import api from "@/api/user";
export default {
  namespaced: true,
  state: {
    userInfo: null
  },
  getters: {
    userAcc: state => {
      return state.userInfo.userAcc
    }
  },
  mutations: {
    saveUserInfo(state, data) {
      state.userInfo = data;
    }
  },
  actions: {
    saveUserInfoActions({ commit, state }) {
      api
        .ajax({
          data: { userAcc: "rd001" },
          method: "login"
        })
        .then(res => {
          if (res.data.data.storeId) {
            localStorage.setItem('userInfo', res.data.data);
            window.userInfo = res.data.data;
            commit('saveUserInfo', res.data.data)
          } else {
            this.$router.replace({ path: "/shopkeeper" });
          }
        })
        .catch(() => {
          console.log("error");
        });
    }
  }
};
