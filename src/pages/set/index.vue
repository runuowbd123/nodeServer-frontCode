<template>
  <div class="set_shopinfo">
    <div v-show="no_edit">
      <div class="shopinfo__item">
        <div class="shopinfo__label fl">店铺名称：</div>
        <div class="shopinfo__content">{{ indexData.storeName }}</div>
      </div>
      <div class="shopinfo__item">
        <div class="shopinfo__label fl">店铺编号：</div>
        <div class="shopinfo__content">
          <span>{{ indexData.storeNumber }}</span>
          <a-button class="copyElement" :data-clipboard-text="indexData.storeNumber" type="link" @click="copyFun">复制</a-button>
        </div>
      </div>
      <div class="shopinfo__item">
        <div class="shopinfo__label fl">主体认证：</div>
        <div class="shopinfo__content">{{ indexData.orgName }}</div>
      </div>
      <!-- <div class="shopinfo__item">
        <div class="shopinfo__label fl">主营类目：</div>
        <div class="shopinfo__content">{{ indexData.category }}</div>
      </div> -->
      <div class="shopinfo__item" style="align-items: center;display: flex">
        <div class="shopinfo__label fl">主营类目：</div>
        <div>
          <a-cascader
            style="width: 350px"
            :options="options" 
            placeholder=""
            disabled
            :displayRender="displayRender"
            class='nocascader'
            :value="indexData.categoryList"
          />
        </div>
      </div>
      <div class="shopinfo__item">
        <div class="shopinfo__label fl">创建日期：</div>
        <div class="shopinfo__content">{{ indexData.inputTime }}</div>
      </div>
      <div class="shopinfo__item">
        <div class="shopinfo__label fl">店铺Logo：</div>
        <div class="shopinfo__content">
          <img class="logo" :src="indexData.logo" />
        </div>
      </div>
      <div class="shopinfo__item">
        <div class="shopinfo__label fl">店铺简介：</div>
        <div class="shopinfo__content">{{ indexData.description }}</div>
      </div>
      <div class="shopinfo__item">
        <div class="shopinfo__label fl">客服电话：</div>
        <div class="shopinfo__content">{{ indexData.waiterPhone }}</div>
      </div>
      <div class="shopinfo__item">
        <div class="shopinfo__label fl">店铺地址：</div>
        <div class="shopinfo__content">
          {{ indexData.province }}{{ indexData.city }}{{ indexData.area
          }}{{ indexData.address }}
        </div>
      </div>
      <div class="shopinfo__item">
        <a-button class="fr" type="primary" @click="edit" v-if="$permission.hasPermission('SET_STORE_EDIT')">编辑</a-button>
      </div>
    </div>

    <div v-show="!no_edit" class="edit">
      <a-form :form="form" @submit="handleSubmit" :hideRequiredMark="true">
        <a-form-item>
          <div class="form-item-label form-item-label2 fl">店铺名称：</div>
          <a-input class="form-item-content" v-decorator="[
              'storeName',
              {
                initialValue: indexData.storeName,
                rules: [
                  { required: true, message: '请输入店铺名称' },
                  {
                    max: 15,
                    message: '15字以内'
                  }
                ]
              }
            ]" />
        </a-form-item>

        <div class="shopinfo__item">
          <div class="shopinfo__label fl">店铺编号：</div>
          <div class="shopinfo__content">
            <span>{{ indexData.storeNumber }}</span>
            <a-button class="copyElement" data-clipboard-text="indexData.storeNumber" type="link" @click="copyFun">复制</a-button>
          </div>
        </div>
        <div class="shopinfo__item">
          <div class="shopinfo__label fl">主体认证：</div>
          <div class="shopinfo__content">{{ indexData.orgName }}</div>
        </div>
        <!-- <div class="shopinfo__item">
          <div class="shopinfo__label fl">主营类目：</div>
          <div class="shopinfo__content">{{ indexData.category }}</div>
        </div> -->
        <div class="shopinfo__item" style="align-items: center;display: flex">
          <div class="shopinfo__label fl">主营类目：</div>
          <div>
            <a-cascader
              style="width: 350px"
              :options="options" 
              placeholder=""
              disabled
              :displayRender="displayRender"
              class='nocascader'
              :value="indexData.categoryList"
            />
          </div>
        </div>
        <div class="shopinfo__item">
          <div class="shopinfo__label fl">创建日期：</div>
          <div class="shopinfo__content">{{ indexData.inputTime }}</div>
        </div>
        <a-form-item >
          <div class="form-item-label fl">店铺Logo：</div>
          <a-upload
            class="form-item-content"
            name="file1"
            listType="picture-card"
            :showUploadList="false"
            action="/api/uploadJson"
            accept=".png,.jpg,.jpeg,.bmp"
            :beforeUpload = "beforeUploadLimit"
            @change="imgChange"
            v-decorator="[
              'logo',
              {
                initialValue: indexData.logo,
                rules: [{ required: true, message: '请上传店铺Logo' }]
              }
            ]">
            <img class="shopLogo" v-if="indexData.logo" :src="indexData.logo" />
            <div v-else>
              <a-icon type="plus" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item>
          <div class="form-item-label fl">店铺简介：</div>
          <a-textarea :maxLength="120" class="form-item-content" v-decorator="[
              'description',
              {
                initialValue: indexData.description
              }
            ]" />
        </a-form-item>

        <a-form-item>
          <div class="form-item-label form-item-label2 fl">客服电话：</div>
          <a-input class="form-item-content" v-decorator="[
              'waiterPhone',
              {
                initialValue: indexData.waiterPhone,
                rules: [{ required: true, message: '请输入电话' }]
              }
            ]" />
        </a-form-item>

        <a-form-item>
          <div class="form-item-label form-item-label2 fl">店铺地址：</div>
          <a-cascader class="form-item-content" :fieldNames="{ label: 'name', value: 'name', children: 'districts' }" :options="citys" placeholder="请选择省/市/区" v-decorator="[
              'address2',
              {
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

        <a-form-item>
          <div class="form-item-label fl"></div>
          <a-input-search id="searchMap" class="form-item-content" placeholder="请填写详细地址" enterButton="搜索地图" @search="handleSelectChange" v-decorator="[
              'address',
              {
                initialValue: indexData.address,
                rules: [
                  {
                    required: true,
                    message: '请填写详细地址'
                  }
                ]
              }
            ]" />
        </a-form-item>
        <a-form-item>
          <div class="form-item-label fl"></div>
          <div class="map-box">
            <div id="mapid"></div>
            <div class="panel-box">
              <div id="panel"></div>
            </div>
          </div>
        </a-form-item>
        <div class="shopinfo__item">
          <a-button class="fr" type="primary" html-type="submit">保存</a-button>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script>
