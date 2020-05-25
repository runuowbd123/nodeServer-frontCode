<template>
  <div class="drawal__Box">
    <a-form :form="form1">
      <div class="_tips">
        本次提现金额将提至公司企蜂云收益账户内
      </div>
      <div class="tips_item">
        <div class="label fl">店铺名称：</div>
        <div class="comtent">{{ info.shopName }}</div>
      </div>
      <div class="tips_item">
        <div class="label fl">提现账户：</div>
        <!-- <div class="comtent">{{ info.orgName }}</div> -->
        <div class="comtent">企蜂云收益账户</div>
      </div>
      <div class="tips_item">
        <div class="label fl">可提现金额：</div>
        <div class="comtent">
          <span class="num">{{ info.balanceAmount }} 元</span>
        </div>
      </div>
      <div class="tips_item">
        <div class="label label1 fl">本次提现：</div>
        <div class="comtent">
          <a-form-item class="mar" :colon="false">
            <a-input-number :precision="2" class="width221" :min="1" :max="info.balanceAmount" v-decorator="[
                'money',
                {
                  initialValue: money,
                  rules: [
                    {
                      required: true,
                      message: '请填写提现金额'
                    }
                  ]
                }
              ]" />
          </a-form-item>
        </div>
      </div>
      <div class="tips_item">
        <!-- <div class="label label1 fl">到账银行卡：</div>
        <div class="comtent">
          <a-form-item class="mar" :class="{marnone:!listBank.length}" :colon="false">
            <a-radio-group v-decorator="[
                'bankId',
                {
                  initialValue: bankId,
                  rules: [
                    {
                      required: true,
                      message: '请选择银行卡'
                    }
                  ]
                }
              ]">
              <a-row class="row-radio" v-for="(itm, idx) in listBank" :key="idx">
                <a-radio :value="itm.id">
                  <span style="font-size:12px;">{{ itm.bankName }}-尾号{{ itm.bankAccount.substr(-4) }}</span>
                </a-radio>
                <span class="cc" @click="edit(itm, idx)">修改</span> |
                <span class="cc" @click="deleteConfirm(itm, idx)">删除</span>
              </a-row>
            </a-radio-group>
            <div><span class="cc" @click="add">添加银行卡</span></div>
          </a-form-item>

        </div> -->

        <div class="tips_item" style="margin-top:20px;">
          <div class="label fl">手机号：</div>
          <div class="comtent">{{ info.phone }}&nbsp;</div>
        </div>
        <div class="tips_item">
          <div class="label label1 fl">验证码：</div>
          <div class="comtent">
            <a-form-item class="mar" :colon="false">
              <a-input class="width221" type="tel" :maxLength="6" v-decorator="[
                  'code',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入验证码'
                      }
                    ]
                  }
                ]" />
              <a-button type="primary" @click="getCode">获取</a-button>
            </a-form-item>
          </div>
        </div>
        <div class="tips_item2">
          <a-button type="primary" size="large" @click="save">确认提现</a-button>
        </div>
      </div>
    </a-form>

    <a-modal title="添加客户" v-if="addShow" :visible="addShow" @ok="handleOk" @cancel="handleCancel">
      <a-form :form="form">
        <a-form-item label="提现银行开户名：" :colon="false" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
          <a-input class="width200" v-decorator="[
              'openName',
              {
                initialValue: editObj.openName,
                rules: [
                  {
                    required: true,
                    message: '请填写提现银行开户名'
                  }
                ]
              }
            ]" />
        </a-form-item>
        <a-form-item label="提现银行账号：" :colon="false" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
          <a-input class="width200" v-decorator="[
              'bankAccount',
              {
                initialValue: editObj.bankAccount,
                rules: [
                  {
                    required: true,
                    message: '请填写提现银行账号'
                  }
                ]
              }
            ]" />
        </a-form-item>

        <a-form-item label="提现银行名称：" :colon="false" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
          <a-input class="width200" v-decorator="[
              'bankName',
              {
                initialValue: editObj.bankName,
                rules: [
                  {
                    required: true,
                    message: '请填写提现银行名称'
                  }
                ]
              }
            ]" />
        </a-form-item>

        <a-form-item label="提现银行开户行：" :colon="false" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
          <a-input class="width200" v-decorator="[
              'openBank',
              {
                initialValue: editObj.openBank,
                rules: [
                  {
                    required: true,
                    message: '请填写提现银行开户行'
                  }
                ]
              }
            ]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import api from "@/api/user";
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: "save" }),
      form1: this.$form.createForm(this, { name: "save1" }),
      info: {},
      listBank: [],
      // shopData: {},
      addShow: false,
      editObj: {
        openName: "",
        bankAccount: "",
        bankName: "",
        openBank: ""
      },
      money: "",
      applyPhone: "",
      bankId: "",
      code: "",
      codeId: ""
    };
  },
  created() {
    this.getDetail();
    // this.getShop();
  },
  methods: {
    getDetail() {
      api
        .ajax({
          data: {},
          method: "listBankRecord"
        })
        .then(res => {
          const data = res.data.data;
          console.log(data)
          this.info = data;
          this.applyPhone = data.phone;
          this.listBank = data.data;
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    getShop() {
      api
        .ajax({
          data: {},
          method: "shopSurvey"
        })
        .then(res => {
          const data = res.data.data;
          this.shopData = data;
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    add() {
      this.addShow = true;
    },
    edit(record, index) {
      this.addShow = true;
      this.editObj = record;
    },
    deleteConfirm(record, index) {
      this.$confirm({
        title: "删除",
        content: "对该条银行账户进行删除",
        onOk: () => {
          api
            .ajax({
              data: { id: record.id },
              method: "delBankRecord"
            })
            .then(res => {
              this.$message.info(res.data.data);
              this.listBank.splice(index, 1);
            })
            .catch(error => {
              console.log("error", error);
            });
        }
      });
    },
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let data = values;
          this.editObj.id && (data.id = this.editObj.id);
          api
            .ajax({
              data,
              method: "saveBankRecord"
            })
            .then(res => {
              this.$message.info(res.data.message);
              this.getDetail();
              setTimeout(() => {
                this.handleCancel();
              }, 1500);
            })
            .catch(() => {
              console.log("error");
            });
        }
      });
    },
    handleCancel(e) {
      this.addShow = false;
      this.editObj = {
        openName: "",
        bankAccount: "",
        bankName: "",
        openBank: ""
      };
    },
    getCode() {
      api
        .ajax({
          data: {
            phone: this.info.phone
          },
          method: "sendSmsCode"
        })
        .then(res => {
          this.$message.info(res.data.message);
          this.codeId = res.data.data.codeId;
        })
        .catch(() => {
          console.log("error");
        });
    },
    save(e) {
      e.preventDefault();
      this.form1.validateFields((err, values) => {
        if (!err) {
          api
            .ajax({
              data: {
                // bankId: values.bankId,
                money: values.money,
                applyPhone: this.applyPhone,
                checkCode: values.code,
                codeId: this.codeId
              },
              method: "saveWithdrawRecord"
            })
            .then(res => {
              this.$message.info(res.data.message);
              this.$router.go(-1)
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
.drawal__Box {
  background: rgba(255, 255, 255, 1);
  padding: 10px;
  ._tips {
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #c7d9fd;
    border-radius: 5px;
    font-size: 12px;
    color: #3e7bf8;
    margin-bottom: 60px;
  }
  .tips_item {
    padding-bottom: 30px;
    line-height: 30px;
    .label {
      width: 100px;
      text-align: right;
    }
    .label1::before {
      display: inline-block;
      margin-right: 4px;
      color: #f5222d;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: "*";
    }
    .comtent {
      margin-left: 110px;
      .mar {
        margin-bottom: 0;
        vertical-align: top;
        .ant-form-item-control {
          line-height: 30px;
        }
      }
      .marnone {
        .ant-radio-group {
          display: inline;
          overflow: hidden;
        }
      }
      .ant-btn-primary {
        vertical-align: top;
      }
      & > .num {
        display: inline-block;
        vertical-align: top;
        font-size: 24px;
        font-weight: bold;
        color: red;
      }
      .row-radio {
        margin-bottom: 20px;
        line-height: 30px;
      }
      .cc {
        color: #3e7bf8;
        cursor: pointer;
        font-size: 14px;
      }
      .width221 {
        width: 221px;
        margin-right: 20px;
        vertical-align: top;
      }
    }
  }
  .tips_item2 {
    padding-left: 328px;
    padding-top: 30px;
  }
}
</style>
