# Nuxt Template App + Supabase

This is a Nuxt template application integrated with Supabase that is meant to be used as a
foundation for new apps.

## TODO

- Timezone: `Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';`

- **Supabase**
  - Reactivate Supabase test project
    - Setup GitHub with secrets
      - SUPABASE_PROJECT_ID
      - SUPABASE_ACCESS_TOKEN
      - SUPABASE_DB_PASSWORD
    - Test Supabase GitHub actions
    - Test SQL for solutions

## Project Goals

- Provide a solid foundation for new Nuxt applications
- Integrate Supabase for authentication and database management
- Provide a test `ExampleApp` route for testing database subscriptions (live queries)

## Setup

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more
information.

```sh
# Install dependencies
npm i

# Start the development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
