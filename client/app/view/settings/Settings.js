Ext.define('OptimusDocs.view.settings.Settings', {

    extend: 'Ext.form.Panel',

    xtype: 'settingsForm',
    title: 'Настройки сервиса',

    controller: 'settings',
    //TODO settings form create
    initComponent: function () {
        Ext.apply(this,
            {
                //set jsonsubmit to true for CUD operation using form.Submit()
                jsonSubmit: true,
                url: '/crud/settings',
                resizable: false,
                collapsible: false,
                bodyPadding: '5',
                buttonAlign: 'center',
                border: false,
                trackResetOnLoad: true,
                layout:
                    {
                        type: 'vbox'
                    },
                fieldDefaults:
                    {
                        xtype: 'textfield',
                        msgTarget: 'side',
                        labelAlign: 'top',
                        labelStyle: 'font-weight:bold'
                    },
                defaultType: 'textfield',
                items: [{
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    defaultType: 'textfield',
                    width: '100%',
                    fieldDefaults:
                        {
                            labelAlign: 'top',
                            labelStyle: 'font-weight:bold'
                        },
                    items: [{
                        fieldLabel: 'Id',
                        name: '_id',
                        readOnly: true,
                        width: 155
                    },
                        {
                            fieldLabel: 'ИНН',
                            width: 150,
                            // flex: 1,
                            name: 'inn',
                            margin: '0 0 0 5',
                            allowBlank: false
                        },
                        {
                            name: 'deals_user',
                            width: 200,
                            margin: '0 0 0 5',
                            fieldLabel: 'Deals login:'
                        },
                        {
                            fieldLabel: 'Deals password',
                            flex: 1,
                            margin: '0 0 0 5',
                            name: 'deals_pass'
                        }
                    ]
                },
                    // {
                    //     xtype: 'datefield',
                    //     fieldLabel: 'Date of Birth',
                    //     name: 'birthDate'
                    // },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Deals URL',
                        width: '100%',
                        name: 'deals_url'
                    }
                    // ,
                    // {
                    //     xtype: 'textfield',
                    //     hideLabel: true,
                    //     name: 'address2',
                    //     width: '100%',
                    //     fieldLabel: 'address2'
                    //
                    // },
                    // {
                    //     xtype: 'textfield',
                    //     fieldLabel: 'City',
                    //     width: '100%',
                    //     name: 'city'
                    // },
                    // {
                    //     xtype: 'textfield',
                    //     fieldLabel: 'state',
                    //     width: '100%',
                    //     name: 'state'
                    // }
                ],
                buttons: [
                //     {
                //     text: 'Create',
                //     itemId: 'btnCreate',
                //     formBind: true,
                //     handler: 'onCreateClick'
                // },
                    {
                        text: 'Read',
                        itemId: 'btnLoad',
                        handler: 'onReadClick'
                    },

                    {
                        text: 'Update',
                        itemId: 'btnUpdate',
                        formBind: true,
                        handler: 'onUpdateClick'
                    },
                    // {
                    //     text: 'Delete',
                    //     itemId: 'btnDelete',
                    //     formBind: true,
                    //     handler: 'onDeleteClick'
                    // },
                    // {
                    //     text: 'Reset',
                    //     itemId: 'btnReset',
                    //     handler: 'onResetClick'
                    // },
                    {
                        text: 'Clear',
                        itemId: 'btnClear',
                        handler: 'onClearClick'
                    }]
            });

        this.callParent(arguments);

    },
    clearForm: function () {
        this.getForm().getFields().each(function (field) {
            field.validateOnChange = false;
            field.setValue('');
            field.resetOriginalValue();
        });
    }

});