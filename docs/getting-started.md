# Getting Started

Decarbonizer is organized in a monorepo via [Lerna](https://github.com/lerna/lerna) and [NPM workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).
The repository contains both the backend and the frontend components.

## Required Tooling

In order to run the projects, an **NPM version >= 7** is required. Use the following command(s) to check
your local NPM version and to update it if necessary.

```sh
# Check your version:
npm --version

# Update NPM (only necessary if your version is less than 7):
npm i -g npm@latest
```

## Project Dependencies

You can easily (re-)install the dependencies using `lerna bootstrap`:

```sh
npx lerna bootstrap
```

If something goes wrong during the installation or if you want to make a clean reinstall it may be helpful
to purge your current package installation. This can simply be done via:

```sh
npm run uninstall-packages

# Afterwards, reinstall the dependencies:
npx lerna bootstrap
```

## Backend Configuration

The backend requires a MongoDB connection in order to run properly.
The connection string must be configured in the [`./../packages/backend/.env`](./../packages/backend/.env) file.
To get started, you can **copy** and then **rename** the [`./../packages/backend/.env.example`](./../src/packages/backend/.env.example)
file to `.env` and fill it with your custom values.

## Running the Frontend and Backend

To run **both** the frontend and backend project at the same time, simply run `npm start` in the
repository's root directory.

Once started, the backend and frontend can be accessed via the following URLs:

- **Backend:** [`localhost:3000`](http://localhost:3000)
  - Swagger Documentation: [`localhost:3000/swagger`](http://localhost:3000/swagger)
  - API Endpoints: [`localhost:3000/api/v1/XXX`](http://localhost:3000/api/v1)
- **Frontend:** [`localhost:1234`](http://localhost:1234)

## Seeding the DB with Development Data

The backend can be seeded with dummy data (which was also used for the presentation of the MVP).
The data seeding can be triggered via a special debug endpoint:
[`POST http://localhost:3000/api/v1/debug/seedDb`[(http://localhost:3000/swagger/#/Debug/DebugController_create)].

We recommend simply invoking that endpoint via the Swagger UI whenever necessary.

## Logging In

With the seed data from the above step in place, you can use the following credentials to sign in
at [`localhost:3000`](http://localhost:3000) and use the application yourself:

- **User:** `user@decarbonizer.com`
- **Password:** `User123`

## Formatting and Linting

The repository is using [Prettier](https://prettier.io/) for formatting and [ESLint](https://eslint.org/) for linting.
You can format/lint all files in the project via the following commands from the repository's root directory:

```sh
npm run format
npm run lint
```
