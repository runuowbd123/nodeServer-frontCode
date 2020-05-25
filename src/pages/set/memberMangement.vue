<template>
  <div class="goods-goodsManage">
    <div class="search__Box">
      <Toolbar :tools="tools" @onSearch="searchFun"/>
    </div>
    <div class="page_btn">
      <a-button @click="addNewMember" type="primary" v-if="$permission.hasPermission('SET_USER_EDIT')">添加成员</a-button>
    </div>
    <div class="content-wrapper page_table-member">
      <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'" :pagination="false" :columns="columns" :dataSource="data" :rowKey="record => record.id" :loading="tableLoading">
        <div slot="status" class="action-cell" slot-scope="text, record">
          <span v-if="record.status === 0">已激活</span>
          <span v-if="record.status === 1">未激活</span>
        </div>
        <div slot="action" class="action-cell" slot-scope="text, record">
          <span v-if="record.isManager !== 1" class="handle-btn" @click="editMember(record)" style="margin-right: 10px">编辑</span>
          <span v-if="record.isManager !== 1" class="handle-btn" @click="deleteMember(record)">删除</span>
        </div>
      </a-table>
    </div>
    <div style="margin-top: 10px;display: flex; flex-direction: row-reverse; padding-bottom: 10px;">
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
    <a-modal
      title="添加成员"
      :visible="isAddOrEdit"
      v-if="isAddOrEdit"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :maskClosable='false'
    >
      <a-form-model :model="formData" ref="addMemberForm" :rules="formRule">
        <a-form-model-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="人员"
          prop="personIds"
        >
          <a-tree-select
            style="width: 100%"
            :treeData="membertree"
            v-model="formData.personIds"
            treeCheckable
            searchPlaceholder="请选择"
            @change="onChange"
            treeNodeFilterProp="title"
            :dropdownStyle="{ maxHeight: '290px !important', overflow: 'auto !important' }"
          />
        </a-form-model-item>
        

      </a-form-model>
    </a-modal>
    <a-modal
      title="编辑成员"
      :visible="editPersonModal"
      v-if="editPersonModal"
      @ok="handlePersonOk"
      @cancel="handlePersonCancel"
      :maskClosable='false'
    >
      <a-form-model :model="editFormData" ref="editPersonForm" :rules="formRule1">
        <a-form-model-item
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          label="成员"
          prop="id"
        >
          <div>
            {{editFormData.userName}}
          </div>
        </a-form-model-item>
        <a-form-model-item
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          label="角色"
          prop="roleId"
        >
          <a-select
            style="width: 240px"
            v-model="editFormData.roleId"
            placeholder="请选择店铺角色"
          >
            <a-select-option v-for="(item, index) in roleArr" :key="index" :value="item.id">{{item.roleName}}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import api from "@/api/user";
