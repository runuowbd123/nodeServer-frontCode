<template>
  <div class="goods-goodsManage">
    <div class="top-box" v-if="$permission.hasPermission('GOODS_LABEL_EDIT')">
      <a-button @click="batchDelete">批量删除</a-button>
      <a-button type="primary" @click="addGroup">新增标签</a-button>
    </div>
    <div class="page_table">
      <a-table
        :rowClassName="(rec, index) => (index % 2 === 0 ? 'jishu' : 'oushu')"
        :columns="columns"
        :dataSource="data"
        :rowSelection="{ onChange: changeSelection }"
        :rowKey="record => record.id"
        :pagination="false"
      >
        <a slot="name" slot-scope="text" href="javascript:;">{{ text }}</a>
        <!-- <span slot="customTitle"><a-icon type="smile-o" /> Name</span> -->
        <span slot="tags" slot-scope="tags">
          <a-tag
            v-for="tag in tags"
            :color="
              tag === 'loser'
                ? 'volcano'
                : tag.length > 5
                ? 'geekblue'
                : 'green'
            "
            :key="tag"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
        <span slot="count" slot-scope="text, record">
          <a
            href="javascript:;"
            @click="
              $router.push({
                path: `/goods/goodsManage`,
                query: { tagId: record.id }
              })
            "
            >{{ text }}</a
          >
        </span>
        <span slot="action" slot-scope="text, record">
          <a href="javascript:;" @click="editFun(record)">编辑</a>
          <a-divider type="vertical" />
          <a href="javascript:;" @click="deleteFun(record)">删除</a>
        </span>
      </a-table>
    </div>
    <a-modal
      :title="addText"
      v-model="isAddOrEdit"
      :confirmLoading="confirmLoading"
      okText="保存"
      @ok="saveGroup"
      @cancel="cancelGroup"
      :maskClosable="false"
    >
      <!-- :width="830" -->
      <div class="group-name">
        <div class="left-item">
          <span class="red">*</span>
          标签名称：
        </div>
        <div class="right-item">
          <a-input
            v-model.trim="groupName"
            placeholder="请输入标签名称"
            :maxLength="5"
          />
          <div class="error red" v-if="confirm && !groupName">
            请输入标签名称
          </div>
        </div>
      </div>
      <!-- <div class="group-product group-product-add">
        <div class="left-item">
          <span class="hidden">*</span>
          选择商品：
        </div>
        <div class="right-item">
          <a-transfer
            :dataSource="mockData"
            showSearch
            :operations="['添加', '移除']"
            :listStyle="{
              width: '300px',
              height: '300px',
            }"
            :lazy="false"
            :targetKeys="targetKeys"
            @change="handleChange"
            :render="renderItem"
            :filterOption="(inputValue, item) => item.title.indexOf(inputValue) !== -1"
          >
          </a-transfer>
        </div>
      </div> -->
    </a-modal>
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
  data() {
    return {
      data: [],
      addText: "",
      isAddOrEdit: false,
      isEdit: false,
      editId: "",
      isAdd: false,
      groupName: "",
      confirm: false,
      confirmLoading: false,
      mockData: [],
      targetKeys: [],
      handleId: "",
      pager: {
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalPage: 0
      },
      selectArr: []
    };
  },
  computed: {
    columns() {
      let columns = [
        {
          title: "标签名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "标签绑定商品数",
          dataIndex: "count",
          key: "count",
          scopedSlots: { customRender: "count" }
        },
        {
          title: "操作",
          key: "action",
          scopedSlots: { customRender: "action" }
        }
      ];
      columns = columns.filter(item => {
        if (item.title === "操作") {
          return this.$permission.hasPermission("GOODS_LABEL_EDIT");
        } else {
          return true;
        }
      });
      return columns;
    }
  },
  created() {
    this.getList();
    this.getgoodsList();
  },
  methods: {
    batchDelete() {
      const that = this;
      let arr = this.selectArr.map((item) => {
        return item.id
      })
      if (arr.length === 0) {
        this.$message.info("请选择需要删除的数据");
      } else {
        that.$confirm({
          title: '删除',
          content: '是否确认删除选中标签？',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            this.deleteData(arr);
          }
        });
      }
    },
    addGroup() {
      this.isAddOrEdit = true;
      this.isAdd = true;
      this.addText = "新增标签";
    },
    changeActivekey(key) {
      console.log(key);
      if (key.length < this.currentPageSize) {
        this.isSpread = false;
      } else {
        this.isSpread = true;
      }
    },
    editFun(obj) {
      this.isAddOrEdit = true;
      this.isEdit = true;
      this.addText = "编辑标签";
      this.editId = obj.id;
      this.getEditInfo(obj.id);
    },
    deleteFun(obj) {
      let that = this;
      let arr;
      this.$confirm({
        title: "删除",
        content: "是否确认删除标签？",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          arr = [obj.id];
          that.deleteData(arr);
        }
      });
    },
    changeSelection(selectedRowKeys, selectedRows) {
      console.log(selectedRowKeys, "--------", selectedRows);
      this.selectArr = selectedRows;
    },
    renderItem(item) {
      // <img class="product-img" src="" />
      const customLabel = (
        <div class="custom-item">
          <a-avatar
            size={40}
            src={item.description.split("+++")[0]}
            icon="user"
            style="margin-top: 5px"
          />
          <div class="right-pro-info">
            <div class="pro-top" title={item.title}>
              {item.title}
            </div>
            <div class="pro-bottom">
              <div class="pro-name">￥{item.description.split("+++")[1]}</div>
              <div class="pro-remain">
                库存{item.description.split("+++")[2]}
              </div>
            </div>
          </div>
        </div>
      );

      return {
        label: customLabel, // for displayed item
        value: item.description.split("+++")[3]
      };
    },
    handleChange(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys);
      this.targetKeys = targetKeys;
    },
    getEditInfo(tagId) {
      let data = {
        tagId: tagId,
        type: 1
      };
      api
        .ajax({
          data,
          method: "tagGoodsList"
        })
        .then(res => {
          const data = res.data.data;
          this.targetKeys = data.ids;
          this.groupName = data.tagName;
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    getList() {
      let data = {
        ...this.pager
      };
      api
        .ajax({
          data,
          method: "listTag"
        })
        .then(res => {
          const data = res.data.data;
          this.data = data.list;
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
    deleteData(arr) {
      let data = {
        ids: arr
      };
      api
        .ajax({
          data,
          method: "delTag"
        })
        .then(res => {
          const data = res.data;
          this.$message.success(data.data);
          let pager1 = {
            currentPage: 1,
            total: 0,
            totalPage: 0
          };
          let pager2 = JSON.parse(JSON.stringify(this.pager));
          this.pager = Object.assign({}, pager2, pager1);
          this.getList();
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    getgoodsList() {
      let data = {
        type: 0
      };
      let that = this;
      api
        .ajax({
          data,
          method: "groupGoodsList"
        })
        .then(res => {
          const data = res.data.data;
          let arr = JSON.parse(JSON.stringify(data));
          let dataArr = [];
          let obj = {};
          for (let i = 0; i < arr.length; i++) {
            // that.$set(arr[i], 'key', arr[i].goodsId);
            obj = {
              key: arr[i].goodsId,
              title: arr[i].goodsName,
              description:
                arr[i].mainPic +
                "+++" +
                arr[i].price +
                "+++" +
                arr[i].stock +
                "+++" +
                arr[i].goodsId
            };
            dataArr.push(obj);
          }
          that.mockData = dataArr;
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
    saveGroup() {
      this.confirm = true;
      if (this.groupName) {
        this.confirmLoading = true;
        this.saveLabel();
      }
    },
    cancelGroup() {
      this.confirm = false;
      this.groupName = "";
      this.isAddOrEdit = false;
      this.isAdd = false;
      this.isEdit = false;
      this.editId = "";
      this.groupName = "";
      this.targetKeys = [];
    },
    saveLabel() {
      let data = {
        // ids: this.targetKeys,
        name: this.groupName
      };
      let that = this;
      let method;
      if (this.isEdit) {
        data.tagId = that.editId;
        method = "editTag";
      } else {
        method = "createTag";
      }
      api
        .ajax({
          data,
          method: method
        })
        .then(res => {
          const data = res.data.data;
          this.$message.success(data);
          this.confirm = false;
          this.confirmLoading = false;
          this.isAddOrEdit = false;
          this.isAdd = false;
          this.isEdit = false;
          this.editId = "";
          this.groupName = "";
          this.targetKeys = [];
          this.selectArr = [];
          let pager1 = {
            currentPage: 1,
            total: 0,
            totalPage: 0
          };
          let pager2 = JSON.parse(JSON.stringify(this.pager));
          this.pager = Object.assign({}, pager2, pager1);
          this.getList();
        })
        .catch(error => {
          console.log("error", error);
          this.confirmLoading = false;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.ant-collapse-header {
  background: #e0e0e0;
}
.ant-collapse-content {
  max-height: 270px;
  overflow: auto;
}

.group-name {
  width: 100%;
  height: 34px;
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
  line-height: 34px;
  // text-align: right;
  .left-item {
    padding: 0 10px 0 40px;
  }
  .right-item {
    width: 200px;
  }
  .error {
    font-size: 12px;
    line-height: 20px;
  }
}
.group-product {
  width: 100%;
  display: flex;
  align-items: flex-start;
}
.red {
  color: #e83030;
}
.hidden {
  color: transparent;
}
.custom-item {
  height: 50px;
  display: flex;
  justify-content: space-between;
  // flex-direction: column;
}
.right-pro-info {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 200px;
  margin-left: 10px;
  .pro-top {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .pro-bottom {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    .pro-name {
      width: 50%;
    }
    .pro-remain {
      width: 50%;
    }
  }
}
.is-visible {
  height: auto !important;
}
.goods-goodsManage {
  .top-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
  }
  .page_table {
    margin-top: 15px;

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
<style lang="less">
.group-product-add .ant-transfer-list-content-item {
  display: flex;
  align-items: center;
}
</style>
