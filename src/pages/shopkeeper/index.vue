<template>
  <div class="shopkeeper__Box">
    <div class="header" v-if="qualificationStatus === 0">
      <img src="../../assets/images/logo1.png" style="padding-left:20px;" />
      <span v-if="step===1">
        商城店铺信息
      </span>
      <span v-else>
        资质认证信息
      </span>
    </div>

    <div v-if="qualificationStatus === 0" class="shopkeeper-content">
      <a-form :form="form" @submit="handleSubmit">
        <div v-show="step === 1">
          <a-form-item label="店铺名称：" :colon="false" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
            <a-input placeholder="请输入店铺名称，建议15字以内" :maxLength="15" v-decorator="[
                'storeName',
                {
                  initialValue: dataInfo.storeName,
                  rules: [
                    { required: true, message: '请输入店铺名称，建议15字以内' }
                  ]
                }
              ]" />
          </a-form-item>

          <a-form-item extra="请注意填写格式，举例（座机：0755-88880000；手机：13688880000）" label="客服电话：" :colon="false" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
            <a-input placeholder="请输入电话" v-decorator="[
                'waiterPhone',
                {
                  initialValue: dataInfo.waiterPhone,
                  rules: [
                    { required: true, message: '请输入电话' },
                    {
                      validator:rules.validateMobile2
                    }
                  ]
                }
              ]" />
          </a-form-item>

          <a-form-item label="店铺地址：" :colon="false" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
            <a-cascader :fieldNames="{ label: 'name', value: 'name', children: 'districts' }" :options="citys" placeholder="请选择省/市/区" v-decorator="[
                'address2',
                {
                  initialValue: dataInfo.province != null ? [dataInfo.province, dataInfo.city, dataInfo.area] : [],
                  rules: [
                    {
                      type: 'array',
                      required: true,
                      message: '请选择省/市/区'
                    }
                  ]
                }
              ]" @change="cascaderChange" />
          </a-form-item>

          <a-form-item label="详细地址：" :colon="false" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
            <a-input-search id="searchMap" placeholder="请填写详细地址" enterButton="搜索地图" @search="handleSelectChange" v-decorator="[
                'address',
                {
                  initialValue: dataInfo.address,
                  rules: [
                    {
                      required: true,
                      message: '请填写详细地址'
                    }
                  ]
                }
              ]" />
          </a-form-item>

          <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
            <div class="map-box">
              <div id="mapid"></div>
              <div class="panel-box">
                <div id="panel"></div>
              </div>
            </div>
          </a-form-item>

          <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
            <div style="text-align: center;">
              <a-button type="primary" @click="step = 2">下一步</a-button>
            </div>
          </a-form-item>
        </div>
        
        <div v-show="step === 2">
          <div style="font-size: 15px;font-weight: bold;padding-left: 120px;margin: 20px 0;color:#000;">
            联系人信息
          </div>
          <a-form-item
            label="联系人姓名："
            :colon="false"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 12 }"
            extra="请填写贵公司运营负责人"
          >
            <a-input
              :maxLength="20"
              placeholder="请输入联系人姓名"
              v-decorator="[
                'contactName',
                {
                  initialValue: dataInfo.contactName,
                  rules: [
                    { required: true, message: '请输入联系人姓名' }
                  ]
                }
              ]" />
          </a-form-item>
          <a-form-item
            label="手机号："
            :colon="false"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 12 }"
          >
            <a-input
              placeholder="请输入手机号"
              v-decorator="[
                'contactPhoneNumber',
                {
                  initialValue: dataInfo.contactPhoneNumber,
                  rules: [
                    { required: true, message: '请输入手机号' },
                    {
                      validator:rules.validateMobile
                    }
                  ]
                }
              ]" />
          </a-form-item>
          <a-form-item
            label="常用邮箱："
            :colon="false"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 12 }"
          >
            <a-input
              placeholder="请输入常用邮箱"
              v-decorator="[
                'contactMail',
                {
                  initialValue: dataInfo.contactMail,
                  rules: [
                    { required: true, message: '请输入常用邮箱' },
                    {
                      validator:rules.checkMail
                    }
                  ]
                }
              ]" />
          </a-form-item>

          <div style="font-size: 15px;font-weight: bold;padding-left: 120px;margin: 20px 0;color:#000;">
            经营信息
          </div>
          <a-form-item label="商户名称：" :colon="false" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
            <a-input
              placeholder="请输入商户名称"
              v-decorator="[
                'merchantName',
                {
                  initialValue: dataInfo.merchantName,
                  rules: [{ required: true, message: '请输入商户名称' }]
                }
              ]" />
          </a-form-item>
          <a-form-item
            label="主营类目："
            :colon="false"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 12 }"
          >
            <a-cascader
              :options="options" 
              placeholder="请选择主营类目"
              :displayRender="displayRender"
              v-decorator="[
                'categoryList',
                {
                  initialValue: dataInfo.categoryList ? dataInfo.categoryList : [],
                  rules: [{ required: true, message: '请选择主营类目' }]
                }
              ]"
              @change="categoryChange"
            />
          </a-form-item>
          <a-form-item
            v-if="!!extra"
            label="特殊资质证明："
            :colon="false"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 12 }"
            :extra="extra"
          >
            <div style="display: flex;flex-wrap: wrap;align-items: center;">
              <div style="margin-right: 15px;position:relative;margin-bottom: 10px;" v-for="(item,index) in fileList" :key="index">
                <a-icon @click="deleteImg(item)" type="close-circle" style="position:absolute;right: -5px;top: -5px;cursor:pointer"/>
                <img
                  :src="item"
                  alt="图片"
                  style="display:block;height: 105px;width: 105px;"
                >
                <!-- <a-upload
                  style="width: 105px;"
                  name="file2"
                  action="/api/uploadJson"
                  listType="picture-card"
                  :showUploadList="false"
                  :beforeUpload="beforeUploadLimit"
                  accept=".png,.jpg,.jpeg,.bmp"
                >
                  <img
                    :src="item"
                    alt="图片"
                    style="display:block;height: 85px;width: 85px;"
                  >
                </a-upload> -->
              </div>
              <a-upload
                listType="picture-card"
                @change="handleChange"
                name="file1"
                style="width: 105px;"
                accept=".png,.jpg,.jpeg,.bmp"
                :beforeUpload = "beforeUploadLimit"
                action="/api/uploadJson"
                :showUploadList="false"
                v-decorator="[
                  'picture',
                  {
                    initialValue: fileList,
                    rules: [{ required: true, message: '请上传店铺图片' }]
                  }
                ]"
              >
                <div v-if="fileList.length < 6">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
              <div style="margin-left: 20px;display: flex;position: relative;">
                <div style="margin-right: 5px">
                  示例：
                </div>
                <img src="../../assets/images/provide.jpg" alt="示例图片" style="display:block;height: 80px;width: 110px;border: 1px solid #ccc"/>
                <div style="color: #3e7bf8;cursor: pointer;position: absolute;right: 40px;top:20px;" @click="picShow=true">
                  查看
                </div>
              </div>
            </div>
          </a-form-item>
          

          <div style="text-align: center;">
            <a-form-item>
              <a-checkbox v-decorator="['ifAgree',{ initialValue: false, valuePropName: 'checked' }]">我已同意<a href="javascript:void(0);" @click='showRule'>《企蜂云产品服务协议》</a>
              </a-checkbox>
            </a-form-item>
          </div>

          <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
            <div style="text-align: center;">
              <a-button @click="step = 1" style="margin-right: 10px">上一步</a-button>
              <a-button type="primary" html-type="submit">保存并提交</a-button>
            </div>
          </a-form-item>
        </div>

      </a-form>
    </div>
    <div v-else-if="qualificationStatus === 1" class="message">
      <div class="message-main">
        <a-icon type="check-circle" theme="twoTone" twoToneColor="#7DDC82" style="fontSize:50px" />
        <div class="title">认证申请已提交成功</div>
        <div class="content">预计审核通过时间为<span style="color: red">1-3</span>个工作日，请耐心等待！</div>
        <a-button disabled>正在审核</a-button>
      </div>
    </div>
    <div v-else-if="qualificationStatus === -1" class="message">
      <div class="message-main" style="width: 430px">
        <div class="title">你所提交的认证不通过</div>
        <a-form :form="form" style="width: 430px;margin-top: 20px;">
          <a-form-item label="驳回原因" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                <a-textarea
                  :autosize="{ minRows: 5, maxRows: 5 }"
                  :value="qualificationReason"
                />
              </a-form-item>
        </a-form>
        <a-button type="primary" @click="clickResubmit">重新提交</a-button>
      </div>
    </div>

    <a-modal title="企蜂云产品服务协议" :visible="ruleShow" :footer="null" width="700px" @cancel="rule_cancel">
      <div class="rule_style">{{rule_txt}}</div>
    </a-modal>
    <a-modal title="特殊资质证明示例" :visible="picShow" :footer="null" width="700px" @cancel="picShow=false">
      <img src="../../assets/images/provide.jpg" alt="示例图片" style="display:block;width: 100%"/>
    </a-modal>
  </div>
