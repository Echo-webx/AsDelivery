<p align="center">
  <a href="https://nextjs.org/" target="blank">
    <img src="https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg" width="500" alt="Next.js Logo" style="filter: invert(1);" />
  </a>
</p>

# AsDelivery Frontend

## Features

- Server-side rendering (SSR) and static site generation (SSG)
- Global state management Zustand 
- API integration with NestJS backend
- Interactive maps with **@2gis/mapgl**
- Data fetching and caching with **@tanstack/react-query**
- Charts and visualizations using **chart.js** and **react-chartjs-2**
- Theming support with **next-themes**
- Notifications via **react-hot-toast**

## Installation

```bash
$ bun install
```

## Running the app

```bash
# development mode
$ bun run dev

# build the application
$ bun run build

# production mode
$ bun run start
```

## Dependencies

**Main dependencies:**
- Next.js 15
- React 19
- Zustand
- Axios
- Sass
- Lucide React

**Development dependencies:**
- TypeScript
- ESLint & Prettier
- PostCSS

## Additional information

- The application fetches data from the **NestJS backend**.
- Environment variables are used to manage API endpoints and other configurations.
- Uses **Next.js App Router** for modern routing and layout management.

## License

This project is licensed under the [GNU Affero General Public License v3.0](../LICENSE)

