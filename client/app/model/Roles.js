Ext.define('OptimusDocs.model.Roles', {
    extend: 'Ext.data.Model',
    alias: 'model.roles',
    
    fields: [{
        name: 'id',
        type: 'int',
        useNull: false
    }, 'name'],
    validations: [{
        type: 'length',
        field: 'name',
        min: 2, max: 40
    },{
        type: 'inclusion',
        field: 'name',
        list:['ROLE_ADMIN','ROLE_USER']
    }]
});