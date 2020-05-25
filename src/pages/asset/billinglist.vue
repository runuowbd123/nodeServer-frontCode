<template>
  <div class="asset-billinglist">
    <div class="search__Box">
      <TableSearchForm @handleSubmit="searchFun" :formList="searchFormList" />
    </div>

    <div class="page_table">
      <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'"
        :bordered="false"
        :pagination="false"
        :columns="columns"
        :dataSource="listData"
        :rowKey="record => record.id"
      >
        <span slot="billType" slot-scope="text, record, index">
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
        <span slot="name" slot-scope="text">
          <Tooltip v-if="text.length > 15" :str="text" :max="15"/>
          <div v-else>
            {{text}}
          </div>
        </span>

        <div slot="orderNum" slot-scope="text, record, index">
          <div>{{ record.orderNum }}</div>
          <div>{{ record.serialNum }}</div>
        </div>

        <span slot="inOut" slot-scope="text, record, index">
          {{ record.inOut == 1 ? "收入" : record.inOut == 2 ? "支出" : "" }}
        </span>

        <div slot="action" slot-scope="text, record, index">
          <router-link :to="'/asset/billingdetails?id=' + record.id"
            >详情</router-link
          >
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
import moment from "moment";
import TableSearchForm from "../../components/TableSearchForm";
import Tooltip from '@/components/Tooltip'
export default {
  components: { TableSearchForm, Tooltip },
  data() {
    return {
      searchField: {},
      searchFormList: [
        {
          type: "datePicker",
          name: "queryDateArr",
          label: "入账时间",
          ranges: {
            今天: [moment(), moment()],
            昨天: [moment().subtract(1, "days"), moment().subtract(1, "days")],
            近7天: [moment().subtract(6, "days"), moment()],
            近30天: [moment().subtract(29, "days"), moment()]
          }
        },
        {
          type: "input",
          name: "queryNum",
          label: "单号"
        },
        {
          type: "select",
          name: "billType",
          label: "类型",
          allowClear: true,
          child: [
            // { value: 1, name: "提至收益账户" },
            { value: 2, name: "退款" },
            { value: 3, name: "交易手续费" },
            { value: 4, name: "订单入账" }
          ]
        }
      ],
      listData: [],
      columns: [
        {
          title: "类型",
          align: "center",
          dataIndex: "billType",
          key: "1",
          scopedSlots: { customRender: "billType" }
        },
        {
          title: "时间",
          align: "center",
          dataIndex: "inputTime",
          key: "2"
        },
        {
          title: "名称",
          align: "center",
          dataIndex: "name",
          key: "3",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "业务单号|支付流水号",
          align: "center",
          dataIndex: "name",
          key: "4",
          scopedSlots: { customRender: "orderNum" }
        },
        {
          title: "收支类型",
          align: "center",
          dataIndex: "age",
          key: "5",
          scopedSlots: { customRender: "inOut" }
        },
        {
          title: "金额（元）",
          align: "center",
          dataIndex: "money",
          key: "6"
        },
        {
          title: "操作",
          dataIndex: "address",
          key: "7",
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
  created() {
    this.getList();
  },
  methods: {
    searchFun(values) {
      this.searchField = values;
      this.getList();
    },
    getList() {
      let data = {
        ...this.pager,
        ...this.searchField
      };
      api
        .ajax({
          data,
          method: "listPageBillRecord"
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
    }
  }
};
</script>
<style lang="less" scoped>
.asset-billinglist {
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
    .table-img {
      width: 58px;
      height: 58px;
      border: 1px solid rgba(230, 230, 230, 1);
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
