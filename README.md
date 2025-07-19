# Nuxt Template App + Supabase

This is a Nuxt template application integrated with Supabase that is meant to be used as a
foundation for new apps.

## TODO

- Build the create/edit/delete Example forms
  - Add form components
  - Convert `CreateDate` to use the ISO format to pair with SQL better
- Instructions overlay for the Examples route
- Reactive your Supabase project
  - Setup GitHub with secrets
  - Test Supabase GitHub actions
- Develop notifications/reminders solution
- Test SQL for solution in Supabase

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
