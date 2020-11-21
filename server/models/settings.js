const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
    deals_url: String,
    deals_user: {type: Schema.ObjectId, ref: 'Users', required: true},
    createdDate: {type: Date, default: Date.now},
    organization: {type: Schema.ObjectId, ref: 'Organizations', required: true}
});

settingsSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
settingsSchema.set('toJSON', {
    virtuals: true
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;