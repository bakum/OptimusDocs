Ext.define('OptimusDocs.model.Organizations', {
    extend: 'Ext.data.Model',
    alias: 'model.organizations',

    fields: [{
        name: 'org_name',
        useNull: false
    }, {
        name:'inn',
        useNull: false
    }, {
        name: 'is_main',
        useNull: false,
        type: 'boolean', defaultValue: true
    }],
    validations: [{
        type: 'length',
        field: 'org_name',
        min: 10, max: 120
    }, {
        type: 'length',
        field: 'inn',
        min: 8, max: 8
    }]
});