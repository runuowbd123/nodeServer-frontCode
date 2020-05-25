<template>
  <div class="tag-form">
    <a-form-model :model="formData" ref="form" :rules="formRule">
      <a-form-model-item
        :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
        label="标签名称"
        prop="name"
      >
        <a-input style="width: 200px" v-model="formData.name" placeholder="请输入标签名称"/>
      </a-form-model-item>
      <a-form-model-item
        :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
        label="标签类型"
        prop="type"
      >
        <a-radio-group
          :options="typeList"
          :disabled="edit"
          v-model="formData.type"
        />
      </a-form-model-item>
      <div v-if="formData.type == 1">
      <!-- <div v-if="true"> -->
        <a-form-model-item label="满足条件" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-radio-group
            :options="conditionList"
            v-model="formData.matchCondition"/>
        </a-form-model-item>
        <a-row>
          <a-col :span="4"></a-col>
          <a-col :span="20">
            <div style="display: flex">
              <a-form-model-item :label="null" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" style="width: 150px">
                <a-checkbox
                  v-model="formData.latelyConsumeStatus"
                >
                  最近消费时间
                </a-checkbox>
              </a-form-model-item>
              <a-form-model-item :label="null" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" prop="dateRange">
                <a-range-picker
                  v-model="formData.dateRange"
                />
              </a-form-model-item>
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4"></a-col>
          <a-col :span="20">
            <div style="display: flex;">
              <a-form-model-item :label="null" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" style="width: 150px">
                  <a-checkbox
                    v-model="formData.consumeNumberStatus"
                  >
                    累计消费次数
                  </a-checkbox>
                </a-form-model-item>
                <a-form-model-item :label="null" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" prop="minConsumeNumber">
                  <a-input-number
                    style="width:90px"
                    :min="0"
                    v-model="formData.minConsumeNumber"
                  />
                </a-form-model-item>
                <div style="margin: 8px 0 0 5px">次</div>
                <div style="margin: 8px 15px 0">-</div>
                <a-form-model-item :label="null" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" prop="maxConsumeNumber">
                  <a-input-number
                    style="width:90px"
                    :min="0"
                    v-model="formData.maxConsumeNumber"
                  />
                </a-form-model-item>
                <div style="margin: 8px 0 0 5px">次</div>
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4"></a-col>
          <a-col :span="20">
            <div style="display: flex;">
              <a-form-model-item :label="null" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" style="width: 150px">
                <a-checkbox
                  v-model="formData.consumeAmoutStatus"
                >
                  累计消费金额
                </a-checkbox>
              </a-form-model-item>
              <a-form-model-item :label="null" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" prop="minConsumeAmout">
                <a-input-number
                  :min="0"
                  style="width:90px"
                  v-model="formData.minConsumeAmout"
                />
              </a-form-model-item>
              <div style="margin: 8px 0 0 5px">元</div>
              <div style="margin: 8px 15px 0">-</div>
              <a-form-model-item :label="null" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" prop="maxConsumeAmout">
                <a-input-number
                  :min="0"
                  style="width:90px"
                  v-model="formData.maxConsumeAmout"
                />
              </a-form-model-item>
              <div style="margin: 8px 0 0 5px">元</div>
            </div>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="4"></a-col>
          <a-col :span="20">
            <div style="display: flex;">
              <a-form-model-item :label="null" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" style="width: 150px">
                  <a-checkbox
                    v-model="formData.customerUnitPriceStatus"
                  >
                    客单价
                  </a-checkbox>
                </a-form-model-item>
                <a-form-model-item :label="null" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" prop="minCustomerUnitPrice">
                  <a-input-number
                    :min="0"
                    style="width:90px"
                    v-model="formData.minCustomerUnitPrice"
                  />
                </a-form-model-item>
                <div style="margin: 8px 0 0 5px">元</div>
                <div style="margin: 8px 15px 0">-</div>
                <a-form-model-item :label="null" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" prop="maxCustomerUnitPrice">
                  <a-input-number
                    :min="0"
                    style="width:90px"
                    v-model="formData.maxCustomerUnitPrice"
                  />
                </a-form-model-item>
                <div style="margin: 8px 0 0 5px">元</div>
            </div>
          </a-col>
        </a-row>

      </div>
    </a-form-model>
    <div style="display: flex; flex-direction: row-reverse; margin-top: 50px">
      <a-button type="primary" @click="save" style="margin-left: 20px">保存</a-button>
      <a-button @click="cancel">取消</a-button>
    </div>
  </div>
