const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {type: String, required: true, max: 120},
    pass: {type: String, required: true, max: 100},
    email: String,
    deals_login: {type: String, required: true, max: 100},
    deals_pass: {type: String, required: true, max: 100},
    is_admin: Boolean,
    createdDate: {type: Date, default: Date.now},
    organization: {type: Schema.ObjectId, ref: 'Organizations', required: true}
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;