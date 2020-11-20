const mongoose = require('mongoose');
const config = require('../utils/config');

const orgSchema = mongoose.Schema({
    org_name: {type: String, default: 'My Organization'},
    inn: {type: String, default: config.deals.orgCode},
    is_main: {type: Boolean, default: true},
    createdDate: {type: Date, default: Date.now}
});

const Organizations = mongoose.model('Organizations', orgSchema);

module.exports = Organizations;