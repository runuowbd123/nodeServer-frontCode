<template>
  <div class="asset_scan">
    <div class="account-info">
      <div>账户概览</div>
      <div class="inline">
        <div class="yu-e">店铺余额（元）</div>
        <div class="num">{{ shopData.balanceAmount }}</div>
        <div v-if="$permission.hasPermission('BALANCE_ACCOUNT_WITHDRAW')">
          <a-button type="primary" style="margin-top:10px;">
            <router-link to="/asset/drawal">提至收益账户</router-link>
          </a-button>
        </div>
      </div>
      <div class="inline">
        <div class="yu-e">
          待结算（元）
          <a-tooltip
            placement="top"
            title="最终结算的资金会减去结算前的退款并在结算后扣除手续费"
          >
            <a-icon type="question-circle" />
          </a-tooltip>
        </div>
        <div class="num">{{ shopData.settlementAmount }}</div>
      </div>
      <!-- <div class="inline">
        <div class="yu-e">冻结余额（元）</div>
        <div class="num">{{ shopData.blockedAmount }}</div>
      </div> -->
    </div>

    <div class="sub-title">
      收支概况
      <a-tooltip placement="top" title="对近期各个账户收入和支出的数据统计">
        <a-icon type="question-circle" />
      </a-tooltip>
      <div class="fr">
        <span :class="{ active: dayType == 1 }" @click="getList(1)">今日</span>
        |
        <span :class="{ active: dayType == 2 }" @click="getList(2)">昨日</span>
      </div>
    </div>

    <div class="page_table">
      <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'"
        :bordered="false"
        :pagination="false"
        :columns="columns"
        :dataSource="listData"
        :rowKey="record => record.billType"
      >
        <span slot="accoutName" slot-scope="text, record, index">店铺余额</span>
        <span slot="billTypeShow" slot-scope="text, record, index">
          {{
            record.billType == 1
              ? "提现"
              : record.billType == 2
              ? "退款"
              : record.billType == 3
              ? "交易手续费"
              : record.billType == 4
              ? "订单入账"
              : ""
          }}
        </span>
        <span slot="inOut1" slot-scope="text, record, index">
          {{ record.inOut == 1 ? `${record.money}元` : "" }}
        </span>
        <span slot="inOut2" slot-scope="text, record, index">
          {{ record.inOut == 2 ? `${record.money}元` : "" }}
        </span>
        <span slot="action" slot-scope="text, record, index">
          <router-link to="/asset/billinglist">明细</router-link>
        </span>
      </a-table>
    </div>
  </div>
</template>
<script>
import api from "@/api/user";
export default {
  data() {
    return {
      shopData: {},
      dayType: 1,
      listData: [],
      columns: [
        {
          title: "账户",
          align: "center",
          dataIndex: "name",
          key: 3,
          scopedSlots: { customRender: "accoutName" }
        },
        {
          title: "订单类型",
          align: "center",
          dataIndex: "billType",
          scopedSlots: { customRender: "billTypeShow" }
        },
        {
          title: "笔数",
          align: "center",
          dataIndex: "dealCount"
        },
        {
          title: "收入",
          align: "center",
          key: 1,
          scopedSlots: { customRender: "inOut1" }
        },
        {
          title: "支出",
          align: "center",
          key: 2,
          scopedSlots: { customRender: "inOut2" }
        },
        {
          title: "操作",
          align: "center",
          dataIndex: "id",
          scopedSlots: { customRender: "action" }
        }
      ]
    };
  },
  created() {
    this.getList(this.dayType);
    this.getShop();
  },
  methods: {
    getList(dayType) {
      this.dayType = dayType;
      api
        .ajax({
          data: {
            dayType
          },
          method: "listBillRecord"
        })
        .then(res => {
          const data = res.data.data;
          this.listData = data;
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
    }
  }
};
</script>
<style lang="less" scoped>
.asset_scan {
  padding-bottom: 20px;
  .account-info {
    background-color: #fff;
    padding: 16px 30px 20px;
    div.inline {
      padding-top: 30px;
      width: 240px;
      display: inline-block;
      vertical-align: top;
      .yu-e {
        font-size: 12px;
        color: rgba(51, 51, 51, 1);
        i {
          color: #cccccc;
          font-size: 16px;
          vertical-align: middle;
        }
        span {
          color: rgba(62, 123, 248, 1);
        }
      }
      .num {
        font-size: 24px;
        color: rgba(51, 51, 51, 1);
        font-weight: bold;
      }
    }
  }
  .sub-title {
    margin-top: 15px;
    padding: 14px 30px;
    background-color: #fff;
    .fr {
      span {
        cursor: pointer;
      }
      span.active {
        color: #3e7bf8;
      }
    }
  }

  .page_table {
    // margin-top: 15px;
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
}
</style>
