const {DealsAPI} = require('@unitybase/deals-api');
const Users = require("../models/users.js");
const config = require('../utils/config');

const adminuser = {
    name: config.mongodb.main_user,
    is_admin: true
};

exports.getApi = async () => {

    const item = await Users.findOne(adminuser).exec();
    const ap = await new DealsAPI({
        dealsUrl: config.deals.dealsUrl,
        login: item.deals_login,
        password: item.deals_pass
    });
    console.log('Star.Docs API has been loaded');
    return ap;
}