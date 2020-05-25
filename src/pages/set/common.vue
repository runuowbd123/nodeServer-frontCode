<template>
  <div class="shopinfo__Box">
    <a-form :form="form" @submit="handleSubmit">
      <!-- <div class="form-item-label fl"></div>
      <div class="shopinfo__item">
        <a-form-item extra="图片用于分享后显示图片">
          <div class="form-item-label fl">店铺图片：</div>
          <a-upload
            style="width: 200px;"
            name="file1"
            listType="picture-card"
            :showUploadList="false"
            accept=".png,.jpg,.jpeg,.bmp"
            :beforeUpload = "beforeUploadLimit"
            @change="imgChange"
            action="/api/uploadJson"
            v-decorator="[
              'picture',
              {
                initialValue: indexData.picture,
                rules: [{ required: true, message: '请上传店铺图片' }]
              }
            ]"
          >
            <img class="img" v-if="indexData.picture" :src="indexData.picture" />
            <div v-else>
              <a-icon type="plus" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
        </a-form-item>
      </div> -->
      <div style="display: flex">
        <div class="form-item-label fl">店铺图片</div>
        <div style="margin-left: -80px" >
          <a-form-item extra="图片用于分享后显示图片" class="form-pic">
            <div class="form-item-label fl"></div>
            <a-upload
              style="width: 200px;"
              name="file1"
              listType="picture-card"
              :showUploadList="false"
              accept=".png,.jpg,.jpeg,.bmp"
              :beforeUpload = "beforeUploadLimit"
              @change="imgChange"
              action="/api/uploadJson"
              v-decorator="[
                'picture',
                {
                  initialValue: indexData.picture,
                  rules: [{ required: true, message: '请上传店铺图片' }]
                }
              ]"
            >
              <img class="img" v-if="indexData.picture" :src="indexData.picture" />
              <div v-else>
                <a-icon type="plus" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
          </a-form-item>
        </div>
      </div>
      

      <div class="shopinfo__item">
        <div class="shopinfo__label fl">经营设置</div>
        <div class="shopinfo__content">
          <a-form-item extra="设置休息后，买家将无法在店内消费，请谨慎操作">
            <div class="form-item-label fl">经营状态：</div>
            <a-radio-group
              v-decorator="[
                'manageStatus',
                {
                  initialValue: indexData.manageStatus
                }
              ]"
            >
              <a-radio :value="0">营业</a-radio>
              <a-radio :value="1">休息</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item class="inline-item">
            <div class="form-item-label fl">营业时间：</div>
            <a-radio-group
              @change="open_time_typeChange"
              v-decorator="[
                'sellTimeType',
                {
                  initialValue: indexData.sellTimeType
                }
              ]"
            >
              <a-radio :value="0">全天</a-radio>
              <a-radio :value="1">自定义</a-radio>
            </a-radio-group>
          </a-form-item>
          <span v-if="indexData.sellTimeType == 1">
            <a-form-item class="inline-item">
              <a-time-picker
                format="HH:mm:ss"
                @change="start_timeChange"
                v-decorator="[
                  'sellStartTime',
                  {
                    initialValue: moment(indexData.sellStartTime, 'HH:mm:ss'),
                    rules: [{ required: true, message: '请输入开始时间' }]
                  }
                ]"
              />
            </a-form-item>
            <span class="lineheight">至</span>
            <a-form-item class="inline-item">
              <a-time-picker
                format="HH:mm:ss"
                @change="end_timeChange"
                v-decorator="[
                  'sellEndTime',
                  {
                    initialValue: moment(indexData.sellEndTime, 'HH:mm:ss'),
                    rules: [{ required: true, message: '请输入结束时间' }]
                  }
                ]"
              />
            </a-form-item>
            <span class="lineheight">每天重复</span>
          </span>
        </div>
      </div>

      <div class="shopinfo__item">
        <div class="shopinfo__label fl">页面设置</div>
        <div class="shopinfo__content">
          <a-form-item
            extra="展示后，售罄商品会在店铺中展示，并显示“已售罄”标记"
          >
            <div class="form-item-label fl">售空商品：</div>
            <a-radio-group
              v-decorator="[
                'soldOutDisplay',
                {
                  initialValue: indexData.soldOutDisplay
                }
              ]"
            >
              <a-radio :value="1">展示</a-radio>
              <a-radio :value="0">不展示</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item extra="不展示则不在店铺展示销量">
            <div class="form-item-label fl">销量展示：</div>
            <a-radio-group
              v-decorator="[
                'salesDisplay',
                {
                  initialValue: indexData.salesDisplay
                }
              ]"
            >
              <a-radio :value="1">展示</a-radio>
              <a-radio :value="0">不展示</a-radio>
            </a-radio-group>
          </a-form-item>
        </div>
      </div>

      <div class="shopinfo__item">
        <div class="shopinfo__label fl">交易设置</div>
        <div class="shopinfo__content">
          <div>
            <span class="left-label">运费计算方式：</span>
            <a-form-item class="inline-item">
              <a-radio-group v-decorator="[
                'freightComputeMode',
                {
                  initialValue: indexData.freightComputeMode
                }
              ]">
                <a-radio :value="0">
                  取最大值
                </a-radio>
                <a-radio :value="1">
                  取最小值
                </a-radio>
                <a-radio :value="2">
                  运费叠加
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </div>
          <div>
            <span class="left-label">待付款订单取消时间：</span
            >
            <span>拍下未付款订单</span>
            <a-form-item class="inline-item">
              <a-input-number
                :precision="0"
                class="width90"
                v-decorator="[
                  'cancelOrderTime',
                  {
                    initialValue: indexData.cancelOrderTime,
                    rules: [
                      {
                        type: 'number',
                        required: true,
                        message: '请输入自动取消订单时间'
                      },
                      
                    ]
                  }
                ]"
              />
              <!-- {
                        type: 'number',
                        max: 1440,
                        min: 20,
                        message: '20-1440分钟之间'
                      } -->
            </a-form-item>
            <span class="lineheight">分钟内未付款，自动取消订单</span>
          </div>
          <div>
            <span class="left-label">发货后自动确认收货时间：</span
            >
            <span>发货后</span>
            <a-form-item class="inline-item">
              <a-input-number
                :precision="0"
                class="width90"
                v-decorator="[
                  'buyerAutoConfirmGoodsDay',
                  {
                    initialValue: indexData.buyerAutoConfirmGoodsDay,
                    rules: [
                      {
                        type: 'number',
                        required: true,
                        message: '请输入自动确认收货时间'
                      },
                     
                    ]
                  }
                ]"
              />
            </a-form-item>
             <!-- {
                        type: 'number',
                        max: 30,
                        min: 7,
                        message: ' 7-30 天之间'
                      } -->
            <span class="lineheight">天，自动确认收货</span>
          </div>
          <div>
            <span class="left-label">买家退货后商家自动确认收货时间：</span
            >
            <span>买家发货后</span>
            <a-form-item class="inline-item">
              <a-input-number
                :precision="0"
                class="width90"
                v-decorator="[
                  'sellerAutoConfirmDay',
                  {
                    initialValue: indexData.sellerAutoConfirmDay,
                    rules: [
                      {
                        type: 'number',
                        required: true,
                        message: '请输入自动确认收货时间'
                      },
                      
                    ]
                  }
                ]"
              />
            </a-form-item>
            <!-- {
                        type: 'number',
                        max: 15,
                        min: 7,
                        message: '7-15 天之间'
                      } -->
            <span class="lineheight">天，自动确认收货</span>
          </div>
          <a-form-item>
            <span class="left-label">买家确认收货后是否允许申请售后：</span>
            <a-radio-group
              v-decorator="[
                'applySaleService',
                {
                  initialValue: indexData.applySaleService
                }
              ]"
            >
              <a-radio :value="1">允许</a-radio>
              <a-radio :value="0">不允许</a-radio>
            </a-radio-group>
          </a-form-item>
        </div>
      </div>
      <div class="shopinfo__item">
        <div class="shopinfo__label fl">售后设置</div>
        <div class="shopinfo__content">
          <div>
            <span class="left-label">买家发起退款处理：</span
            >
            <span>买家发起退款申请</span>
            <a-form-item class="inline-item">
              <a-input-number
                :precision="0"
                class="width90"
                v-decorator="[
                  'autoRefundDay',
                  {
                    initialValue: indexData.autoRefundDay,
                    rules: [
                      {
                        type: 'number',
                        required: true,
                        message: '请输入自动同意时间'
                      },
                      
                    ]
                  }
                ]"
              />
            </a-form-item>
            <!-- {
                        type: 'number',
                        max: 15,
                        min: 7,
                        message: '7-15 天之间'
                      } -->
            <span class="lineheight">天，未处理自动同意</span>
          </div>
          <div>
            <span class="left-label">买家发起退货/退款处理：</span
            >
            <span>买家发起退货/退款申请</span>
            <a-form-item class="inline-item">
              <a-input-number
                :precision="0"
                class="width90"
                v-decorator="[
                  'autoReturnGoodsDay',
                  {
                    initialValue: indexData.autoReturnGoodsDay,
                    rules: [
                      {
                        type: 'number',
                        required: true,
                        message: '请输入自动同意时间'
                      },
                      
                    ]
                  }
                ]"
              />
            </a-form-item>
            <!-- {
                        type: 'number',
                        max: 15,
                        min: 7,
                        message: '7-15 天之间'
                      } -->
            <span class="lineheight">天，未处理自动同意</span>
          </div>
          <div>
            <span class="left-label">商家同意退货处理：</span
            >
            <span>商家同意退货后</span>
            <a-form-item class="inline-item">
              <a-input-number
                :precision="0"
                class="width90"
                v-decorator="[
                  'buyerCancelSaleServiceDay',
                  {
                    initialValue: indexData.buyerCancelSaleServiceDay,
                    rules: [
                      {
                        type: 'number',
                        required: true,
                        message: '请输入自动取消售后时间'
                      },
                      
                    ]
                  }
                ]"
              />
            </a-form-item>
            <!-- {
                        type: 'number',
                        max: 15,
                        min: 7,
                        message: '7-15 天之间'
                      } -->
            <span class="lineheight">天，买家未处理，自动取消售后</span>
          </div>
          <!-- <div>
            <span class="left-label">买家已退货处理：</span>
            <span>商家同意退货后</span>
            <a-form-item class="inline-item">
              <a-input-number
                  :precision="0"
                  class="width90"
                  v-decorator="[
                    'sellerCancelSaleServiceDay',
                    {
                      initialValue: indexData.sellerCancelSaleServiceDay,
                      rules: [
                        {
                          type: 'number',
                          required: true,
                          message: '请输入自动取消售后时间'
                        },
                        
                      ]
                    }
                  ]"
                />
            </a-form-item>
            <span class="lineheight">天，商家未处理，自动取消售后</span>
          </div> -->
        </div>
      </div>
      <div class="shopinfo__item">
        <a-button
          v-if="$permission.hasPermission('SET_COMMON_EDIT')"
          class="fr width90"
          type="primary"
          html-type="submit"
          >保存</a-button
        >
      </div>
    </a-form>
  </div>
