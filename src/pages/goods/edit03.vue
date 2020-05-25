<template>
  <div class="frame-box">
    <div>
      <div class="frame fl">
        <iframe id="myframe" :src="'https://qfscxcx.qifengyun.net/#/prodetail/'+goodsId+'?pc=1'" frameborder="0"></iframe>
        <!-- <iframe id="myframe" :src="'http://192.168.1.78:8080/#/prodetail/'+goodsId+'?pc=1'" frameborder="0"></iframe> -->
      </div>
      <div class="qr-box">
        <div class="title01">手机扫码购买</div>
        <div class="title02">微信"扫一扫"立即购买</div>
        <div class="img">
          <img :src="qr" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/user";
export default {
  props: ["goodsId"],
  data() {
    return {
      qr: ""
    };
  },
  created() {
    this.getQr();
  },
  methods: {
    getQr() {
      api
        .qrAjax({
          page: "pages/pro/pro",
          id: this.goodsId
        })
        .then(res => {
          let bytes = new Uint8Array(res.data);
          let storeData = "";
          let len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            storeData += String.fromCharCode(bytes[i]);
          }
          this.qr = "data:image/png;base64," + window.btoa(storeData);
        })
        .catch(() => {
          console.log("error");
        });
    }
  }
};
</script>
<style lang="less" scoped>
.frame-box {
  padding: 80px 0;
  background-color: #fff;
  & > div {
    overflow: hidden;
    width: 620px;
    margin: 0 auto;
    .frame {
      width: 375px;
      height: 619px;
    }
    #myframe {
      width: 375px;
      height: 619px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .qr-box {
      border: 1px solid #e8e8e8;
      margin-left: 395px;
      padding: 0 10px;
      width: 225px;
      text-align: center;
      .title01 {
        font-size: 20px;
        padding: 20px 0 15px;
      }
      .title02 {
        font-size: 14px;
        padding: 15px 0 0;
        border-top: 1px solid #e8e8e8;
      }
      .img {
        width: 150px;
        height: 150px;
        margin: 0 auto;
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>
