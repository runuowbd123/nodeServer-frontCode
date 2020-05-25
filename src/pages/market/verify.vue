<template>
  <div class="client-list">
    <Toolbar :tools="tools" @onChange="changeTool" @onSearch="onSearch"/>

    <div class="page_table">
      <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'"
        :bordered="false"
        :pagination="false"
        :columns="columns"
        :dataSource="listData"
        :rowKey="record => record.id"
        :loading="tableLoading"
      >
        <div slot="type" slot-scope="text">
          <div v-if="text == 1">
            满减券
          </div>
          <div v-else-if="text == 2">
            折扣券
          </div>
          <div v-else>
            店铺促销
          </div>
        </div>
        <div slot="content" slot-scope="text">
          {{text ? text : '-'}}
        </div>
        <div slot="status" slot-scope="text">
          {{statusObj[text]}}
        </div>
        <div slot="action" slot-scope="text, record">
          <a href="javascript:;" style="margin-right: 10px" @click="goToActivity(record, 'verify')" v-if="record.status == 1 && $permission.hasPermission('SALE_AUTH_EDIT')">审核</a>
          <a href="javascript:;" style="margin-right: 10px" @click="goToActivity(record, 'look')" v-else>详情</a>
          <!-- <a href="javascript:;" style="margin-right: 10px" @click="goToActivity(record, 'verify')" >审核</a>
          <a href="javascript:;" style="margin-right: 10px" @click="goToActivity(record, 'look')" >详情</a> -->
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
import Toolbar from "../../components/ToolBar.vue"
const statusObj = {
  "1": "待审核",
  "-1": "驳回",
  "0": "默认",
  "2": "审核通过",
}
export default {
  components: {
    Toolbar
  },
  data() {
    return {
      statusObj,
      toolValue: {
        searchText: null,
        status: 'null',
        type: 'null',
      },
      tools: [
        {
            type: 'input',
            title: '活动名称:',
            placeholder: '请输入活动名称',
            key: 'searchText',
            defaultValue: null,
        },
        {
            type: 'select',
            title: '活动状态:',
            key: 'status',
            defaultValue: null,
            allowClear: true,
            options: [
              // {value: 'null', name: '全部'},
              {value: '1', name: '待审核'},
              {value: '-1', name: '驳回'},
              {value: '2', name: '审核通过'},
            ]
        },
        {
            type: 'select',
            title: '活动类型:',
            key: 'type',
            defaultValue: null,
            allowClear: true,
            options: [
              // {value: 'null', name: '全部'},
              {value: '0', name: '店铺促销'},
              {value: '1', name: '满减券'},
              {value: '2', name: '折扣券'},
            ]
        },
        {
            type: 'search',
            title: '筛选'
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
          key: "name",
        },
        {
          title: "类型",
          dataIndex: "type",
          key: "type",
          align: "center",
          scopedSlots: { customRender: "type" },
        },
        {
          title: "活动内容",
          dataIndex: "content",
          key: "content",
          align: "center",
          scopedSlots: { customRender: "content" },
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          align: "center",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "提交人",
          dataIndex: "inputName",
          key: "inputName",
          align: "center",
        },
        {
          title: "审核人",
          dataIndex: "authName",
          key: "authName",
          align: "center",
        },
        {
          title: "审核时间",
          dataIndex: "authTime",
          key: "authTime",
          align: "center",
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          scopedSlots: { customRender: "action" },
          align: "center",
        }
      ],
      pager: {
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        currentPage: 1,
        pageSize: 10,
        total: 1,
        totalPage: 1
      },
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    goToActivity(data, type) {
      // 查看详情或者是重新提交
      if (data.type == 0) {
        //店铺促销
        if(type === 'look') {
          this.$router.push({path: '/market/shopverifydetail', query: {type: type, id: data.activityId, verifyId: data.id}})  
        } else if (type === 'verify'){
          this.$router.push({path: '/market/shopverify', query: {type: type, id: data.activityId, verifyId: data.id}}) 
        }
      } else {
        // 满减券和折扣券
        if(type === 'look') {
          this.$router.push({path: '/market/couponverifydetail', query: {type: type, id: data.activityId, verifyId: data.id}})
        } else if (type === 'verify') {
          this.$router.push({path: '/market/couponverify', query: {type: type, id: data.activityId, verifyId: data.id}}) 
        }
      }
    },
    changeStatus(val) {
      this.status = val;
    },
    changeType(val) {
      this.type = val;
    },
    changeInput(e) {
      const { value } = e.target
      this.searchText = value
    },
    changeTool(key, value, obj) {
      console.log(key, value, obj);
    },
    onSearch (obj) {
      this.pager.currentPage = 1;
      this.toolValue = JSON.parse(JSON.stringify(obj))
      this.getList()
    },
    getList() {
      let data = {
        currentPage: this.pager.currentPage,
        pageSize: this.pager.pageSize,
        status: this.toolValue.status,
        searchText: this.toolValue.searchText,
        type: this.toolValue.type
      };
      // console.log(data)
      this.tableLoading = true;
      api
        .ajax({
          data,
          method: "listPageSaleAuth"
        })
        .then(res => {
          const data = res.data.data;
          console.log(data)
          this.listData=data.list
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
  }
};
</script>
<style lang="less" scoped>
.client-list {
  .toolbar{
    display: flex;
    align-items: center;
    margin-top: 15px;
    justify-content: flex-start;
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
