Ext.define('OptimusDocs.model.Organizations', {
    extend: 'Ext.data.Model',
    alias: 'model.organizations',

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
            name: 'org_name',
            useNull: false,
            critical : true
        }, {
            name:'inn',
            useNull: false,
            critical : true
        }, {
            name: 'is_main',
            useNull: false,
            critical : true,
            type: 'boolean', defaultValue: true
        }],

    validators: [{
        type: 'length',
        field: 'org_name',
        min: 10, max: 120
    }, {
        type: 'length',
        field: 'inn',
        min: 8, max: 8
    }]
});