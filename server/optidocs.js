#!/usr/bin/env node

const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const certPath = path.join(__dirname, 'certs');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const api = require('./api');
const crud = require('./crud');
const config = require('./utils/config');
const mongoose = require("mongoose");
const Users = require("./models/users.js");
const fileUpload = require('express-fileupload');
const ports = {
    http: config.direct.portHttp,
    https: config.direct.portHttps
};
const favicon = require('serve-favicon');
const accessLogStream = fs.createWriteStream(path.join(__dirname, '/log/access.log'), {flags: 'a'});

const yargs = require('yargs')
    .option('client-path', {
        describe: 'Path to the client app (absolute or relative to the server directory)'
    })
    .option('client-environment', {
        describe: "Client app build environment, either 'development', 'testing' or 'production'",
        choice: ['development', 'testing', 'production'],
        default: 'development'
    })
    .help()
    .argv;

if (yargs['client-path']) {
    config.client.path = yargs['client-path'];
}

let httpsServer;
let httpServer;
let router = express.Router();
let routerCrud = express.Router();

if (yargs['client-environment'] === 'development') {
    try {
        httpServer = http.createServer(app);
        httpServer.on('error', onError);
    } catch (e) {
    }
}

try {
    const crt = fs.readFileSync(path.join(certPath, 'server.crt'));
    const key = fs.readFileSync(path.join(certPath, 'server.key'));

    httpsServer = https.createServer({
        cert: crt,
        key: key
    }, app);
    httpsServer.on('error', onError);
} catch (e) {
}

let clientPath = path.join(__dirname, config.client.path);

if ((/^prod/i.test(yargs['client-environment'])) || (/^test/i.test(yargs['client-environment']))) {
    clientPath = path.join(clientPath, 'build', yargs['client-environment'], config.client.clientName);
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, config.direct.classPath)));
app.use(express.static(clientPath));
app.use(logger('combined', {stream: accessLogStream}));
app.use(favicon(path.join(__dirname, 'images', 'favicon.ico')));
app.use(fileUpload());

console.log(`Client app has loaded from ${clientPath}`);

//API Deals
router.get('/', api.index);

router.get('/getorganization/:org_code', api.getOrganization);
router.get('/getorganization', api.getOrganization);
router.post('/getorganization', api.getOrganization);

router.get('/getdealslist/:org_code', api.getDealsList);
router.get('/getdealslist', api.getDealsList);
router.post('/getdealslist', api.getDealsList);

router.get('/getdealdocumentlist/:dealID', api.getDealDocumentList);
router.post('/getdealdocumentlist', api.getDealDocumentList);

router.get('/getdocumentinfo/:id', api.getDocumentInfo);
router.post('/getdocumentinfo', api.getDocumentInfo);

router.get('/getdocument/:id/:dwn', api.getDocument);
router.get('/getdocument/:id', api.getDocument);

router.post('/addnewdeal', api.addNewDeal);
router.post('/addnewdealinvite', api.addNewDealAndInvite);

router.post('/adddocument', api.AddOneDocument);
router.post('/setcontent', api.setDocumentContent);
router.post('/addsignature', api.addDocumentSignature);
router.post('/adddocumentwithcontent', api.AddOneDocumentWithContent);

router.post('/upload', api.FileUpload);

router.route('/checkcredentials').post(api.credentials);

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use(config.direct.apiUrl, router);

//API CRUD
routerCrud.get('/', crud.index);
routerCrud.get('/users', crud.getUsers);
routerCrud.put('/users/:id', crud.putUsers);

routerCrud.get('/organizations', crud.getOrganizations);
routerCrud.put('/organizations/:id', crud.putOrganizations);

routerCrud.post('/changepass', crud.changePassword);

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /crud
app.use(config.direct.crudUrl, routerCrud);

mongoose.connect((yargs['client-environment'] === 'development') ? config.mongodb.url_dev : config.mongodb.url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }, function (err) {
        if (err) return console.log(err);

        Users.find().then(docs => {
            if (docs.length === 0) {
                Users.create({})
            }
        }).then(
            require('./api/dealsapi').getApi().then((deals) => {
                app.locals.deals_api = deals;
            })
        ).catch(e => {
            return console.error(e);
        });

        if ((httpServer) && (yargs['client-environment'] === 'development')) {
            httpServer.listen(ports.http, () => {
                console.log(`Non-Secure Server listening (nSSL) on port ${ports.http}`);
            });
        }

        if (httpsServer) {
            httpsServer.listen(ports.https, () => {
                console.log(`Secure Server listening (SSL) on port ${ports.https}`);
            });
        }
    });


function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof error.port === 'string' ? 'Pipe ' + error.port : 'Port ' + error.port;

    // handle specific listen errors with friendly messages
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
}
