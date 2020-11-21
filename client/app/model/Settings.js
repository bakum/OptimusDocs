Ext.define('OptimusDocs.model.Settings', {
    extend: 'Ext.data.Model',
    alias: 'model.settings',

    fields: [
        {
            name: 'id',
            critical : true
        },
        {
            name: '_id',
            critical : true
        },
        {
            name:'deals_url',
            useNull: false,
            critical : true
        }
    ],

    validators: [{
        type: 'length',
        field: 'deals_url',
        max: 120
    }]
});