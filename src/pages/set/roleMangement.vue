<template>
  <div class="goods-goodsManage">
    <div class="page_btn">
      <a-button type="primary" @click="addNewMember" v-if="$permission.hasPermission('SET_ROLE_EDIT')">添加角色</a-button>
    </div>
    <div class="content-wrapper page_table-role">
      <a-table :columns="columns" :dataSource="data"  :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'" :rowKey="record => record.id">
        <div slot="default" slot-scope="text, record">
          <div class="default" :style="record.type === 0 ? 'color:transparent;background: transparent;' : ''">默认</div>
          <span>{{text}}</span>
        </div>
        <div slot="action" class="action-cell" slot-scope="text, record">
          <template v-if="$permission.hasPermission('SET_ROLE_EDIT') && record.type === 0">
            <span class="handle-btn" @click="editMember(record)" style="margin-right:20px;">编辑</span>
            <span class="handle-btn" @click="deleteMember(record)">删除</span>
          </template>
          <template v-if="record.type !== 0">
            <span class="handle-btn" @click="lookMember(record)">查看</span>
          </template>
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
  components: { TableSearchForm },
  data() {
    return {
      data: [],
    };
  },
  computed: {
    columns() {
        let columns = [
          {
            title: '',
            width: 70,
            dataIndex: 'default',
            scopedSlots: { customRender: 'default' }
          },
          {
            title: '员工角色',
            dataIndex: 'roleName'
          },
          {
            title: '员工数量',
            dataIndex: 'userCount',
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ];
        if(!this.$permission.hasPermission('SET_ROLE_EDIT')) {
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
    addNewMember() {
      this.$router.push('/set/roleMangement/addRole')
    },
    editMember(record) {
      console.log('编辑',record)
      this.$router.push({
        path: '/set/roleMangement/addRole',
        query: {
          id: record.id
        }
      })
    },
    lookMember(record) {
      this.$router.push({
        path: '/set/roleMangement/addRole',
        query: {
          id: record.id,
          look: true
        }
      })
    },
    deleteMember(record) {
      let that = this;
      this.$confirm({
        title: '删除',
        content: h => <div>确定要删除员工？</div>,
        onOk() {
          let data = {
            id: record.id
          };
          api
            .ajax({
              data,
              method: "delSysRole"
            })
            .then(res => {
              const data = res.data;
              that.$message.success(data.msg);
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
          method: "listPageSysRole"
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
  .content-wrapper {
    .default {
      padding: 2px 5px;
      background: rgba(102, 102, 102, 1);
      color: #fff;
    }
    .handle-btn {
      color: #1890ff;
      cursor: pointer;
      user-select: none;
    }
  }
  .page_table-role {
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
    // .ant-table-row .ant-table-row-level-0:nth-child(odd) {
    //   background-color: #f7f8fa !important;
    // }
    // .ant-table-row .ant-table-row-level-0:nth-child(even) {
    //   background-color: #fff;
    // }
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
    .default {
      padding: 2px 5px;
      background: rgba(102, 102, 102, 1);
      color: #fff;
      width: 40px;
      text-align: center;
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
