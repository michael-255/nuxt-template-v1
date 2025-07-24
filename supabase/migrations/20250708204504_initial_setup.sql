--
-- Enums
--

CREATE TYPE public.recurrence_type AS ENUM (
  -- Times
  'Daily',
  'Weekly',
  'Monthly',
  'Yearly',
  -- Weekdays
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  -- Months
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
);

COMMENT ON TYPE public.recurrence_type IS 'Enumeration of reminder types for scheduling reminders.';

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
  recurrence recurrence_type NOT NULL,
  PRIMARY KEY (user_id, example_id, recurrence)
);

COMMENT ON TABLE public.example_reminders IS 'Table to store reminders for user examples.';
COMMENT ON COLUMN public.example_reminders.user_id IS 'ID of the user who created the reminder.';
COMMENT ON COLUMN public.example_reminders.example_id IS 'ID of the example associated with the reminder.';
COMMENT ON COLUMN public.example_reminders.recurrence IS 'Type of recurrence for the example.';

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

--
-- Functions
--

CREATE FUNCTION public.is_reminder_satisfied(
  recurrence public.recurrence_type,
  latest_created_at TIMESTAMPTZ,
  tz TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  local_date DATE := (latest_created_at AT TIME ZONE 'UTC' AT TIME ZONE tz)::date;
  local_dow INT := EXTRACT(DOW FROM (latest_created_at AT TIME ZONE 'UTC' AT TIME ZONE tz));
  local_month INT := EXTRACT(MONTH FROM (latest_created_at AT TIME ZONE 'UTC' AT TIME ZONE tz));
  local_year INT := EXTRACT(YEAR FROM (latest_created_at AT TIME ZONE 'UTC' AT TIME ZONE tz));
  today DATE := (CURRENT_DATE AT TIME ZONE tz);
  this_week INT := EXTRACT(WEEK FROM (CURRENT_DATE AT TIME ZONE tz));
  this_month INT := EXTRACT(MONTH FROM (CURRENT_DATE AT TIME ZONE tz));
  this_year INT := EXTRACT(YEAR FROM (CURRENT_DATE AT TIME ZONE tz));
  latest_week INT := EXTRACT(WEEK FROM local_date);
BEGIN
  CASE recurrence
    -- Times
    WHEN 'Daily' THEN RETURN local_date = today;
    WHEN 'Weekly' THEN RETURN latest_week = this_week AND local_year = this_year;
    WHEN 'Monthly' THEN RETURN local_month = this_month AND local_year = this_year;
    WHEN 'Yearly' THEN RETURN local_year = this_year;
    -- Weekdays
    WHEN 'Sunday' THEN RETURN local_dow = 0 AND local_date = today;
    WHEN 'Monday' THEN RETURN local_dow = 1 AND local_date = today;
    WHEN 'Tuesday' THEN RETURN local_dow = 2 AND local_date = today;
    WHEN 'Wednesday' THEN RETURN local_dow = 3 AND local_date = today;
    WHEN 'Thursday' THEN RETURN local_dow = 4 AND local_date = today;
    WHEN 'Friday' THEN RETURN local_dow = 5 AND local_date = today;
    WHEN 'Saturday' THEN RETURN local_dow = 6 AND local_date = today;
    -- Months
    WHEN 'January' THEN RETURN local_month = 1 AND local_year = this_year;
    WHEN 'February' THEN RETURN local_month = 2 AND local_year = this_year;
    WHEN 'March' THEN RETURN local_month = 3 AND local_year = this_year;
    WHEN 'April' THEN RETURN local_month = 4 AND local_year = this_year;
    WHEN 'May' THEN RETURN local_month = 5 AND local_year = this_year;
    WHEN 'June' THEN RETURN local_month = 6 AND local_year = this_year;
    WHEN 'July' THEN RETURN local_month = 7 AND local_year = this_year;
    WHEN 'August' THEN RETURN local_month = 8 AND local_year = this_year;
    WHEN 'September' THEN RETURN local_month = 9 AND local_year = this_year;
    WHEN 'October' THEN RETURN local_month = 10 AND local_year = this_year;
    WHEN 'November' THEN RETURN local_month = 11 AND local_year = this_year;
    WHEN 'December' THEN RETURN local_month = 12 AND local_year = this_year;
    ELSE RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE FUNCTION public.get_example_reminder_status(
  p_user_id UUID,
  p_timezone TEXT
)
RETURNS TABLE (
  user_id UUID,
  recurrence public.recurrence_type,
  latest_created_at TIMESTAMPTZ,
  is_satisfied BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    er.user_id,
    er.recurrence,
    latest.created_at,
    public.is_reminder_satisfied(er.recurrence, latest.created_at, p_timezone) AS is_satisfied
  FROM example_reminders er
  LEFT JOIN LATERAL (
    SELECT e.created_at
    FROM examples e
    WHERE e.user_id = er.user_id
    ORDER BY e.created_at DESC
    LIMIT 1
  ) latest ON TRUE
  WHERE er.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql STABLE;
