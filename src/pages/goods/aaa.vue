<template>
  <div class="goodsedit01__Box">
    <a-row class="step__box">
      <a-col class="step1" :span="12"><span>1</span> 编辑基本信息 </a-col>
      <a-col class="step" :span="12"><span>2</span> 编辑商品详情 </a-col>
    </a-row>
    <a-form class="step__form" :form="form">
      <!-- <a-form-item label="商品规格" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="" extra="如有颜色、尺码等多种规格，请添加商品规格">
          <a-radio-group v-decorator="[
          'ruleType',
            {
              initialValue: formData.ruleType,
              rules: [
                { required: true, message: '请选择商品规格!' }
              ]
            }
          ]" @change="changeRuleType">
            <a-radio value="single">
              统一规格
            </a-radio>
            <a-radio value="more">
              多规格
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <div class="attrList-content" v-for="(item, index) in formData.attrAndSkuList.attrList" :key="index">
          <a-icon class="close-icon" v-if="formData.attrAndSkuList.attrList.length > 1" type="close-circle" @click="deleteRule(index)" />
          <a-form-item label="规格名" style="display:flex;width: 100%;">
            <a-input v-decorator="[
              `attrKeyName${index}`,
              {
                initialValue: item.attrKeyName,
                validateTrigger: ['change', 'blur'],
                rules: [
                  { 
                    required: true,
                    whitespace: true,
                    message: '请输入规格名',
                  }
                ]
              }
            ]" @input="setRuleName($event,index)" @blur="setdata($event,index)" />
          </a-form-item>
          <a-form-item style="display:flex;width: 100%;">
            <span class="rule-label" slot="label">规格值</span>
              <div style="display:flex;width:100%;flex-wrap:wrap;flex-shrink: 0;">
                <a-form-item v-for="(obj, ind) in item.valueList" :key="ind" style="margin-right:20px;width:90px;flex-shrink: 0;">
                  <div class="rule-box">
                    <a-input v-decorator="[
                      `attrKeyName${index}attrValueName${ind}`,
                      {
                        initialValue: obj.attrValueName,
                        validateTrigger: ['change', 'blur'],
                        rules: [
                          { 
                            required: true,
                            whitespace: true,
                            message: '请输入规格值',
                          }
                        ]
                      }
                    ]" @input="setRuleValue($event,index,ind)" @blur="setdata($event,index,ind)" />
                    <a-icon class="close-icon" v-if="item.valueList.length > 1" type="close-circle" @click="deleteRuleValue(index, ind)" />
                  </div>
                </a-form-item>
              </div>
              <span class="add-rule-value" style="flex-shrink: 0;color: #1890ff;cursor:pointer;user-select: none;" @click="addRuleValue(index)">添加规格值</span>
          </a-form-item>
        </div>
        <a-button style="margin-bottom:20px;" @click="addattrList" v-if="formData.ruleType === 'more' && formData.attrAndSkuList.attrList.length < 3">添加商品规格</a-button>
        <table style="border:1px solid #d9d9d9;width:100%">
          <thead>
            <tr>
              <th :style="'border:1px solid #d9d9d9;text-align:center;width:' + (100 / ruleDetailColumns.length) + '%'" v-for="(item, index) in ruleDetailColumns" :key="index" v-if="item.title" >
                <span v-if="item.key === 'price'">
                  <span class="mark red">*</span>
                  价格
                </span>
                <span v-else-if="item.key === 'number'">
                  <span class="mark red">*</span>
                  库存
                  <a-tooltip placement="topLeft">
                    <template slot="title">
                      <span>此处库存仍然为商品的可售卖库存，可以直接进行修改，修改后，买家看到的商品可售库存数量会进行变化</span>
                    </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                </span>
                <span v-else-if="item.key === 'costPrice'">
                  成本价
                  <a-tooltip placement="topLeft">
                    <template slot="title">
                      <span>成本价未来会用于营销建议，利润分析等</span>
                    </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                </span>
                <span v-else>{{item.title}}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in ruleDetailData" :key="index">
              <td style="border:1px solid #d9d9d9;text-align:center;" v-for="(val, key, ind) in item" v-if="key !== 'rowspan'" :key="ind" :rowspan="val.split('&&')[1] || 1">
                <a-form-item style="margin:24px auto;width:80%;" v-if="key === 'price'" label="">
                  <a-input v-decorator="[
                    `price${index}`,
                    {
                      initialValue: '',
                      validateTrigger: ['change', 'blur'],
                      rules: [
                        { 
                          required: true,
                          whitespace: true,
                          message: '请输入价格',
                        }
                      ]
                    }
                  ]" />
                </a-form-item>
                <a-form-item style="margin:24px auto;width:80%;" v-else-if="key === 'number'" label="">
                  <a-input v-decorator="[
                    `number${index}`,
                    {
                      initialValue: '',
                      validateTrigger: ['change', 'blur'],
                      rules: [
                        { 
                          required: true,
                          whitespace: true,
                          message: '请输入库存',
                        }
                      ]
                    }
                  ]" />
                </a-form-item>
                <a-form-item style="margin:24px auto;width:80%;" v-else-if="key === 'costPrice'" label="">
                  <a-input v-decorator="[
                    `costPrice${index}`,
                    {
                      initialValue: '',
                      validateTrigger: ['change', 'blur'],
                      rules: [
                        { 
                          required: true,
                          whitespace: true,
                          message: '请输入成本价',
                        }
                      ]
                    }
                  ]" />
                </a-form-item>
                <span v-else>{{val.split('&&')[0]}}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </a-form-item> -->
      <a-form-item v-for="(item, index) in testArr" :key="index" :label="item.label" style="display:flex;width: 100%;">
        <a-input v-decorator="[
          `attrKeyName${index}`,
          {
            initialValue: item.name,
            validateTrigger: ['change', 'blur'],
            rules: [
              { 
                required: true,
                whitespace: true,
                message: '请输入',
              }
            ]
          }
        ]" />
      </a-form-item>
      <a-form-item label=" " :colon="false" :label-col="{ span: 15 }" :wrapper-col="{ span: 9 }">
        <a-button @click="save">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import api from "@/api/user";
