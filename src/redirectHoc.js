// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect } from 'react-router';
import hoistNonReactStatics from 'hoist-non-react-statics';
import getDisplayName from 'react-display-name';

export function getRedirectTo(redirectLocation, routeProps, componentProps) {
    return typeof redirectLocation === 'function' ?
        redirectLocation(routeProps, componentProps) :
        redirectLocation;
}

export function shouldPerformRedirect(shouldRedirect, props) {
    return typeof shouldRedirect === 'boolean' ?
        shouldRedirect :
        shouldRedirect(props);
}

function redirectHoc({ to, shouldRedirect, ...redirectProps } = {}) {
    return (Component) => {
        const isComponentNull = Component === null;

        // eslint-disable-next-line no-unused-vars
        const HOC = ({ location, match, history, ...componentProps }) => {
            if (shouldPerformRedirect(shouldRedirect, { location, match }, componentProps)) {
                const redirectTo = getRedirectTo(to, { location, match }, componentProps);
                return (<Redirect to={redirectTo} {...redirectProps} />);
            }

            return isComponentNull ? null : (<Component {...componentProps} />);
        };

        HOC.displayName = `withRedirect(${isComponentNull ? 'null' : getDisplayName(Component)})`;

        HOC.WrappedComponent = Component;

        HOC.propTypes = {
            match: PropTypes.object.isRequired,
            location: PropTypes.object.isRequired,
            history: PropTypes.object.isRequired
        };

        return withRouter(isComponentNull ? HOC : hoistNonReactStatics(HOC, Component));
    };
}

export default redirectHoc;
