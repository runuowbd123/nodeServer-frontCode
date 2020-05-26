import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/set/test'
    },
    {
      path: '/login',
      component: () => import('@/pages/login/index.vue')
    },
    {
      path: '/shopkeeper',
      component: () => import('@/pages/shopkeeper/newIndex.vue'),
    },
    {
      path: '/',
      component: () => import('@/components/Menu'),
      children: [
        // 有些对象中会含有permission字段，是在Menu文件中用到，用作点击菜单时默认进该模块下哪个页面
        {
          path: 'set/test',
          // meta: { menuLevel: 2 },
          // name: '测试',
          permission: "SET_COMMON_VIEW",
          component: () => import('@/pages/test/index.vue'),
        },
        // {
        //   path: 'survey',
        //   name: '概览',
        //   alias: '',
        //   permission: 'INDEX_BANNER',
        //   component: () => import('@/pages/survey/index.vue'),
        // },
        // {
        //   path: 'goods/goodsManage',
        //   meta: { menuLevel: 2, keepAlive: true },
        //   name: '商品管理',
        //   permission: 'GOODS_MANAGER_VIEW',
        //   component: () => import('@/pages/goods/index.vue'),
        // },
        // {
        //   path: 'goods/goodsadd',
        //   meta: { menuLevel: 2 },
        //   name: '商品管理 > 商品新建',
        //   component: () => import('@/pages/goods/edit.vue'),
        // },
        // {
        //   path: 'goods/aaa',
        //   meta: { menuLevel: 2 },
        //   name: '商品管理 > 新建',
        //   component: () => import('@/pages/goods/aaa.vue'),
        // },
        // {
        //   path: 'goods/goodsedit',
        //   meta: { menuLevel: 2 },
        //   name: '商品管理 > 商品编辑',
        //   component: () => import('@/pages/goods/edit.vue'),
        // },
        // {
        //   path: 'goods/goodsGroup',
        //   meta: { menuLevel: 2 },
        //   name: '商品分组',
        //   permission: 'GOODS_GROUPS_VIEW',
        //   component: () => import('@/pages/goods/goodsGroup.vue'),
        // },
        // {
        //   path: 'goods/goodsLabel',
        //   meta: { menuLevel: 2 },
        //   name: '商品标签',
        //   permission: 'GOODS_LABEL_VIEW',
        //   component: () => import('@/pages/goods/goodsLabel.vue'),
        // },
        // {
        //   path: 'order/orderAll',
        //   meta: { menuLevel: 2 },
        //   name: '全部订单',
        //   permission: 'ORDER_MANAGER_VIEW',
        //   component: () => import('@/pages/order/list.vue'),
        // },
        // {
        //   path: 'order/refundManagement',
        //   meta: { menuLevel: 2 },
        //   name: '退款管理',
        //   permission: 'ORDER_REFUND_VIEW',
        //   component: () => import('@/pages/order/refundManagement.vue'),
        // },
        // {
        //   path: 'order/refundDetail',
        //   meta: { menuLevel: 2 },
        //   name: '退款管理 > 详情',
        //   component: () => import('@/pages/order/refundDetail.vue'),
        // },
        // {
        //   path: 'order/orderCheck',
        //   meta: { menuLevel: 2 },
        //   name: '核销管理',
        //   permission: 'ORDER_CHECK_VIEW',
        //   component: () => import('@/pages/order/checklist.vue'),
        // },
        // {
        //   path: 'order/freightTemplate',
        //   meta: { menuLevel: 2 },
        //   name: '运费模板',
        //   permission: 'ORDER_FREIGHT_VIEW',
        //   component: () => import('@/pages/order/freightTemplate.vue'),
        // },
        // {
        //   path: 'order/createFreightTemplate',
        //   meta: { menuLevel: 2 },
        //   name: '运费模板 > 新建模板',
        //   component: () => import('@/pages/order/createFreightTemplate.vue'),
        // },
        // {
        //   path: 'order/modifyFreightTemplate',
        //   meta: { menuLevel: 2 },
        //   name: '运费模板 > 编辑模板',
        //   component: () => import('@/pages/order/createFreightTemplate.vue'),
        // },
        // {
        //   path: 'order/createFreightTemplate2',
        //   meta: { menuLevel: 2 },
        //   name: '运费模板 > 新建模板2',
        //   component: () => import('@/pages/order/createFreightTemplate2.vue'),
        // },
        // {
        //   path: 'order/detail',
        //   meta: { menuLevel: 2 },
        //   name: '订单详情',
        //   component: () => import('@/pages/order/detail.vue'),
        // },


        // {
        //   path: 'client/list',
        //   meta: { menuLevel: 2 },
        //   name: '客户管理',
        //   permission: 'CUSTOMER_MANAGER_VIEW',
        //   component: () => import('@/pages/client/list.vue')
        // },
        // {
        //   path: 'client/detail',
        //   meta: { menuLevel: 2 },
        //   name: '客户管理 > 客户详情',
        //   component: () => import('@/pages/client/detail.vue')
        // },
        // {
        //   path: 'client/tag',
        //   meta: { menuLevel: 2 },
        //   name: '客户标签',
        //   permission: 'CUSTOMER_LABEL_VIEW',
        //   component: () => import('@/pages/client/tag.vue')
        // },
        // {
        //   path: 'client/tagadd',
        //   meta: { menuLevel: 2 },
        //   name: '客户标签 > 新建标签',
        //   component: () => import('@/pages/client/tagEdit.vue')
        // },
        // {
        //   path: 'client/tagedit',
        //   meta: { menuLevel: 2 },
        //   name: '客户标签 > 编辑标签',
        //   component: () => import('@/pages/client/tagEdit.vue')
        // },

        // {
        //   path: 'data/dataview',
        //   meta: { menuLevel: 2 },
        //   name: '数据概览',
        //   permission: 'DATA_INDEX',
        //   component: () => import('@/pages/data/dataView.vue')
        // },
        // {
        //   path: 'data/productanalysis',
        //   meta: { menuLevel: 2 },
        //   name: '商品分析',
        //   permission: 'DATA_GOODS',
        //   component: () => import('@/pages/data/productAnalysis.vue')
        // },
        // {
        //   path: 'data/trafficanalysis',
        //   meta: { menuLevel: 2 },
        //   name: '流量分析',
        //   permission: 'DATA_FLOW',
        //   component: () => import('@/pages/data/trafficAnalysis.vue')
        // },
        // {
        //   path: 'data/statistics',
        //   meta: { menuLevel: 2 },
        //   name: '优惠券统计',
        //   permission: 'DATA_SALE',
        //   component: () => import('@/pages/data/statistics.vue')
        // },
        // {
        //   path: 'market/store',
        //   meta: { menuLevel: 2 },
        //   name: '店铺促销',
        //   permission: 'SALE_STORE_VIEW',
        //   component: () => import('@/pages/market/store.vue')
        // },
        // {
        //   path: 'market/addstore',
        //   meta: { menuLevel: 2 },
        //   name: '店铺促销 > 新建店铺促销',
        //   component: () => import('@/pages/market/storeEditNew.vue')
        // },
        // {
        //   path: 'market/storedetail',
        //   meta: { menuLevel: 2 },
        //   name: '店铺促销 > 店铺促销详情',
        //   component: () => import('@/pages/market/storeEditNew.vue')
        // },
        // {
        //   path: 'market/storeresubmit',
        //   meta: { menuLevel: 2 },
        //   name: '店铺促销 > 重新提交店铺促销',
        //   component: () => import('@/pages/market/storeEditNew.vue')
        // },
        // {
        //   path: 'market/coupon',
        //   meta: { menuLevel: 2 },
        //   name: '优惠券',
        //   permission: 'SALE_COUPON_VIEW',
        //   component: () => import('@/pages/market/coupon.vue')
        // },
        // {
        //   path: 'market/addcoupon',
        //   meta: { menuLevel: 2 },
        //   name: '优惠券 > 新建优惠券',
        //   component: () => import('@/pages/market/couponEditNew.vue')
        // },
        // {
        //   path: 'market/resubmitcoupon',
        //   meta: { menuLevel: 2 },
        //   name: '优惠券 > 重新提交优惠券',
        //   component: () => import('@/pages/market/couponEditNew.vue')

        // },
        // {
        //   path: 'market/coupondetail',
        //   meta: { menuLevel: 2 },
        //   name: '优惠券 > 优惠券详情',
        //   component: () => import('@/pages/market/couponEditNew.vue')
        // },
        // {
        //   path: 'market/codebanck',
        //   meta: { menuLevel: 2 },
        //   name: '优惠券 > 码库',
        //   component: () => import('@/pages/market/codeBank.vue')
        // },
        // {
        //   path: 'market/verify',
        //   meta: { menuLevel: 2 },
        //   name: '营销审核',
        //   permission: 'SALE_AUTH_VIEW',
        //   component: () => import('@/pages/market/verify.vue')
        // },
        // {
        //   path: 'market/shopverify',
        //   meta: { menuLevel: 2 },
        //   name: '营销审核 > 店铺促销审核',
        //   component: () => import('@/pages/market/storeEditNew.vue')
        // },
        // {
        //   path: 'market/shopverifydetail',
        //   meta: { menuLevel: 2 },
        //   name: '营销审核 > 店铺促销详情',
        //   component: () => import('@/pages/market/storeEditNew.vue')
        // },
        // {
        //   path: 'market/couponverify',
        //   meta: { menuLevel: 2 },
        //   name: '营销审核 > 优惠券审核',
        //   component: () => import('@/pages/market/couponEditNew.vue')
        // },
        // {
        //   path: 'market/couponverifydetail',
        //   meta: { menuLevel: 2 },
        //   name: '营销审核 > 优惠券详情',
        //   component: () => import('@/pages/market/couponEditNew.vue')
        // },

        // {
        //   path: 'asset/scan',
        //   meta: { menuLevel: 2 },
        //   name: '账户概览',
        //   permission: 'BALANCE_ACCOUNT_VIEW',
        //   component: () => import('@/pages/asset/scan.vue'),
        // },
        // {
        //   path: 'asset/balance',
        //   meta: { menuLevel: 2 },
        //   name: '店铺余额',
        //   permission: 'BALANCE_STORE_VIEW',
        //   component: () => import('@/pages/asset/balance.vue'),
        // },
        // {
        //   path: 'asset/billinglist',
        //   meta: { menuLevel: 2 },
        //   name: '账单明细',
        //   permission: 'BALANCE_BILL_VIEW',
        //   component: () => import('@/pages/asset/billinglist.vue'),
        // },
        // {
        //   path: 'asset/billingdetails',
        //   meta: { menuLevel: 2 },
        //   name: '账单明细 > 详情',
        //   component: () => import('@/pages/asset/billingdetails.vue'),
        // },
        // {
        //   path: 'asset/drawallist',
        //   meta: { menuLevel: 2 },
        //   name: '店铺余额 > 提现记录',
        //   component: () => import('@/pages/asset/drawallist.vue'),
        // },
        // {
        //   path: 'asset/drawal',
        //   meta: { menuLevel: 2 },
        //   name: '账户概览 > 提现',
        //   component: () => import('@/pages/asset/drawal.vue'),
        // },
        // {
        //   path: 'set/common',
        //   meta: { menuLevel: 2 },
        //   name: '通用设置',
        //   permission: 'SET_COMMON_VIEW',
        //   component: () => import('@/pages/set/common.vue'),
        // },
        // {
        //   path: 'set/shopinfo',
        //   meta: { menuLevel: 2 },
        //   name: '店铺信息',
        //   permission: 'SET_STORE_VIEW',
        //   component: () => import('@/pages/set/index.vue'),
        // },
        // {
        //   path: 'set/verifier',
        //   meta: { menuLevel: 2 },
        //   name: '核销员',
        //   permission: 'SET_CHECKER_VIEW',
        //   component: () => import('@/pages/set/verifier.vue'),
        // },
        // {
        //   path: 'set/businessAddress',
        //   meta: { menuLevel: 2 },
        //   name: '商家地址',
        //   permission: 'SET_ADDRESS_VIEW',
        //   component: () => import('@/pages/set/businessAddress.vue'),
        // },
        // {
        //   path: 'set/businessAddress/addNewAddress',
        //   meta: { menuLevel: 2 },
        //   name: '商家地址 > 新增地址',
        //   component: () => import('@/pages/set/addNewAddress.vue'),
        // },
        // {
        //   path: 'set/memberMangement',
        //   meta: { menuLevel: 2 },
        //   name: '成员管理',
        //   permission: 'SET_USER_VIEW',
        //   component: () => import('@/pages/set/memberMangement.vue'),
        // },
        // {
        //   path: 'set/roleMangement',
        //   meta: { menuLevel: 2 },
        //   name: '角色管理',
        //   permission: 'SET_ROLE_VIEW',
        //   component: () => import('@/pages/set/roleMangement.vue'),
        // },
        // {
        //   path: 'set/roleMangement/addRole',
        //   meta: { menuLevel: 2 },
        //   name: '角色管理 > 添加角色',
        //   component: () => import('@/pages/set/addRole.vue'),
        // },
      ]
    }
  ]
})
