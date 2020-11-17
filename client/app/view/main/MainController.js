/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('OptimusDocs.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'Ext.window.Window',
        'Ext.form.Panel'
    ],

    alias: 'controller.main',

    onItemSelected: function (sender, record) {
        // Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    },

    onChangePass: function(grid, rowIndex, colIndex) {
        var record = grid.store.data.items[rowIndex].data;
        Ext.define('ChangePassDlg', {
            extend: 'Ext.window.Window',
            xtype: 'changepassdlg',
            title: Ext.String.format("Cменить пароль для: {0}",record.name),
            bodyPadding: 10,
            closable: true,
            autoShow: true,
            modal: true,
            items: {
                xtype: 'form',
                reference: 'form',
                items: [{
                    xtype: 'textfield',
                    name: 'password_old',
                    inputType: 'password',
                    fieldLabel: 'Старый пароль:',
                    enableKeyEvents:true,
                    emptyText: 'old password',
                    allowBlank: false,

                }, {
                    xtype: 'textfield',
                    name: 'password_new',
                    inputType: 'password',
                    fieldLabel: 'Новый пароль:',
                    enableKeyEvents:true,
                    emptyText: 'new password',
                    allowBlank: false,
                    listeners: {
                        // specialkey: 'onKey'
                    }
                }, {
                    xtype: 'textfield',
                    name: 'password_new_rep',
                    inputType: 'password',
                    fieldLabel: 'Новый пароль (ещё раз):',
                    enableKeyEvents:true,
                    emptyText: 'new password',
                    allowBlank: false,
                    listeners: {
                        // specialkey: 'onKey'
                    }
                },
                    {
                    xtype: 'displayfield',
                    hideEmptyLabel: false,
                    value: 'Введите старый пароль и дважды новый'
                }],
                buttons: [{
                    text: 'Сменить',
                    formBind: true,
                    itemId: 'login-button',
                    listeners: {
                        click: 'onChangePassword'
                    }
                }]
            }
        });
        // var win = new Ext.window.Window();
        // var form = Ext.create('Ext.form.Panel', {
        //     title: 'Simple Form',
        //     bodyPadding: 5,
        //     width: 350,
        //
        //     // The form will submit an AJAX request to this URL when submitted
        //     url: 'save-form.php',
        //
        //     // Fields will be arranged vertically, stretched to full width
        //     layout: 'anchor',
        //     defaults: {
        //         anchor: '100%'
        //     },
        //
        //     // The fields
        //     defaultType: 'textfield',
        //     items: [{
        //         fieldLabel: 'First Name',
        //         name: 'first',
        //         allowBlank: false
        //     },{
        //         fieldLabel: 'Last Name',
        //         name: 'last',
        //         allowBlank: false
        //     }],
        //
        //     // Reset and Submit buttons
        //     buttons: [{
        //         text: 'Reset',
        //         handler: function() {
        //             this.up('form').getForm().reset();
        //         }
        //     }, {
        //         text: 'Submit',
        //         formBind: true, //only enabled once the form is valid
        //         disabled: true,
        //         handler: function() {
        //             var form = this.up('form').getForm();
        //             if (form.isValid()) {
        //                 form.submit({
        //                     success: function(form, action) {
        //                         Ext.Msg.alert('Success', action.result.msg);
        //                     },
        //                     failure: function(form, action) {
        //                         Ext.Msg.alert('Failed', action.result.msg);
        //                     }
        //                 });
        //             }
        //         }
        //     }],
        //     renderTo: win
        // });
        this.dialog = Ext.widget('changepassdlg');
        this.dialog.show();
        // win.show();
    },

    onChangePassword: function(me){
        var form = me.up('window').down('form').getForm();
        // var win = this;
    },

    onLogoutClick: function () {
        // Remove the localStorage key/value
        localStorage.removeItem('OptimusDocLoggedIn');

        // Remove Main View
        this.getView().destroy();

        // Add the Login Window
        Ext.create({
            xtype: 'login'
        });
    }
});
