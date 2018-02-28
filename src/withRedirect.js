// @flow
import { withActions } from 'react-router-dispatcher';
import redirectAction from './redirectAction';

export default function withRedirect({ mapParamsToProps, ...redirectOptions }) {
    return withActions(mapParamsToProps, redirectAction(redirectOptions));
}
