<template>
  <div class="asset_balance">
    <div class="account-info">
      <div>账户概览</div>
      <div class="inline">
        <div class="yu-e">
          店铺余额（元）
          <span>
            <router-link to="/asset/drawallist">提现记录</router-link>
          </span>
        </div>
        <div class="num">{{ shopData.balanceAmount }}</div>
        <div v-if="$permission.hasPermission('BALANCE_STORE_WITHDRAW')">
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

    <div class="sub-title">最近交易记录</div>

    <div class="page_tabs">
      <a-tabs :activeKey="activeKey" @change="changeTab">
        <a-tab-pane v-for="(itm, idx) in tabs" :key="idx" :tab="itm">
        </a-tab-pane>
      </a-tabs>
    </div>

    <div class="page_table">
      <a-table
        :rowClassName="(rec, index) => (index % 2 === 0 ? 'jishu' : 'oushu')"
        :bordered="false"
        :pagination="false"
        :columns="columns"
        :dataSource="listData"
        :rowKey="record => record.id"
      >
        <div slot="copys" slot-scope="text, record">
          <div class="inner1">
            <Tooltip
              v-if="(getMapName(record.copys) || '').length > 15"
              :str="getMapName(record.copys)"
              :max="15"
            />
            <div v-else>
              {{ getMapName(record.copys) }}
            </div>
          </div>
          <div v-if="record.refundPrice" class="inner2"></div>
        </div>

        <div slot="orderNum" slot-scope="text, record, index">
          <div class="inner1">
            <div>{{ record.orderNum }}</div>
            <div>{{ record.serialNum }}</div>
          </div>
          <div v-if="record.refundPrice" class="inner2"></div>
        </div>

        <div slot="buyerName" slot-scope="text, record, index">
          <div class="inner1">
            {{ record.buyerName }}
          </div>
          <div v-if="record.refundPrice" class="inner2">退款</div>
        </div>

        <div slot="practicalDealPrice" slot-scope="text, record, index">
          <div class="inner1">+{{ record.practicalDealPrice }}</div>
          <div v-if="record.refundPrice" class="inner2 red">
            -{{ record.refundPrice }}
          </div>
        </div>

        <div slot="serialState" slot-scope="text, record, index">
          <div class="inner1">
            {{
              record.state == 1
                ? "待付款"
                : record.state == 2
                ? "待发货"
                : record.state == 3
                ? "已发货"
                : record.state == 4
                ? "已完成"
                : record.state == 5
                ? "已关闭"
                : ""
            }}
          </div>
          <div v-if="record.refundPrice" class="inner2">退款成功</div>
        </div>

        <div slot="action" slot-scope="text, record, index">
          <div class="inner1">
            <router-link :to="'/order/detail?id=' + record.id"
              >查看</router-link
            >
          </div>
          <div v-if="record.refundPrice" class="inner2"></div>
        </div>
      </a-table>
    </div>

    <div class="page_pagination">
      <a-pagination
        showQuickJumper
        showSizeChanger
        :total="pager.total"
        v-model="pager.currentPage"
        @change="paginationChange"
        :pageSize="pager.pageSize"
        @showSizeChange="onShowSizeChange"
        :pageSizeOptions="pager.pageSizeOptions"
        :showTotal="total => `共有 ${pager.total} 条/${pager.totalPage}页`"
      >
        <template slot="buildOptionText" slot-scope="props">
          <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
        </template>
      </a-pagination>
    </div>
  </div>
</template>
<script>
import api from "@/api/user";
import Tooltip from "@/components/Tooltip";
export default {
  data() {
    return {
      shopData: {},
      tabs: ["全部", "进行中", "待结算", "交易完成", "交易关闭"],
      activeKey: 0,
      listData: [],
      columns: [
        {
          title: "时间",
          align: "center",
          dataIndex: "inputTime",
          key: "1"
        },
        {
          title: "名称",
          align: "center",
          dataIndex: "copys",
          key: "2",
          scopedSlots: { customRender: "copys" }
        },
        {
          title: "订单号 | 支付单号",
          align: "center",
          dataIndex: "orderNum",
          key: "3",
          scopedSlots: { customRender: "orderNum" }
        },
        {
          title: "对方",
          align: "center",
          dataIndex: "buyerName",
          key: "4",
          scopedSlots: { customRender: "buyerName" }
        },
        {
          title: "金额（元） | 明细",
          align: "center",
          dataIndex: "practicalDealPrice",
          key: "5",
          scopedSlots: { customRender: "practicalDealPrice" }
        },
        {
          title: "状态",
          align: "center",
          dataIndex: "serialState",
          key: "6",
          scopedSlots: { customRender: "serialState" }
        },
        {
          title: "操作",
          align: "center",
          dataIndex: "id",
          scopedSlots: { customRender: "action" }
        }
      ],
      pager: {
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalPage: 0
      }
    };
  },
  components: { Tooltip },
  created() {
    this.getList();
    this.getShop();
  },
  methods: {
    getList() {
      let data = {
        ...this.pager,
        serialState: this.activeKey
      };
      api
        .ajax({
          data,
          method: "serialListPageOrder"
        })
        .then(res => {
          const data = res.data.data;
          this.listData = data.list;
          this.pager = {
            pageSizeOptions: ["10", "20", "30", "40", "50"],
            currentPage: data.currentPage,
            pageSize: data.pageSize,
            total: data.totalRecord,
            totalPage: data.totalPage
          };
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    onShowSizeChange(current, pageSize) {
      this.pager.pageSize = pageSize;
      this.pager.currentPage = 1;
      this.getList();
    },
    paginationChange(page, pageSize) {
      this.pager.pageSize = pageSize;
      this.pager.currentPage = page;
      this.getList();
    },
    changeTab(key) {
      this.activeKey = key;
      this.pager.currentPage = 1;
      this.getList();
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
    getMapName(arr) {
      let str = "";
      arr.forEach((item, ind) => {
        let addStr = ind === 0 ? item.goodsName : "," + item.goodsName;
        str += addStr;
      });
      return str;
    }
  }
};
</script>
<style lang="less" scoped>
.asset_balance {
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
          cursor: pointer;
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
  }

  .page_tabs {
    border-top: 1px solid #e8e8e8;
    .ant-tabs-top-bar {
      background-color: #fff;
      margin: 0;
      border-bottom: none;
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
          padding: 16px 0;
          .inner1 {
            height: 58px;
            padding-bottom: 10px;
            line-height: 42px;
            div {
              line-height: 21px;
            }
          }
          .inner1:last-child {
            height: 42px;
            padding-bottom: 0;
          }
          .inner2 {
            height: 58px;
            padding-top: 10px;
            line-height: 42px;
            border-top: 1px solid #e8e8e8;
          }
          .red {
            color: #f00;
          }
        }
      }
    }
  }

  // 分页
  .page_pagination {
    text-align: right;
    margin-top: 15px;
    .ant-select-dropdown-menu {
      text-align: center;
    }
  }
}
</style>
