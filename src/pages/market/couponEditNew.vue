<template>
  <div class="coupon-form">
    <a-spin tip="加载中..." :spinning="spin || productSpin">
      <a-form-model :model="formData" ref="couponForm" :rules="formRule">
        <a-form-model-item
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          label="优惠券名称"
          prop="name"
          >
          <a-input
            :disabled="type === 'look' || type === 'verify'"
            style="width: 400px"
            v-model="formData.name"
            :maxLength="10"
          />
        </a-form-model-item>
        <a-form-model-item
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          label="优惠券类型"
          prop="type"
          >
          <a-radio-group
            :options="typeList"
            :disabled="type === 'look' || type === 'verify'"
            v-model="formData.type"
          />
        </a-form-model-item>
        <a-form-model-item
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          label="适用商品"
          prop="type"
          >
          <a-radio-group
            :disabled="type === 'look' || type === 'verify'"
            @change="() => {formData.goodIds = []}"
            v-model="formData.googsType"
            >
            <div style="display: flex; align-items: center;height:40px">
              <a-radio :value="0">全部商品可用</a-radio>
            </div>
            <div style="display: flex; align-items: center;height:40px">
              <a-radio :value="1">指定商品可用</a-radio>
              <a href="javascript:;" v-show="type !== 'look' && type !== 'verify'" style="margin-left: 10px" v-if="formData.googsType == 1" @click="()=>{modalShow = true}">选择商品</a>
            </div>
            <div class="product-list" v-if="formData.googsType == 1">
              <div class="product-item" v-for="(item, index) in formData.goodIds" :key="index">
                <img :src="findProductObj(item).mainPic" alt="商品" class="pic">
                <div class='content'>
                  <Tooltip :str="findProductObj(item).goodsName" :max="5" style="margin-top"/>
                  <div style="display: flex; width: 180px">
                    <div style="width: 50%">
                      ￥ {{findProductObj(item).price}}
                    </div>
                    <span>
                      库存 {{findProductObj(item).stock}}
                    </span>
                  </div>
                </div>
                <a-icon type="close-circle" @click="deleteProduct(item)" class="delete" v-show="type !== 'look' && type !== 'verify'"/>
              </div>
            </div>

            <div style="display: flex; align-items: center;height:40px">
              <a-radio :value="2">指定商品不可用</a-radio>
              <a href="javascript:;" v-show="type !== 'look' && type !== 'verify'" style="margin-left: 10px" v-if="formData.googsType == 2" @click="()=>{modalShow = true}">选择商品</a>
            </div>
            <div class="product-list" v-if="formData.googsType == 2">
              <div class="product-item" v-for="(item, index) in form.getFieldValue('goodIds')" :key="index">
                <img :src="findProductObj(item).mainPic" alt="商品" class="pic">
                <div class='content'>
                  <Tooltip :str="findProductObj(item).goodsName" :max="5" style=""/>
                  <div style="display: flex; margin-top: -15px; width: 180px">
                    <div style="width: 50%">
                      ￥ {{findProductObj(item).price}}
                    </div>
                    <span style="margin-left:10px">
                      库存 {{findProductObj(item).stock}}
                    </span>
                  </div>
                </div>
                <a-icon type="close-circle" @click="deleteProduct(item)" class="delete" v-show="type !== 'look' && type !== 'verify'"/>
              </div>
            </div>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          label="使用门槛"
          prop="useConditionType"
          >
          <a-radio-group
            :disabled="type === 'look' || type === 'verify'"
            v-model="formData.useConditionType"
            >
            <div style="height:40px;display: flex;align-items: center;">
              <a-radio :value="0">无使用门槛</a-radio>
            </div>
            <div style="height:40px;display: flex;align-items: center;">
              <a-radio :value="1">适用商品范围内满</a-radio>
              <a-form-model-item :label='null' prop="useCondition">
                <a-input-number
                  :disabled="type === 'look' || type === 'verify'"
                  :min="0"
                  :max="999999"
                  style="width: 80px;display: block;margin-top:25px;"
                  v-model="formData.useCondition"
                  />
              </a-form-model-item>
              <div style="margin-left: 5px;">
                元
              </div>
              <a-popover :title="null" style="margin-left: 10px;">
                <template slot="content">
                  当商品参与促销活动，会以参与促销后的优惠金额计算门槛
                </template>
                <a-icon theme="filled" type="question-circle" style="font-size: 16px; color: rgb(61,123,248)"/>
              </a-popover>
            </div>
          </a-radio-group>
        </a-form-model-item>
        <div  v-if="formData.type == 1">
          <a-form-model-item
            label="优惠内容"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            prop="couponAmount"
            ref="couponAmount"
            >
            减免
            <a-input-number
              style="width: 80px;margin: 0 5px;"
              :min="0.01"
              :max="9999"
              :disabled="type === 'look' || type === 'verify'"
              v-model="formData.couponAmount"
              @blur="() => {$refs.couponAmount.onFieldBlur()}"
              @change="() => {$refs.couponAmount.onFieldChange()}"
              />
              元
          </a-form-model-item>
        </div>
        <div v-else style="position: relative;overflow: hidden">
          <div>
            <a-form-model-item label="优惠内容" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" prop="discountRate">
              <a-input-number
                style="width: 80px;"
                :min="1"
                :max="9.9"
                :step="0.1"
                :precision="1"
                :disabled="type === 'look' || type === 'verify'"
                v-model="formData.discountRate"
                />
                折
            </a-form-model-item>
          </div>
          <div style="width: 100%;">
            <a-form-model-item label="最多优惠" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" prop="discountAmountMax">
              <a-input-number
                style="width: 80px;"
                :min="0.01"
                :max="100000"
                :disabled="type === 'look' || type === 'verify'"
                v-model="formData.discountAmountMax"
                />
                元
            </a-form-model-item>
          </div>
        </div>
        <a-form-model-item label="发放张数" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" prop="amount">
          <a-input-number
            style="width: 120px"
            :min="0"
            :max="10000000"
            :disabled="type === 'look' || type === 'verify'"
            v-model="formData.amount"
            />
            张
        </a-form-model-item>
        <a-form-model-item label="用券时间" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" prop="validType">
          <a-radio-group
            :disabled="type === 'look' || type === 'verify'"
            v-model="formData.validType"
            >
            <div style="height:40px;display: flex;align-items: center;margin-bottom:20px">
              <a-radio :value="0">固定日期</a-radio>
              <a-form-model-item :label="null" prop="dateRange">
                <a-range-picker
                  style="margin-top: 30px;"
                  :disabled="type === 'look' || type === 'verify'"
                  v-model="formData.dateRange"
                  />
              </a-form-model-item>
            </div>
            <div style="height:40px;display: flex;align-items: center;">
              <a-radio :value="1">领券当日起</a-radio>
              <a-form-model-item :label='null' prop="validDay">
                <a-input-number
                  :disabled="type === 'look' || type === 'verify'"
                  :min="0" style="width: 80px;display: block;margin-top:25px;"
                  :max="999999"
                  v-model="formData.validDay"
                  />
              </a-form-model-item>
              <div style="margin-left: 5px;">
                天内可用
              </div>
            </div>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="限领张数" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" prop="limitAmount">
          <a-input-number
            style="width: 120px"
            :min="1"
            :max="500"
            :disabled="type === 'look' || type === 'verify'"
            v-model="formData.limitAmount"
            />
            张
        </a-form-model-item>
        <a-form-model-item label="使用说明" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" prop="remark">
          <a-textarea
            placeholder="请输入使用说明"
            style="width: 400px;resize:none"
            :rows="4"
            :disabled="type === 'look' || type === 'verify'"
            v-model="formData.remark"
            />
        </a-form-model-item>
        <a-form-model-item label="发放渠道" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" prop="sendWay">
          <a-checkbox-group
          :disabled="type === 'look' || type === 'verify'"
            v-model="formData.sendWay"
            >
            <a-checkbox value="shop">店铺主页自动获取</a-checkbox>
            <a-checkbox value="product">商品详情页</a-checkbox>
          </a-checkbox-group>
          <a-popover :title="null" style="margin-left: 10px;">
            <template slot="content">
              您也可以通过推广链接或小程序二维码完成卡券发放
            </template>
            <a-icon theme="filled" type="question-circle" style="font-size: 16px; color: rgb(61,123,248)"/>
          </a-popover>
        </a-form-model-item>
      </a-form-model>

      <div v-if="type === 'verify'" style="display: flex; flex-direction:row-reverse;margin-top: 50px">
        <a-button type="primary" @click="verify('pass')" style="margin-left: 20px">通过</a-button>
        <a-button @click="verify('reject')">驳回</a-button>
      </div>
      <div v-else style="display: flex; flex-direction:row-reverse; margin-top: 50px">
        <a-button type="primary" @click="save" style="margin-left: 20px" v-show="type !== 'look'">保存</a-button>
        <a-button @click="cancel">取消</a-button>
      </div>

      <ProductSelectModal
        :modalShow="modalShow"
        v-if="modalShow"
        title="选择商品"
        v-on:handleOk="handleOk"
        v-on:handleCancel="handleCancel"
        getProductListUrl="groupGoodsList"
        :rightKeyList="formData.goodIds || []"
      />

    </a-spin>

  </div>
