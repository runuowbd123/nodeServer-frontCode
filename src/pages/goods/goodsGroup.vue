<template>
  <div class="goods-goodsManage">
    <TableSearchForm @handleSubmit="searchFun" :formList="searchFormList" />
    <div class="page_btn">
      <a-button type="primary" @click="addGroup" v-if="$permission.hasPermission('GOODS_GROUPS_EDIT')">新增分组</a-button>
    </div>
    <a-spin tip="加载中..." :spinning="listLoading || listItemLoading">
      <div class="content-wrapper">
        <div class="collapse-wrapper" v-for="(item, index) in collapseArr" :key="index" >
          <div class="collapse-header" @click="toggleSpread(item)">
            <a-icon type="right" :class="item.rotate ? 'backRotate' : 'rotate'" />
            <div class="left-info">{{item.name}}</div>
            <div class="mid-info">商品数量：<span>{{item.count}}</span></div>
            <div class="right-info" v-if="$permission.hasPermission('GOODS_GROUPS_EDIT')">
              <span class="handle-btn" @click="editFun($event,item)">编辑</span>
              <span class="handle-btn" @click="deleteFun($event,item)">删除</span>
            </div>
          </div>
          <div class="info-box" :class="item.isShow ? 'show' : 'hide'">
            <div class="scroll-item" v-for="(obj, ind) in item.dataArr" :key="ind">
              <div class="item-left">
                <a-avatar class="avatar" :size="40" icon="user" :src="obj.mainPic" />
                <span class="goods-name" :title="obj.goodsName">{{obj.goodsName}}</span>
              </div>
              <div class="delete-btn" @click="deleteFun($event,item,obj)" v-if="$permission.hasPermission('GOODS_GROUPS_EDIT')">移除</div>
            </div>
            <a-empty v-if="item.isClick && (item.dataArr || []).length === 0" />
          </div>
        </div>
        <a-empty v-if="collapseArr.length === 0" />
      </div>
    </a-spin>

    <a-modal :maskClosable="false" :title="addText" v-model="isAddOrEdit" :width="850" :confirmLoading="confirmLoading" okText="保存" @ok="saveGroup" @cancel="cancelGroup">
      <div class="group-name">
        <div class="left-item">
          <span class="red">*</span>
          分组名称：
        </div>
        <div class="right-item">
          <a-input v-model.trim="groupName" placeholder="请输入分组名称" :maxLength="15" />
          <div class="error red" v-if="confirm && !groupName">请输入分组名称</div>
        </div>
      </div>
      <div class="group-product group-product-fenzu">
        <div class="left-item">
          <span class="hidden">*</span>
          选择商品：
        </div>
        <div class="right-item">
          <a-transfer
            :dataSource="mockData"
            :operations="['添加', '移除']"
            showSearch
            :listStyle="{
              width: '300px',
              height: '300px',
            }"
            :targetKeys="targetKeys"
            @change="handleChange"
            :render="renderItem"
            :filterOption="(inputValue, item) => item.title.indexOf(inputValue) !== -1"
          >
          </a-transfer>
        </div>
      </div>
    </a-modal>
    <div class="page_pagination" v-if="collapseArr.length !== 0">
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
  components: {
    TableSearchForm
  },
  data() {
    return {
      listLoading: false,
      listItemLoading: false,
      isSpread: false,
      activeKey: [],
      searchText: '',
      collapseArr: [],
      currentPageSize: 3,
      isAddOrEdit: false,
      groupName: '',
      addText: '',
      isAddOrEdit: false,
      isEdit: false,
      editId: '',
      isAdd: false,
      confirm: false,
      confirmLoading: false,
      mockData: [],
      targetKeys: [],
      pager: {
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalPage: 0
      },
      searchField: {},
      searchFormList: [
        {
          type: "input",
          name: "name",
          label: "分组名称"
        },
      ]
    };
  },
  created() {
    console.log(this.$permission)
    this.getList();
    this.getgoodsList();
  },
  methods: {
    // spreadAll() {
    //   const newCollapseArr = this.collapseArr.map((item) => {
    //     return {
    //       ...item,
    //       rotate: true,
    //       isShow: true,
    //       isClick: true
    //     }
    //   })
    //   this.collapseArr = newCollapseArr;
    //   this.isSpread = true;
    // },
    // closeAll() {
    //   const newCollapseArr = this.collapseArr.map((item) => {
    //     return {
    //       ...item,
    //       rotate: false,
    //       isShow: false,
    //       isClick: false
    //     }
    //   })
    //   this.collapseArr = newCollapseArr;
    //   this.isSpread = false
    // },
    searchFun(values) {
      this.searchField = values;
      this.getList();
    },
    addGroup() {
      this.isAddOrEdit = true;
      this.isAdd = true;
      this.addText = '新增分组';
    },
    toggleSpread(obj) {
      console.log(123, obj)
      if(!obj.isClick) {
        this.$set(obj, 'isClick', true);
      }
      if(!obj.rotate) {
        this.$set(obj, 'rotate', true);
      } else {
        this.$set(obj, 'rotate', false);
      }
      if(!obj.isShow) {
        this.$set(obj, 'isShow', true);
        this.getGoodsList(obj);
      } else {
        this.$set(obj, 'isShow', false);
      }

    },
    changeActivekey(key) {
      console.log(key)
      if (key.length < this.currentPageSize) {
        this.isSpread = false;
      } else {
        this.isSpread = true;
      }
    },
    editFun(e,obj) {
      e.stopPropagation();
      this.isAddOrEdit = true;
      this.isEdit = true;
      this.addText = '编辑分组';
      this.editId = obj.id;
      this.getEditInfo(obj.id);
    },
    deleteFun(e,item,obj) {
      e.stopPropagation();
      let that = this;
      this.$confirm({
        title: '删除',
        content: `是否确认${obj ? '移除当前商品': '删除该分组'}？`,
        okText: '确认',
        cancelText: '取消',
        onOk() {
          console.log('删除分组')
          that.deleteGroup(item,obj);
        },
      });
    },
    renderItem(item) {
      const customLabel = (
        <div class="custom-item">
          <a-avatar size={40} src={item.description.split('+++')[0]} icon="user" style="margin-top: 5px"/>
          <div class="right-pro-info">
            <div class="pro-top" title={item.title}>{item.title}</div>
            <div class="pro-bottom">
              <div class="pro-name">￥{item.description.split('+++')[1]}</div>
              <div class="pro-remain">库存{item.description.split('+++')[2]}</div>
            </div>
          </div>
        </div>
      );

      return {
        label: customLabel, // for displayed item
        value: item.description.split('+++')[3]
      };
    },
    deleteGroup(item,obj) {
      console.log(item)
      let data = {
        type: obj ? 1 : 0,
        groupId: item.id
      };
      if (obj) {
        data.goodsId = obj.goodsId
      }
      api
        .ajax({
          data,
          method: "delGroupOrRemoveGoods"
        })
        .then(res => {
          const data = res.data.data;
          this.$message.success(data);
          let pager1 = {
            currentPage: 1,
            total: 0,
            totalPage: 0
          };
          let pager2 = JSON.parse(JSON.stringify(this.pager));
          this.pager = Object.assign({},pager2,pager1)
          if (obj) {
            // this.getGoodsList(item);
            this.getList(item);
          } else {
            this.getList();
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    handleChange(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys);
      this.targetKeys = targetKeys;
    },
    getEditInfo(groupId) {
      let data = {
        groupId: groupId,
        type: 1
      };
      api
        .ajax({
          data,
          method: "groupGoodsList"
        })
        .then(res => {
          const data = res.data.data;
          this.targetKeys = data.ids;
          this.groupName = data.groupName;
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    getList(item) {
      let data = {
        ...this.pager,
        ...this.searchField
      };
      this.listLoading = true;
      api
        .ajax({
          data,
          method: "listGroup"
        })
        .then(res => {
          const data = res.data.data;
          this.collapseArr = data.list
          if(item) {
            data.list.forEach((it) => {
              if(it.id === item.id) {
                this.toggleSpread(it)
              }
            });
          }
          this.pager = {
            pageSizeOptions: ["10", "20", "30", "40", "50"],
            currentPage: data.currentPage,
            pageSize: data.pageSize,
            total: data.totalRecord,
            totalPage: data.totalPage
          };
          this.listLoading = false;
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    getGoodsList(item) {
      let data = {
        groupId: item.id,
        type: 2
      };
      this.listItemLoading = true;
      api
        .ajax({
          data,
          method: "groupGoodsList"
        })
        .then(res => {
          const data = res.data.data;
          this.$set(item, 'dataArr', data);
          this.listItemLoading = false;
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
              description: arr[i].mainPic + '+++' + arr[i].price + '+++' + arr[i].stock + '+++' + arr[i].goodsId
            }
            dataArr.push(obj)
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
        this.saveGroupData();
      }
    },
    cancelGroup() {
      this.confirm = false;
      this.groupName = '';
      this.isAddOrEdit = false;
      this.isAdd = false;
      this.isEdit = false;
      this.editId = '';
      this.groupName = '';
      this.targetKeys = [];
    },
    saveGroupData() {
      let data = {
        ids: this.targetKeys,
        name: this.groupName
      };
      let that = this;
      let method;
      if (this.isEdit) {
        data.groupId = that.editId;
        method = "editGroup";
      } else {
        method = "createGroup";
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
          this.editId = '';
          this.groupName = '';
          this.targetKeys = [];
          let pager1 = {
            currentPage: 1,
            total: 0,
            totalPage: 0
          };
          let pager2 = JSON.parse(JSON.stringify(this.pager));
          this.pager = Object.assign({},pager2,pager1)
          this.getList();
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  }
};
</script>
<style lang="less" scoped>
.info-box {
  max-height: 0;
  overflow: hidden;
  transition: all 0s;
  background: #fff;
}
.show {
  max-height: 270px;
  overflow: auto;
  transition: all 0.3s ease;
}
.hide {
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}
.rotate{
  transition: all 0.3s ease;
}
.backRotate{
  transform:rotate(90deg);
  transition: all 0.3s ease;
}


.group-name {
  width: 100%;
  height: 34px;
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
  line-height: 34px;
  // text-align: right;
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
    text-overflow:ellipsis;
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

.goods-goodsManage {
  .page_btn {
    margin: 10px 0;
    text-align: right;
  }
  .top-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
    .right-box {
      width: 250px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .content-wrapper {
    .collapse-wrapper{
      margin-bottom: 20px;
      .collapse-header {
      border: 1px solid #ccc;
      height: 50px;
      background: rgb(247,248,250);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      cursor: pointer;
      user-select: none;
      .left-info{
        width: 220px;
      }
      .mid-info{
        width: 140px;
      }
      .right-info {
        width: 70px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .handle-btn {
          color: #1890ff;
          user-select: none;
        }
      }
    }
    .scroll-item {
      border-bottom: 1px solid #ccc;
      height: 54px;
      line-height: 54px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item-left {
        width: calc(100% - 70px);
        display: flex;
        align-items: center;
        .avatar {
          flex-shrink: 0;
          margin-right: 20px;
        }
        .goods-name {
          width: calc(100% - 60px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .delete-btn {
        cursor: pointer;
        user-select: none;
        color: #1890ff;
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
<style lang="less">
  .group-product-fenzu {
    .ant-transfer-list-content-item {
        display: flex;
        align-items: center;
      }
      .is-visible {
        height: auto !important;
      }
  .ant-collapse-header {
      background: #e0e0e0;
    }
    .ant-collapse-content {
      max-height: 270px;
      overflow: auto;
    }
  }
</style>
