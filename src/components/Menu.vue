<template>
  <div class="layout-box">
    <div class="menu1">
      <div class="logo">
        <img src="../assets/images/logo.png" />
      </div>
      <!-- 一级菜单 -->
      <a-menu :selectedKeys="[oneLevelKey]" mode="inline" theme="dark" @click="gotoOtherPage">
        <template v-for="item in menuList">
          <a-menu-item  :key="item.key" v-if="permissionResult(item.permission)">
            <span>{{item.menuTitle}}</span>
          </a-menu-item>
        </template>
      </a-menu>
    </div>

    <!-- 二级菜单 -->
    <div class="menu2" v-if="menuLevel == 2">
      <template v-for="(item) in menuList">
        <div :key="item.key"  v-if="oneLevelKey === item.key && item.children" >
          <div class="oneTitle">{{item.title}}</div>
          <a-menu
            mode="inline"
            theme="light"
            :defaultOpenKeys="item.defaultOpenKeys ? item.defaultOpenKeys : []" 
            :selectedKeys="[twoLevelKey]"
            @click="gotoOtherPageSub"
          >
            <template v-for="item1 in item.children">
              <!-- 下面没有子菜单的情况 -->
              <a-menu-item :key="item1.key" v-if="item1.type === 'menuItem' && permissionResult(item1.permission)">
                {{item1.title}}
              </a-menu-item>
              <!-- 下面还有子菜单的情况 -->
              <a-sub-menu :key="item1.key" v-if="item1.type === 'subMenu' && permissionResult(item1.permission)">
                <span slot="title"><span>{{item1.title}}</span></span>
                <template v-for="item2 in item1.children">
                  <a-menu-item :key="item2.key" v-if="permissionResult(item2.permission)">
                    {{item2.title}}
                  </a-menu-item>
                </template>
              </a-sub-menu>
            </template>
          </a-menu>
        </div>
      </template>

    </div>

    <div class="layout-content" :class="{ 'layout-content2': menuLevel == 2 }">
      <div class="header" style="z-index: 999">
        <span class="sub-title">{{ menuName }}</span>
        <div class="fr">
          <a-avatar size="large" icon="user" :src="userInfo.headUrl" />
          <span>{{userInfo.userName}}</span>
        </div>
      </div>
      <div class="main-page">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import menuList from '../util/menuList'
import routerList from '../router/index'
export default {
  data() {
    return {
      menuList,
      menuLevel: 1,
      oneLevelKey: "",
      twoLevelKey: "",
      menuName: "",
      userInfo: sessionStorage.getItem("userInfo")
        ? JSON.parse(sessionStorage.getItem("userInfo"))
        : {}
    };
  },
  watch: {
    $route(to, from) {
      this.setMenuName();
    }
  },
  created() {
    this.setMenuName();
    // this.$store.dispatch("user/saveUserInfoActions");
  },
  methods: {
    permissionResult(permission) {
      // 传进来可能是字符串或者字符串数组
      if (typeof(permission) === 'string') {
        return this.$permission.hasPermission(permission)
      } else {
        let flag = false;
        (permission || []).forEach((item) => {
          if(this.$permission.hasPermission(item)) {
            flag = true
          }
        });
        return flag
      }
    },
    setMenuName() {
      let route = this.$route;
      this.menuLevel = route.meta.menuLevel || 1;
      let routeStrArr = this.$route.path.split("/");
      this.oneLevelKey = routeStrArr[1] || "";
      this.twoLevelKey = routeStrArr[2] || "";
      this.menuName = route.name || "";
    },
    gotoOtherPage({ item, key, keyPath }) {
      // console.log('router的列表',routerList.options.routes[3].children)
      console.log(key)
      const routeList = routerList.options.routes[3].children;
      if (key !== this.oneLevelKey) {
        var str = "";
        const targetObj = routeList.find((item) => {
          return item.permission && ('/'+ item.path).includes('/'+key) && this.$permission.hasPermission(item.permission)
        })
        str = '/'+ targetObj.path
        console.log(targetObj, str)
        // switch (key) {
        //   case "survey":
        //     str = "/survey";
        //     break;
        //   case "goods":
        //     str = "/goods/goodsManage";
        //     break;
        //   case "order":
        //     str = "/order/orderAll";
        //     break;
        //   case "set":
        //     str = "/set/shopinfo";
        //     break;
        //   case "asset":
        //     str = "/asset/scan";
        //     break;
        //   case "client":
        //     str = "/client/list";
        //     break;
        //   case "data":
        //     str = "/data/dataview";
        //     break;
        //   case "market":
        //     str = "/market/store";
        //     break;

        //   default:
        //     str = "";
        // }
        this.$router.push({
          path: str
        });
      }
    },
    gotoOtherPageSub({ item, key, keyPath }) {
      if (key !== this.twoLevelKey) {
        this.$router.push({
          path: `/${this.oneLevelKey}/${key}`
        });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.layout-box {
  .menu1 {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 120px;
    overflow-x: hidden;
    overflow-y: auto;
    background: #2a3646;
    .logo {
      height: 52px;
      overflow: hidden;
      padding: 0 10px;
      img {
        width: 100%;
        margin-top: 5px;
        // height: 100%;
      }
    }
  }

  .menu2 {
    position: fixed;
    left: 120px;
    top: 0;
    bottom: 0;
    width: 100px;
    overflow-x: hidden;
    overflow-y: auto;
    border-right: 1px solid #e8e8e8;
    .ant-menu-inline {
      border-right: none;
    }
    .oneTitle {
      line-height: 51px;
      text-align: center;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      border-bottom: 1px solid rgba(229, 229, 229, 1);
    }
  }

  .layout-content {
    margin-left: 120px;
    background-color: #f1f2f5;
    padding-top: 52px;
    position: relative;
    min-height: 100vh;
    .header {
      position: fixed;
      top: 0;
      z-index: 10;
      left: 120px;
      right: 0;
      padding: 0 20px;
      height: 52px;
      line-height: 52px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 6px 12px 1px rgba(42, 54, 70, 0.09);
      .sub-title {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      span {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin-left: 10px;
      }
    }
    .main-page {
      margin: 10px 10px 0 10px;
    }
  }
  .layout-content2 {
    margin-left: 220px;
    .header {
      left: 220px;
    }
  }
}
</style>

<style lang="less">
.layout-box .ant-menu {
  -moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  .ant-menu-submenu-title,
  .ant-menu-item {
    text-align: center;
    padding: 0 !important;
    width: 100%;
    .ant-menu-submenu-arrow {
      right: auto;
      left: 5px;
    }
  }
}
</style>
