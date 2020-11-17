// const {DealsAPI} = require('@unitybase/deals-api');
const config = require('../utils/config');
const fs = require('fs');
const path = require('path');
const pathDownload = path.join(__dirname, '../download');

// exports.deals = () => {
//     let options = {
//         dealsUrl: config.deals.dealsUrl,
//         login: dealsUser.deals_login,
//         login: dealsUser.deals_login,
//         password: dealsUser.deals_pass
//     };
//     return new DealsAPI(options);
// };

exports.index = (req, res) => {
    res.json({message: 'hooray! welcome to our api!'});
    // console.log(db);
};

exports.getOrganization = (req, response) => {
    // let dealsUser = req.app.locals.dusers;
    const api = req.app.locals.deals_api;
    const options = {
        code: req.params.org_code || req.query.org_code || config.deals.orgCode,
        confirmed: true
    }
    // if (('nologin' === dealsUser.deals_login) && ('nopass' === dealsUser.deals_pass)) {
    //     response.json({message: 'deals user not defined!'});
    // } else {
    // const id = req.params.org_code || config.deals.orgCode;
    // const api = new DealsAPI({
    //     dealsUrl: config.deals.dealsUrl,
    //     login: dealsUser.deals_login,
    //     password: dealsUser.deals_pass
    // });
    api.getOrganization(options).then(res => {
        // console.log(res);
        response.json(res);
    }).catch(err => {
        console.log(err.data);
        response.json(err);
    });
    // }
};

exports.getDealsList = (req, response) => {
    // let dealsUser = req.app.locals.dusers;
    const api = req.app.locals.deals_api;
    const id = req.params.org_code || req.query.org_code || config.deals.orgCode;
    // const api = new DealsAPI({
    //     dealsUrl: config.deals.dealsUrl,
    //     login: dealsUser.deals_login,
    //     password: dealsUser.deals_pass
    // });
    api.getOrganization({code: id, confirmed: true}).then(res => {
        // console.log(res);
        // response.json(res);
        let dateFrom = new Date();
        dateFrom.setFullYear(dateFrom.getFullYear() - 1);
        return api.getDealsList({
            orgID: res.ID,
            dateFrom: dateFrom,
            dateTo: new Date(),
            appendArchive: true
        })
    }).then(res => {
        response.json(res);
    }).catch(err => {
        console.log(err.data);
        response.json(err);
    });

};

exports.getDealDocumentList = (req, response) => {
    const dealID = req.params.dealID;
    // let dealsUser = req.app.locals.dusers;
    const api = req.app.locals.deals_api;
    // const api = new DealsAPI({
    //     dealsUrl: config.deals.dealsUrl,
    //     login: dealsUser.deals_login,
    //     password: dealsUser.deals_pass
    // });
    api.getDealDocumentList({dealID: dealID}).then(res => {
        response.json(res);
    }).catch(err => {
        console.log(err.data);
        response.json(err);
    })
};

exports.getDocumentInfo = (req, response) => {
    const ID = req.params.id;
    // let dealsUser = req.app.locals.dusers;
    const api = req.app.locals.deals_api;
    // const api = new DealsAPI({
    //     dealsUrl: config.deals.dealsUrl,
    //     login: dealsUser.deals_login,
    //     password: dealsUser.deals_pass
    // });
    api.getDocumentInfo({ID: ID}).then(res => {
        response.json(res);
    }).catch(err => {
        console.log(err.data);
        response.json(err);
    })
};

exports.getDocument = (req, response) => {
    const ID = req.params.id;
    const dwn = req.params.dwn || 0;
    const api = req.app.locals.deals_api;
    // let dealsUser = req.app.locals.dusers;
    // const api = new DealsAPI({
    //     dealsUrl: config.deals.dealsUrl,
    //     login: dealsUser.deals_login,
    //     password: dealsUser.deals_pass
    // });
    api.getDocument({ID: ID, resultType: 'FULL'}).then(res => {
        const file = path.join(pathDownload, `doc${ID}.zip`);
        fs.writeFileSync(file, Buffer.from(res), {encoding: 'binary'});
        if (0 === dwn) {
            response.json(res);
        } else {
            response.download(file);
        }
    }).catch(err => {
        console.log(err.data);
        response.json(err);
    })
}

exports.addNewDeal = (req, response) => {
    const options = {
        name: req.body.name || req.query.name || 'New name',
        description: req.body.desc || req.query.desc || (new Date()).toLocaleString(),
        onlyAuthor: req.body.onlyAuthor || req.query.onlyAuthor || 'true'
    }
    // const name          = req.body.name || req.query.name || 'New name';
    // const desc          = req.body.desc || req.query.desc || (new Date()).toLocaleString();
    // const onlyAuthor    = req.body.onlyAuthor || req.query.onlyAuthor || 'true';
    const api = req.app.locals.deals_api;
    // let dealsUser = req.app.locals.dusers;
    // const api = new DealsAPI({
    //     dealsUrl: config.deals.dealsUrl,
    //     login: dealsUser.deals_login,
    //     password: dealsUser.deals_pass
    // });
    api.addNewDeal(options).then(res => {
        response.json(res);
    }).catch(err => {
        console.log(err.data);
        response.json(err);
    })
}

exports.credentials = (req, res) => {
    //console.log(req.body.username);
    //console.log(req.body.password);
    // console.log(db);
    let db = req.app.locals.db;
    let adminuser = {name: req.body.username, is_admin: true};

    db.collection('users').findOne(adminuser, (err, item) => {
        if (err) {
            console.log('An error has occured while finding the record');
            res.json({success: false, msg: "Login failed"});
        } else if (null === item) {
            res.json({success: false, msg: "Login failed"});
        }
        else {
            console.log('Found admin user -> ' + item.name);
            if ((item.name === req.body.username) && (item.pass === req.body.password)) {
                res.json({success: true});
            } else {
                res.json({success: false, msg: "Login failed"});
            }
        }
    });

    // if (("ADMIN" === req.body.username.toUpperCase()) && ("1C3ZVPk/YzDa/oEKp7EbW3L+4FzQ642O6WzFtrl2glI=" === req.body.password)) {
    //         res.json({ success: true });
    // } else {
    //     res.json({ success: false, msg : "Login failed" });
    //     }
};