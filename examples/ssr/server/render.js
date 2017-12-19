import React from 'react';
import { renderToNodeStream, renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import Html from 'react-html-metadata';
import { UniversalRouteDispatcher, dispatchServerActions } from '../src/routeDispatcher';
import AppScripts from '../src/components/AppScripts';
import LoadingPlaceholder from '../src/components/LoadingIndicator';

let assets;
if (process.env.NODE_ENV === 'development') {
    // Use the bundle from create-react-app's server in development mode.
    assets = {
        'main.js': '/static/js/bundle.js',
        'main.css': '',
    };
} else {
    assets = require('../build/asset-manifest.json');
}

function serverRender(req, callback) {

    const actionParams = {
        assets: assets
    };

    // Dispatch actions on the server, before rendering the application.
    dispatchServerActions(req.url, actionParams).then(({ metadata, assets, httpResponse }) => {

        // Compose the app using the factory RouteDispatcher
        const ctx = {};
        let serverApp;
        if (httpResponse.redirect === true || (httpResponse.statusCode < 300 || httpResponse.statusCode >= 400)) {
            serverApp = (
                <Html metadata={metadata} /* render={serverHtmlRender} */>
                <StaticRouter location={req.url} context={ctx}>
                    {/* Pass 'assets' to the 'Root' component */}
                    <UniversalRouteDispatcher assets={assets}/>
                </StaticRouter>
                </Html>
            );
        }

        callback(undefined, { ctx, serverApp, httpResponse });
    });
}

let clientHtml;
function clientRender(req, res) {
    // return markup for client-side render
    if (typeof clientHtml === 'undefined') {
        clientHtml = renderToStaticMarkup(
            <html>
                <head>
                    <title>App Name</title>
                </head>
                <body>
                    <LoadingPlaceholder />
                    <AppScripts assets={assets} />
                </body>
            </html>);
    }

    res.send('<!DOCTYPE html>' + clientHtml);
}

function renderOnClient(req) {
    return typeof req.query.client !== 'undefined';
}

export function toString(req, res) {
    if (renderOnClient(req)) {
        return clientRender(req, res);
    }

    serverRender(req, (err, { /* ctx, */ serverApp, httpResponse }) => {
        if (err) {
            throw err;
        }

        if (httpResponse.redirect) {
            return res.redirect(httpResponse.statusCode, httpResponse.redirect);
        }

        const html = renderToString(serverApp);
        res.status(httpResponse.statusCode);
        res.send('<!DOCTYPE html>' + html);
    });
}

export function stream(req, res) {
    if (renderOnClient(req)) {
        return clientRender(req, res);
    }

    serverRender(req, (err, { /*ctx,*/ serverApp, httpResponse }) => {
        if (err) {
            throw err;
        }

        if (httpResponse.redirect) {
            return res.redirect(httpResponse.statusCode, httpResponse.redirect);
        }

        const stream = renderToNodeStream(serverApp);
        res.status(httpResponse.statusCode);
        res.write("<!DOCTYPE html>");
        stream.pipe(res, { end: false });
        stream.on('end', () => {
            // this can be removed if { end: true }
            res.end();
        });
    });
}
