<template>
  <div class="client-list">
    <Toolbar :tools="tools" @onChange="changeTool" @onSearch="onSearch" />
    <div
      style="display: flex;flex-direction: row-reverse"
      v-if="$permission.hasPermission('SALE_STORE_EDIT')"
    >
      <a-button type="primary" @click="addCoupon" style="margin-top: 10px"
        >新建活动</a-button
      >
    </div>

    <div class="page_table">
      <a-table
        :rowClassName="(rec, index) => (index % 2 === 0 ? 'jishu' : 'oushu')"
        :bordered="false"
        :pagination="false"
        :columns="columns"
        :dataSource="listData"
        :rowKey="record => record.id"
        :loading="tableLoading"
      >
        <div slot="type">
          店铺满减
        </div>
        <div slot="content" slot-scope="text">
          {{ text || "-" }}
        </div>
        <div slot="orderNum" slot-scope="text">
          {{ text || 0 }}
        </div>
        <div slot="orderAmount" slot-scope="text">
          {{ text || 0 }}
        </div>
        <div slot="discountsAmount" slot-scope="text">
          {{ text || 0 }}
        </div>
        <div slot="status" slot-scope="text">
          {{ statusObj[text] || "-" }}
        </div>
        <div slot="action" slot-scope="text, record, index">
          <!-- <a href="javascript:;" style="margin-right: 10px" @click="goToActivity(record, 'look')">详情</a>
          <a href="javascript:;" style="margin-right: 10px" @click="startActivity(record, index)" >开始活动</a>
          <a href="javascript:;" style="margin-right: 10px" @click="stopActivity(record, index)">结束活动</a>
          <a href="javascript:;" style="margin-right: 10px" @click="goToActivity(record, 'resubmit')">重新提交</a>
          <a href="javascript:;" @click="deleteActivity(record, index)"  >删除</a> -->
          <a
            href="javascript:;"
            style="margin-right: 10px"
            @click="goToActivity(record, 'look')"
            v-show="record.status != -1"
            >详情</a
          >
          <a
            href="javascript:;"
            style="margin-right: 10px"
            @click="startActivity(record, index)"
            v-show="record.status == 2"
            v-if="$permission.hasPermission('SALE_STORE_EDIT')"
            >开始活动</a
          >
          <a
            href="javascript:;"
            style="margin-right: 10px"
            @click="stopActivity(record, index)"
            v-show="record.status == 3"
            v-if="$permission.hasPermission('SALE_STORE_EDIT')"
            >结束活动</a
          >
          <a
            href="javascript:;"
            style="margin-right: 10px"
            @click="goToActivity(record, 'resubmit')"
            v-show="record.status == -1"
            v-if="$permission.hasPermission('SALE_STORE_EDIT')"
            >重新提交</a
          >
          <a
            href="javascript:;"
            @click="deleteActivity(record, index)"
            v-show="
              record.status != 1 && record.status != 3 && record.status != 2
            "
            v-if="$permission.hasPermission('SALE_STORE_EDIT')"
            >删除</a
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
      />
    </div>
  </div>
