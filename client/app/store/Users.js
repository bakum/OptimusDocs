Ext.define('OptimusDocs.store.Users', {
    extend: 'Ext.data.Store',

    requires: [
        'OptimusDocs.model.User',
        'Ext.data.proxy.Rest',
        'Ext.window.Toast'
    ],

    alias: 'store.users',
    model: Ext.create('OptimusDocs.model.User'),
    autoLoad: true,
    autoSync: false,
    autoDestroy: true,

    sorters: [{
        property: 'name',
        direction: 'ASC'
    }],

    proxy: {
        type: 'rest',
        url: '/crud/users',
        appendId: true,
        // idParam: '_id',
        reader: {
            type: 'json',
            // idProperty: '_id',
            rootProperty: 'items'
        },
        writer: {
            type: 'json',
            encode: true,
            // idProperty: '_id',
            rootProperty: 'items'
        }
    },
    listeners: {
        write: function (store, operation) {
            let record = operation.getRecords()[0],
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
            const msg = Ext.String.format("{0} запись: {1}", verb, record.getId());
            Ext.toast({
                // title: name,
                html: msg,
                align: 't',
                bodyPadding: 10
            });

        }
    }
});
