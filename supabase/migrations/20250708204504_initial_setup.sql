--
-- Enums
--

CREATE TYPE public.reminder_type AS ENUM (
  'None',
  'Daily',
  'Weekly',
  'Monthly',
  'Yearly',
);

COMMENT ON TYPE reminder_type IS 'Enumeration of reminder types for scheduling reminders.';

--
-- Tables
--

CREATE TABLE public.examples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
  message TEXT,
);

COMMENT ON TABLE public.examples IS 'Table to store user examples with timestamps.';
COMMENT ON COLUMN public.examples.id IS 'Unique identifier for each example.';
COMMENT ON COLUMN public.examples.user_id IS 'ID of the user who created the example.';
COMMENT ON COLUMN public.examples.created_at IS 'Timestamp when the example was created, in UTC.';

CREATE TABLE public.example_reminders (
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  example_id UUID NOT NULL REFERENCES examples(id) ON DELETE CASCADE,
  reminder reminder_type NOT NULL,
  PRIMARY KEY (user_id, example_id, reminder)
);

COMMENT ON TABLE public.example_reminders IS 'Table to store reminders for user examples.';
COMMENT ON COLUMN public.example_reminders.user_id IS 'ID of the user who created the reminder.';
COMMENT ON COLUMN public.example_reminders.example_id IS 'ID of the example associated with the reminder.';
COMMENT ON COLUMN public.example_reminders.reminder IS 'Type of reminder for the example.';

--
-- Policies
--

-- Examples
ALTER TABLE public.examples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Select own examples"
  ON public.examples
  FOR SELECT
  TO authenticated
  USING user_id = (select auth.uid());

CREATE POLICY "Insert own examples"
  ON public.examples
  FOR INSERT
  TO authenticated
  WITH CHECK user_id = (select auth.uid());

CREATE POLICY "Update own examples"
  ON public.examples
  FOR UPDATE
  TO authenticated
  USING user_id = (select auth.uid());

CREATE POLICY "Delete own examples"
  ON public.examples
  FOR DELETE
  TO authenticated
  USING user_id = (select auth.uid());

-- Example Reminders
ALTER TABLE public.example_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Select own example reminders"
  ON public.example_reminders
  FOR SELECT
  TO authenticated
  USING user_id = (select auth.uid());

CREATE POLICY "Insert own example reminders"
  ON public.example_reminders
  FOR INSERT
  TO authenticated
  WITH CHECK user_id = (select auth.uid());

CREATE POLICY "Update own example reminders"
  ON public.example_reminders
  FOR UPDATE
  TO authenticated
  USING user_id = (select auth.uid());

CREATE POLICY "Delete own example reminders"
  ON public.example_reminders
  FOR DELETE
  TO authenticated
  USING user_id = (select auth.uid());

-- TEST 1

-- CREATE VIEW example_reminder_view AS
-- SELECT
--   er.user_id,
--   er.example_id,
--   e.created_at,
--   er.type,
--   CASE
--     WHEN er.type = 'Daily' THEN date_trunc('day', NOW())
--     WHEN er.type = 'Weekly' THEN date_trunc('week', NOW())
--     WHEN er.type = 'Monthly' THEN date_trunc('month', NOW())
--     WHEN er.type = 'Yearly' THEN date_trunc('year', NOW())
--     -- For months, you could use the current year and the month from the enum
--     WHEN er.type IN ('January','February','March','April','May','June','July','August','September','October','November','December')
--       THEN make_date(EXTRACT(YEAR FROM NOW())::int,
--         CASE er.type
--           WHEN 'January' THEN 1
--           WHEN 'February' THEN 2
--           WHEN 'March' THEN 3
--           WHEN 'April' THEN 4
--           WHEN 'May' THEN 5
--           WHEN 'June' THEN 6
--           WHEN 'July' THEN 7
--           WHEN 'August' THEN 8
--           WHEN 'September' THEN 9
--           WHEN 'October' THEN 10
--           WHEN 'November' THEN 11
--           WHEN 'December' THEN 12
--         END, 1)
--     ELSE NULL
--   END AS next_reminder
-- FROM example_reminders er
-- JOIN examples e ON er.example_id = e.id;

-- TEST 2

-- CREATE VIEW example_reminder_status AS
-- SELECT
--   er.user_id,
--   er.type,
--   -- Example created in current period?
--   CASE
--     WHEN er.type = 'Daily' THEN EXISTS (
--       SELECT 1 FROM examples e
--       WHERE e.user_id = er.user_id
--         AND e.created_at::date = CURRENT_DATE
--     )
--     WHEN er.type = 'Weekly' THEN EXISTS (
--       SELECT 1 FROM examples e
--       WHERE e.user_id = er.user_id
--         AND date_trunc('week', e.created_at) = date_trunc('week', NOW())
--     )
--     WHEN er.type = 'Monthly' THEN EXISTS (
--       SELECT 1 FROM examples e
--       WHERE e.user_id = er.user_id
--         AND date_trunc('month', e.created_at) = date_trunc('month', NOW())
--     )
--     WHEN er.type = 'Yearly' THEN EXISTS (
--       SELECT 1 FROM examples e
--       WHERE e.user_id = er.user_id
--         AND date_trunc('year', e.created_at) = date_trunc('year', NOW())
--     )
--     WHEN er.type IN ('January','February','March','April','May','June','July','August','September','October','November','December') THEN EXISTS (
--       SELECT 1 FROM examples e
--       WHERE e.user_id = er.user_id
--         AND EXTRACT(MONTH FROM e.created_at) =
--           CASE er.type
--             WHEN 'January' THEN 1
--             WHEN 'February' THEN 2
--             WHEN 'March' THEN 3
--             WHEN 'April' THEN 4
--             WHEN 'May' THEN 5
--             WHEN 'June' THEN 6
--             WHEN 'July' THEN 7
--             WHEN 'August' THEN 8
--             WHEN 'September' THEN 9
--             WHEN 'October' THEN 10
--             WHEN 'November' THEN 11
--             WHEN 'December' THEN 12
--           END
--         AND EXTRACT(YEAR FROM e.created_at) = EXTRACT(YEAR FROM NOW())
--     )
--     ELSE FALSE
--   END AS has_example_this_period,
--   -- Last example id for this user
--   (
--     SELECT e2.id FROM examples e2
--     WHERE e2.user_id = er.user_id
--     ORDER BY e2.created_at DESC
--     LIMIT 1
--   ) AS last_example_id
-- FROM example_reminders er;
