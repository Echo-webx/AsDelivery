<p align="center">
  <a href="https://nextjs.org/" target="blank">
    <img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png" width="200" alt="Next.js Logo" />
  </a>
</p>
<p align="center">A powerful <a href="https://react.dev/" target="_blank">React</a> framework for building fast and scalable frontend applications.</p>

<h1 align="center">AsDelivery Frontend</h1>

## Features

- **Server-side rendering (SSR)** and **static site generation (SSG)**
- **Global state management** with Zustand
- **API integration** with a NestJS backend
- **Interactive maps** powered by **@2gis/mapgl**
- **Data fetching and caching** with **@tanstack/react-query**
- **Charts and visualizations** using **chart.js** and **react-chartjs-2**
- **Theming support** via **next-themes**
- **Notifications** powered by **react-hot-toast**

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

The application will run on **http://localhost:3000**

## Environment Variables

To properly configure the application, make sure to specify the following environment variables in your `.env` file:

```env
NEXT_PUBLIC_BACKEND_URL=<your-backend-url>
NEXT_PUBLIC_DOMAIN=<your-domain>
NEXT_PUBLIC_ACCESS_EXPIRES_IN=<your-token-expires-in> # Must be equal to the value of <jwt-access-expires-in> from the backend
NEXT_PUBLIC_2GIS_KEY=<your-2gis-api-key>
```

These variables are required for API communication, authentication handling, and map integration.

## Dependencies

**Main dependencies:**

- Next.js 15
- React 19
- Zustand
- Axios
- Sass
- Next-pwa

**Development dependencies:**

- TypeScript
- ESLint & Prettier
- PostCSS

## Additional information

- The application fetches data from the **NestJS backend**.
- Utilizes **Next.js App Router** for modern routing and layout management.

## License

This project is licensed under the [GNU Affero General Public License v3.0](../LICENSE)
