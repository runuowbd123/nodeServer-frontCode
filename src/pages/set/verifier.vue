<template>
  <div class="verifier__Box">
    <div class="page_btn">
      <a-button
        type="primary"
        @click="
          () => {
            addShow = true;
          }
        "
        v-if="$permission.hasPermission('SET_CHECKER_EDIT')"
        >添加核销员</a-button
      >
    </div>

    <div class="page_table">
      <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'"
        :bordered="false"
        :pagination="false"
        :columns="columns"
        :dataSource="listData"
        :rowKey="record => record.id"
      >
        <span slot="action" slot-scope="text, record, index">
          <a href="javascript:;" @click="edit(record, index)">编辑</a>
          <a-divider type="vertical" />
          <a href="javascript:;" @click="deleteConfirm(record, index)">删除</a>
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

    <a-modal
      title="添加核销员"
      v-if="addShow"
      :visible="addShow"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-form-item
          label="姓名："
          :colon="false"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 14 }"
        >
          <a-input
            class="width200"
            :maxLength="10"
            v-decorator="[
              'name',
              {
                initialValue: editObj.name,
                rules: [
                  {
                    required: true,
                    message: '请填写姓名'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          label="手机号："
          :colon="false"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 14 }"
        >
          <a-input
            class="width200"
            :maxLength="11"
            v-decorator="[
              'phoneNumber',
              {
                initialValue: editObj.phoneNumber,
                rules: [
                  {
                    required: true,
                    message: '请填写手机号'
                  },{
                    validator: validateMobile
                  }
                ]
              }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import api from "@/api/user";
import {validateMobile} from "@/util/rules"
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: "save" }),
      addShow: false,
      pager: {
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalPage: 0
      },
      listData: [],
      editObj: {
        name: "",
        phoneNumber: ""
      }
    };
  },
  computed:{
    columns() {
      let columns = [
        {
          title: "姓名",
          align: "center",
          dataIndex: "name"
        },
        {
          title: "手机号",
          align: "center",
          dataIndex: "phoneNumber"
        },
        {
          title: "操作",
          align: "center",
          dataIndex: "id",
          scopedSlots: { customRender: "action" }
        }
      ];
      if(!this.$permission.hasPermission('SET_CHECKER_EDIT')) {
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
    validateMobile,
    getList() {
      api
        .ajax({
          data: this.pager,
          method: "listCheckUser"
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
    edit(record, index) {
      this.editObj = record;
      this.addShow = true;
    },
    deleteConfirm(record, index) {
      this.$confirm({
        title: "删除",
        content: "对该核销员进行删除",
        onOk: () => {
          api
            .ajax({
              data: { id: record.id },
              method: "deleteCheckUser"
            })
            .then(res => {
              this.$message.info(res.data.data);
              this.listData.splice(index, 1);
            })
            .catch(error => {
              console.log("error", error);
            });
        }
      });
    },

    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let data = {
            name: values.name,
            phoneNumber: values.phoneNumber
          };
          let method = "addCheckUser";
          this.editObj.id && (data.id = this.editObj.id);
          this.editObj.id && (method = "editCheckUser");
          api
            .ajax({
              data,
              method
            })
            .then(res => {
              this.$message.info(res.data.data);
              this.getList();
              setTimeout(() => {
                this.handleCancel();
              }, 1500);
            })
            .catch(() => {
              console.log("error");
            });
        }
      });
    },
    handleCancel(e) {
      this.addShow = false;
      this.editObj = {
        name: "",
        phoneNumber: ""
      };
    }
  }
};
</script>

<style lang="less" scoped>
.verifier__Box {
  .page_btn {
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