</template>
<script>
import api from "@/api/user";
import moment from 'moment';
import ProductSelectModal from '@/components/ProductSelectModal'
import Tooltip from '@/components/Tooltip'
export default {
  components: {
    ProductSelectModal,
    Tooltip
  },
  data() {
    return {
      spin: true,
      productSpin: true,
      moment,
      type: 'add',
      editData: {},
      productList: [],
      typeList: [
        {label: '满减券', value: 1},
        {label: '折扣券', value: 2}
      ],
      modalShow: false,
      form: this.$form.createForm(this, { name: "save" }),
      formData: {
        name: '', // 优惠券名称
        type: 1, // 优惠券类型
        googsType: 0, // 使用商品
        goodIds: [], // 商品id数组
        useConditionType: 0, // 使用门槛
        useCondition: '', // 使用门槛数值,
        couponAmount: '', // 优惠内容数值,
        discountRate: '', // 优惠内容折扣
        discountAmountMax: '', // 优惠内容最多优惠
        amount: null, // 发放张数
        validType: 0, // 用券时间类型
        dateRange: [], // 用券时间 [moment(editData.validStartTime), moment(editData.validEndTime)]
        validDay: '', // 用券领取之后多少天有效
        limitAmount: null, // 限领张数
        remark: null, // 使用说明
        sendWay: ['shop', 'product'], // 发放渠道 editData.sendWay ? editData.sendWay : ['shop', 'product'],
      },
    }
  },
  computed: {
    formRule() {
      const formData = this.formData;
      const rule = {
        name: [{ required: true, message: '请输入优惠券名称' }],
        type: [{ required: true, message: '请选择类型' }],
        googsType: [{ required: true, message: '请选择类型' }],
        useConditionType: [{ required: true, message: '请选择类型' }],
        useCondition: [{ required: formData.useConditionType == 1, message: '请输入使用门槛'}],
        couponAmount: [{ required: true, message: '请输入优惠内容' },{
                        validator: (rule, value, callback) => {
                            if (formData.useConditionType == 1 && ( formData.useCondition == '' || formData.useCondition < value || formData.useCondition === value )) {
                              callback('优惠内容需要小于使用门槛中使用商品范围内满减金额')
                            }
                            callback();
                        }
                      }],
        discountRate: [{ required: true, message: '请输入优惠内容' }],
        discountAmountMax: [{ required: true, message: '请输入优惠内容' }],
        amount: [{ required: true, message: '请输入发放张数' }],
        validType: [{ required: true, message: '请选择类型' }],
        dateRange: [{ required: formData.validType == 0, message: '请填写日期' }],
        validDay: [{ required: formData.validType == 1, message: '请输入天数' }],
        limitAmount: [{ required: true, message: '请输入限领张数' }],
        remark: [{ required: true, message: '请输入使用说明' },{ max: 60, message: '最多输入60个字' }]
      }
      return rule
    }
  },
  created() {
    // console.log(this.$route);
    this.type = this.$route.query.type
    if(this.type !== 'add') {
      // 添加和查看详情都需要获取数据
      this.getData()
    } else {
      this.spin = false;
      this.productSpin = false;
    }

  },
  methods: {
    findProductObj(id){
      const obj = this.productList.find((it) => {return it.goodsId == id}) || {}
      return obj
    },
    getData() {
      const id = this.$route.query.id
      api
        .ajax({
          data: {
            id
          },
          method: "infoSaleCoupon"
        })
        .then(res => {
          console.log(res);
          const data = res.data.data
          const sendWay = data.showIndex == 1 && data.showGoodsDetail == 1
            ? ['shop', 'product']
            : (
              data.showIndex == 1 && data.showGoodsDetail == 0
                ? ['shop']
                : (
                  data.showIndex == 0 && data.showGoodsDetail == 1
                  ? ['product']
                  : []
                )
            ) 
            console.log(id,sendWay, data)
          const dateRange = !!data.validStartTime ? [moment(data.validStartTime), moment(data.validEndTime)] : []
          this.formData = {
            ...data,
            id,
            sendWay,
            dateRange
          };
          this.spin = false;
          this.getProductList(data.goodIds)
        })
        .catch((e) => {
          this.spin = false;
          this.productSpin = false
          console.log("error", e);
        });
    },
    getProductList(goodsIds) {
      api
        .ajax({
          method: "groupGoodsList",
          data: {
            type: 3,
            goodsIds
          }
        })
        .then(res => {
          console.log(res);
          const data = res.data.data
          this.productList = data;
          this.productSpin = false;
        })
        .catch(() => {
          console.log("error");
        });
    },
    deleteProduct(id) {
      console.log(id)
      const productList = (this.formData.goodIds || []).filter((item) => {
        return item != id;
      })
      this.formData.goodIds = productList;
    },
    handleOk(goodIds, goodList) {
      console.log('oooooooookkkkkkkkkkkkk!', goodIds, goodList)
      this.formData.goodIds = goodIds
      this.productList = goodList;
      this.modalShow = false;
    },
    handleCancel() {
      this.modalShow = false;
    },
    save() {
      this.$refs.couponForm.validate((valid) => {
        if (valid) {
          console.log(this.formData)
          const formData = this.formData
          const data = {
            ...formData,
            validStartTime: formData.validType == 0 ? moment(formData.dateRange[0]).format('YYYY-MM-DD') : null,
            validEndTime: formData.validType == 0 ? moment(formData.dateRange[1]).format('YYYY-MM-DD') : null,
            showIndex: (formData.sendWay).includes('shop') ? 1 : 0,
            showGoodsDetail: (formData.sendWay).includes('product') ? 1 : 0,
          }
          api
            .ajax({
              method: "saveSaleCoupon",
              data: {
                ...data,
                id: this.type === 'resubmit' ? this.$route.query.id : null
              }
            })
            .then(res => {
              console.log(res);
              this.$message.info(res.data.msg);
              this.$router.go(-1)
            })
            .catch(() => {
              console.log("error");
            });
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    verify(type) {
      console.log(type);
      api
        .ajax({
          method: "doSaleAuth",
          data: {
            status: type === 'pass' ? 2 : -1,
            id: this.$route.query.verifyId
          }
        })
        .then(res => {
          console.log(res);
          this.$message.info(res.data.msg);
          this.$router.go(-1)
        })
        .catch(() => {
          console.log("error");
        });
    }
  }
};
</script>
<style lang="less" scoped>
  .coupon-form {
    background: #fff;
    padding: 20px;
    .product-list{
      display: flex;
      flex-wrap: wrap;
      .product-item{
        align-items: center;
        width: 260px;
        height: 60px;
        display: flex;
        background: rgb(242,242,242);
        margin: 10px 10px 0 0;
        font-size: 12px;
        padding-left: 10px;
        position: relative;
          .pic{
            display: block;
            height: 40px;
            width: 40px;
            margin-right: 10px;
          }
          .content{
            height: 60px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
          }
        .delete{
          position: absolute;
          top: -4px;
          right: -4px;
          font-size: 14px;
        }
      }
    }
  }
</style>
