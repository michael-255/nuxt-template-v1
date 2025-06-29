# Nuxt Template App + Supabase

This is a Nuxt template application integrated with Supabase that is meant to be used as a
foundation for new apps.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## TODO

- Figure out how to use Nuxt UI (learning Tailwind CSS?)
  - <https://ui.nuxt.com/getting-started>

- CSS vars for the theme and using those values in code
  - <https://ui.nuxt.com/getting-started/theme>
  - Get your theme variable setup!

- Getting the `toast` to work with `useLogger`
  - <https://ui.nuxt.com/composables/use-toast>
  - Working! Update to display the correct toast design

## Notes

- Using Icons: `<UIcon name="material-symbols:info" style="color: black" size="5em" />`

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more
information.
