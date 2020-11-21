const mongoose = require('mongoose');
const config = require('../utils/config');
const CryptoJS = require("crypto-js");
const pass_default = CryptoJS.SHA256(config.mongodb.default_password).toString(CryptoJS.enc.Base64);

const userSchema = mongoose.Schema({
    name: {type: String, required: true, max: 120, default : config.mongodb.main_user},
    pass: {type: String, required: true, max: 100, default : pass_default},
    email: {type: String, default : config.mongodb.default_email},
    deals_login: {type: String, required: true, max: 100, default : 'nologin'},
    deals_pass: {type: String, required: true, max: 100, default : 'nopass'},
    is_admin: {type: Boolean, default: true},
    createdDate: {type: Date, default: Date.now},
    organization: {type: mongoose.Schema.Types.ObjectId, ref: 'Organizations'}
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
    virtuals: true
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;