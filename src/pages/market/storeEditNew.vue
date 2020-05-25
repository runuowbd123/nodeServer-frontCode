<template>
  <div class="coupon-form">
    <a-spin tip="加载中..." :spinning="spin || productSpin">
      <a-form-model :model="formData" ref="storeForm" :rules="formRule">
        <a-form-model-item label="活动名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" prop="name">
          <a-input
            :disabled="type === 'look' || type === 'verify'"
            style="width: 400px"
            v-model="formData.name"
            :max="10"
            />
        </a-form-model-item>
        <a-form-model-item label="活动时间" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" prop="dateRange">
          <a-range-picker
            :disabled="type === 'look' || type === 'verify'"
            v-model="formData.dateRange"
            />
        </a-form-model-item>
        <a-form-model-item label="适用商品" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" prop="googsType">
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
              <a href="javascript:;" v-show="type !== 'look' && type !== 'verify'" style="margin-left: 10px" v-if="formData.googsType == 2" @click="()=>{modalShow = true}">选择商品</a>
            </div>
            <div class="product-list" v-if="formData.googsType == 2">
              <div class="product-item" v-for="(item, index) in formData.goodIds" :key="index">
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
        </a-form-model-item>
        <a-form-model-item label="优惠设置" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" prop="type">
          <a-radio-group
            :disabled="type === 'look' || type === 'verify'"
            @change="changeType"
            v-model="formData.type"
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
        </a-form-model-item>
        <div v-if="formData.type == 1" style="padding: 30px 0 5px 80px;background: rgb(242,242,242)" >
          <a-form-model-item label="优惠门槛" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" prop="useCondition" ref="useCondition" >
            每满
            <a-input-number
              :precision="2"
              :disabled="type === 'look' || type === 'verify'"
              style="width: 120px; margin: 0 10px;"
              :min="0"
              v-model="formData.useCondition"
              @blur="() => {$refs.useCondition.onFieldBlur()}"
              @change="() => {$refs.useCondition.onFieldChange()}"
              />
              元
          </a-form-model-item>
          <a-form-model-item label="优惠内容" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" prop="couponAmount" ref="couponAmount">
            减
            <a-input-number
              :precision="2"
              :disabled="type === 'look' || type === 'verify'"
              style="width: 120px; margin: 0 10px;"
              :min="0"
              @blur="() => {$refs.couponAmount.onFieldBlur()}"
              @change="() => {$refs.couponAmount.onFieldChange()}"
              v-model="formData.couponAmount"
              />
              元
          </a-form-model-item>
          </div>
          <div v-else>
          <div style="margin-bottom: 10px;position: relative;padding: 30px 0 5px 80px;background: rgb(242,242,242)" v-for="(item, index) in formData.ladder" :key="index">
            <div style="position: absolute;left: 10px; top: 10px;">
              {{index + 1}}级满减:
            </div>
            <a-form-model-item
              label="优惠门槛"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
              :prop="'ladder.' +index+ '.useCondition'"
              :rules="{
                required: true,
                message: '请输入优惠门槛'
              }"
              style="position: relative"
              >
              <a-input-number
                :precision="2"
                :disabled="type === 'look' || type === 'verify'"
                style="width: 120px; margin: 0 10px 0 40px;"
                :min="0"
                v-model='formData.ladder[index].useCondition'
                />
                <span style="position: absolute;left: 0">每满</span>
                元
            </a-form-model-item>
            <a-form-model-item
              label="优惠内容"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 20 }"
              :prop="'ladder.' +index+ '.couponAmount'"
              :rules="[{
                  required: true,
                  message: '请输入满减金额'
                },{
                  validator: (rule, value, callback) => {
                      if (formData.ladder[index].useCondition < value || formData.ladder[index].useCondition === value) {
                        callback('优惠内容需要小于使用门槛中使用商品范围内满减金额')
                      }
                      callback();
                  }
                }]"
              >           
              <a-input-number
                :precision="2"
                :disabled="type === 'look' || type === 'verify'"
                style="width: 120px; margin: 0 10px 0 25px;"
                :min="0"
                v-model='formData.ladder[index].couponAmount'
                />
                <span style="position: absolute;left: 0">减</span>
                元
            </a-form-model-item>
            <a-button v-if="index === 0" @click="addLadder" style="position: absolute; top: 10px;right: 10px;" type="primary" :disabled="type === 'look' || formData.ladder.length > 19 || type === 'verify'">
              添加阶梯
            </a-button>
            <a-button v-else @click="decreseLadder(item)" style="position: absolute; top: 10px;right: 10px;" type="danger" :disabled="type === 'look' || type === 'verify'">
              删除
            </a-button>
          </div>
        </div>
      </a-form-model>
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
      modalShow: false,
      formData: {
        name: '', // 活动名称
        dateRange: [], // 活动时间 [moment(editData.validStartTime), moment(editData.validEndTime)]
        googsType: 0, // 适用商品类型
        goodIds: [], // 选择商品id数组
        type: 0, // 优惠设置类型
        useCondition: '', // 优惠券门槛
        couponAmount: '', // 满减金额
        ladder: [{useCondition: '', couponAmount: ''}], // 满减数据级
      },
    }
  },
  computed: {
    formRule() {
      const formData = this.formData;
      const rule = {
        name: [{ required: true, message: '请输入活动名称' }],
        dateRange: [{ required: true, message: '请输入活动时间' }],
        googsType: [{ required: true, message: '请选择类型' }],
        type: [{ required: true, message: '请选择类型' }],
        useCondition: [{ required: true, message: '请输入优惠门槛' }],
        couponAmount: [{ required: true, message: '请输入满减金额' },
                      {
                        validator: (rule, value, callback) => {
                            if (formData.useCondition < value || formData.useCondition === value) {
                              callback('优惠内容需要小于使用门槛中使用商品范围内满减金额')
                            }
                            callback();
                        }
                      }]
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
          method: "infoSaleActivity"
        })
        .then(res => {
          const data = res.data.data
          console.log(id, data)
          this.formData = {
            id,
            ...data,
            dateRange: data.validStartTime ? [moment(data.validStartTime), moment(data.validEndTime)] : [],
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
      console.log(productList, this.formData.goodIds)
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
    changeType(val) {
      console.log(val)
      this.formData.ladder = [{useCondition: '', couponAmount: ''}]
    },
    addLadder() {
      const newArr = this.formData.ladder.concat([{useCondition: '', couponAmount: ''}])
      this.formData.ladder = newArr
    },
    decreseLadder(index) {
      const newArr = this.formData.ladder.filter((item, ind) => {
        return ind !== index
      });
      this.formData.ladder = newArr
    },
    save() {
      this.$refs.storeForm.validate((valid) => {
        if (valid) {
          let data = {
            ...this.formData,
            validStartTime: moment(this.formData.dateRange[0]).format('YYYY-MM-DD'),
            validEndTime: moment(this.formData.dateRange[1]).format('YYYY-MM-DD'),
          }
          if(this.formData.type === 1) {
            delete data.ladder;
          }
          console.log(this.formData, data)
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