import moment from "moment";
import utils from "@/util/common";
export default {
  props: ["goodsId"],
  data() {
    return {
      form: this.$form.createForm(this, { name: "save" }),
      info: {},
      tableRowNumHandle: 1,
      tableRowNum: 1,
      goodType: 0,
      ruleDetailColumns: [
        {
          dataIndex: 'price',
          key: 'price',
          title: 'price'
        },
        {
          dataIndex: 'number',
          key: 'number',
          title: 'number'
        },
        {
          dataIndex: 'costPrice',
          key: 'costPrice',
          title: 'costPrice'
        }
      ],
      ruleDetailData: [],
      ruleDetailColumnsHandle: [
        {
          dataIndex: 'price',
          key: 'price',
          title: 'price'
        },
        {
          dataIndex: 'number',
          key: 'number',
          title: 'number'
        },
        {
          dataIndex: 'costPrice',
          key: 'costPrice',
          title: 'costPrice'
        }
      ],
      ruleDetailDataHandle: [],
      formData: {
        attrAndSkuList: {
          attrList: [],
          skuList: []
        },
      },
      testArr: []
    };
  },
  created() {
    this.form.getFieldDecorator('attrAndSkuList', { initialValue: {attrList:[]}, preserve: true });
    let obj = {};
    let arr = [];
    for (let i = 0; i < 100; i++) {
      obj = {
        label: '第' + (i + 1) + '项',
        name: ''
      }
      arr.push(obj)
    }
    this.testArr = arr;
  },
  methods: {
    changeRuleType(e) {
      this.formData.ruleType = e.target.value;
    },
    setRuleName(e, index) {
      const { form } = this;
      let attrAndSkuList = this.formData.attrAndSkuList;
      this.formData.attrAndSkuList.attrList[index].attrKeyName = e.target.value;
      attrAndSkuList.attrList[index].attrKeyName = e.target.value;
      form.setFieldsValue({
        attrAndSkuList: attrAndSkuList,
      });
      // this.setTableData();
    },
    setRuleValue(e,index,ind) {
      const { form } = this;
      let attrAndSkuList = this.formData.attrAndSkuList;
      this.formData.attrAndSkuList.attrList[index].valueList[ind].attrValueName = e.target.value;
      attrAndSkuList.attrList[index].valueList[ind].attrValueName = e.target.value;
      form.setFieldsValue({
        attrAndSkuList: attrAndSkuList,
      });
      // this.setTableData();
    },
    setdata($event,index,ind) {
      
      if (this.formData.attrAndSkuList.attrList[index].attrKeyName) {
        this.setTableData();
      }
      // if (e.target.value) {
      //   this.setTableData();
      // }
    },
    setTableData() {
      let attrList = this.formData.attrAndSkuList.attrList;
      let arr = [];
      let colunmObj = {};
      let propObj;
      let dataArr = JSON.parse(JSON.stringify(this.ruleDetailDataHandle));
      let dataObj;
      let that = this;
      let oriObj = {};
      let finalArr = [];
      let rowspan1,rowspan2;
      let num = 0;
      for (let i = 0; i < attrList.length; i++) {
        if (attrList[i].attrKeyName) {
          colunmObj = {
            title: attrList[i].attrKeyName,
            dataIndex: attrList[i].attrKeyName,
            key: attrList[i].attrKeyName,
          };
          arr.push(colunmObj);
        }
      }
      if (attrList.length === 1) {
        for (var i = 0; i < attrList[0].valueList.length; i++) {
          oriObj = {};
          oriObj[attrList[0].attrKeyName] = attrList[0].valueList[i].attrValueName + '&&' + 1;
          // oriObj.rowspan = 1;
          oriObj.price = '';
          oriObj.number = '';
          oriObj.costPrice = '';
          finalArr.push(oriObj)
        }
      }
      if (attrList.length === 2) {
        for (var i = 0; i < attrList[0].valueList.length; i++) {
          for (var j = 0; j < attrList[1].valueList.length; j++) {
            oriObj = {};
            if (j === 0) {
              oriObj[attrList[0].attrKeyName] = attrList[0].valueList[i].attrValueName + '&&' + attrList[1].valueList.length;
              oriObj[attrList[1].attrKeyName] = attrList[1].valueList[j].attrValueName + '&&' + 1;
              // oriObj.rowspan = attrList[1].valueList.length;
            } else {
              oriObj[attrList[1].attrKeyName] = attrList[1].valueList[j].attrValueName + '&&' + 1;
              oriObj.price = '';
              oriObj.number = '';
              oriObj.costPrice = '';
            }
            oriObj.price = '';
            oriObj.number = '';
            oriObj.costPrice = '';
            finalArr.push(oriObj)
          }
        }
      }
      if (attrList.length === 3) {
        for (var i = 0; i < attrList[0].valueList.length; i++) {
          for (var j = 0; j < attrList[1].valueList.length; j++) {
            for (var k = 0; k < attrList[2].valueList.length; k++) {
              oriObj = {};
              if (j === 0) {
                if (k === 0) {
                  oriObj[attrList[0].attrKeyName] = attrList[0].valueList[i].attrValueName + '&&' + attrList[1].valueList.length * attrList[2].valueList.length;
                  oriObj[attrList[1].attrKeyName] = attrList[1].valueList[j].attrValueName + '&&' + attrList[2].valueList.length;
                  oriObj[attrList[2].attrKeyName] = attrList[2].valueList[k].attrValueName + '&&' + 1;
                  // oriObj.rowspan = attrList[1].valueList.length * attrList[2].valueList.length;
                } else {
                  oriObj[attrList[2].attrKeyName] = attrList[2].valueList[k].attrValueName + '&&' + 1;
                }
              } else {
                if (k === 0) {
                  oriObj[attrList[1].attrKeyName] = attrList[1].valueList[j].attrValueName + '&&' + attrList[2].valueList.length;
                  oriObj[attrList[2].attrKeyName] = attrList[2].valueList[k].attrValueName + '&&' + 1;
                  // oriObj.rowspan = attrList[2].valueList.length;
                } else {
                  oriObj[attrList[2].attrKeyName] = attrList[2].valueList[k].attrValueName + '&&' + 1;
                }
              }
              oriObj.price = '';
              oriObj.number = '';
              oriObj.costPrice = '';
              finalArr.push(oriObj)
            }
          }
        }
      }
      console.log(finalArr)
      console.log(arr)
      this.ruleDetailColumns = arr.concat(this.ruleDetailColumnsHandle);
      this.ruleDetailData = finalArr;
      this.tableRowNum = this.tableRowNumHandle;
      // for (let x = 0; x < finalArr.length; x++) {
      //   for (let val in finalArr[x]) {}
        
      // }
      console.log(finalArr,'------------')
    },
    computedTableRow() {
      let attrList = this.formData.attrAndSkuList.attrList;
      let length1 = attrList.length;
      let tableRowNum = 1;
      for (let i = 0; i < attrList.length; i++) {
        tableRowNum = attrList[i].valueList.length * tableRowNum;
      }
      this.tableRowNumHandle = tableRowNum;
    },
    addattrList() {
      const { form } = this;
      let attrAndSkuList = this.formData.attrAndSkuList;
      if (attrAndSkuList.attrList.length >= 3) {
        this.$message.info('最多可添加3种不同规格');
        return;
      }
      let obj = {
        attrKeyName: '',
        valueList: [
          {
            attrValueName: ''
          },{
            attrValueName: ''
          },
        ]
      }
      attrAndSkuList.attrList.push(obj);
      form.setFieldsValue({
        attrAndSkuList: attrAndSkuList,
      });
      this.formData.attrAndSkuList = attrAndSkuList;
      this.computedTableRow();
    },
    deleteRule(index) {
      const { form } = this;
      let attrAndSkuList = this.formData.attrAndSkuList;
      attrAndSkuList.attrList.splice(index, 1);
      form.setFieldsValue({
        attrAndSkuList: attrAndSkuList
      });
      // let arr = form.getFieldValue('attrKeyName[0]');
      // arr.splice(index, 1);
      let obj = {};
      for (let i = 0; i < attrAndSkuList.attrList.length; i++) {
        obj['attrKeyName' + i] = attrAndSkuList.attrList[i].attrKeyName;
        for (let j = 0; j < attrAndSkuList.attrList[i].valueList.length; j++) {
          obj['attrKeyName' + i + 'attrValueName' + j] = attrAndSkuList.attrList[i].valueList[j].attrValueName;
        }
      }
      form.setFieldsValue(obj);
      // form.setFieldsValue({
      //   attrKeyName: arr
      // });

      // this.formData.attrAndSkuList = attrAndSkuList;
      this.computedTableRow();
      this.setTableData();
      // let that = this;
      // setTimeout(() => {
      //   that.$forceUpdate()
      // }, 1000)
    },
    addRuleValue(index) {
      const { form } = this;
      let attrAndSkuList = this.formData.attrAndSkuList;
      if (attrAndSkuList.attrList[index].valueList.length >= 10) {
        this.$message.info('同一级规格最多可添加10个不同规格值');
        return;
      }
      let obj = {
        attrValueName: ''
      }
      attrAndSkuList.attrList[index].valueList.push(obj);
      form.setFieldsValue({
        attrAndSkuList: attrAndSkuList,
      });
      this.computedTableRow();
    },
    deleteRuleValue(index, ind) {
      const { form } = this;
      let attrAndSkuList = this.formData.attrAndSkuList;
      attrAndSkuList.attrList[index].valueList.splice(ind, 1);
      form.setFieldsValue({
        attrAndSkuList: attrAndSkuList,
      });
      let obj = {};
      for (let i = 0; i < attrAndSkuList.attrList.length; i++) {
        obj['attrKeyName' + i] = attrAndSkuList.attrList[i].attrKeyName;
        for (let j = 0; j < attrAndSkuList.attrList[i].valueList.length; j++) {
          obj['attrKeyName' + i + 'attrValueName' + j] = attrAndSkuList.attrList[i].valueList[j].attrValueName;
        }
      }
      form.setFieldsValue(obj);
      this.computedTableRow();
      this.setTableData();
    },

    save(num) {
      this.form.validateFields((err, values) => {
        if (!err) {
          // let data = {
          //   goodsName: values.goodsName,
          //   shareDesc: values.shareDesc,
          //   realPrice: values.realPrice,
          //   originalPrice: values.originalPrice,
          //   stock: values.stock,
          //   mainPic: this.fileList[0],
          //   noMainPics: this.fileList.slice(1),
          //   showRemainStock: 1,
          //   sort: values.sort,
          //   upperSheifStatus: values.upperSheifStatus,
          //   showCard: 0,
          //   checkType: values.checkType,
          //   checkRelativeDay: values.checkRelativeDay,
          //   ruleTip: values.ruleTip,
          //   warmTip: values.warmTip
          // };
          // if (
          //   values.showRemainStock &&
          //   values.showRemainStock.indexOf(0) !== -1
          // ) {
          //   data.showRemainStock = 0;
          // }

          // if (values.showCard.indexOf(1) != -1) {
          //   data.showCard = 1;
          // }
          // if (values.upperSheifStatus === 1) {
          //   data.upperSheifTime = values.upperSheifTime.format(
          //     "YYYY-MM-DD HH:mm:ss"
          //   );
          // }
          // if (values.checkType === 0 && values.checkSellDate.length == 2) {
          //   data.checkSellEndDate = values.checkSellDate[1].format(
          //     "YYYY-MM-DD"
          //   );
          //   data.checkSellStartDate = values.checkSellDate[0].format(
          //     "YYYY-MM-DD"
          //   );
          // }
          // if (this.goodsId) {
          //   data.detailPic = this.info.detailPic;
          //   data.type = 1;
          //   data.goodsId = this.goodsId;
          //   api
          //     .ajax({
          //       data,
          //       method: "createOrEditGoods"
          //     })
          //     .then(res => {
          //       if (num == 1) {
          //         this.$emit("changeStep", 3);
          //       } else if (num == 2) {
          //         this.$emit("changeStep", 2);
          //       }
          //     })
          //     .catch(error => {
          //       console.log("error", error);
          //     });
          // } else {
          //   api
          //     .ajax({
          //       data: {},
          //       method: "obtainFutureGoodsId"
          //     })
          //     .then(res => {
          //       data.type = 0;
          //       data.goodsId = res.data.data;
          //       api
          //         .ajax({
          //           data,
          //           method: "createOrEditGoods"
          //         })
          //         .then(res => {
          //           if (num == 1) {
          //             this.$emit("changeId", res.data.data);
          //             this.$emit("changeStep", 3);
          //           } else if (num == 2) {
          //             this.$emit("changeId", res.data.data);
          //             this.$emit("changeStep", 2);
          //           }
          //         })
          //         .catch(error => {
          //           console.log("error", error);
          //         });
          //     })
          //     .catch(() => {
          //       console.log("error");
          //     });
          // }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.ant-form-item-label {
  flex-shrink: 0;
}
.ant-table-wrapper {
  background: #fff;
}
.ant-table-tbody > tr:hover>td { 
    background-color:#ffffff!important
}
.goodsedit01__Box {
  .step__box {
    & > div {
      height: 38px;
      line-height: 38px;
      text-align: center;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(243, 244, 248, 1);
      span {
        display: inline-block;
        vertical-align: top;
        font-size: 22px;
        margin-left: 5px;
      }
    }
    .step1 {
      background: url("../../assets/images/_bg01.png") no-repeat right center;
      background-size: 24px 38px;
      background-color: #76b0de;
    }
    .step {
      background-color: #f3f4f8;
      color: rgba(106, 105, 110, 1);
    }
  }
  .step__form {
    background-color: #ffffff;
    padding-top: 20px;
  }
  .attrList-content {
    background: #e0e0e0;
    position: relative;
    .rule-box {
      position: relative;
      .rule-label {
        flex-shrink: 0;
      }
    }
    .close-icon {
      font-size: 14px;
      position: absolute;
      top: -7px;
      right: -7px;
      // color: #d9d9d9;
      cursor: pointer;
      user-select: none;
      background: transparent;
      z-index: 10;
    }
  }
  .rule-label::before {
    display: inline-block;
    margin-right: 4px;
    color: #f5222d;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }
  .mark {
    display: inline-block;
    margin-right: 4px;
    color: #f5222d;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
  }
  .sub-title {
    padding: 10px 0 10px 20px;
    border-bottom: 1px solid rgba(222, 222, 222, 1);
    font-size: 16px;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 20px;
  }
  .proType {
    width: 130px;
    height: 50px;
    // border: 1px solid rgba(222, 222, 222, 1);
    text-align: center;
    font-size: 0;
    cursor: pointer;
    user-select: none;
    position: absolute;
    top: 0;
    left: 0;
    div {
      font-size: 12px;
      color: rgba(51, 51, 51, 1);
      line-height: 28px;
    }
    span {
      display: inline-block;
      vertical-align: top;
      font-size: 10px;
      line-height: 16px;
      color: #939393;
    }
  }
  .proType-sele {
    background: #1890ff;
    color: #fff;
  }
  .my-ant-upload-list {
    position: relative;
    .ant-upload.ant-upload-select-picture-card {
      margin-right: 18px;
    }
    .my-ant-upload-list-item {
      float: left;
      width: 86px;
      height: 86px;

      img {
        width: 100%;
        height: 100%;
      }
    }
    .close-delete-icon {
      position: absolute;
      right: 10px;
      top: -5px;
      cursor: pointer;
    }
  }
  .shop_pro_num {
    margin-bottom: 0;
  }
  .open_date {
    display: inline-block;
    margin-bottom: 0;
  }
  .next-step {
    margin-left: 20px;
  }
  .width200 {
    width: 200px;
  }
}
</style>