import api from "@/api/user";
import ClipboardJS from "clipboard";
import citys from "@/assets/json/list.json";
import utils from "@/util/common"
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: "save" }),
      no_edit: true,
      indexData: {},
      latitude: "",
      longitude: "",

      map: null,
      district: null,
      placeSearch: null,
      citys: citys,
      polygons: [],
      cityNum: null,
      options: []
    };
  },
  created() {
    this.getInfo();
    this.getOptions();
  },
  methods: {
    beforeUploadLimit:utils.beforeUploadLimit,
    getInfo() {
      api
        .ajax({
          data: {},
          method: "shopInfo"
        })
        .then(res => {
          this.indexData = res.data.data;
          this.latitude = this.indexData.latitude;
          this.longitude = this.indexData.longitude;
        })
        .catch(() => {
          console.log("error");
        });
    },
    getOptions() {
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
    edit() {
      this.no_edit = false;
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
        this.cityNum =
          this.indexData.area ||
          this.indexData.city ||
          this.indexData.province ||
          "中国";
        this.form.setFieldsValue({
          address2: [
            this.indexData.province,
            this.indexData.city,
            this.indexData.area
          ]
        });
      }, 200);
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
    imgChange(info) {
      if (info.file.status === "done") {
        let logo = info.file.response.data[0];
        this.indexData.logo = logo;
      } else if (info.file.status === "error") {
        this.$message.error(info.file.response.message);
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let data = {
            description: values.description,
            waiterPhone: values.waiterPhone,
            province: values.address2[0],
            city: values.address2[1],
            area: values.address2[2],
            address: values.address,
            latitude: this.latitude,
            longitude: this.longitude,
            storeName: values.storeName,
            logo: this.indexData.logo
          };
          api
            .ajax({
              data: data,
              method: "editShop"
            })
            .then(res => {
              console.log(res);
              this.$message.info(res.data.data);
              this.no_edit = true;
              this.getInfo();
            })
            .catch(() => {
              console.log("error");
            });
        }
      });
    },
    copyFun() {
      let clipboard = new ClipboardJS(".copyElement");
      clipboard.on("success", e => {
        this.$message.success("复制成功");
        e.clearSelection();
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        this.$message.error("复制失败");
        clipboard.destroy();
      });
    },
    displayRender({labels, selectedOptions}){
      return labels.join(' | ')
    },
  }
};
</script>
<style lang="less" scoped>
.set_shopinfo {
  border: 1px solid rgba(229, 229, 229, 1);
  background: rgba(255, 255, 255, 1);
  padding: 30px 20px 50px;
  .shopinfo__item {
    font-size: 14px;
    line-height: 20px;
    padding-bottom: 20px;
    overflow: hidden;
    .shopinfo__label {
      width: 100px;
      text-align: right;
    }
    .shopinfo__content {
      margin-left: 110px;
      .ant-btn-link {
        height: 20px;
      }
      .logo {
        width: 60px;
        height: 60px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(230, 230, 230, 1);
      }
      .shopLogo {
        width: 60px;
        height: 60px;
      }
    }
    .fr {
      width: 100px;
    }
  }
  .edit {
    .shopLogo {
      width: 60px;
      height: 60px;
      background: #ffffff;
      border: 1px solid #e6e6e6;
    }
    .ant-form-explain {
      margin-left: 110px;
    }

    .form-item-label {
      width: 100px;
      text-align: right;
      margin-right: 10px;
      height: 40px;
    }
    .form-item-label2::before {
      display: inline-block;
      margin-right: 4px;
      color: #f5222d;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: "*";
    }
    .form-item-content {
      width: 475px;
    }
    .ant-upload {
      width: 60px;
      height: 60px;
    }
    .map-box {
      position: relative;
      #mapid {
        width: 475px;
        height: 249px;
        display: inline-block;
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
  .nocascader{
    background: #fff;
    color: #595959;
    cursor: default;
    /deep/ .ant-input{
      border: none;
      cursor: default;
    }
    /deep/ i{
      display: none;
      cursor: default;
    }
  }
}
</style>
<style>
.set_shopinfo .amap-marker .amap-marker-content.hover .amap-pls-marker-tip {
  display: none;
}
</style>