</template>

<script>
import api from "@/api/user";
import citys from "@/assets/json/list.json";
import utils from "@/util/common"
import rules from "@/util/rules.js";
export default {
  data() {
    let userInfo = sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo"))
      : {};
    return {
      rules,
      step: 1,
      form: this.$form.createForm(this, {
        name: "form"
      }),
      dataInfo: {},
      qualificationReason: userInfo.qualificationReason ? userInfo.qualificationReason : '', // 提交审核失败的错误信息
      qualificationStatus: userInfo.qualificationStatus !=null ? userInfo.qualificationStatus : 0, // 0未提交，1，待审核，2审核通过， -1资质驳回"
      con: 6,
      timer: null,
      address2: [], // [province, city, area]
      province: "",
      city: "",
      area: "",
      address: "",
      categoryList: [],
      ifAgree: false,
      latitude: "",
      longitude: "",
      storeName: "",
      waiterPhone: "",
      qr: "",
      map: null,
      district: null,
      placeSearch: null,
      citys: citys,
      polygons: [],
      cityNum: '中国', // 地图搜索时限定的区域
      ruleShow: false,
      rule_txt: "",
      beforeUploadLimit:utils.beforeUploadLimit,
      fileList: [], // 特殊资质证明图片列表
      options: [], // 主营类目树
      optionTile: [], // 主营类目所有平铺
      extra: '', // 特殊资质证明的提示语
      picShow: false, // 特殊资质证明示例图片预览弹窗
    };
  },
  created() {
    let userInfo = sessionStorage.getItem("userInfo");
    if (userInfo) {
      let storeId = JSON.parse(userInfo).storeId;
      // storeId && this.$router.push("/survey");
    }
    this.getList();
    setTimeout(() => {
      this.map = new AMap.Map("mapid", {
        resizeEnable: true,
        zoom: 10
      });
      let geocoder = new AMap.Geocoder();
      AMap.event.addListener(this.map, "click", e => {
        geocoder.getAddress(e.lnglat, (status, result) => {
          if (status === "complete" && result.regeocode) {
            let adres = result.regeocode.addressComponent;
            let address = `${adres.township}${adres.street}${adres.streetNumber}`;
            this.map.clearMap();
            let marker = new AMap.Marker({
              position: e.lnglat,
              title: address
            });
            new AMap.InfoWindow({
              isCustom: false,
              content: "<span>" + address + "&nbsp;&nbsp;</span>",
              offset: new AMap.Pixel(0, -36),
              showShadow: true,
              closeWhenClickMap: true,
              autoMove: true
            }).open(this.map, new AMap.LngLat(e.lnglat.lng, e.lnglat.lat));
            this.map.add(marker);
            this.latitude = e.lnglat.lat;
            this.longitude = e.lnglat.lng;
            this.form.setFieldsValue({
              address
            });
          }
        });
      });
      this.district = new AMap.DistrictSearch({
        subdistrict: 1,
        showbiz: false
      });
    }, 200);
  },

  methods: {
    showRule() {
      this.ruleShow = true;
    },
    rule_cancel() {
      this.ruleShow = false;
    },
    cascaderChange(value, selectedOptions) {
      this.map.setCity(value[2] || value[1] || value[0] || "中国");
      this.cityNum = value[2] || value[1] || value[0] || "中国";
    },
    handleSelectChange() {
      for (var i = 0, l = this.polygons.length; i < l; i++) {
        this.polygons[i].setMap(null);
      }
      let address = this.form.getFieldValue("address");
      AMap.service(["AMap.PlaceSearch"], () => {
        let obj = {
          pageSize: 0, // 单页显示结果条数
          pageIndex: 1, // 页码
          citylimit: true, //是否强制限制在设置的城市内搜索
          map: this.map, // 展现结果的地图实例
          panel: "panel", // 结果列表将在此容器中进行展示。
          autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        };
        this.cityNum && (obj.city = this.cityNum);
        let placeSearch = new AMap.PlaceSearch(obj);
        address && placeSearch.search(address);
        AMap.event.addListener(placeSearch, "markerClick", e => {
          this.latitude = e.data.location.lat;
          this.longitude = e.data.location.lng;
          this.form.setFieldsValue({
            address: e.data.address
          });
          new AMap.InfoWindow({
            isCustom: false,
            content: "<span>" + e.data.address + "&nbsp;&nbsp;</span>",
            offset: new AMap.Pixel(0, -36),
            showShadow: true,
            closeWhenClickMap: true,
            autoMove: true
          }).open(
            this.map,
            new AMap.LngLat(e.data.location.lng, e.data.location.lat)
          );
        });
        AMap.event.addListener(placeSearch, "listElementClick", e => {
          this.map.clearInfoWindow();
          this.latitude = e.data.location.lat;
          this.longitude = e.data.location.lng;
          this.form.setFieldsValue({
            address: e.data.address
          });
          new AMap.InfoWindow({
            isCustom: false,
            content: "<span>" + e.data.address + "&nbsp;&nbsp;</span>",
            offset: new AMap.Pixel(0, -36),
            showShadow: true,
            closeWhenClickMap: true,
            autoMove: true
          }).open(
            this.map,
            new AMap.LngLat(e.data.location.lng, e.data.location.lat)
          );
        });
      });
    },

    getList() {
      //获取类目树
      api
        .ajax({
          data: {},
          method: "treeSysCategory"
        })
        .then(res => {
          this.options = this.dealTreeData(res.data.data);
          console.log(this.options)
        })
        .catch(() => {
          console.log("error");
        });
      // 获取类目平铺
      api
        .ajax({
          data: {},
          method: "allCategory"
        })
        .then(res => {
          this.optionTile = res.data.data;
        })
        .catch(() => {
          console.log("error");
        });

      // 获取 企蜂云产品服务协议
      api
        .ajax({
          data: {},
          method: "obtainProtocolFile"
        })
        .then(res => {
          this.rule_txt = res.data.data;
        })
        .catch(() => {
          console.log("error");
        });
    },
    dealTreeData(list) {
      const rList = list.map((item) => {
        if (item.children && item.children.length > 0) {
          let children = this.dealTreeData(item.children);
          return {
            value: item.value,
            label: item.label,
            qualificationRequirement: item.qualificationRequirement,
            children
          }
        } else {
          return {
            value: item.value,
            label: item.label,
            qualificationRequirement: item.qualificationRequirement
          }
        }
      })
      return rList
    },

    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        console.log(err, values)
        if(err && (err.storeName || err.waiterPhone || err.address2 || err.address)) {
          this.$message.error("请完善店铺信息后再进行保存提交")
        }
        if (!err) {
          if (!values.ifAgree) {
            return this.$message.error("请先阅读《企蜂云产品服务协议》");
          }
          if (!this.latitude || !this.longitude) {
            return this.$message.error("请先搜索地图选择详细位置");
          }
          let data = {
            storeId: this.dataInfo.id,
            storeName: values.storeName,
            waiterPhone: values.waiterPhone,
            province: values.address2[0],
            city: values.address2[1],
            area: values.address2[2],
            address: values.address,
            latitude: this.latitude,
            longitude: this.longitude,
            ifAgree: 1,
            contactName: values.contactName,
            contactPhoneNumber: values.contactPhoneNumber,
            contactMail: values.contactMail,
            merchantName: values.merchantName,
            categoryList: values.categoryList,
            proveList: this.extra ? this.fileList : []
          };

          api
            .ajax({
              data: data,
              method: "createShop"
            })
            .then(res => {
              if (res.data.code == 200) {
                let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
                userInfo.storeId = res.data.data.storeId;
                userInfo.qualificationStatus = 1;
                sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
                this.qualificationStatus = 1;
                // 下面注释的是以前有的功能，创建成功后出现能扫的小程序的二维码，然后倒计时进入PC端的首页
                // api
                //   .qrAjax({
                //     page: "pages/shop/shop",
                //     id: res.data.data.storeId
                //   })
                //   .then(res => {
                //     let bytes = new Uint8Array(res.data);
                //     let storeData = "";
                //     let len = bytes.byteLength;
                //     for (let i = 0; i < len; i++) {
                //       storeData += String.fromCharCode(bytes[i]);
                //     }
                //     this.qr = "data:image/png;base64," + window.btoa(storeData);
                //   })
                //   .catch(() => {
                //     console.log("error");
                //   });

                // this.timer && clearInterval(this.timer);
                // this.timer = setInterval(() => {
                //   if (this.con <= 0) {
                //     this.timer && clearInterval(this.timer);
                //     this.$router.replace({
                //       path: "/survey"
                //     });
                //   } else {
                //     this.con--;
                //   }
                // }, 1000);
              }
            })
            .catch(() => {
              console.log("error");
            });
        }
      });
    },

    goto() {
      this.timer && clearInterval(this.timer);
      this.$router.replace({
        path: "/survey"
      });
    },
    handleChange(info) {
      console.log(info)
      if (info.file.status === "done") {
        let logo = info.file.response.data[0];
        this.fileList.push(logo)
        console.log(this.fileList)
      } else if (info.file.status === "error") {
        this.$message.error(info.file.response.message);
      }
    },
    deleteImg(item) {
      this.fileList = this.fileList.filter((it) => {
        return it !== item
      })
    },
    displayRender({labels, selectedOptions}){
      return labels.join(' | ')
    },
    categoryChange(categoryList) {
      // console.log(categoryList, this.optionTile)
      const target = this.optionTile.find((item) => {return item.value === categoryList[categoryList.length - 1]}) || {}
      // console.log(target)
      this.extra = target.qualificationRequirement
    },
    clickResubmit() {
      api
        .ajax({
          data: {},
          method: "shopInfo"
        })
        .then(res => {
          this.dataInfo = res.data.data;
          this.latitude = this.dataInfo.latitude;
          this.longitude = this.dataInfo.longitude;
          this.cityNum =
          this.dataInfo.area ||
          this.dataInfo.city ||
          this.dataInfo.province ||
          "中国";
          this.qualificationStatus=0;
          setTimeout(() => {
            this.map = new AMap.Map("mapid", {
                resizeEnable: true,
                zoom: 10
              });
              let geocoder = new AMap.Geocoder();
              AMap.event.addListener(this.map, "click", e => {
                geocoder.getAddress(e.lnglat, (status, result) => {
                  if (status === "complete" && result.regeocode) {
                    let adres = result.regeocode.addressComponent;
                    let address = `${adres.township}${adres.street}${adres.streetNumber}`;
                    this.map.clearMap();
                    let marker = new AMap.Marker({
                      position: e.lnglat,
                      title: address
                    });
                    new AMap.InfoWindow({
                      isCustom: false,
                      content: "<span>" + address + "&nbsp;&nbsp;</span>",
                      offset: new AMap.Pixel(0, -36),
                      showShadow: true,
                      closeWhenClickMap: true,
                      autoMove: true
                    }).open(this.map, new AMap.LngLat(e.lnglat.lng, e.lnglat.lat));
                    this.map.add(marker);
                    this.latitude = e.lnglat.lat;
                    this.longitude = e.lnglat.lng;
                    this.form.setFieldsValue({
                      address
                    });
                  }
                });
              });
              this.district = new AMap.DistrictSearch({
                subdistrict: 1,
                showbiz: false
              });
          }, 200);
      })
      .catch(() => {
        console.log("error");
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.shopkeeper__Box {
  padding-top: 52px;
  min-height: 100vh;
  background-color: #f1f2f5;
  .header {
    width: 100%;
    height: 52px;
    background: rgba(255, 255, 255, 1);
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    & > img {
      height: 52px;
    }
  }
  .shopkeeper-content {
    width: 1000px;
    margin: 10px auto 0;
    background: rgba(255, 255, 255, 1);
    padding: 50px 0;
  }
  .message{
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .message-main{
      width: 310px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      .title{
        margin: 20px 0;
        font-size: 16px;
        font-weight: bold;
      }
      .content{
        margin: 0 0 40px;
      }
    }
  }
  .map-box {
    position: relative;
    #mapid {
      height: 249px;
    }
    .panel-box {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 30%;
      overflow: auto;
    }
  }
}
</style>
<style>
.rule_style {
  max-height: 60vh;
  overflow-x: hidden;
  overflow-y: auto;
  word-break: break-all;
  white-space: pre-wrap;
}
.shopkeeper__Box .amap-marker .amap-marker-content.hover .amap-pls-marker-tip {
  display: none;
}
</style>
