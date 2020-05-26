const menuList = [
    // {
    //     key: "survey",
    //     permission: 'INDEX_BANNER',
    //     menuTitle: '概览'
    // },
    // {
    //     menuTitle: '商品',
    //     key: "goods",
    //     title: "商品管理",
    //     permission: ['GOODS_MANAGER_VIEW', 'GOODS_GROUPS_VIEW', 'GOODS_LABEL_VIEW'],
    //     defaultOpenKeys: ['sub1'],
    //     children: [
    //         {
    //             type: 'subMenu',
    //             key: 'sub1',
    //             title: '商品中心',
    //             permission: ['GOODS_MANAGER_VIEW', 'GOODS_GROUPS_VIEW', 'GOODS_LABEL_VIEW'],
    //             children: [
    //                 {
    //                     title: '商品管理',
    //                     key: 'goodsManage',
    //                     permission: 'GOODS_MANAGER_VIEW'
    //                 },
    //                 {
    //                     title: '商品分组',
    //                     key: 'goodsGroup',
    //                     permission: 'GOODS_GROUPS_VIEW'
    //                 },
    //                 {
    //                     title: '商品标签',
    //                     key: 'goodsLabel',
    //                     permission: 'GOODS_LABEL_VIEW'
    //                 },
    //             ]
    //         }
    //     ]
    // },
    // {
    //     menuTitle: '订单',
    //     key: 'order',
    //     title: '订单管理',
    //     permission: ['ORDER_MANAGER_VIEW', 'ORDER_REFUND_VIEW', 'ORDER_CHECK_VIEW', 'ORDER_FREIGHT_VIEW'],
    //     defaultOpenKeys: ['sub1', 'sub2'],
    //     children: [
    //         {
    //             type: 'subMenu',
    //             key: 'sub1',
    //             title: '订单查询',
    //             permission: ['ORDER_MANAGER_VIEW'],
    //             children: [
    //                 {
    //                     title: '全部订单',
    //                     key: 'orderAll',
    //                     permission: 'ORDER_MANAGER_VIEW'
    //                 }
    //             ]
    //         },
    //         {
    //             type: 'subMenu',
    //             title: '订单处理',
    //             key: 'sub2',
    //             permission: ['ORDER_REFUND_VIEW', 'ORDER_CHECK_VIEW', 'ORDER_FREIGHT_VIEW'],
    //             children: [
    //                 {
    //                     title: '退款管理',
    //                     key: 'refundManagement',
    //                     permission: 'ORDER_REFUND_VIEW'
    //                 },
    //                 {
    //                     title: '核销管理',
    //                     key: 'orderCheck',
    //                     permission: 'ORDER_CHECK_VIEW'
    //                 },
    //                 {
    //                     title: '运费模板',
    //                     key: 'freightTemplate',
    //                     permission: 'ORDER_FREIGHT_VIEW'
    //                 }
    //             ]
    //         }
    //     ]
    // },
    // {
    //     menuTitle: '客户',
    //     key: "client",
    //     title: "客户管理",
    //     defaultOpenKeys: ['sub1'],
    //     permission: ['CUSTOMER_MANAGER_VIEW', 'CUSTOMER_LABEL_VIEW'],
    //     children: [
    //         {
    //             type: 'subMenu',
    //             key: 'sub1',
    //             title: '客户管理',
    //             permission: ['CUSTOMER_MANAGER_VIEW', 'CUSTOMER_LABEL_VIEW'],
    //             children: [
    //                 {
    //                     title: '客户查询',
    //                     key: 'list',
    //                     permission: 'CUSTOMER_MANAGER_VIEW'
    //                 },
    //                 {
    //                     title: '客户标签',
    //                     key: 'tag',
    //                     permission: 'CUSTOMER_LABEL_VIEW'
    //                 }
    //             ]
    //         }
    //     ]
    // },
    // {
    //     menuTitle: '数据',
    //     key: "data",
    //     title: "数据中心",
    //     permission: 'DATA',
    //     children: [
    //         {
    //             type: 'menuItem',
    //             title: '数据概览',
    //             key: 'dataview',
    //             permission: 'DATA_INDEX'
    //         },
    //         {
    //             type: 'menuItem',
    //             title: '商品分析',
    //             key: 'productanalysis',
    //             permission: 'DATA_GOODS'
    //         },
    //         {
    //             type: 'menuItem',
    //             title: '流量分析',
    //             key: 'trafficanalysis',
    //             permission: 'DATA_FLOW'
    //         },
    //         {
    //             type: 'menuItem',
    //             title: '优惠券统计',
    //             key: 'statistics',
    //             permission: 'DATA_SALE'
    //         }
    //     ]
    // },
    // {
    //     menuTitle: '促销',
    //     key: 'market',
    //     title: '营销中心',
    //     defaultOpenKeys: ['sub1', 'sub2'],
    //     permission: ['SALE_STORE_VIEW', 'SALE_COUPON_VIEW', 'SALE_AUTH_VIEW'],
    //     children: [
    //         {
    //             type: 'subMenu',
    //             key: 'sub1',
    //             title: '营销玩法',
    //             permission: ['SALE_STORE_VIEW', 'SALE_COUPON_VIEW'],
    //             children: [
    //                 {
    //                     title: '店铺促销',
    //                     key: 'store',
    //                     permission: 'SALE_STORE_VIEW'
    //                 },
    //                 {
    //                     title: '优惠券',
    //                     key: 'coupon',
    //                     permission: 'SALE_COUPON_VIEW'
    //                 }
    //             ]
    //         },
    //         {
    //             type: 'subMenu',
    //             key: 'sub2',
    //             title: '营销管理',
    //             permission: ['SALE_AUTH_VIEW'],
    //             children: [
    //                 {
    //                     title: '营销审核',
    //                     key: "verify",
    //                     permission: 'SALE_AUTH_VIEW'
    //                 }
    //             ]
    //         }
    //     ]
    // },
    // {
    //     menuTitle: '资产',
    //     key: 'asset',
    //     title: '资产中心',
    //     defaultOpenKeys: ['sub1', 'sub2'],
    //     permission: ['BALANCE_ACCOUNT_VIEW', 'BALANCE_STORE_VIEW', 'BALANCE_BILL_VIEW'],
    //     children: [
    //         {
    //             type: 'subMenu',
    //             key: 'sub1',
    //             title: '我的账户',
    //             permission: ['BALANCE_ACCOUNT_VIEW', 'BALANCE_STORE_VIEW'],
    //             children: [
    //                 {
    //                     title: '账户概览',
    //                     key: 'scan',
    //                     permission: 'BALANCE_ACCOUNT_VIEW'
    //                 },
    //                 {
    //                     title: '店铺余额',
    //                     key: 'balance',
    //                     permission: 'BALANCE_STORE_VIEW'
    //                 }
    //             ]
    //         },
    //         {
    //             type: 'subMenu',
    //             key: 'sub2',
    //             title: '资金对账',
    //             permission: ['BALANCE_BILL_VIEW'],
    //             children: [
    //                 {
    //                     title: '账单明细',
    //                     key: 'billinglist',
    //                     permission: 'BALANCE_BILL_VIEW'
    //                 }
    //             ]
    //         }
    //     ]
    // },
    {
        menuTitle: '设置',
        key: 'set',
        title: '设置中心',
        defaultOpenKeys: ['sub1', 'sub2'],
        permission: ['SET_COMMON_VIEW', 'SET_STORE_VIEW' ,'SET_CHECKER_VIEW', 'SET_ADDRESS_VIEW', 'SET_USER_VIEW', 'SET_ROLE_VIEW'],
        // children: [
        //     {
        //         type: 'menuItem',
        //         key: 'common',
        //         title: '通用设置',
        //         permission: 'SET_COMMON_VIEW'
        //     },
        //     {
        //         type: 'subMenu',
        //         key: 'sub1',
        //         title: '店铺信息',
        //         permission: ['SET_STORE_VIEW'],
        //         children: [
        //             {
        //                 title: '店铺信息',
        //                 key: 'shopinfo',
        //                 permission: 'SET_STORE_VIEW'
        //             }
        //         ]
        //     },
        //     {
        //         type: 'subMenu',
        //         key: 'sub2',
        //         title: '店铺设置',
        //         permission: ['SET_CHECKER_VIEW', 'SET_ADDRESS_VIEW', 'SET_USER_VIEW', 'SET_ROLE_VIEW'],
        //         children: [
        //             {
        //                 title: '核销员',
        //                 key: 'verifier',
        //                 permission: 'SET_CHECKER_VIEW'
        //             },
        //             {
        //                 title: '商家地址',
        //                 key: 'businessAddress',
        //                 permission: 'SET_ADDRESS_VIEW'
        //             },
        //             {
        //                 title: '成员管理',
        //                 key: 'memberMangement',
        //                 permission: 'SET_USER_VIEW'
        //             },
        //             {
        //                 title: '角色管理',
        //                 key: 'roleMangement',
        //                 permission: 'SET_ROLE_VIEW'
        //             }
        //         ]
        //     }
        // ]
    }
]

export default menuList
