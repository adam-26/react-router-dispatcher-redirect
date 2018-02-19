// @flow
// TODO: When new version of react-router is released, uncomment this - and remove copied code.
// import { generatePath } from 'react-router';
import generatePath from './generatePath';
import invariant from 'invariant';
import redirectHoc, { getRedirectTo, shouldPerformRedirect } from './redirectHoc';

// This is copied from:
// https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/Redirect.js#L69
function computeTo({ computedMatch, to }) {
    if (!computedMatch) {
        return to;
    }

    if (typeof to === "string") {
        return generatePath(to, computedMatch.params)
    }

    return {
        ...to,
        pathname: generatePath(to.pathname, computedMatch.params)
    }
}

export const REDIRECT = 'redirect';

export default function redirectAction(options: Object = {}) {
    invariant(options.to, 'redirectAction() requires a \'to\' prop value.');

    const {
        mapParamsToProps,
        statusCode,
        to,
        shouldRedirect,
        ...redirectProps
    } = Object.assign({
        statusCode: 302, // always default to temporary redirects
        shouldRedirect: true,
        mapParamsToProps: params => params
    }, options);

    return {
        name: REDIRECT,

        staticMethod: (routeProps, { httpResponse, ...actionProps }) => {
            if (httpResponse.redirect) {
                // redirect has been previously set
                return;
            }

            if (shouldPerformRedirect(shouldRedirect, routeProps, actionProps)) {
                const redirectTo = getRedirectTo(to, routeProps, actionProps);
                httpResponse.statusCode = statusCode;
                httpResponse.redirect = computeTo({computedMatch: routeProps.match, to: redirectTo});
            }
        },

        initServerAction: (params) => {
            const httpResponse = params.httpResponse || {};
            return {
                httpResponse: {
                    ...httpResponse,
                    redirect: typeof httpResponse.redirect === 'undefined' ? false : httpResponse.redirect
                }
            };
        },

        mapParamsToProps: (params, routerCtx) => ({
            ...mapParamsToProps(params, routerCtx),
            httpResponse: params.httpResponse
        }),

        hoc: (Component) => redirectHoc({ to, shouldRedirect, ...redirectProps })(Component),

        // stop processing actions on the server if a redirect is required
        stopServerActions: (routeProps, { httpResponse: { redirect } }) => {
            return redirect !== false
        }
    };
}
