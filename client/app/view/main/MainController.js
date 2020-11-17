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
        this.dialog = Ext.widget('changepassdlg');
        this.dialog.show();
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
