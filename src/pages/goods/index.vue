<template>
  <div class="goods-goodsManage">
    <div class="search__Box">
      <TableSearchForm @handleSubmit="searchFun" :formList="searchFormList" />
    </div>

    <div class="page_tabs">
      <a-tabs :activeKey="activeKey" @change="changeTab">
        <a-tab-pane v-for="(itm, idx) in tabs" :key="idx" :tab="itm">
        </a-tab-pane>
      </a-tabs>
    </div>

    <div class="page_btn" v-if="$permission.hasPermission('GOODS_MANAGER_EDIT')">
      <div class="fl" v-if="activeKey == 1||activeKey == 2">
        <a-button @click="piliang('下架', 1)">下架</a-button>
        <a-button @click="piliang('删除', 0)">删除</a-button>
      </div>
      <div class="fl" v-if="activeKey == 3">
        <a-button @click="piliang('上架', 2)">上架</a-button>
        <a-button @click="piliang('删除', 0)">删除</a-button>
      </div>
      <a-button type="primary">
        <router-link to="/goods/goodsadd">新建商品</router-link>
      </a-button>
    </div>

    <div class="page_table">
      <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'" :rowSelection="activeKey !== 0 ? rowSelection : null" :bordered="false" :pagination="false" :columns="columns" :dataSource="listData" :rowKey="record => record.id" @change="handleChange" :loading="tableLoading">
        <div slot="mainPic" slot-scope="text, record, index">
          <img class="table-img" :src="record.mainPic" />
        </div>
        <router-link slot="goodsName" slot-scope="text, record, index" :to="'/goods/goodsedit?index=3&id=' + record.id">{{record.goodsName}}</router-link>
        <div slot="action" slot-scope="text, record, index">
          <a href="javascript:;" v-if="record.goodsStatus == '已下架'" @click="geton(record, index)">上架 |</a>
          <a href="javascript:;" v-if="record.goodsStatus == '出售中'||record.goodsStatus == '已售罄'" @click="getoff(record, index)">下架 |</a>
          <router-link :to="'/goods/goodsedit?id=' + record.id">编辑</router-link>
          <a href="javascript:;" @click="deleteConfirm(record, index)">| 删除</a>
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
      rowSelection: {
        columnWidth: "60px",
        selectedRowKeys: [],
        onChange: (selectedRowKeys, selectedRows) => {
          this.goodsIds = selectedRowKeys;
          this.rowSelection.selectedRowKeys = selectedRowKeys;
        }
      },
      goodsIds: [],
      searchField: {},
      searchFormList: [
        {
          type: "input",
          name: "goodsName",
          label: "商品名称"
        },
        {
          type: "inputNumberRange",
          name: ["minSalesVolume", "maxSalesVolume"],
          label: "总销量"
        },
        {
          type: "inputNumberRange",
          name: ["minRealPrice", "maxRealPrice"],
          label: "价格"
        },
        {
          type: "searchSelect",
          name: "groupId",
          label: "商品分组",
          child: [],
          allowClear: true
        },
        {
          type: "searchSelect",
          name: "tagId",
          label: "商品标签",
          child: [],
          allowClear: true
        },
      ],
      sortedInfo: {},
      listData: [],
      tableLoading: false,
      pager: {
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalPage: 0
      },
      activeKey: 0,
      tabs: ["全部商品", "出售中", "已售罄", "已下架"]
    };
  },
  computed: {
    columns() {
      let columns = [
        {
          title: "商品",
          align: "center",
          dataIndex: "mainPic",
          key: "mainPic",
          scopedSlots: { customRender: "mainPic" }
        },
        {
          title: "商品名称",
          align: "center",
          width:'240px',
          dataIndex: "goodsName",
          key: "goodsName",
          scopedSlots: { customRender: "goodsName" }
        },
        {
          title: "价格",
          align: "center",
          dataIndex: "realPrice",
          key: "realPrice",
          sorter: true,
          sortOrder: this.sortedInfo && this.sortedInfo.columnKey === 'realPrice' && this.sortedInfo.order,
        },
        {
          title: "访问量",
          align: "center",
          dataIndex: "pageView",
          key: "pageView"
        },
        {
          title: "总销量",
          align: "center",
          dataIndex: "salesVolume",
          key: "salesVolume",
          sorter: true,
          sortOrder: this.sortedInfo && this.sortedInfo.columnKey === 'salesVolume' && this.sortedInfo.order,
        },
        {
          title: "库存",
          align: "center",
          dataIndex: "stock",
          key: "stock",
          sorter: true,
          sortOrder: this.sortedInfo && this.sortedInfo.columnKey === 'stock' && this.sortedInfo.order,
        },
        {
          title: "更新时间",
          align: "center",
          dataIndex: "updateTime",
          key: "updateTime"
        },
        {
          title: "序号",
          align: "center",
          dataIndex: "sort",
          key: "sort"
        },
        {
          title: "商品状态",
          align: "center",
          dataIndex: "goodsStatus",
          key: "goodsStatus"
        },
        {
          title: "操作",
          width: "150px",
          align: "center",
          dataIndex: "action",
          key: "action",
          scopedSlots: { customRender: "action" }
        }
      ]
      if (!this.$permission.hasPermission('GOODS_MANAGER_EDIT')) {
        columns = columns.filter((item) => {
          return item.title !== '操作'
        })
      }
      return columns
    }
  },
  created() {
    if(this.$route.query.tagId) {
      this.searchField.tagId = this.$route.query.tagId;
    }
    this.getGroupList();
    this.getLabelList();
    this.getList();
  },
  methods: {
    searchFun(values) {
      this.searchField = values;
      this.getList();
    },
    handleChange(pagination, filters, sorter) {
      console.log('Various parameters', pagination, filters, sorter);
      this.sortedInfo = sorter;
      this.getList();
    },
    getList() {
      let data = {
        ...this.pager,
        ...this.searchField,
        queryType: this.activeKey,
        orderBy: this.sortedInfo.columnKey,
        direction: this.sortedInfo.order
      };
      this.tableLoading = true;
      api
        .ajax({
          data,
          method: "goodsList"
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
          this.tableLoading = false;
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    getGroupList() {
      let data = {};
      api
        .ajax({
          data,
          method: "listGroupForGoods"
        })
        .then(res => {
          const data = res.data.data;
          let arr = [];
          let obj = {};
          for (let i = 0; i < data.list.length; i++) {
            obj = {
              name: data.list[i].name,
              value: data.list[i].id
            }
            arr.push(obj);
          }
          this.searchFormList[3].child = arr;
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    getLabelList() {
      let data = {};
      api
        .ajax({
          data,
          method: "listTagForGoods"
        })
        .then(res => {
          const data = res.data.data;
          let arr = [];
          let obj = {};
          for (let i = 0; i < data.list.length; i++) {
            obj = {
              name: data.list[i].name,
              value: data.list[i].id
            }
            arr.push(obj);
          }
          if(this.$route.query.tagId) {
            this.searchFormList[4].defaultValue = this.searchField.tagId
            this.searchFormList[4].child = arr;
          } else {
            this.searchFormList[4].child = arr;
          }
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
      this.goodsIds = [];
      this.rowSelection.selectedRowKeys = [];
      this.getList();
    },
    deleteConfirm(record, index) {
      this.$confirm({
        title: "删除",
        content: "对该条商品进行删除",
        onOk: () => {
          api
            .ajax({
              data: { goodsIds: [record.id], type: 0 },
              method: "editGoodsStatus"
            })
            .then(res => {
              this.$message.info(res.data.data);
              this.listData.splice(index, 1);
              this.goodsIds = [];
              this.rowSelection.selectedRowKeys = [];
            })
            .catch(error => {
              console.log("error", error);
            });
        }
      });
    },
    getoff(record, index) {
      this.$confirm({
        title: "下架",
        content: "对该商品进行下架",
        onOk: () => {
          api
            .ajax({
              data: { goodsIds: [record.id], type: 1 },
              method: "editGoodsStatus"
            })
            .then(res => {
              this.$message.info(res.data.data);
              // this.listData[index].goodsStatus = "已下架";
              this.getList();
            })
            .catch(error => {
              console.log("error", error);
            });
        }
      });
    },
    geton(record, index) {
      this.$confirm({
        title: "上架",
        content: "对该商品进行上架",
        onOk: () => {
          api
            .ajax({
              data: { goodsIds: [record.id], type: 2 },
              method: "editGoodsStatus"
            })
            .then(res => {
              this.$message.info(res.data.data);
              // this.listData[index].goodsStatus = "出售中";
              this.getList();
            })
            .catch(error => {
              console.log("error", error);
            });
        }
      });
    },
    piliang(str, type) {
      this.$confirm({
        title: str,
        content: "对该条商品进行" + str,
        onOk: () => {
          api
            .ajax({
              data: { goodsIds: this.goodsIds, type },
              method: "editGoodsStatus"
            })
            .then(res => {
              this.$message.info(res.data.data);
              this.goodsIds = [];
              this.rowSelection.selectedRowKeys = [];
              this.getList();
            })
            .catch(error => {
              console.log("error", error);
            });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.goods-goodsManage {
  .page_tabs {
    margin-top: 15px;
    border-top: 1px solid #e8e8e8;
    .ant-tabs-top-bar {
      background-color: #fff;
      margin: 0;
      border-bottom: none;
    }
  }
  .page_btn {
    margin-top: 15px;
    text-align: right;
  }
  .page_table {
    margin-top: 15px;
    // background-color: #fff;
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
