<template>
  <div style="width:300px; margin:80px auto 0;">
    <a-form id="components-form-demo-normal-login" :form="form" class="login-form" @submit="handleSubmit">
      <a-form-item>
        <a-input v-decorator="[
          'userAcc',
          { rules: [{ required: true, message: 'Please input your username!' }] },
        ]" placeholder="Username">
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <!-- <a-form-item>
      <a-input
        v-decorator="[
          'password',
          { rules: [{ required: true, message: 'Please input your Password!' }] },
        ]"
        type="password"
        placeholder="Password"
      >
        <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item> -->
      <a-form-item>
        <a-button type="primary" html-type="submit" class="login-form-button">
          Log in
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import api from "@/api/user";
import moment from "moment";
export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    console.log(to,from,"免登===============")
    let query_prams = to.query.params;
    if(query_prams) {
      let params = {
        method: "authorizedLogin",
        data: query_prams,
        timestamp: moment().format("YYYY-MM-DD HH:mm:ss")
      }

      api.ajax(params).then(res => {
        sessionStorage.setItem("userInfo", JSON.stringify(res.data.data));
        if (res.data.data.qualificationStatus === 2) {
          next({ name: "概览" });
        } else {
          next("/shopkeeper");
        }
      })
      .catch(() => {
        next();
        console.log("error");
      });
    }else {
      next();
    }
  },
  methods: {
    login(params) {
      api
        .ajax(params)
        .then(res => {
          sessionStorage.setItem("userInfo", JSON.stringify(res.data.data));
          if (res.data.data.qualificationStatus === 2) {
            this.$router.push({ name: "概览" });
          } else {
            this.$router.push("/shopkeeper");
          }
        })
        .catch(() => {
          console.log("error");
        });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let params = {
            method: "login",
            data: values,
            timestamp: moment().format("YYYY-MM-DD HH:mm:ss")
          };
          this.login(params);
        }
      });
    }
  }
};
</script>
<style>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>