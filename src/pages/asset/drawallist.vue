<template>
  <div class="asset-drawallist">
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
        <!-- <span slot="state" slot-scope="text, record, index">
          {{
            record.state == 1
              ? "申请中"
              : record.state == 2
              ? "处理中"
              : record.state == 3
              ? "成功"
              : record.state == 4
              ? "失败"
              : ""
          }}
        </span> -->
        <span slot="money" slot-scope="text" style="color:red">
          {{text}}
        </span>
        <span slot="account">
          企蜂云收益账户
        </span>
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
export default {
  components: { TableSearchForm },
  data() {
    return {
      searchField: {},
      searchFormList: [
        {
          type: "datePicker",
          name: "queryDateArr",
          label: "申请时间",
          ranges: {
            今天: [moment(), moment()],
            昨天: [moment().subtract(1, "days"), moment().subtract(1, "days")],
            近7天: [moment().subtract(6, "days"), moment()],
            近30天: [moment().subtract(29, "days"), moment()]
          }
        },
        // {
        //   type: "select",
        //   name: "state",
        //   label: "类型",
        //   child: [
        //     { value: "", name: "全部" },
        //     { value: 1, name: "申请中" },
        //     { value: 2, name: "处理中" },
        //     { value: 3, name: "成功" },
        //     { value: 4, name: "失败" }
        //   ]
        // }
      ],
      listData: [],
      columns: [
        {
          title: "申请时间",
          align: "center",
          dataIndex: "applyTime",
          key: "applyTime"
        },
        // {
        //   title: "提现银行",
        //   align: "center",
        //   dataIndex: "bankName",
        //   key: "2"
        // },
        {
          title: "提现金额（元）",
          align: "center",
          dataIndex: "money",
          key: "money",
          scopedSlots: { customRender: "money" }
        },
        // {
        //   title: "处理完成时间",
        //   align: "center",
        //   dataIndex: "finishTime",
        //   key: "4"
        // },
        // {
        //   title: "状态",
        //   align: "center",
        //   dataIndex: "state",
        //   key: "5",
        //   scopedSlots: { customRender: "state" }
        // },
        {
          title: '账户',
          align: 'center',
          dataIndex: 'account',
          key: 'account',
          scopedSlots: { customRender: "account" }
        },
        {
          title: "申请人",
          align: "center",
          dataIndex: "applyName",
          key: "applyName"
        },
        // {
        //   title: "申请人号码",
        //   align: "center",
        //   dataIndex: "applyPhone",
        //   key: "7"
        // }
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
          method: "listPageWithdrawRecord"
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
.asset-drawallist {
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
