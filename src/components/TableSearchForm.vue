<template>
  <div class="searchStyel">
    <a-form layout="inline" :form="form" @submit="handleSubmit">
      <a-form-item v-for="(item,index) in formList" :key="index" :label="item.label">
        <a-range-picker v-if="item.type=='datePicker'" :format="item.format?item.format:'YYYY-MM-DD'" style="width:240px" v-decorator="[
              item.name,
            ]" allowClear :ranges="item.ranges" />
        <!-- :style='{"width":item.width?"120px": item.width }' -->
        <a-select :allowClear="item.allowClear" v-if="item.type=='select'" :dropdownMatchSelectWidth="false" v-decorator="[
               item.name,
              { initialValue: '' }
            ]" style="min-width:170px;">
          <a-select-option v-for="(item,index) in item.child" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select :allowClear="item.allowClear" showSearch optionFilterProp="children" :filterOption="false" v-if="item.type=='searchSelect'" v-decorator="[
               item.name,
              { initialValue: '' }
            ]" style="min-width:170px;">
          <a-select-option v-for="(item,index) in item.child" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-input-group compact v-if="item.type=='compact'">
          <a-select v-decorator="[
              item.name,
              { initialValue: item.child[0].value }
            ]" :dropdownMatchSelectWidth="false">
            <a-select-option v-for="(item,index) in item.child" :key="index" :label="item.label" :value="item.value" allowClear>{{item.label}}</a-select-option>
          </a-select>
          <a-input v-if="item.compact=='input'" v-decorator="[
               'queryContent'
              ]" style="width: 170px" placeholder="请输入" allowClear />
          <a-range-picker style="width:240px" v-if="item.compact=='datePicker'" :format="item.format?item.format:'YYYY-MM-DD'" v-decorator="[
              'inputTimeArr',
            ]" allowClear />
        </a-input-group>
        <a-input v-if="item.type=='input'" v-decorator="[
            item.name
          ]" style="width: 170px" placeholder="请输入" allowClear />
        <a-input-group compact v-if="item.type=='inputRange'">
          <a-input style=" width: 70px; text-align: center" placeholder="" v-decorator="[
            item.name[0]
          ]" />
          <a-input style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff" placeholder="~" disabled />
          <a-input style="width: 70px; text-align: center; border-left: 0" placeholder="" v-decorator="[
            item.name[1]
          ]" />
        </a-input-group>

        <a-input-group compact v-if="item.type=='inputNumberRange'">
          <a-input-number style=" width: 70px; text-align: center" :min="0" placeholder="" v-decorator="[
            item.name[0]
          ]" />
          <a-input style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff" placeholder="~" disabled />
          <a-input-number :min="0" style="width: 70px; text-align: center; border-left: 0" placeholder="" v-decorator="[
            item.name[1]
          ]" />
        </a-input-group>

      </a-form-item>
      <a-form-item>
        <a-button type="default" @click="handleSubmit">筛选</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: {
    formList: {
      type: Array,
      default: []
    },
    orderName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: "transationFlow" })
      // changeName: ""
    };
  },
  created() {
    
  },
  mounted() {
    console.log(this.formList)
    const that = this;
    this.formList.forEach((item) => {
        if(item.name != null && item.defaultValue) {
          that.form.setFieldsValue({
            [item.name]: item.defaultValue
          })
          console.log(item.name, item.defaultValue)
        }
    })
  },
  methods: {
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          // 时间数组处理
          let dateTimeArr = this.filterDateTime();
          if (dateTimeArr && dateTimeArr.length) {
            dateTimeArr.map(item => {
              values[item.name] &&
                (values[item.name] = values[item.name].map(it => {
                  return it.format(item.format ? item.format : "YYYY-MM-DD");
                }));
            });
          }
          console.log("tableSearchForm=====", values);

          // // 文本框 select 選擇
          // values[values.change] = values.changeInput
          // delete values.change
          // delete values.changeInput

          // 时间 select 选择
          this.$emit("handleSubmit", values);
        }
      });
    },
    filterOption(input, option) {
      console.log(option)
        return (
          option.componentOptions.children[0].label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },
    filterDateTime() {
      let dateTimeArr = this.formList.filter((item, index) => {
        return item.type == "datePicker" || item.compact == "datePicker";
      });
      return dateTimeArr;
    }
  },
  watch:{
    formList: {
        handler(ee) {
          const that = this;
          this.formList.forEach((item) => {
              if(item.name != null && item.defaultValue) {
                that.form.setFieldsValue({
                  [item.name]: item.defaultValue
                })
                console.log(item.name, item.defaultValue)
              }
          })
        },
        deep: true
    },
  }
};
</script>
<style lang="less" scoped>
.searchStyel {
  // border: 1px solid #ddd;
  // border-bottom: 1px solid #ddd;
  // background: #fff;
  margin-bottom: -10px;
  padding-top: 10px;
  padding-left: 10px;
  min-height: 60px;
}
</style>
