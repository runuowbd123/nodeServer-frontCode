<template>
  <div class="test">
    <div class="page_btn">
      <a-input-search
        placeholder="请输入名称或id"
        enter-button
        @search="getUser"
        style="width: 200px"
        v-model="searchKey"
      />
      <a-button @click="modalShow = true" type="primary">添加成员</a-button>
    </div>
    <div class="test-table">
      <a-table
        :loading="loading"
        :columns="columns"
        :dataSource="list"
        :rowKey="record => record.id"
        :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'"
        :pagination="{pageSize: 5, change: changePagination}"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      >
        <div slot="action" slot-scope="text, record">
          <span
            class="handle-btn"
            style="margin-right:20px;"
            @click="modalShow = 'edit';formData=record"
          >编辑</span>
          <span class="handle-btn" @click="deleteUser(record)">删除</span>
        </div>
        <div slot="joinTime" slot-scope="text">{{text ? text : '-'}}</div>
      </a-table>
    </div>
    <a-modal
      :title="modalShow === 'edit' ? '编辑人员' : '添加人员'"
      :visible="!!modalShow"
      v-if="!!modalShow"
      @ok="handleOk"
      @cancel="handleCancel"
      :maskClosable="false"
    >
      <a-form-model :model="formData" ref="addForm">
        <a-form-model-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="名称"
          :rules="[{ required: true, message: '请填写名称'}]"
          prop="name"
        >
          <a-input v-model="formData.name" placeholder="请输入名称" />
        </a-form-model-item>
        <a-form-model-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="年龄"
          :rules="[{ required: true, message: '请填写年龄'}]"
          prop="age"
        >
          <a-input-number v-model="formData.age" style="width: 100%" :min="0" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import api from "@/api/user";
export default {
  data() {
    return {
      searchKey: "",
      loading: false,
      list: [],
      columns: [
        {
          title: "名称",
          dataIndex: "name"
        },
        {
          title: "年龄",
          dataIndex: "age"
        },
        {
          title: "加入时间",
          dataIndex: "joinTime",
          scopedSlots: { customRender: "joinTime" }
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: { customRender: "action" }
        }
      ],
      selectedRowKeys: [],
      modalShow: false,
      formData: {
        name: "",
        age: undefined
      },
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 }
      }
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      this.loading = true;
      api
        .ajax1({
          path: "findUser",
          key: this.searchKey
        })
        .then(res => {
          console.log(res);
          this.list = res.data.list;
          this.loading = false;
        })
        .catch(e => {
          console.log("error", e);
          this.loading = false;
        });
    },
    deleteUser(record) {
      api
        .ajax1({
          path: "deleteUser",
          ids: [record.id]
        })
        .then(res => {
          console.log(res);
          this.$message.success(res.data.message);
          this.getUser();
        })
        .catch(e => {
          console.log("error", e);
        });
    },
    handleOk() {
      if (this.modalShow === "edit") {
        api
          .ajax1({
            path: "editUser",
            ...this.formData
          })
          .then(res => {
            console.log(res);
            this.$message.success(res.data.message);
            this.modalShow = false;
            this.formData = {};
            this.getUser();
          })
          .catch(e => {
            console.log("error", e);
          });
      } else {
        api
          .ajax1({
            path: "addUser",
            ...this.formData
          })
          .then(res => {
            console.log(res);
            this.$message.success(res.data.message);
            this.modalShow = false;
            this.formData = {};
            this.getUser();
          })
          .catch(e => {
            console.log("error", e);
          });
      }
    },
    handleCancel() {
      this.modalShow = false;
      this.formData = {};
    },
    onSelectChange(selectedRowKeys) {
      console.log('选中的selectedRowKeys', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    changePagination() {
      console.log('pagechange');
      this.selectedRowKeys=[]
    }
  }
};
</script>
<style lang="less" scoped>
.test {
  .page_btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .test-table {
    margin-top: 15px;
    .handle-btn {
      color: #1890ff;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>
