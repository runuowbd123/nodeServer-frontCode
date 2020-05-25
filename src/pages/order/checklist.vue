<template>
  <div class="check-list">
    <div class="search__Box" style="padding-right:15px;">
      <TableSearchForm @handleSubmit="searchFun" :formList="searchFormList" />
    </div>

    <!-- <div class="page_btn">
      <router-link to="/goods/goodsadd">
        <a-button type="primary">新建商品</a-button>
      </router-link>
    </div> -->

    <div class="page_table">
      <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'" :bordered="false" :pagination="false" :columns="columns" :dataSource="listData" :rowKey="record => record.id">
        <div slot="waresPictrueUrl" slot-scope="text, record, index">
          <img class="table-img" :src="record.waresPictrueUrl" />
        </div>

        <div slot="waresName" slot-scope="text, record, index">
          <router-link class="blue" :to="'/goods/goodsedit?id=' + record.waresId + '&index=3'">
            <span>{{ record.waresName }}</span>
          </router-link>
        </div>

        <div slot="state" slot-scope="text, record, index">
          {{
            record.state == 1
              ? "待核销"
              : record.state == 2
              ? "已核销"
              : record.state == 3
              ? "已失效"
              : ""
          }}
        </div>
        <div slot="action" slot-scope="text, record, index">
          <router-link  v-if="$permission.hasPermission('ORDER_CHECK_VIEW')" :to="'/order/detail?id='+record.orderId">查看订单</router-link>
          <a href="javascript:;"  v-if="record.state == 1&&$permission.hasPermission('ORDER_CHECK_EDIT')" @click="openShow(record, index)">确认核销</a>
        </div>
      </a-table>
    </div>

    <div class="page_pagination">
      <a-pagination showQuickJumper showSizeChanger :total="pager.total" v-model="pager.currentPage" @change="paginationChange" :pageSize="pager.pageSize" @showSizeChange="onShowSizeChange" :pageSizeOptions="pager.pageSizeOptions" :showTotal="total => `共有 ${pager.total} 条/${pager.totalPage}页`">
        <template slot="buildOptionText" slot-scope="props">
          <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
        </template>
      </a-pagination>
    </div>

    <a-modal title="确认核销" v-if="addShow" :visible="addShow" @ok="handleOk" @cancel="handleCancel">
      <a-icon type="check-circle" theme="filled" twoToneColor="#7DDC82" style="fontSize:50px;color:#7DDC82;verticalAlign:middle;marginRight:20px;" />请仔细核对信息，避免错误核销，请谨慎操作！
    </a-modal>
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
          label: "验证时间",
          ranges: {
            今天: [moment(), moment()],
            昨天: [moment().subtract(1, "days"), moment().subtract(1, "days")],
            近7天: [moment().subtract(6, "days"), moment()],
            近30天: [moment().subtract(29, "days"), moment()]
          }
        },
        {
          type: "input",
          name: "queryCheckCode",
          label: "核销码"
        },
        {
          type: "input",
          name: "queryOrderNum",
          label: "订单编号"
        },
        {
          type: "input",
          name: "queryCheckName",
          label: "核销员姓名"
        },
        {
          type: "select",
          name: "state",
          label: "核销状态",
          allowClear: true,
          child: [
            { value: 1, name: "待核销" },
            { value: 2, name: "已核销" },
            { value: 3, name: "已失效" }
          ]
        }
      ],
      listData: [],
      columns: [
        {
          title: "核销码",
          align: "center",
          dataIndex: "checkCode",
          key: "1"
        },
        {
          title: "商品",
          align: "center",
          dataIndex: "waresPictrueUrl",
          key: "2",
          scopedSlots: { customRender: "waresPictrueUrl" }
        },
        {
          title: "商品名称",
          align: "center",
          dataIndex: "waresName",
          key: "3",
          width:"15%",
          scopedSlots: { customRender: "waresName" }
        },
        {
          title: "价格",
          align: "center",
          dataIndex: "waresPrice",
          key: "4",
          customRender:(value,row,index)=>{
              return "￥"+value
          }

        },
        {
          title: "订单号",
          align: "center",
          dataIndex: "orderNum",
          key: "5"
        },
        {
          title: "核销状态",
          align: "center",
          dataIndex: "state",
          key: "6",
          width:"8%",
          scopedSlots: { customRender: "state" }
        },
        {
          title: "核销时间",
          align: "center",
          dataIndex: "checkTime",
          key: "7"
        },
        {
          title: "核销员",
          align: "center",
           width:"8%",
          dataIndex: "checkName",
          key: "8"
        },
        {
          title: "操作",
          align: "center",
          dataIndex: "id",
          key: "9",
          width:'18%',
          scopedSlots: { customRender: "action" }
        }
      ],
      pager: {
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalPage: 0
      },
      addShow: false,
      crrenId: ""
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
          method: "listPageCheck"
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
    handleOk() {
      api
        .ajax({
          data: { id: this.crrenId },
          method: "check"
        })
        .then(res => {
          this.$message.info(res.data.message);
          this.getList();
          setTimeout(() => {
            this.handleCancel();
          }, 1500);
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    openShow(record, index) {
      (this.addShow = true), (this.crrenId = record.id);
    },
    handleCancel() {
      this.addShow = false;
      this.crrenId = "";
    }
  }
};
</script>
<style lang="less" scoped>
.check-list {
  padding-bottom:50px;
  .page_btn {
    margin-top: 15px;
    text-align: right;
  }
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
