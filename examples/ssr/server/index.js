require('ignore-styles');
const babelRegister = require('babel-register');
const proxy = require('http-proxy-middleware');

babelRegister({
    ignore: /\/(build|node_modules)\//,
    presets: ['react-app'],
});

function renderRequest(render, req, res) {
    if (typeof req.query.stream === 'undefined') {
        console.log('renderToString');
        render.toString(req, res);
    }
    else {
        console.log('renderToStream');
        render.stream(req, res);
    }
}

const express = require('express');
const path = require('path');

const app = express();

// Application
if (process.env.NODE_ENV === 'development') {
    const renderDevRequest = (req, res) => {
        // In development mode we clear the module cache between each request to
        // get automatic hot reloading.
        for (var key in require.cache) {
            delete require.cache[key];
        }
        const render = require('./render');
        renderRequest(render, req, res);
    };
    app.get('/', function(req, res) {
        renderDevRequest(req, res);
    });
    app.get('/about', function(req, res) {
        renderDevRequest(req, res);
    });
    app.get('/myaccount', function(req, res) {
        renderDevRequest(req, res);
    });
    app.get('/redirect', function(req, res) {
        renderDevRequest(req, res);
    });
    app.get('/notfound', function(req, res) {
        renderDevRequest(req, res);
    });
} else {
    const render = require('./render');
    app.get('/', function(req, res) {
        renderRequest(render, req, res);
    });
    app.get('/about', function(req, res) {
        renderRequest(render, req, res);
    });
    app.get('/myaccount', function(req, res) {
        renderRequest(render, req, res);
    });
    app.get('/redirect', function(req, res) {
        renderRequest(render, req, res);
    });
    app.get('/notfound', function(req, res) {
        renderRequest(render, req, res);
    });
}

// Static resources
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Proxy everything else to create-react-app's webpack development server
if (process.env.NODE_ENV === 'development') {
    app.use(
        '/',
        proxy({
            ws: true,
            target: 'http://localhost:3001',
        })
    );
}

app.listen(3000, () => {
    console.log('Listening on port 3000...');
});

app.on('error', function(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});
