<template>
  <div class="goods-goodsManage">
    <div class="page_btn">
      <a-button type="primary" @click="addNewTemplate" v-if="$permission.hasPermission('SET_ADDRESS_EDIT')">新增地址</a-button>
    </div>
    <div class="content-wrapper page_table_adress">
      <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'" :columns="columns" :dataSource="data" :rowKey="record => record.id">
        <div slot="default" slot-scope="text, record">
          <div class="default" :style="record.isDefault === 0 ? 'color:transparent;background: transparent;' : ''">默认</div>
          <span>{{text}}</span>
        </div>
        <div slot="action" class="action-cell" slot-scope="text, record">
          <span class="handle-btn" style="margin-right:20px;" @click="editAdress(record)">编辑</span>
          <a-tooltip placement="topLeft" v-if="record.isDefault === 1">
            <template slot="title">
              <span>默认退货地址不可删除</span>
            </template>
            <span class="handle-btn" style="color:#d0d0d0;cursor:default;">删除</span>
          </a-tooltip>
          <span v-else class="handle-btn" @click="deleteAdress(record)">删除</span>
        </div>
      </a-table>
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
      data: []
    };
  },
  computed:{
    columns() {
      let columns = [
        {
          title: '',
          width: 70,
          dataIndex: 'default',
          scopedSlots: { customRender: 'default' }
        },
        {
          title: '联系人',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '联系方式',
          dataIndex: 'phone',
        },
        {
          title: '地址',
          dataIndex: 'detailAddress',
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ];
      if(!this.$permission.hasPermission('SET_ADDRESS_EDIT')) {
        columns = columns.filter((item) => {
          return item.title !== '操作'
        })
      }
      return columns;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    addNewTemplate() {
      this.isAddOrEdit = true;
      this.addText = '新增分组';
      this.$router.push({
        path: '/set/businessAddress/addNewAddress',
        query: {
          type: '0'
        }
      })
    },
    editAdress(record) {
      this.$router.push({
        path: '/set/businessAddress/addNewAddress',
        query: {
          id: record.id
        }
      })
    },
    deleteAdress(record) {
      let that = this;
      this.$confirm({
        title: '删除',
        content: h => <div>确认删除该地址？</div>,
        onOk() {
          let data = {
            id: record.id
          };
          api
            .ajax({
              data,
              method: "delAddr"
            })
            .then(res => {
              const data = res.data.data;
              that.$message.success(data);
              let pager1 = {
                currentPage: 1,
                total: 0,
                totalPage: 0
              };
              let pager2 = JSON.parse(JSON.stringify(that.pager));
              that.pager = Object.assign({},pager2,pager1)
              that.getList();
            })
            .catch(error => {
              console.log("error", error);
            });
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    getList() {
      let data = {
        ...this.pager
      };
      api
        .ajax({
          data,
          method: "listAddr"
        })
        .then(res => {
          const data = res.data.data;
          let arr = JSON.parse(JSON.stringify(data.list));
          for (let i = 0; i < arr.length; i++) {
            arr[i].default = '';
          }
          this.data = arr;
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
  }
};
</script>
<style lang="less" scoped>
.goods-goodsManage {
  .page_btn {
    margin-top: 10px;
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
  
  .page_table_adress {
    margin-top: 15px;
    background-color: rgba(0,0,0,0);
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
    .ant-table-row.ant-table-row-level-0:nth-child(even) {
      background-color: #fff;
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
  .content-wrapper {
    .default {
      padding: 2px 5px;
      background: rgba(102, 102, 102, 1);
      color: #fff;
      width: 40px;
      text-align: center;
    }
    .handle-btn {
      color: #1890ff;
      cursor: pointer;
      user-select: none;
    }
  }
  // // 分页
  // .page_pagination {
  //   text-align: right;
  //   margin-top: 15px;
  //   .ant-select-dropdown-menu {
  //     text-align: center;
  //   }
  // }
}
</style>
