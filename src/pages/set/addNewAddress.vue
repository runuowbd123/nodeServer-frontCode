<template>
  <div style="background: #fff; padding: 20px 0;">
    <a-form :form="form">
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="联系人"
      >
        <a-input
          v-decorator="[
            'name',
            { 
              initialValue: formData.name,
              rules: [{ required: true, message: '请输入联系人' }] },
          ]"
          placeholder="请填写联系人姓名"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="联系方式"
      >
        <a-input
          v-decorator="[
            'phone',
            { 
              initialValue: formData.phone,
              rules: [{ required: true, validator: checkPhone }] },
          ]"
          placeholder="请填写手机号"
        />
      </a-form-item>
       <a-form-item :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="联系地址"
      >
        <a-cascader :fieldNames="{ label: 'name', value: 'name', children: 'districts' }" :options="citys" placeholder="请选择省/市/区" v-decorator="[
              'adress',
              {
                initialValue: formData.adress,
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
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="详细地址"
      >
        <a-textarea
          maxlength="100"
          v-decorator="[
            'detailAddress',
            { 
              initialValue: formData.detailAddress,
              rules: [{ required: true, message: '请输入详细地址' }] },
          ]"
          placeholder="请填写详细地址，比如街道名称，门牌号等信息"
          :autosize="{ minRows: 5, maxRows: 5 }"
        />
      </a-form-item>
      <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
        <a-checkbox v-model="formData.isDefault" v-decorator="[
            'isDefault',
            {initialValue: formData.isDefault}
          ]" @change="handleChange">
          设为默认地址
        </a-checkbox>
      </a-form-item>
      <div style="display: flex; flex-direction: row-reverse;padding-right: 20px;">
        <a-button type="primary" @click="saveInfo">
          保存
        </a-button>
      </div>
    </a-form>
  </div>
</template>
<script>
import api from "@/api/user";
import citys from "@/assets/json/list.json";
export default {
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 8 },
      },
      formTailLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 8, offset: 4 },
      },
      form: this.$form.createForm(this, { name: 'dynamic_rule' }),
      formData: {
        name: '',
        phone: '',
        adress: [],
        detailAddress: '',
        isDefault: false
      },
      citys: citys
    };
  },
  created() {
    let id = this.$route.query.id;
    if (id) {
      console.log(id)
      this.getInfo(id);
    }
  },
  methods: {
    saveInfo() {
      this.form.validateFields((err, values) => {
        if (!err) {
          let data = {
            id: this.$route.query.id  ? this.$route.query.id : null,
            name: values.name,
            phone: values.phone,
            province: values.adress[0],
            city: values.adress[1],
            area: values.adress[2],
            detailAddress: values.detailAddress,
            isDefault: values.isDefault ? 1 :0,
            type: this.$route.query.id ? 1 : 0
          }
          api
            .ajax({
              data,
              method: "createOrEditAddress"
            })
            .then(res => {
              const data = res.data.data;
              this.$message.success(data);
              this.$router.go(-1);
            })
            .catch(error => {
              console.log("error", error);
            });
        }
      });
    },
    cascaderChange(value, selectedOptions) {
      console.log(value, selectedOptions)
    },
    checkPhone (rule, value, callback) {
      let rexp= /^(0?1[123456789]\d{9})$/
      if (value) {
        if (!rexp.test(value)) {
          callback('手机号码格式不正确！')
        }
      } else {
        callback('请输入手机号');
      }
      callback();   
    },
    handleChange(e) {
      this.checkAdress = e.target.checked;
      this.$nextTick(() => {
        this.form.validateFields(['nickname'], { force: true });
      });
    },
    getInfo(id) {
      let data = {
        id: id
      }
      api
        .ajax({
          data,
          method: "detailAddr"
        })
        .then(res => {
          const data = JSON.parse(JSON.stringify(res.data.data));
          data.adress = [data.province, data.city, data.area];
          data.isDefault ? data.isDefault = true : data.isDefault = false;
          this.formData = data;
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  },
}
</script>

