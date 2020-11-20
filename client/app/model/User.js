Ext.define('OptimusDocs.model.User', {
    extend: 'Ext.data.Model',
    alias: 'model.user',

    fields: [
        {
            name: '_id',
            critical : true
        },
        {
            name:'name',
            useNull: false,
            critical : true
        },
        // {
        //     name:'pass',
        //     useNull: false
        // },
        {
            name:'email',
            useNull: false,
            critical : true
        },
        {
            name:'deals_login',
            useNull: false,
            critical : true
        },
        {
            name:'deals_pass',
            useNull: false,
            critical : true
        },
        {
            name: 'is_admin',
            useNull: false,
            critical : true,
            type: 'boolean', defaultValue: true
        }
    ],

    validators: [{
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