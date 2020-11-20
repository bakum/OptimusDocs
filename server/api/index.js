const config = require('../utils/config');
const fs = require('fs');
const path = require('path');
const pathDownload = path.join(__dirname, '../download');
const Users = require("../models/users.js");

exports.index = (req, res) => {
    res.json({message: 'hooray! welcome to our api!'});
    // console.log(db);
};

exports.getOrganization = (req, response) => {
    const api = req.app.locals.deals_api;
    const options = {
        code: req.params.org_code || req.query.org_code || config.deals.orgCode,
        confirmed: true
    }

    api.getOrganization(options).then(res => {
        // console.log(res);
        response.json(res);
    }).catch(err => {
        console.log(err.data);
        response.status(400).json(err);
    });
};

exports.getDealsList = (req, response) => {
    const api = req.app.locals.deals_api;
    const id = req.params.org_code || req.query.org_code || config.deals.orgCode;

    api.getOrganization({code: id, confirmed: true}).then(res => {

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
        response.status(400).json(err);
    });

};

exports.getDealDocumentList = (req, response) => {
    const dealID = req.params.dealID || req.query.dealID;

    const api = req.app.locals.deals_api;

    api.getDealDocumentList({dealID: dealID}).then(res => {
        response.json(res);
    }).catch(err => {
        console.log(err.data);
        response.status(400).json(err);
    })
};

exports.getDocumentInfo = (req, response) => {
    const ID = req.params.id || req.query.id;

    const api = req.app.locals.deals_api;
    api.getDocumentInfo({ID: ID}).then(res => {
        response.json(res);
    }).catch(err => {
        console.log(err.data);
        response.status(400).json(err);
    })
};

exports.getDocument = (req, response) => {
    const ID = req.params.id;
    const dwn = req.params.dwn || 0;
    const api = req.app.locals.deals_api;

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
        response.status(400).json(err);
    })
}

exports.addNewDeal = (req, response) => {
    const options = {
        name: req.body.name || req.query.name || 'New name',
        description: req.body.desc || req.query.desc || (new Date()).toLocaleString(),
        onlyAuthor: req.body.onlyAuthor || req.query.onlyAuthor || 'true'
    }
    const api = req.app.locals.deals_api;
    api.addNewDeal(options).then(res => {
        response.json(res);
    }).catch(err => {
        console.log(err.data);
        response.status(400).json(err);
    })
}

exports.addNewDealAndInvite = (req, response) => {
    const options = {
        name: req.body.name || req.query.name || 'New name',
        description: req.body.desc || req.query.desc || (new Date()).toLocaleString(),
        onlyAuthor: req.body.onlyAuthor || req.query.onlyAuthor || 'true'
    }
    const api = req.app.locals.deals_api;
    api.addNewDeal(options).then(res => {
        const dealID = res.ID;
        return api.getOrganization({code: req.body.orgINN, confirmed: true}).then(res => {
            let option_for_invite = {
                dealID: dealID,
                orgID: res.ID
            };
            return api.invitePartner(option_for_invite)
        }).catch(e => {
            let option_for_invite = {
                dealID: dealID,
                eMail: req.body.eMail,
                invite: req.body.invite
            }
            return api.invitePartner(option_for_invite)
        })
    }).then(res => {
        response.json(res);
    }).catch(err => {
        console.log(err.data);
        response.status(400).json(err);
    });
}

exports.credentials = (req, res) => {
    let adminuser = {name: req.body.username, is_admin: true};
    Users.findOne(adminuser).then((item) => {
        if (null === item) {
            res.json({success: false, msg: "Login failed"});
        } else {
            if ((item.name === req.body.username) && (item.pass === req.body.password)) {
                res.json({success: true});
            } else {
                res.json({success: false, msg: "Login failed"});
            }
        }
    }).catch(err => {
        res.json({success: false, msg: "Login failed"});
    })
};