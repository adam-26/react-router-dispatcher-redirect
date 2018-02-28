// @flow
import invariant from 'invariant';
import withRedirect from './withRedirect';

export default function redirectRoute(options = {}) {
    invariant(options.to, 'redirectRoute() requires a \'to\' prop value.');
    invariant(options.from, 'redirectRoute() requires a \'from\' prop value.');

    const {
        from,
        strict,
        exact,
        ...redirectProps
    } = Object.assign({
        mapParamsToProps: params => params
    }, options);

    return {
        path: from,
        strict: strict,
        exact: exact,
        component: withRedirect({ ...redirectProps, shouldRedirect: true })(null)
    };
}
