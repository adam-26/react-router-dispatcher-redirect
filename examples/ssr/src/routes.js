import Root from './components/Root';
import Home from './components/Home';
import About from './components/About';
import NotFound from './components/NotFound';
import { redirectRoute, withRedirect } from 'react-router-dispatcher-redirect';
import { withStatusCode } from 'react-router-dispatcher-status-code';

const routes = [
    { component: Root, // included for every route
        routes: [
            {
                path: '/',
                exact: true,
                component: Home
            },
            {
                path: '/about',
                exact: true,
                component: withStatusCode(201)(About)
            },

            // Conditional route example - this demo always redirects
            { path: '/myaccount',
                exact: true,
                component: withRedirect({
                    to: '/',
                    shouldRedirect: (/*routeProps, props*/) => true  // conditional redirect
                })(About)
            },

            // Redirect route(s)
            redirectRoute({ from: '/redirect', exact: true, to: '/' }),

            // Not Found route handler
            {
                component: withStatusCode(404)(NotFound)
            }
        ]
    }
];

export default routes;
