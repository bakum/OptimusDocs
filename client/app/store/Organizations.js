Ext.define('OptimusDocs.store.Organizations', {
    extend: 'Ext.data.Store',

    requires: [
        'Ext.data.proxy.Rest',
        'Ext.window.Toast'
    ],

    alias: 'store.organizations',
    // model: 'model.organizations',
    autoLoad: true,
    autoSync: false,
    autoDestroy: true,
    // idProperty: '_id',
    // idParam: '_id',
    // pageSize: 15,

    fields: [
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

    validations: [{
        type: 'length',
        field: 'org_name',
        min: 10, max: 120
    }, {
        type: 'length',
        field: 'inn',
        min: 8, max: 8
    }],

    sorters: [{
        property: 'org_name',
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
        url: '/crud/organizations',
        appendId: true,
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
            var msg = Ext.String.format("{0} запись: {1}", verb, record.getId());
            Ext.toast({
                // title: name,
                html: msg,
                align: 't',
                bodyPadding: 10
            });

        }
    }
});
