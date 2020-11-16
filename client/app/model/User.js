Ext.define('OptimusDocs.model.User', {
    extend: 'Ext.data.Model',
    alias: 'model.user',

    fields: [
        {
            name:'name',
            useNull: false
        },
        {
            name:'pass',
            useNull: false
        },
        {
            name:'email',
            useNull: false
        },
        {
            name:'deals_login',
            useNull: false
        },
        {
            name:'deals_pass',
            useNull: false
        },
        {
            name: 'is_admin',
            useNull: false,
            type: 'boolean', defaultValue: true
        }
    ],

    validations: [{
        type: 'length',
        field: 'name',
        max: 120
    }, {
        type: 'length',
        field: 'pass',
        min: 6, max: 120
    }, {
        type: 'length',
        field: 'deals_login',
        max: 100
    },{
        type: 'length',
        field: 'deals_pass',
        max: 100
    }]
});