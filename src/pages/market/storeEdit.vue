<template>
  <div class="coupon-form">
    <a-spin tip="加载中..." :spinning="spin || productSpin">
      <a-form :form="form" v-if="!spin">
      <a-form-item label="活动名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
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
      <a-form-item label="活动时间" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-range-picker
          :disabled="type === 'look' || type === 'verify'"
          v-decorator="[
            'dateRange',
            {
              initialValue: editData.validStartTime ? [moment(editData.validStartTime), moment(editData.validEndTime)] : [],
              rules: [
                {
                  required: true,
                  message: '请填写日期'
                },
                //{
                //  validator: (rule, value, callback) => {
                //      if (value.length < 1) {
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
                <Tooltip :str="findProductObj(item).goodsName" :max="5"/>
                <div style="display: flex;width: 180px">
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
                <Tooltip :str="findProductObj(item).goodsName" :max="5"/>
                <div style="display: flex; margin-top: -15px; width: 180px">
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
        </a-radio-group>

      </a-form-item>
      <a-form-item label="优惠设置" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-radio-group
          :disabled="type === 'look' || type === 'verify'"
          @change="changeType"
          v-decorator="[
            'type',
            {
              initialValue: editData.type || 0,
              rules: [
                {
                  required: true,
                  message: '请选择类型'
                },
              ]
            }
          ]"
        >
          <div style="height: 30px">
            <a-radio :value="0">阶梯满减</a-radio>
          </div>
          <div style="height: 30px">
            <a-radio :value="1">循环满减</a-radio>
          </div>
        </a-radio-group>
      </a-form-item>
      <div v-if="form.getFieldValue('type') == 1" style="padding: 30px 0 5px 80px;background: rgb(242,242,242)" >
        <a-form-item label="优惠门槛" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          每满
          <a-input-number
            :precision="2"
            :disabled="type === 'look' || type === 'verify'"
            style="width: 120px; margin: 0 10px;"
            :min="0"
            v-decorator="[
              'useCondition',
              {
                initialValue: editData.useCondition || '',
                rules: [
                  {
                    required: true,
                    message: '请输入优惠门槛'
                  }
                ]
              }
            ]" />
            元
        </a-form-item>
        <a-form-item label="优惠内容" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          减
          <a-input-number
            :precision="2"
            :disabled="type === 'look' || type === 'verify'"
            style="width: 120px; margin: 0 10px;"
            :min="0"
            v-decorator="[
              'couponAmount',
              {
                initialValue: editData.couponAmount || '',
                rules: [
                  {
                    required: true,
                    message: '请输入满减金额'
                  },
                  {
                    validator: (rule, value, callback) => {
                        if (form.getFieldValue('useCondition') < value || form.getFieldValue('useCondition') === value) {
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
      <div v-else>
        <div style="margin-bottom: 10px;position: relative;padding: 30px 0 5px 80px;background: rgb(242,242,242)" v-for="(item, index) in form.getFieldValue('ladderIndexArr')" :key="item">
          <div style="position: absolute;left: 10px; top: 10px;">
            {{index + 1}}级满减:
          </div>
          <a-form-item label="优惠门槛" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            每满
            <a-input-number
              :precision="2"
              :disabled="type === 'look' || type === 'verify'"
              style="width: 120px; margin: 0 10px;"
              :min="0"
              v-decorator="[
                `useCondition${item}`,
                {
                  validateTrigger: ['change', 'blur'],
                  initialValue: ((editData.ladder || [])[item] || {}).useCondition,
                  rules: [
                    {
                      required: true,
                      message: '请输入优惠门槛'
                    }
                  ]
                }
              ]" />
              元
          </a-form-item>
          <a-form-item label="优惠内容" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            减
            <a-input-number
              :precision="2"
              :disabled="type === 'look' || type === 'verify'"
              style="width: 120px; margin: 0 10px;"
              :min="0"
              v-decorator="[
                `couponAmount${item}`,
                {
                  validateTrigger: ['change', 'blur'],
                  initialValue: ((editData.ladder || [])[item] || {}).couponAmount,
                  rules: [
                    {
                      required: true,
                      message: '请输入满减金额'
                    },
                    {
                      validator: (rule, value, callback) => {
                          if (form.getFieldValue(`useCondition${item}`) < value || form.getFieldValue(`useCondition${item}`) === value) {
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
          <a-button v-if="index === 0" @click="addLadder" style="position: absolute; top: 10px;right: 10px;" type="primary" :disabled="type === 'look' || form.getFieldValue('ladderIndexArr').length > 19 || type === 'verify'">
            添加阶梯
          </a-button>
          <a-button v-else @click="decreseLadder(item)" style="position: absolute; top: 10px;right: 10px;" type="danger" :disabled="type === 'look' || type === 'verify'">
            删除
          </a-button>
        </div>
      </div>

    </a-form>
    <div style="display: flex; flex-direction:row-reverse; margin-top: 50px" v-if="type === 'verify'">
      <a-button type="primary" @click="verify('pass')" style="margin-left: 20px">通过</a-button>
      <a-button @click="verify('reject')">驳回</a-button>
    </div>
    <div style="display: flex; flex-direction: row-reverse;margin-top: 50px" v-else>
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
let id = 0;

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
      modalShow: false,
    }
  },
  created() {
    // console.log(this.$route);
    this.type = this.$route.query.type
    this.form.getFieldDecorator('goodIds', { initialValue: [], preserve: true });
    this.form.getFieldDecorator('googsType', { initialValue: 0, preserve: true });
    this.form.getFieldDecorator('type', { initialValue: 0, preserve: true });
    this.form.getFieldDecorator('ladderIndex', { initialValue: 0, preserve: true });
    this.form.getFieldDecorator('ladderIndexArr', { initialValue: [0], preserve: true });
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
          method: "infoSaleActivity"
        })
        .then(res => {
          const data = res.data.data
          console.log(id, data)
          this.editData = {
            id,
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
            googsType: data.googsType
          });
          this.form.setFieldsValue({
            ladderIndex: (data.ladder || []).length
          });
          this.form.setFieldsValue({
            ladderIndexArr: (data.ladder || [0]).map((item, index) => {return index})
          });
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
    changeType(val) {
      console.log(val)
      this.form.setFieldsValue({
        ladderIndex: 0
      });
      this.form.setFieldsValue({
        ladderIndexArr: [0]
      });
      this.editData.ladder = []
    },
    addLadder() {
      const newIndex = this.form.getFieldValue('ladderIndex') + 1;
      const newArr = this.form.getFieldValue('ladderIndexArr').concat(newIndex)
      this.form.setFieldsValue({
        ladderIndex: newIndex
      });
      this.form.setFieldsValue({
        ladderIndexArr: newArr
      })
    },
    decreseLadder(index) {
      const newArr = this.form.getFieldValue('ladderIndexArr').filter((item) => {
        return item != index
      });
      this.form.setFieldsValue({
        ladderIndexArr: newArr
      })
    },
    save() {
      this.form.validateFields((err, values) => {
        if (!err) {
          let data = {
            ...values,
            validStartTime: moment(values.dateRange[0]).format('YYYY-MM-DD'),
            validEndTime: moment(values.dateRange[1]).format('YYYY-MM-DD'),
          }
          if(values.type == 0) {
            const ladder = values.ladderIndexArr.map((item) => {
              return {
                useCondition: values[`useCondition${item}`],
                couponAmount: values[`couponAmount${item}`]
              }
            })
            data = {
              ...data,
              ladder
            }
          }
          console.log(values, data)
          api
            .ajax({
              method: "saveSaleActivity",
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
