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
const MongoClient = require('mongodb').MongoClient;
const ports = {
    http: config.direct.portHttp,
    https: config.direct.portHttps
};
const CryptoJS = require("crypto-js");
const {DealsAPI} = require('@unitybase/deals-api');
const accessLogStream = fs.createWriteStream(path.join(__dirname, '/log/access.log'), {flags: 'a'})
// const models = require("./models");
// //Sync Database
// models.sequelize.sync({force : false}).then(function() {

//     console.log('Nice! Database looks fine')

// }).catch(function(err) {

//     console.log(err, "Something went wrong with the Database Update!")

// });

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

if (/^prod/i.test(yargs['client-environment'])) {
    clientPath = path.join(clientPath, 'build', yargs['client-environment'], config.client.clientName);
} else if (/^test/i.test(yargs['client-environment'])) {
    clientPath = path.join(clientPath, 'build', yargs['client-environment'], config.client.clientName);
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, config.direct.classPath)));
app.use(express.static(clientPath));
app.use(logger('combined', {stream: accessLogStream}));

console.log(`Client app has loaded from ${clientPath}`);
// router.use((req, res, next) => {
//     // do logging
//     console.log(`Method: ${req.method}, url: ${req.originalUrl}`);
//     next(); // make sure we go to the next routes and don't stop here
// });
router.use((req, res, next) => {
    if ((config.direct.apiUrl === req.baseUrl) && ('/checkcredentials' !== req.url)){
        if ((!req.app.locals.deals_api) && (req.app.locals.dusers)) {
            let dealsUser = req.app.locals.dusers;
            if (('nologin' === dealsUser.deals_login) || ('nopass' === dealsUser.deals_pass)) {
                // res.local.noservice = true;
                let err = new Error('Deals user not defined. Service not avaible');
                err.status = 501;
                next(err);
            } else {
                req.app.locals.deals_api = new DealsAPI({
                    dealsUrl: config.deals.dealsUrl,
                    login: dealsUser.deals_login,
                    password: dealsUser.deals_pass
                });
                // res.local.noservice = false;
            }
        }
    }
    next();
})

//API Deals
router.get('/', api.index);

router.get('/getorganization/:org_code', api.getOrganization);
router.get('/getorganization', api.getOrganization);

router.get('/getdealslist/:org_code', api.getDealsList);
router.get('/getdealslist', api.getDealsList);

router.get('/getdealdocumentlist/:dealID', api.getDealDocumentList);

router.get('/getdocumentinfo/:id', api.getDocumentInfo);

router.get('/getdocument/:id/:dwn', api.getDocument);
router.get('/getdocument/:id', api.getDocument);

router.post('/addnewdeal', api.addNewDeal);


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

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /crud
app.use(config.direct.crudUrl, routerCrud);

// catch 404 and forward to error handler
/*app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: (yargs['client-environment'] === 'development') ? err : {}
    });
});*/

MongoClient.connect((yargs['client-environment'] === 'development') ? config.mongodb.url_dev : config.mongodb.url,
    {
        useUnifiedTopology: true,  // установка опций
        useNewUrlParser: true
    },
    (err, database) => {
        if (err) return console.log(err);
        var mydb = database.db((yargs['client-environment'] === 'development') ? config.mongodb.db_name_dev : config.mongodb.db_name);
        let adminuser = {name: config.mongodb.main_user, is_admin: true};
        mydb.collection('users').findOne(adminuser, (err, item) => {
            if (err) {
                console.log('An error has occured while finding the record');
            } else if (null === item) {
                let pass = CryptoJS.SHA256(config.mongodb.default_password).toString(CryptoJS.enc.Base64);
                let adminuser_new = {
                    name: config.mongodb.main_user,
                    pass: pass,
                    email: config.mongodb.default_email,
                    deals_login: 'nologin',
                    deals_pass: 'nopass',
                    is_admin: true
                };
                mydb.collection('users').insertOne(adminuser_new, (err, result) => {
                    if (err) {
                        //   res.send({ 'error': 'An error has occurred' });
                        console.log('An error has occurred while inserting the record');
                    } else {
                        console.log('Created default admin user -> ' + result.ops[0].name);
                        app.locals.dusers = result.ops[0];
                    }
                });
                mydb.collection('organizations').insertOne({
                    org_name : 'My Organization',
                    inn : config.deals.orgCode,
                    is_main : true
                }, (err, result) => {
                    if (err) {
                        //   res.send({ 'error': 'An error has occurred' });
                        console.log('An error has occurred while inserting the record');
                    } else {
                        console.log('Created default organization -> ' + result.ops[0].org_name);
                        // app.locals.dusers = result.ops[0];
                    }
                });
            }
            else {
                console.log('Found admin user -> ' + item.name);
                app.locals.dusers = item;
            }
        });
        console.log('Connected to -> ' + mydb.s.namespace.db);
        app.locals.db = mydb;

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


//app.listen(ports.http, (err) => {
//    console.log(`Non-Secure Server listening on port ${ports.http}`);
//app.on('error', onError);
//});


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