</template>
<script>
import api from "@/api/user";
import moment from 'moment';
export default {
  data() {
    return {
      moment,
      edit: false,
      typeList: [
        {
          label: '手动标签',
          value: 0
        },
        {
          label: '自动标签',
          value: 1
        }
      ],
      conditionList: [
        {
          label: '满足任意一个被选中的条件即可',
          value: 0
        },
        {
          label: '必须满足所有被选中的条件',
          value: 1
        }
      ],
      formData: {
        name: '',
        type: 0,
        matchCondition: 0,
        latelyConsumeStatus: false,
        dateRange: [],
        consumeNumberStatus: false,
        minConsumeNumber: null,
        maxConsumeNumber: null,
        consumeAmoutStatus: false,
        minConsumeAmout: null,
        maxConsumeAmout: null,
        minCustomerUnitPrice: null,
        maxCustomerUnitPrice: null
      },
    }
  },
  computed: {
    formRule() {
      const formData = this.formData;
      let rule = {
        name: [{ required: true, message: '请输入标签名称' }, { max: 20, message: '最多输入20个字符' }],
        dateRange: [{ required: formData.latelyConsumeStatus, message: '请填写日期' },
                    {
                      validator: (rule, value, callback) => {
                          if (formData.latelyConsumeStatus && value.length < 1) {
                            callback('请填写日期');
                          }
                          callback();
                      }
                    }],
        minConsumeNumber: [{ required: formData.consumeNumberStatus, message: '请填写次数' }],
        maxConsumeNumber: [{ required: formData.consumeNumberStatus, message: '请填写次数' }],
        minConsumeAmout: [{ required: formData.consumeAmoutStatus, message: '请填写金额' }],
        maxConsumeAmout: [{ required: formData.consumeAmoutStatus, message: '请填写金额' }],
        minCustomerUnitPrice: { required: formData.customerUnitPriceStatus, message: '请填写金额' },
        maxCustomerUnitPrice: { required: formData.customerUnitPriceStatus, message: '请填写金额' },
      }
      return rule
    },
  },
  created() {
    console.log(this.$route);
    this.edit = !! this.$route.query.edit
    if(this.edit) {
      this.getData()
    }
  },
  methods: {
    getData() {
      const id = this.$route.query.id
      api
        .ajax({
          data: {
            tagId: id
          },
          method: "tagDetail"
        })
        .then(res => {
          console.log(res);
          const data = res.data.data
          this.formData = {
            id,
            ...data,
            latelyConsumeStatus: !!data.latelyConsumeStatus,
            consumeNumberStatus: !!data.consumeNumberStatus,
            consumeAmoutStatus: !!data.consumeAmoutStatus,
            customerUnitPriceStatus: !!data.customerUnitPriceStatus,
            dateRange: data.latelyConsumeStartDate ? [moment(data.latelyConsumeStartDate), moment(data.latelyConsumeEndDate)] : []
          };
        })
        .catch(() => {
          console.log("error");
        });
    },
    save() {
      this.$refs.form.validate((valid, err) => {
        if (valid) {
          if (this.edit) {
            if (this.formData.type == 1) {
              // 编辑自动标签
              const data = {
                ...this.formData,
                latelyConsumeStartDate: this.formData.latelyConsumeStatus ? moment(this.formData.dateRange[0]).format('YYYY-MM-DD') : null,
                latelyConsumeEndDate: this.formData.latelyConsumeStatus ? moment(this.formData.dateRange[1]).format('YYYY-MM-DD') : null,
                latelyConsumeStatus: this.formData.type == 1 ? (this.formData.latelyConsumeStatus ? 1 : 0) : null,
                consumeNumberStatus: this.formData.type == 1 ? (this.formData.consumeNumberStatus ? 1 : 0) : null,
                consumeAmoutStatus: this.formData.type == 1 ? (this.formData.consumeAmoutStatus ? 1 : 0) : null,
                customerUnitPriceStatus: this.formData.type == 1 ? (this.formData.customerUnitPriceStatus ? 1 : 0) : null,
              }
              console.log(data, this.edit, this.formData)
              api
                .ajax({
                  data,
                  method: "editAutoCustomerTag"
                })
                .then(res => {
                  this.$message.info(res.data.data);
                  this.$router.go(-1)
                })
                .catch(() => {
                  console.log("error");
                });
            } else {
              // 编辑手动标签
              const data = {
                ...this.formData,
              }
              console.log(data, this.edit, this.editData)
              api
                .ajax({
                  data,
                  method: "editManualCustomerTag"
                })
                .then(res => {
                  this.$message.success(res.data.data);
                  this.$router.go(-1)
                })
                .catch(() => {
                  console.log("error");
                });
            }


          } else {
            const data = {
              ...this.formData,
              latelyConsumeStartDate: this.formData.latelyConsumeStatus ? moment(this.formData.dateRange[0]).format('YYYY-MM-DD') : null,
              latelyConsumeEndDate: this.formData.latelyConsumeStatus ? moment(this.formData.dateRange[1]).format('YYYY-MM-DD') : null,
              latelyConsumeStatus: this.formData.type == 1 ? (this.formData.latelyConsumeStatus ? 1 : 0) : null,
              consumeNumberStatus: this.formData.type == 1 ? (this.formData.consumeNumberStatus ? 1 : 0) : null,
              consumeAmoutStatus: this.formData.type == 1 ? (this.formData.consumeAmoutStatus ? 1 : 0) : null,
              customerUnitPriceStatus: this.formData.type == 1 ? (this.formData.customerUnitPriceStatus ? 1 : 0) : null,
            }
            console.log(data, this.edit, this.formData)
            api
              .ajax({
                data,
                method: "createCustomerTag"
              })
              .then(res => {
                this.$message.info(res.data.data);
                this.$router.go(-1)
              })
              .catch(() => {
                console.log("error");
              });
          }
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
};
</script>
<style lang="less" scoped>
  .tag-form {
    background: #fff;
    padding: 60px 50px;
  }
</style>
