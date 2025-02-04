<p align="center">
  <a href="http://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
  </a>
</p>
<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

# AsDelivery Backend

## Features

- **JWT authorization**
- **Prisma ORM** for database management
- **Email notifications** processing (Mailer / Nodemailer)
- **Security** enhancements (Helmet, Passport)

## Installation

```bash
$ bun install
```

## Running the App

```bash
# Start in development mode
$ bun run start

# Watch mode (auto-restart on changes)
$ bun run dev

# Build the application
$ bun run build

# Start in production mode
$ bun run prod
```

The application will run on **http://localhost:4000**

## Dependencies

### Main Dependencies:

- **Nest.js**
- **Passport**
- **Argon2**
- **UUID**
- **Helmet**
- **React-email**

### Development Dependencies:

- **TypeScript**
- **ESLint & Prettier**
- **Prisma**

## Additional Information

- Uses environment variables for configuration.
- The default database is **MongoDB**.

## License

This project is licensed under the [GNU Affero General Public License v3.0](../LICENSE).
