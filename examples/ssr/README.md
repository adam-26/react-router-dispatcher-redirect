# SSR Example

A set of test cases for quickly identifying issues with server-side rendering.

## Setup

Run the following commands:
_note: localDeploy **must** be run AFTER npm install_

```
cd examples/ssr
npm install

cd ../..
npm run localDeploy

cd examples/ssr
npm run start
```

The `start` command runs a webpack dev server and a server-side rendering server in development mode with hot reloading.


If you want to try the production mode instead run:

```
npm run start:prod
```

This will pre-build all static resources and then start a server-side rendering HTTP server that hosts the React app and service the static resources (without hot reloading).
