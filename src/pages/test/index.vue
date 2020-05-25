<template>
  <div class="test">
    <div class="page_btn">
      <a-button @click="modalShow = true" type="primary">添加成员</a-button>
    </div>
    <div class="test-table">
      <a-table :columns="columns" :dataSource="list" :rowKey="record => record.id" :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'">
        <div slot="action" slot-scope="text, record">
          <!-- <span class="handle-btn" style="margin-right:20px;">编辑</span> -->
          <span class="handle-btn" @click="deleteUser(record)" >删除</span>
        </div>
        <div slot="joinTime" slot-scope="text">
          {{text ? text : '-'}}
        </div>
      </a-table>
    </div>
    <a-modal
      title="添加人员"
      :visible="modalShow"
      v-if="modalShow"
      @ok="handleOk"
      @cancel="handleCancel"
      :maskClosable='false'
    >
      <a-form-model :model="formData" ref="addForm">
        <a-form-model-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="名称"
          :rules="[{ required: true, message: '请填写名称'}]"
          prop="name"
        >
          <a-input
            v-model="formData.name"
            placeholder="请输入名称"
          />
        </a-form-model-item>
        <a-form-model-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="年龄"
          :rules="[{ required: true, message: '请填写年龄'}]"
          prop="age"
        >
          <a-input-number
            v-model="formData.age"
            style="width: 100%"
            :min="0"
          />
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
      list: [],
      columns: [
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '年龄',
          dataIndex: 'age',
        },
        {
          title: '加入时间',
          dataIndex: 'joinTime',
          scopedSlots: { customRender: 'joinTime' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      modalShow: false,
      formData: {
        name: '',
        age: undefined,
      },
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
      },
    };
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      api
        .ajax1({
          path: 'findUser'
        })
        .then(res => {
          console.log(res);
          this.list = res.data.list
        })
        .catch((e) => {
          console.log("error",e);
        });
    },
    deleteUser(record) {
      api
        .ajax1({
          path: 'deleteUser',
          ids: [record.id]
        })
        .then(res => {
          console.log(res);
          this.$message.success(res.data.message)
          this.getUser()
        })
        .catch((e) => {
          console.log("error",e);
        });
    },
    handleOk() {
      api.ajax1({
        path: 'addUser',
        ...this.formData
      })
      .then(res => {
          console.log(res);
          this.$message.success(res.data.message)
          this.modalShow = false;
          this.$refs.addForm.resetFields();
          this.getUser()
        })
        .catch((e) => {
          console.log("error",e);
        });
    },
    handleCancel() {
      this.modalShow = false;
      this.$refs.addForm.resetFields();
    }
  }
};
</script>
<style lang="less" scoped>
.test{
  .test-table{
    margin-top: 15px;
    .handle-btn{
      color: #1890ff;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>
