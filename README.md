# Decarbonizer


## Getting Started

We are using a monorepo using [Lerna](https://github.com/lerna/lerna) and [NPM workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).
The repository contains both the backend and the frontend components.

### Required Tooling

In order to run the projects, an **NPM version >= 7** is required. Use the following command(s) to check
your local NPM version and to update it if necessary.

```sh
# Check your version:
npm --version

# Update NPM (only necessary if your version is less than 7):
npm i -g npm@latest
```

### Project Dependencies

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

### Backend Configuration

The backend requires a MongoDB connection in order to run properly.
The connection string must be configured in the [`packages/backend/.env`](./packages/backend/.env) file.
To get started, you can **copy** and then **rename** the [`packages/backend/.env.example`](./packages/backend/.env.example)
file to `.env` and fill it with your custom values.

### Running the Frontend and Backend

To run **both** the frontend and backend project at the same time, simply run `npm start` in the
repository's root directory.

If you want to run the projects individually for some reason, you can do so by navigating to their
respective directory and then running `npm start` there:

```sh
# At the example of the frontend:
cd packages/frontend/src
npm start
```
Then open http://localhost:1234 in your browser.

### Formatting and Linting

The repository is using [Prettier](https://prettier.io/) for formatting and [ESLint](https://eslint.org/) for linting.
You can format/lint all files in the project via the following commands from the repository's root directory:

```sh
npm run format
npm run lint
```


## License

See [`LICENSE`](./LICENSE) for details.
