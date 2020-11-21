const config = require('../utils/config');
const fs = require('fs');
const path = require('path');
const pathDownload = path.join(__dirname, '../download');
const Users = require("../models/users.js");

exports.index = (req, res) => {
    res.json({message: 'hooray! welcome to our api!'});
    // console.log(db);
};

/**
 *
 * @param {Object} options
 * @param {String} options.code
 * @param {Boolean} options.confirmed
 * @returns {Promise.<{ID: Number}>}
 */
exports.getOrganization = (req, response) => {
    if (!req.params.org_code && !req.query.org_code && !config.deals.orgCode) throw new Error('Invalid parameters');

    const api = req.app.locals.deals_api;
    const options = {
        code: req.params.org_code || req.query.org_code || config.deals.orgCode,
        confirmed: req.query.confirmed || true
    }

    api.getOrganization(options).then(res => {
        // console.log(res);
        response.json(res);
    }).catch(err => {
        console.error(err.data);
        response.status(400).json(err);
    });
};

/**
 *
 * @param {Object} options
 * @param {Number} options.orgID
 * @param {Date} options.dateFrom
 * @param {Date} options.dateTo
 * @param {Boolean} [options.appendArchive=false] Append deals from archive
 * @returns {Promise.<Object[]>}
 */
exports.getDealsList = (req, response) => {
    if (!req.params.org_code && !req.query.org_code && !config.deals.orgCode) throw new Error('Invalid parameters');
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

/**
 *
 * @param {Object} options
 * @param {Number} options.dealID
 * @returns {Promise.<Object[]>}
 */
exports.getDealDocumentList = (req, response) => {
    if (!req.params.dealID && !req.query.dealID) throw new Error('Invalid parameters');
    const dealID = req.params.dealID || req.query.dealID;

    const api = req.app.locals.deals_api;

    api.getDealDocumentList({dealID: dealID}).then(res => {
        response.json(res);
    }).catch(err => {
        console.log(err.data);
        response.status(400).json(err);
    })
};

/**
 *
 * @param {Object} options
 * @param {Number} options.ID
 * @returns {Promise.<Object>}
 */
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

/**
 *
 * @param {Object} options
 * @param {Number} options.ID
 * @param {String} options.resultType (possible values DOCUMENT, SIGNATURES, FULL)
 * @returns {Promise.<ArrayBuffer>}
 */
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

/**
 *
 * @param {Object} options
 * @param {String} options.name Deal name
 * @param {String} [options.description] Deal description
 * @param {String} [options.num] Deal code
 * @param {Boolean} [options.onlyAuthor=false] Only author can add documents
 * @param {Boolean} [options.payForPartner=false] This organization pay for partner. This is only default value for insert new document
 * @param {String} [options.accessType=GENERAL] Deal accessType Possible values ['GENERAL', 'LIMITED']
 * @param {Boolean} [options.isDocConfirm=false]
 * @param {String} [options.moderator] Login user that must be moderator
 * @param {String} [options.accessUser] Login users who has access to deal. The parameter accessType must has value 'limited'
 * @param {String} [options.accessGroup] Group names that has access to deal. The parameter accessType must has value 'limited'
 * @param {String} [options.accessGroupFull] Group names that has access to the deal with its subgroups. The parameter accessType must has value 'limited'
 * @returns {Promise}
 */
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

/**
 *
 * @param {Object} options
 * @param {Number} [options.dealID]
 * @param {Number} [options.orgID]
 * @param {String} [options.publicGroup] Public group name
 * @param {String} [options.eMail]
 * @returns {Promise.<Object>}
 */
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