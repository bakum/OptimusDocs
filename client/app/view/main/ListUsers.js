/**
 * This view is an example list of people.
 */
Ext.define('OptimusDocs.view.main.ListUsers', {
    extend: 'Ext.grid.Panel',
    xtype: 'mainlistusers',

    requires: [
        'OptimusDocs.store.Users'
    ],

    title: 'Пользователи',

    store: {
        type: 'users'
    },

    plugins: [
        Ext.create('Ext.grid.plugin.RowEditing', {
            // hideButtons: function(){
            //     var me = this;
            //     if (me.editor && me.editor.floatingButtons){
            //         me.editor.floatingButtons.getEl().setStyle('visibility', 'hidden');
            //     } else {
            //         Ext.defer(me.hideButtons, 10, me);
            //     }
            // },

            listeners: {
                // beforeedit: {
                //     fn: function(){
                //         this.hideButtons();
                //     },
                //     single: true
                // },
                cancelEdit: function (rowEditing, context) {

                    // var store = Ext.getStore('organizations');
                    // console.log(context.store);
                    if (context.record.phantom) {
                        context.store.remove(context.record);
                    }
                },
                edit: function (rowEditing, context) {
                    // console.log(Ext.getStore('organizations'));
                    // Ext.getStore('store.organizations').sync();
                    context.store.sync();
                }
            },
            clicksToMoveEditor: 2,
            // useNull: false,
            autoCancel: true,
            // pluginId: 'rowediting',
            saveBtnText: 'Сохранить',
            cancelBtnText: 'Отменить',
            errorSummary: true
        })
        // {
        //     ptype: 'rowediting',
        //     clicksToEdit: 2,
        //     autoCancel: true
        // },
    ],

    columns: [{
            xtype: 'actioncolumn',
            align: 'center',
            width: 30,
            handler: 'onChangePass',
            items: [{
                tooltip: 'Сменить пароль',
                iconCls: 'x-fa fa-key'
            }]
        },
        {
            text: 'ID',
            dataIndex: '_id',
            hidden : true
        },
        {
            text: 'Логин',
            dataIndex: 'name'
            // editor: {xtype: 'textfield', allowBlank: false}
        },
        {
            text: 'Email',
            dataIndex: 'email',
            flex: 1,
            editor: {xtype: 'textfield', allowBlank: false}
            },
        {
            text: 'Deals (login)',
            dataIndex: 'deals_login',
            flex: 1,
            editor: {xtype: 'textfield', allowBlank: false}
        },
        {
            text: 'Deals (password)',
            dataIndex: 'deals_pass',
            hidden : true,
            flex: 1,
            editor: {xtype: 'textfield', allowBlank: false}
        },
        {
            text: 'Администратор',
            dataIndex: 'is_admin',
            xtype: 'booleancolumn',
            flex: 1,
            trueText: 'Да',
            falseText: 'Нет'
            // editor: {xtype: 'checkbox', allowBlank: false}
        }
    ],
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store:  {
            type: 'users'
        },
        dock: 'bottom',
        displayInfo: true,
        beforePageText: 'Страница',
        afterPageText: 'из {0}',
        displayMsg: 'Пользователи {0} - {1} из {2}'
    }]

    // listeners: {
    //     select: 'onItemSelected'
    // }
});
