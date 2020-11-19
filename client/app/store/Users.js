Ext.define('OptimusDocs.store.Users', {
    extend: 'Ext.data.Store',

    requires: [
        'Ext.data.proxy.Rest',
        'Ext.window.Toast'
    ],

    alias: 'store.users',
    // model: 'model.user',
    autoLoad: true,
    autoSync: false,
    autoDestroy: true,
    // pageSize: 15,

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
    }],

    sorters: [{
        property: 'name',
        direction: 'ASC'
    }],

    // data: { items: [
    //     { name: 'Jean Luc', email: "jeanluc.picard@enterprise.com", phone: "555-111-1111" },
    //     { name: 'Worf',     email: "worf.moghsson@enterprise.com",  phone: "555-222-2222" },
    //     { name: 'Deanna',   email: "deanna.troi@enterprise.com",    phone: "555-333-3333" },
    //     { name: 'Data',     email: "mr.data@enterprise.com",        phone: "555-444-4444" }
    // ]},

    proxy: {
        type: 'rest',
        url: '/crud/users',
        appendId: true,
        // idParam: '_id',
        reader: {
            type: 'json',
            idProperty: '_id',
            rootProperty: 'items'
        },
        writer: {
            type: 'json',
            encode: true,
            idProperty: '_id',
            rootProperty: 'items'
        }
    },
    listeners: {
        write: function (store, operation) {
            var record = operation.getRecords()[0],
                name = Ext.String.capitalize(operation.action),
                verb;


            if (name == 'Destroy') {
                //record = operation.records[0];
                verb = 'Удалена';
            } else if (name == 'Create') {
                store.reload();
                verb = 'Добавлена';
                //record = operation.records[0];

            } else {
                verb = 'Отредактирована';
            };
            var msg = Ext.String.format("{0} запись: {1}", verb, record.data.name);
            Ext.toast({
                // title: name,
                html: msg,
                align: 't',
                bodyPadding: 10
            });

        }
    }
});
