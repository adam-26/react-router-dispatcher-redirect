// @flow
import { withActions } from 'react-router-dispatcher';
import redirectAction from './redirectAction';

export default function withRedirect(options) {
    return withActions(redirectAction(options));
}