import moment from "moment";
import Toolbar from "../../components/ToolBar.vue"
export default {
  components: { Toolbar },
  data() {
    return {
      tools: [],
      searchField: {
        select: null,
        userName: '',
      },
      pager: {
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        currentPage: 1,
        pageSize: 10,
        total: 1,
        totalPage: 1
      },
      roleArr: [], // 角色列表
      membertree: [], // 可添加的成员树
      memberList: [], // 可添加的成员树的平铺
      data: [], // 表格数据
      tableLoading: false, // 表格加载
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
      },
      formData: {
        personIds: []
      },
      formRule:{
        personIds: [{ required: true, message: '请选择成员' }]
      },
      isAddOrEdit: false,
      confirmLoading: false,
      editPersonModal: false,
      editFormData: {
      },
      formRule1:{
        id: [{ required: true, message: '' }]
      },
    };
  },
  computed: {
    columns() {
      let col = [
        {
          title: '员工姓名',
          dataIndex: 'userName'
        },
        {
          title: '联系方式',
          dataIndex: 'mobile',
        },
        {
          title: '角色',
          dataIndex: 'roleName'
        },
        {
          title: '添加时间',
          dataIndex: 'inputTime',
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ];
      col = col.filter((item) => {
        if(!this.$permission.hasPermission('SET_USER_EDIT') && item.title === '操作') {
          return false;
        } else {
          return true
        }
      })
      return col
    }
  },
  created() {
    this.getList();
    this.getRoleList();
    this.getPersonTree()
  },
  methods: {
    addNewMember() {
      this.isAddOrEdit = true;
      this.getPersonTree()
    },
    
    searchFun(values) {
      this.searchField = values;
      console.log('搜索',values)
      this.pager = {
        ...this.pager,
        currentPage: 1,
      }
      this.getList();
    },
    deleteMember(record) {
      const that = this;
      this.$confirm({
        title: '删除',
        content: h => <div>确定要删除员工？</div>,
        onOk() {
          api
          .ajax({
            data: {id: record.id},
            method: "delSysUser"
          })
          .then(res => {
            that.$message.info(res.data.msg);
            that.getList();
            that.getPersonTree()
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
    handleOk() {
      // console.log('确认')
      let that = this;
      this.$refs.addMemberForm.validate((valid) => {
        if (valid) {
          console.log('-----选择出来的节点',that.formData.personIds,'------全部成员平铺',that.memberList);
          const ids = that.formData.personIds.filter((item) => {
            const targetItem = that.memberList.find((it) => {
              return it.id === item
            })
            return targetItem.type !== 0
          })
          api
            .ajax({
              data: {ids},
              method: "saveSysUser"
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
              that.getPersonTree()
              that.isAddOrEdit = false;
              that.$refs.addMemberForm.resetFields();
            })
            .catch(error => {
              console.log("error", error);
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleCancel() {
      console.log('取消')
      this.isAddOrEdit = false;
      this.$refs.addMemberForm.resetFields();
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
    getList() {
      let data = {
        ...this.pager,
        roleId: this.searchField.roleId,
        userName: this.searchField.userName,
      };
      this.tableLoading = true
      api
        .ajax({
          data,
          method: "listPageSysUser"
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
          this.tableLoading= false;
        })
        .catch(error => {
          this.tableLoading= false;
          console.log("error", error);
        });
    },
    getRoleList() {
      let data = {};
      api
        .ajax({
          data,
          method: "listSysRole"
        })
        .then(res => {
          const data = res.data.data;
          this.roleArr = data;
          const optionList = this.roleArr.map((item) => {
            return {
              value: item.id,
              name: item.roleName
            }
          })
          this.tools=[
            {
                type: 'select',
                title: '角色:',
                key: 'roleId',
                defaultValue: null,
                allowClear: true,
                options: optionList
            },
            {
                type: 'input',
                title: '姓名/联系方式:',
                placeholder: '请输入姓名/联系方式',
                key: 'userName',
                defaultValue: null,
            },
            {
                type: 'search',
                title: '筛选'
            }
          ]
          // console.log(this.tools)
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    getPersonTree() {
      api
        .ajax({
          method: "treeSysDept"
        })
        .then(res => {
          this.membertree = this.dealData(res.data.tree)
          this.memberList = this.dealData(res.data.list)
          console.log('-----------可添加人员列表',this.membertree, this.memberList)
        })
        .catch(error => {
          this.tableLoading= false;
          console.log("error", error);
        });
    },
    onChange(idList,nameList) {
      console.log(idList,nameList)
    },
    editMember(record) {
      this.editPersonModal = true;
      this.editFormData = record
    },
    handlePersonOk() {
      const that = this;
       this.$refs.editPersonForm.validate((valid) => {
        if (valid) {
          console.log(this.editFormData)
          api
            .ajax({
              data: {ids: [this.editFormData.id], roleId: this.editFormData.roleId},
              method: "changeRole"
            })
            .then(res => {
              const data = res.data;
              that.$message.success(data.message);
              that.getList();
              that.getPersonTree()
              that.editPersonModal = false;
              that.$refs.editPersonForm.resetFields();
            })
            .catch(error => {
              console.log("error", error);
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handlePersonCancel() {
      this.editPersonModal = false;
      this.$refs.editPersonForm.resetFields();
    },
    dealData(treeData) {
      let newList = treeData.map((item) => {
        if(item.children && item.children.length > 0) {
          return {
            ...item,
            title: item.name,
            value: item.id,
            key: item.id,
            children: this.dealData(item.children)
          }
        } else {
          return {
            ...item,
            title: item.name,
            value: item.id,
            key: item.id,
          } 
        }
      })
      return newList
    }
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
    margin: 10px 0;
    .right-box {
      width: 250px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .search__Box {
    margin-bottom: 10px;
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
  .page_table-member {
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
