# react-router-dispatcher-redirect

[![Greenkeeper badge](https://badges.greenkeeper.io/adam-26/react-router-dispatcher-redirect.svg)](https://greenkeeper.io/)

[![npm](https://img.shields.io/npm/v/react-router-dispatcher-redirect.svg)](https://www.npmjs.com/package/react-router-dispatcher-redirect)
[![npm](https://img.shields.io/npm/dm/react-router-dispatcher-redirect.svg)](https://www.npmjs.com/package/react-router-dispatcher-redirect)
[![CircleCI branch](https://img.shields.io/circleci/project/github/adam-26/react-router-dispatcher-redirect/master.svg)](https://circleci.com/gh/adam-26/react-router-dispatcher-redirect/tree/master)
[![Code Climate](https://img.shields.io/codeclimate/coverage/github/adam-26/react-router-dispatcher-redirect.svg)](https://codeclimate.com/github/adam-26/react-router-dispatcher-redirect)
[![Code Climate](https://img.shields.io/codeclimate/github/adam-26/react-router-dispatcher-redirect.svg)](https://codeclimate.com/github/adam-26/react-router-dispatcher-redirect)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

A [react-router-dispatcher](https://github.com/adam-26/react-router-dispatcher) **action** for defining react-router redirects that support server-side streaming.

Read the [react-router-dispatcher](https://github.com/adam-26/react-router-dispatcher) documentation if you haven't already done so.

There is an [working example here](https://github.com/adam-26/react-router-dispatcher-redirect/tree/master/examples/ssr) that incorporates [redirects](https://github.com/adam-26/react-router-dispatcher-redirect) and [metadata](https://github.com/adam-26/react-router-dispatcher-metadata)

### Install

##### NPM

```js
npm install --save react-router-dispatcher-redirect
```

##### Yarn

```js
yarn add react-router-dispatcher-redirect
```

### Usage

```js
import redirectAction, { redirectRoute, REDIRECT, STATUS_CODE } from 'react-router-dispatcher-redirect';

// REDIRECT is the action name, used to configure react-router-dispatcher
```

### Example

##### Defining routes using `redirectRoute()` and `withRedirect()`

```js
// routes.js
import { redirectRoute, withRedirect } from 'react-router-dispatcher-redirect';
import { Root, Home, MyAccount } from './components';

const routes = [
  { component: Root,
    routes: [
      { path: '/',
        exact: true,
        component: Home
      },
      { path: '/myaccount',
	    exact: true,
	    component: withRedirect({
	      to: '/login',
	      shouldRedirect: (routeProps, props) => true,  // conditional redirect
	      mapParamsToProps: p => p
	    })(MyAccount)
	  },

	  // redirect routes
      redirectRoute({ from: '/hello', to: '/world' }),
      redirectRoute({ from: '/temporary', to: '/login', statusCode: 302 })
    ]
  }
]

export default routes;
```

##### Configuring the redirect action using [react-router-dispatcher](https://github.com/adam-26/react-router-dispatcher)

```js
import { createRouteDispatchers } from 'react-router-dispatcher';
import { STATUS_CODE, REDIRECT } from 'react-router-dispatcher-redirect';
import routes from './routes';

const {
    UniversalRouteDispatcher,
    ClientRouteDispatcher,
    dispatchClientActions,
    dispatchServerActions
} = createRouteDispatchers(routes, [[STATUS_CODE, REDIRECT]]);

// Server dispatch
dispatchServerActions(req.url, params).then(({ httpResponse: { statusCode, redirect } }) => {
  if (redirect) {
    // redirect the response - expressjs syntax
    return res.redirect(statusCode, redirect);
  }

  res.status(statusCode);
  // render the application
});
```

### API

`redirectAction(props: Object)`

#### Parameters

**mapParamsToProps**: `(params: Object, routerCtx: Object) => Object`

  * An optional function that maps action parameters to component props

**statusCode**: `number`

  * A HTTP status code to be used by the redirect

**shouldRedirect**: `boolean | (routeProps: Object, componentProps: Object) => boolean`

  * An optional boolean or function that returns true if the request should be redirected

**push**: `boolean`

  * An optional boolean value used for client-side redirects, true to push or false to replace the url


`redirectRoute(props: Object)`

_define a react-router-config redirect route_

#### Parameters

**from**: `string`

  * The source route path

**to**: `string | object`

  * The target of the redirect

**statusCode**: `number`

  * Optionally, the statusCode to use for server-side HTTP redirects

**push**: `boolean`

  * Optionally, for client-side redirects. True to push or false to replace the history url location

**strict**: `boolean`

  * Optionally, true to have the `from` path use a strict match

**exact**: `boolean`

  * Optionally, true to have the `from` path use an exact match

`withRedirect(props: Object)`

_Used to enable conditional redirects, for example protecting authenticated routes_

#### Parameters

**to**: `string | object`

  * The target of the redirect

**mapParamsToProps**: `(params: Object, routerCtx: Object) => Object`

  * An optional function that maps action parameters to component props

**shouldRedirect**: `boolean | (routeProps: Object, componentProps: Object) => boolean`

  * An optional boolean or function that returns true if the requets should be redirected

**statusCode**: `number`

  * Optionally, the statusCode to use for server-side HTTP redirects

**push**: `boolean`

  * Optionally, for client-side redirects. True to push or false to replace the history url location

**strict**: `boolean`

  * Optionally, true to have the `from` path use a strict match

**exact**: `boolean`

  * Optionally, true to have the `from` path use an exact match

### Contribute
For questions or issues, please [open an issue](https://github.com/adam-26/react-router-dispatcher-redirect/issues), and you're welcome to submit a PR for bug fixes and feature requests.

Before submitting a PR, ensure you run `npm test` to verify that your coe adheres to the configured lint rules and passes all tests. Be sure to include unit tests for any code changes or additions.

### License
MIT