<p align="center">
  <a href="https://nextjs.org/" target="blank">
    <img src="https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg" width="500" alt="Next.js Logo" />
  </a>
</p>
<p align="center">A powerful <a href="https://react.dev/" target="_blank">React</a> framework for building fast and scalable frontend applications.</p>

# AsDelivery Frontend

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
