Ext.define('OptimusDocs.model.User', {
    extend: 'Ext.data.Model',
    alias: 'model.user',
    
    fields: [{
        name: 'id',
        type: 'int',
        useNull: false
    }, 'username', 'name', 'email','password'],
    validations: [{
        type: 'length',
        field: 'email',
        min: 1
    }, {
        type: 'length',
        field: 'username',
        min: 2, max:40
    }, {
        type: 'length',
        field: 'name',
        min: 2, max: 40
    }]
});