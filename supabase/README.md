# Supabase

To create a new SQL migration file.

```sh
npx supabase migrations new {file_name}
```

To create a new Deno Edge Function.

```sh
npx supabase functions new {file_name}
```

Generate types for a project.

```sh
npx supabase gen types typescript --project-id "$SUPABASE_PROJECT_ID " --schema public > shared/types/supabase.ts
```
