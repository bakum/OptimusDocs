const mongoose = require('mongoose');

const orgSchema = mongoose.Schema({
    org_name: String,
    inn: String,
    is_main: Boolean,
    createdDate: {type: Date, default: Date.now}
});

const Organizations = mongoose.model('Organizations', orgSchema);

module.exports = Organizations;