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
# Watch mode (auto-restart on changes)
$ bun run dev

# Start in development mode
$ bun run start

# Build the application
$ bun run build

# Start in production mode
$ bun run prod
```

The application will run on **http://localhost:4000**

## Environment Variables

To properly configure the application, make sure to specify the following environment variables in your `.env` file:

```env
FRONTEND_URL=<your-frontend-url>
DOMAIN=<your-domain>
SAME_SITE="lax"

DATABASE_URL=<your-database-url>

# JWT options
JWT_ACCESS_EXPIRES_IN=<your-jwt-access-expires-in> # In days
JWT_REFRESH_EXPIRES_IN=<your-jwt-refresh-expires-in> # In days
JWT_ACCESS_SECRET=<your-jwt-access-secret>
JWT_REFRESH_SECRET=<your-jwt-refresh-secret>

# SMTP configuration
SMTP_HOST=<your-smtp-host>
SMTP_USER=<your-smtp-user>
SMTP_PASS=<your-smtp-password>

# Default root user (auto-created if missing)
DEFAULT_ROOT_EMAIL=<your-root-email>
DEFAULT_ROOT_PASSWORD=<your-root-password>
```

These variables are required for database connection, authentication, email notifications, and security settings.

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

