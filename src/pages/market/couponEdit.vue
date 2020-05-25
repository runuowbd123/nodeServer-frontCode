<template>
  <div class="coupon-form">
    <a-spin tip="加载中..." :spinning="spin || productSpin">
      <a-form :form="form" v-if="!spin">
      <a-form-item label="优惠券名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-input :disabled="type === 'look' || type === 'verify'" style="width: 400px" v-decorator="[
            'name',
            {
              initialValue: editData.name || '',
              rules: [
                {
                  required: true,
                  message: '请输入优惠券名称'
                },
                {
                  max: 10,
                  message: '最多输入10个字符'
                }
              ]
            }
          ]" />
      </a-form-item>
      <a-form-item label="优惠券类型" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-radio-group
          :options="typeList"
          :disabled="type === 'look' || type === 'verify'"
          v-decorator="[
            'type',
            {
              initialValue: editData.type || 1,
              rules: [
                {
                  required: true,
                  message: '请选择类型'
                },
              ]
            }
          ]"
        />
      </a-form-item>
      <a-form-item label="适用商品" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" style="">
        <a-radio-group
          :disabled="type === 'look' || type === 'verify'"
          @change="() => {this.form.setFieldsValue({goodIds: []})}"
          v-decorator="[
            'googsType',
            {
              initialValue: editData.googsType || 0,
              rules: [
                {
                  required: true,
                  message: '请选择类型'
                },
              ]
            }
          ]"
        >
          <div style="display: flex; align-items: center;height:40px">
            <a-radio :value="0">全部商品可用</a-radio>
          </div>
          <div style="display: flex; align-items: center;height:40px">
            <a-radio :value="1">指定商品可用</a-radio>
            <a href="javascript:;" v-show="type !== 'look' && type !== 'verify'" style="margin-left: 10px" v-if="form.getFieldValue('googsType') == 1" @click="()=>{this.modalShow = true}">选择商品</a>
          </div>
          <div class="product-list" v-if="form.getFieldValue('googsType') == 1">
            <div class="product-item" v-for="(item, index) in form.getFieldValue('goodIds')" :key="index">
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
            <a href="javascript:;" v-show="type !== 'look' && type !== 'verify'" style="margin-left: 10px" v-if="form.getFieldValue('googsType') == 2" @click="()=>{this.modalShow = true}">选择商品</a>
          </div>
          <div class="product-list" v-if="form.getFieldValue('googsType') == 2">
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

      </a-form-item>

      <a-form-item label="使用门槛" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-radio-group
          :disabled="type === 'look' || type === 'verify'"
          v-decorator="[
            'useConditionType',
            {
              initialValue: editData.useConditionType || 0,
              rules: [
                {
                  required: true,
                  message: '请选择类型'
                },
              ]
            }
          ]"
        >
          <div style="height:40px;display: flex;align-items: center;">
            <a-radio :value="0">无使用门槛</a-radio>
          </div>
          <div style="height:40px;display: flex;align-items: center;">
            <a-radio :value="1">适用商品范围内满</a-radio>
            <a-form-item :label='null'>
              <a-input-number :disabled="type === 'look' || type === 'verify'" :min="0" style="width: 80px;display: block;margin-top:25px;" v-decorator="[
                'useCondition',
                  {
                    initialValue: editData.useCondition || '',
                    rules: [
                      {
                        required: this.form.getFieldValue('useConditionType') == 1,
                        message: '请输入使用门槛'
                      },
                    ]
                  }
                ]" 
              />
            </a-form-item>
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
      </a-form-item>
      <div  v-if="this.form.getFieldValue('type') == 1">
        <a-form-item label="优惠内容" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          减免
          <a-input-number
            style="width: 80px;margin: 0 5px;"
            :min="0.01"
            :max="9999"
            :disabled="type === 'look' || type === 'verify'"
            v-decorator="[
              'couponAmount',
              {
                initialValue: editData.couponAmount || '',
                rules: [
                  {
                    required: true,
                    message: '请输入优惠内容'
                  },
                  {
                    validator: (rule, value, callback) => {
                        if (form.getFieldValue('useConditionType') === 1 && ( form.getFieldValue('useCondition') == '' || form.getFieldValue('useCondition') < value || form.getFieldValue('useCondition') === value )) {
                          callback('优惠内容需要小于使用门槛中使用商品范围内满减金额')
                        }
                        callback();
                    }
                  }
                ]
              }
            ]" />
            元
        </a-form-item>
      </div>
      <div v-else style="position: relative;overflow: hidden">
        <div>
          <a-form-item label="优惠内容" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-input-number
              style="width: 80px;"
              :min="1"
              :max="9.9"
              :step="0.1"
              :precision="1"
              :disabled="type === 'look' || type === 'verify'"
              v-decorator="[
                'discountRate',
                {
                  initialValue: editData.discountRate || '',
                  rules: [
                    {
                      required: true,
                      message: '请输入优惠内容'
                    },
                  ]
                }
              ]" />
              折
          </a-form-item>
        </div>
        <div style="width: 100%;">
          <a-form-item label="最多优惠" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-input-number
              style="width: 80px;"
              :min="0.01"
              :max="100000"
              :disabled="type === 'look' || type === 'verify'"
              v-decorator="[
                'discountAmountMax',
                {
                  initialValue: editData.discountAmountMax || '',
                  rules: [
                    {
                      required: true,
                      message: '请输入优惠内容'
                    },
                  ]
                }
              ]" />
              元
          </a-form-item>
        </div>
      </div>

      <a-form-item label="发放张数" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-input-number
          style="width: 120px"
          :min="0"
          :max="10000000"
          :disabled="type === 'look' || type === 'verify'"
          v-decorator="[
            'amount',
            {
              initialValue: editData.amount || null,
              rules: [
                {
                  required: true,
                  message: '请输入发放张数'
                }
              ]
            }
          ]" />
          张
      </a-form-item>

      <a-form-item label="用券时间" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-radio-group
          :disabled="type === 'look' || type === 'verify'"
          v-decorator="[
            'validType',
            {
              initialValue: editData.validType || 0,
              rules: [
                {
                  required: true,
                  message: '请选择类型'
                },
              ]
            }
          ]"
        >
          <div style="height:40px;display: flex;align-items: center;margin-bottom:20px">
            <a-radio :value="0">固定日期</a-radio>
            <a-form-item :label="null">
              <a-range-picker
                style="margin-top: 30px;"
                :disabled="type === 'look' || type === 'verify'"
                v-decorator="[
                  'dateRange',
                  {
                    initialValue: editData.validType == 0 ? [moment(editData.validStartTime), moment(editData.validEndTime)] : [],
                    rules: [
                      {
                        required: form.getFieldValue('validType') == 0,
                        message: '请填写日期'
                      },
                      //{
                      //  validator: (rule, value, callback) => {
                      //      if (form.getFieldValue('validType') == 0 && value.length < 1) {
                      //        callback('请填写日期');
                      //      }
                      //      callback();
                      //  }
                      //}
                    ]
                  }
                ]"
              />
            </a-form-item>
          </div>
          <div style="height:40px;display: flex;align-items: center;">
            <a-radio :value="1">领券当日起</a-radio>
            <a-form-item :label='null'>
              <a-input-number :disabled="type === 'look' || type === 'verify'" :min="0" style="width: 80px;display: block;margin-top:25px;" v-decorator="[
                'validDay',
                  {
                    initialValue: editData.validDay || '',
                    rules: [
                      {
                        required: this.form.getFieldValue('validType') == 1,
                        message: '请输入天数'
                      },
                    ]
                  }
                ]" 
              />
            </a-form-item>
            <div style="margin-left: 5px;">
              天内可用
            </div>
          </div>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="限领张数" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-input-number
          style="width: 120px"
          :min="1"
          :max="500"
          :disabled="type === 'look' || type === 'verify'"
          v-decorator="[
            'limitAmount',
            {
              initialValue: editData.limitAmount || null,
              rules: [
                {
                  required: true,
                  message: '请输入限领张数'
                }
              ]
            }
          ]" />
          张
      </a-form-item>

      <a-form-item label="使用说明" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-textarea
          placeholder="请输入使用说明"
          style="width: 400px;resize:none"
          :rows="4"
          :disabled="type === 'look' || type === 'verify'"
          v-decorator="[
            'remark',
            {
              initialValue: editData.remark || null,
              rules: [
                {
                  required: true,
                  message: '请输入使用说明'
                },{
                  max: 60,
                  message: '最多输入60个字'
                }
              ]
            }
          ]" />
      </a-form-item>

      <a-form-item label="发放渠道" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-checkbox-group
        :disabled="type === 'look' || type === 'verify'"
          v-decorator="[
            'sendWay',
            {
              initialValue: editData.sendWay ? editData.sendWay : ['shop', 'product'],
            }
          ]"
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
      </a-form-item>

    </a-form>

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
      :rightKeyList="form.getFieldValue('goodIds') || []"
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
      form: this.$form.createForm(this, { name: "save" }),
      typeList: [
        {label: '满减券', value: 1},
        {label: '折扣券', value: 2}
      ],
      modalShow: false,
    }
  },
  created() {
    // console.log(this.$route);
    this.type = this.$route.query.type
    this.form.getFieldDecorator('goodIds', { initialValue: [], preserve: true });
    this.form.getFieldDecorator('type', { initialValue: 1, preserve: true });
    this.form.getFieldDecorator('validType', { initialValue: 0, preserve: true });
    this.form.getFieldDecorator('googsType', { initialValue: 0, preserve: true });
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
          this.editData = {
            id,
            sendWay,
            ...data
          };
          this.spin = false;
          this.getProductList(data.goodIds)
          this.form.setFieldsValue({
            type: data.type
          });
          this.form.setFieldsValue({
            goodIds: data.goodIds
          });
          this.form.setFieldsValue({
            validType: data.validType
          })
          this.form.setFieldsValue({
            googsType: data.googsType
          })
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
      const productList = (this.form.getFieldValue('goodIds') || []).filter((item) => {
        return item != id;
      })
      this.form.setFieldsValue({
        goodIds: productList
      });
    },
    handleOk(goodIds, goodList) {
      console.log('oooooooookkkkkkkkkkkkk!', goodIds, goodList)
      this.form.setFieldsValue({
        goodIds
      });
      this.productList = goodList;
      this.modalShow = false;
    },
    handleCancel() {
      this.modalShow = false;
    },
    save() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          const data = {
            ...values,
            validStartTime: values.validType == 0 ? moment(values.dateRange[0]).format('YYYY-MM-DD') : null,
            validEndTime: values.validType == 0 ? moment(values.dateRange[1]).format('YYYY-MM-DD') : null,
            showIndex: (values.sendWay).includes('shop') ? 1 : 0,
            showGoodsDetail: (values.sendWay).includes('product') ? 1 : 0,
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
