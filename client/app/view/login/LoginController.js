Ext.define('OptimusDocs.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    onLoginClick: function(me) {
        var form = me.up('window').down('form').getForm(); 
        var win = this;      
        if (form.isValid()) {
            var formValues = form.getValues(),
            passField = form.findField('password');
            passField.setValue(CryptoJS.SHA256(formValues.password).toString(CryptoJS.enc.Base64));
            form.submit({
                url: '/api/checkcredentials',  // your url
                params: null, // needed for additional param
                submitEmptyText: false,  // don't post empty text in fields
                success: function(form, action) {
                    localStorage.setItem("OptimusDocLoggedIn",true);
                    win.getView().destroy();
                    // Add the main view to the viewport
                    Ext.create({
                       xtype: 'app-main'
                     });
                },
                failure: function(form, action) {
                    Ext.Msg.alert('Failed', action.result.msg);
                }
            });
        }
        // This would be the ideal location to verify the user's credentials via
        // a server-side lookup. We'll just move forward for the sake of this example.

    },
    onKey: function (field, el) {
        if (el.getKey() == Ext.EventObject.ENTER) //ENTER key performs Login
            var myBtn = Ext.ComponentQuery.query('#login-button')[0];
            // console.log(myBtn);
            myBtn.fireEvent('click', myBtn);
            // Ext.getCmp('#login-button').fireEvent('click');
    }
});