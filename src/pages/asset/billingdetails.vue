<template>
  <div class="asset_billingdetails">
    <div class="page_table">
      <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'" :bordered="false" :pagination="false" :columns="columns" :dataSource="list" :rowKey="record => record.id">
        <span slot="billType" slot-scope="text, record, index">{{
          record.billType == 1
            ? "提现"
            : record.billType == 2
            ? "退款"
            : record.billType == 3
            ? "交易手续费"
            : record.billType == 4
            ? "订单入账"
            : ""
        }}</span>
        <span slot="dealType" slot-scope="text, record, index">{{
          record.dealType == 1 ? "微信支付" : ""
        }}</span>
      </a-table>
    </div>
    <div class="deatai">
      <div>
        <div>
          <div class="fl">
            <div class="fl-title">单号</div>
            <div class="fl-item">业务单号：{{ info.orderNum }}</div>
            <div class="fl-item">支付流水号：{{ info.serialNum }}</div>
          </div>
          <div class="fl">
            <div class="fl-title">进度</div>
            <div class="fl-item">下单时间：{{ info.orderTime }}</div>
            <div class="fl-item">入账时间：{{ info.inputTime }}</div>
          </div>
          <div class="fl">
            <div class="fl-title">财务（元）</div>
            <div class="fl-item">财务主体：{{ info.storeName}}</div>
            <div class="fl-item">店铺余额：{{ info.balance }}</div>
          </div>
        </div>
        <div class="item-title">附加信息</div>
        <div class="fl-item" style="margin-left:30px">{{ info.subjoin }}</div>
        <div class="item-title2" @click="add" v-if="$permission.hasPermission('BALANCE_BILL_EDIT')">
          <a-icon type="form" />备注：
        </div>
        
        <!-- <div class="item-title2" style="cursor: default; color: #000" v-else>
          备注：
        </div> -->
        <div class="fl-item" style="margin-left:30px;padding-bottom:60px;">
          {{ info.remark }}
        </div>
      </div>
    </div>

    <a-modal title="商家备注" :visible="addShow" @ok="handleOk" @cancel="handleCancel" :maskClosable="false">
      <a-form :form="form">
        <a-form-item :colon="false">
          <a-textarea :maxLength="256" :autosize="{ minRows: 2, maxRows: 6 }" v-decorator="[
              'remark',
              {
                initialValue: info.remark,
                rules: [
                  {
                    required: true,
                    message: '请填写商家备注'
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
      addShow: false,
      info: {},
      list: [],
      columns: [
        {
          title: "类型",
          align: "center",
          dataIndex: "billType",
          key: "1",
          scopedSlots: { customRender: "billType" }
        },
        {
          title: "名称",
          align: "center",
          dataIndex: "name",
          key: "2"
        },
        // {
        //   title: "交易来源",
        //   align: "center",
        //   dataIndex: "name",
        //   key: "3"
        // },
        {
          title: "支付方式",
          align: "center",
          dataIndex: "dealType",
          key: "4",
          scopedSlots: { customRender: "dealType" }
        },
        {
          title: "金额（元）",
          align: "center",
          dataIndex: "money",
          key: "5"
        }
      ]
    };
  },

  created() {
    this.getDetail(this.$route.query.id);
  },

  methods: {
    getDetail(id) {
      api
        .ajax({
          data: { id },
          method: "infoBillRecord"
        })
        .then(res => {
          const data = res.data.data;
          this.list = [
            {
              billType: data.billType,
              name: data.name,
              dealType: data.dealType,
              money: data.money,
              id: data.id
            }
          ];
          this.info = data;
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    add() {
      this.addShow = true;
    },
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          api
            .ajax({
              data: {
                remark: values.remark,
                id: this.info.id
              },
              method: "remarkBill"
            })
            .then(res => {
              this.$message.info(res.data.message);
              this.info.remark = values.remark;
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
    }
  }
};
</script>
<style lang="less" scoped>
.asset_billingdetails {
  .page_table {
    margin-top: 15px;
    background-color: #fff;
    .ant-table-thead {
      tr {
        th {
          background-color: #fff;
          padding: 10px 16px;
          .ant-table-column-sorter {
            position: relative;
            top: 0;
            right: 0;
            display: inline-block;
            vertical-align: top;
            margin-top: 2px;
            margin-left: 5px;
          }
        }
      }
    }
    .ant-table-row.ant-table-row-level-0:nth-child(odd) {
      background-color: #f7f8fa;
    }
    .ant-table-body {
      table {
        border: 1px solid #e8e8e8;
        td {
          border-bottom: none;
        }
      }
    }
  }
  .deatai {
    padding: 20px;
    background-color: #fff;
    & > div {
      background: rgba(247, 248, 250, 1);
      border: 1px solid rgba(229, 229, 229, 1);
      & > div {
        overflow: hidden;
      }
      .fl {
        padding-left: 30px;
        padding-top: 30px;
        width: 33%;
      }
      .fl-title {
        font-size: 14px;
        color: rgba(51, 51, 51, 1);
        padding-bottom: 10px;
      }
      .fl-item {
        margin-top: 10px;
        font-size: 12px;
        color: rgba(128, 128, 128, 1);
      }
      .item-title {
        margin-top: 30px;
        margin-left: 30px;
        font-size: 14px;
        color: rgba(51, 51, 51, 1);
      }
      .item-title2 {
        font-size: 12px;
        color: rgba(62, 123, 248, 1);
        margin-left: 30px;
        margin-right: 30px;
        margin-top: 30px;
        padding-top: 30px;
        border-top: 1px solid rgba(229, 229, 229, 1);
        cursor: pointer;
      }
    }
  }
}
</style>