</template>
<script>
import moment from "moment";
import ClipboardJS from "clipboard";
import api from "@/api/user";
import utils from "@/util/common"
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: "save" }),
      imageUrl: "",
      indexData: {}
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    moment,
    beforeUploadLimit:utils.beforeUploadLimit,
    getInfo() {
      api
        .ajax({
          data: {},
          method: "shopInfo"
        })
        .then(res => {
          this.indexData = res.data.data;
        })
        .catch(() => {
          console.log("error");
        });
    },
    imgChange(info) {
      if (info.file.status === "done") {
        let logo = info.file.response.data[0];
        this.indexData.picture = logo;
      } else if (info.file.status === "error") {
        this.$message.error(info.file.response.message);
      }
    },
    open_time_typeChange(e) {
      this.indexData.sellTimeType = e.target.value;
    },
    start_timeChange(time) {
      // this.start_time = time;
    },
    end_timeChange(time) {
      // this.end_time = time;
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let data = {
            cancelOrderTime: values.cancelOrderTime,
            salesDisplay: values.salesDisplay,
            soldOutDisplay: values.soldOutDisplay,
            manageStatus: values.manageStatus,
            picture: this.indexData.picture,
            applySaleService: values.applySaleService,
            autoRefundDay: values.autoRefundDay,
            autoReturnGoodsDay: values.autoReturnGoodsDay,
            buyerAutoConfirmGoodsDay: values.buyerAutoConfirmGoodsDay,
            buyerCancelSaleServiceDay: values.buyerCancelSaleServiceDay,
            freightComputeMode: values.freightComputeMode,
            sellerAutoConfirmDay: values.sellerAutoConfirmDay,
            // sellerCancelSaleServiceDay: values.sellerCancelSaleServiceDay,
          };
          if (this.indexData.sellTimeType == 1) {
            data.sellEndTime = values.sellEndTime.format("HH:mm:ss");
            data.sellStartTime = values.sellStartTime.format("HH:mm:ss");
          } else {
            data.sellEndTime = "23:59:59";
            data.sellStartTime = "00:00:00";
          }
          api
            .ajax({
              data: data,
              method: "editShopSetting"
            })
            .then(res => {
              this.$message.info(res.data.data);
              this.getInfo();
            })
            .catch(() => {
              console.log("error");
            });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.shopinfo__Box {
  border: 1px solid rgba(229, 229, 229, 1);
  background: rgba(255, 255, 255, 1);
  padding: 30px 20px 50px;
  .form-item-label,
  .shopinfo__label {
    width: 100px;
    text-align: right;
    margin-right: 10px;
    height: 40px;
    line-height: 40px;
  }
  .shopinfo__item {
    overflow: hidden;
    .shopinfo__label {
      padding-right: 10px;
    }
    .shopinfo__content {
      margin-left: 110px;
    }
  }
  .inline-item {
    display: inline-block;
  }
  .lineheight {
    line-height: 40px;
  }
  .width90 {
    width: 90px;
  }
  .img {
    width: 94px;
    height: 94px;
  }
  .left-label {
    display: inline-block;
    // width: 230px;
    line-height: 40px;
    text-align: left;
    margin-left: 30px;
  }
}
</style>
<style lang="less">
.form-pic{
    .ant-form-extra{
      margin-left: 110px !important;
      font-size: 12px;
      color: rgba(128, 128, 128, 1);
    }
  }
</style>
