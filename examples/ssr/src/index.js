import React from 'react';
import {hydrate, render} from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import Html from 'react-html-metadata';
import { UniversalRouteDispatcher, ClientRouteDispatcher, dispatchClientActions } from './routeDispatcher';

// Extract the state from the server render
const { assets, hydrateClient, /* metadata (if hydrating metadata not possible */ } = window.__AppState;

function getClientApp(RouteDispatcher, metadata) {
    return (
        <Html metadata={metadata}>
            <BrowserRouter>
                {/* Pass 'assets' to the 'Root' component */}
                {RouteDispatcher}
            </BrowserRouter>
        </Html>
    );
}

if (hydrateClient) {
    const { metadata } = dispatchClientActions(window.location.pathname, { assets });
    hydrate(
        getClientApp(<UniversalRouteDispatcher assets={assets} />, metadata),
        document);
}
else {
    // NOTE: The 'ClientRouteDispatcher' MUST be used when performing a client render
    render(
        getClientApp(<ClientRouteDispatcher assets={assets} />),
        document);
}
