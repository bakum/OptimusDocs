Ext.define('OptimusDocs.view.login.Login', {
    extend: 'Ext.window.Window',
    xtype: 'login',

    requires: [
        'OptimusDocs.view.login.LoginController',
        'Ext.form.Panel'
    ],

    controller: 'login',
    bodyPadding: 10,
    title: 'Авторизация',
    closable: false,
    autoShow: true,

    items: {
        xtype: 'form',
        reference: 'form',
        items: [{
            xtype: 'textfield',
            name: 'username',
            fieldLabel: 'Логин:',
            enableKeyEvents:true,
            emptyText: 'login',
            allowBlank: false,

        }, {
            xtype: 'textfield',
            name: 'password',
            inputType: 'password',
            fieldLabel: 'Пароль:',
            enableKeyEvents:true,
            emptyText: 'password',
            allowBlank: false,
            listeners: {
                specialkey: 'onKey'
            }
        }, {
            xtype: 'displayfield',
            hideEmptyLabel: false,
            value: 'Введите имя пользователя и пароль'
        }],
        buttons: [{
            text: 'Войти',
            formBind: true,
            itemId: 'login-button',
            listeners: {
                click: 'onLoginClick'
            }
        }]
    }
});