</template>
<script>
import api from "@/api/user";
import moment from "moment";
import Toolbar from "../../components/ToolBar.vue";
const statusObj = {
  "1": "待审核",
  "-1": "驳回",
  "0": "默认",
  "2": "未开始",
  "3": "进行中",
  "4": "已结束"
};
export default {
  components: {
    Toolbar
  },
  data() {
    return {
      statusObj,
      toolValue: {
        searchText: null,
        status: undefined
      },
      tools: [
        {
          type: "input",
          title: "活动名称:",
          placeholder: "请输入活动名称",
          key: "searchText",
          defaultValue: null
        },
        {
          type: "select",
          title: "活动状态:",
          key: "status",
          allowClear: true,
          options: [
            // {value: 'null', name: '全部'},
            { value: "1", name: "待审核" },
            { value: "-1", name: "驳回" },
            { value: "2", name: "未开始" },
            { value: "3", name: "进行中" },
            { value: "4", name: "已结束" }
          ]
        },
        // {
        //     type: 'select',
        //     title: '活动类型:',
        //     key: 'type',
        //     defaultValue: 'null',
        //     options: [
        //       {value: 'null', name: '全部'},
        //       {value: '1', name: '店铺满减'},
        //     ]
        // },
        {
          type: "search",
          title: "筛选"
        }
      ],
      tableLoading: false,
      listData: [],
      detailModal: false,
      detailDataList: [],
      columns: [
        {
          title: "活动名称",
          align: "center",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "类型",
          dataIndex: "type",
          key: "type",
          align: "center",
          scopedSlots: { customRender: "type" }
        },
        {
          title: "活动内容",
          dataIndex: "content",
          key: "content",
          align: "center",
          scopedSlots: { customRender: "content" }
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          align: "center",
          scopedSlots: { customRender: "status" }
        },
        {
          title: "订单数",
          dataIndex: "orderNum",
          key: "orderNum",
          align: "center",
          scopedSlots: { customRender: "orderNum" }
        },
        {
          title: "订单金额（元）",
          dataIndex: "orderAmount",
          key: "orderAmount",
          align: "center",
          scopedSlots: { customRender: "orderAmount" }
        },
        {
          title: "优惠总金额（元）",
          dataIndex: "discountsAmount",
          key: "discountsAmount",
          align: "center",
          scopedSlots: { customRender: "discountsAmount" }
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          scopedSlots: { customRender: "action" },
          align: "center"
        }
      ],
      pager: {
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        currentPage: 1,
        pageSize: 10,
        total: 1,
        totalPage: 1
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    addCoupon() {
      console.log("新增");
      this.$router.push({ path: "/market/addstore", query: { type: "add" } });
    },
    goToActivity(data, type) {
      // 查看详情或者是重新提交
      if (type === "look") {
        this.$router.push({
          path: "/market/storedetail",
          query: { type: type, id: data.id }
        });
      } else if (type === "resubmit") {
        this.$router.push({
          path: "/market/storeresubmit",
          query: { type: type, id: data.id }
        });
      }
    },
    changeTool(key, value, obj) {
      console.log(key, value, obj);
    },
    onSearch(obj) {
      this.pager.currentPage = 1;
      this.toolValue = JSON.parse(JSON.stringify(obj));
      this.getList();
    },
    getList() {
      let data = {
        currentPage: this.pager.currentPage,
        pageSize: this.pager.pageSize,
        status: this.toolValue.status,
        searchText: this.toolValue.searchText
      };
      console.log(data);
      this.tableLoading = true;
      api
        .ajax({
          data,
          method: "listPageSaleActivity"
        })
        .then(res => {
          const data = res.data.data;
          // console.log(data)
          this.listData = data.list;
          this.pager = {
            ...this.pager,
            pageSizeOptions: ["10", "20", "30", "40", "50"],
            currentPage: data.currentPage,
            pageSize: data.pageSize,
            total: data.totalRecord,
            totalPage: data.totalPage
          };
          this.tableLoading = false;
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
    stopActivity(data) {
      const that = this;
      this.$confirm({
        title: "结束活动",
        content: (
          <div>
            是否确认结束活动？
            <br />
            结束活动后，不会影响在活动期内已提交的订单。
          </div>
        ),
        onOk() {
          api
            .ajax({
              data: {
                id: data.id
              },
              method: "stopSaleActivity"
            })
            .then(res => {
              that.$message.info(res.data.msg);
              that.getList();
            })
            .catch(error => {
              console.log("error", error);
            });
        },
        onCancel() {}
      });
    },
    startActivity(data) {
      const that = this;
      this.$confirm({
        title: "开始活动",
        content: <div>是否确认开始活动？</div>,
        onOk() {
          api
            .ajax({
              data: {
                id: data.id
              },
              method: "startSaleActivity"
            })
            .then(res => {
              that.$message.info(res.data.msg);
              that.getList();
            })
            .catch(error => {
              console.log("error", error);
            });
        },
        onCancel() {}
      });
    },
    deleteActivity(data) {
      const that = this;
      this.$confirm({
        title: "删除",
        content: `是否确认删除 【${data.name}】 活动`,
        onOk() {
          api
            .ajax({
              data: {
                id: data.id
              },
              method: "delSaleActivity"
            })
            .then(res => {
              that.$message.info(res.data.msg);
              that.getList();
            })
            .catch(error => {
              console.log("error", error);
            });
        },
        onCancel() {}
      });
    }
  }
};
</script>
<style lang="less" scoped>
.client-list {
  .toolbar {
    display: flex;
    align-items: center;
    margin-top: 15px;
    flex-wrap: wrap;
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
      border-radius: 50%;
    }
  }

  // 分页
  .page_pagination {
    text-align: right;
    margin-top: 15px;
    padding-bottom: 20px;
    .ant-select-dropdown-menu {
      text-align: center;
    }
  }
}
</style>
