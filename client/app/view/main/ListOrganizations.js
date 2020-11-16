/**
 * This view is an example list of people.
 */
Ext.define('OptimusDocs.view.main.ListOrganizations', {
    extend: 'Ext.grid.Panel',
    xtype: 'mainlistorganizations',

    requires: [
        'OptimusDocs.store.Organizations'
    ],

    title: 'Организации',

    store: {
        type: 'organizations'
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
            pluginId: 'rowediting',
            saveBtnText: 'Сохранить',
            cancelBtnText: 'Отменить',
            errorSummary: true
        })
    ],

    columns: [
        {
            text: 'ID',
            dataIndex: '_id',
            hidden : true
        },
        {
            text: 'Наименование',
            align: 'center',
            dataIndex: 'org_name',
            flex: 1,
            editor: {xtype: 'textfield', allowBlank: false}
        },
        {
            text: 'ИНН',
            align: 'center',
            dataIndex: 'inn',
            editor: {xtype: 'textfield', allowBlank: false}
        },
        {
            text: 'Основная организация',
            // xtype: 'checkcolumn',
            xtype: 'booleancolumn',
            dataIndex: 'is_main',
            flex: 1,
            trueText: 'Да',
            falseText: 'Нет'
            // editor: {xtype: 'checkbox', allowBlank: false}
        }
    ],
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store:  {
            type: 'organizations'
        },
        dock: 'bottom',
        displayInfo: true,
        beforePageText: 'Страница',
        afterPageText: 'из {0}',
        displayMsg: 'Организации {0} - {1} из {2}'
    }]
    // dockedItems: [
    //     {
    //     xtype: 'pagingtoolbar',
    //     bind: {
    //         store: {
    //             type: 'organizations'
    //         }
    //     },   // same store GridPanel is using
    //     dock: 'bottom',
    //     displayInfo: true,
    //     plugins: Ext.create('client.ProgressBarPager', {
    //         width: 350,
    //         pluginId: 'pager'
    //     })
    // },
    //     {
    //         xtype: 'toolbar',
    //         items: [
    //             {
    //                 text: 'Добавить',
    //                 iconCls: 'icon-user-add',
    //                 handler: 'onCreateRecord'
    //             },
    //             {
    //                 text: 'Удалить',
    //                 itemId: 'removeKontrag',
    //                 iconCls: 'icon-delete-user',
    //                 disabled: true,
    //                 handler: 'onClickDelete'
    //             }
    //         ]
    //     }
    // ]

    // listeners: {
    //     select: 'onItemSelected'
    // }
});
