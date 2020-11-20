Ext.define('OptimusDocs.store.Settings', {
    extend: 'Ext.data.Store',

    requires: [
        'OptimusDocs.model.Settings',
        'Ext.data.proxy.Rest',
        'Ext.window.Toast'
    ],

    alias: 'store.settings',
    model: Ext.create('OptimusDocs.model.Settings'),
    autoLoad: true,
    autoSync: false,
    autoDestroy: true,

    proxy: {
        type: 'rest',
        url: '/crud/settings',
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