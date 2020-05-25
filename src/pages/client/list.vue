<template>
  <div class="client-list">
    <div class="search__Box">
      <TableSearchForm @handleSubmit="searchFun" :formList="searchFormList" />
    </div>

    <div class="page_btn" v-if="$permission.hasPermission('CUSTOMER_MANAGER_EDIT')">
      <a-button type="primary" @click="add">添加客户</a-button>
    </div>

    <div class="page_table">
      <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'" :bordered="false" :pagination="false" :columns="columns" :dataSource="listData" :rowKey="record => record.id">
        <div slot="img" slot-scope="text, record, index">
          <img class="table-img" v-if="record.wxPic" :src="record.wxPic" />
          <img class="table-img" v-else src="../../assets/images/ava.png" />
        </div>
        <div slot="name" slot-scope="text, record, index">
          <a href="javascript:;" @click="edit(record, index)">{{record.name}}</a>
        </div>
        <div slot="action" slot-scope="text, record, index" style="width: 125px">
          <a href="javascript:;" @click="edit(record, index)" style="margin-right: 5px">查看详情</a>
          <a href="javascript:;" @click="setTag(record)" v-if="$permission.hasPermission('CUSTOMER_MANAGER_EDIT')">设置标签</a>
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

    <a-modal title="添加客户" v-if="addShow" :visible="addShow" @ok="handleOk" @cancel="handleCancel" :maskClosable='false'>
      <a-form :form="form">
        <a-form-item label="手机号：" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
          <a-input class="width200" :maxLength="11" v-decorator="[
              'phone',
              {
                initialValue: formData.phone,
                validateFirst:true,
                rules: [
                  {
                    required: true,
                    message: '请填写手机号'
                  },
                  {
                    validator:rules.validateMobile
                  }
                ]
              }
            ]" />
        </a-form-item>

        <a-form-item label="姓名：" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
          <a-input class="width200" v-decorator="[
              'name',
              {
                initialValue: formData.name,
                rules: [
                  {
                    required: true,
                    message: '请填写姓名'
                  }
                ]
              }
            ]" />
        </a-form-item>

        <a-form-item label="性别：" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
          <a-radio-group v-decorator="[
              'gender',
              {
                initialValue: formData.gender
              }
            ]">
            <a-radio value="男">男</a-radio>
            <a-radio value="女">女</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="生日：" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
          <a-date-picker v-decorator="[
              'birthday',
              {
                initialValue: formData.birthday
                  ? moment(formData.birthday, 'YYYY-MM-DD')
                  : null
              }
            ]" />
        </a-form-item>

        <a-form-item label="地区：" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
          <a-cascader placeholder=" " class="width200" :fieldNames="{ label: 'name', value: 'name', children: 'children' }" :options="cityList" v-decorator="[
              'area',
              {
                initialValue: formData.area,
              }
            ]" />
        </a-form-item>

        <a-form-item label="备注：" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
          <a-textarea :maxLength="256" :autosize="{ minRows: 2, maxRows: 6 }" v-decorator="[
              'remark',
              {
                initialValue: formData.remark
              }
            ]" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal title="设置标签" v-if="setTagShow" :visible="setTagShow" @ok="handleTagOk" @cancel="handleTagCancel" :maskClosable='false'>
      <a-form :form="tagForm">
        <a-form-item :label="null" :colon="false" :label-col="{ span: 0 }" :wrapper-col="{ span: 20 }">
            <a-select
              mode="multiple"
              placeholder="请选择标签"
              v-decorator="[
                'tagIds',
                {
                  initialValue: (editData.tagList || []).map((item) => {return item.tagId})
                }
              ]"
            >
              <a-select-option v-for="item in tagList" :key="item.id" :disabled="item.type === 1">
                {{item.name}}
              </a-select-option>
            </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import api from "@/api/user";
import moment from "moment";
import cityList from "@/assets/json/city.json";
import TableSearchForm from "../../components/TableSearchForm";
import rules from "@/util/rules.js";
export default {
  components: { TableSearchForm },
  data() {
    return {
      rules,
      searchField: {},
      searchFormList: [
        {
          type: "datePicker",
          name: "queryDateArr",
          label: "上次消费时间",
          ranges: {
            今天: [moment(), moment()],
            昨天: [moment().subtract(1, "days"), moment().subtract(1, "days")],
            近7天: [moment().subtract(6, "days"), moment()],
            近30天: [moment().subtract(29, "days"), moment()]
          }
        },
        {
          type: "datePicker",
          name: "beCusQueryDateArr",
          label: "成为客户时间",
          ranges: {
            今天: [moment(), moment()],
            昨天: [moment().subtract(1, "days"), moment().subtract(1, "days")],
            近7天: [moment().subtract(6, "days"), moment()],
            近30天: [moment().subtract(29, "days"), moment()]
          }
        },
        {
          type: "input",
          name: "searchWord",
          label: "关键词"
        },
        {
          type: "inputNumberRange",
          name: ["minBuyNum", "maxBuyNum"],
          label: "购买次数"
        },
        {
          type: "inputNumberRange",
          name: ["minCostPrice", "maxCostPrice"],
          label: "累计消费金额"
        }
      ],
      listData: [],
      columns: [
        {
          title: "头像",
          align: "center",
          dataIndex: "wxPic",
          key: "1",
          scopedSlots: { customRender: "img" }
        },
        {
          title: "昵称",
          align: "center",
          dataIndex: "name",
          key: "2",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "手机号",
          align: "center",
          dataIndex: "phone",
          key: "3"
        },
        {
          title: "购买次数",
          align: "center",
          dataIndex: "buyNum",
          key: "13"
        },
        {
          title: "累计消费",
          align: "center",
          dataIndex: "totalCostPrice",
          key: "4"
        },
        {
          title: "上次消费时间",
          dataIndex: "lastCostTime",
          key: "5"
        },
        {
          title: '成为客户时间',
          dataIndex: 'beCusTime',
          key: 'beCusTime'
        },
        {
          title: "操作",
          dataIndex: "address",
          align:"center",
          key: "6",
          scopedSlots: { customRender: "action" }
        }
      ],
      pager: {
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalPage: 0
      },
      form: this.$form.createForm(this, { name: "save" }),
      tagForm: this.$form.createForm(this, { name: "tag" }),
      setTagShow: false,
      addShow: false,
      cityList,
      formData: {
        area: [],
        birthday: null,
        gender: "",
        name: "",
        phone: "",
        remark: "",
        type: 0,
        tagIds: []
      },
      tagList: [],
      editData: {}
    };
  },
  created() {
    this.getList();
    this.getTagList();
  },
  methods: {
    moment,
    searchFun(values) {
      this.searchField = values;
      this.getList();
    },
    getTagList() {
      api
      .ajax({
        method: "tagList"
      })
      .then(res => {
        console.log(res.data)
        this.tagList = res.data.data
      })
      .catch(() => {
        console.log("error");
      });
    },
    getList() {
      let data = {
        ...this.pager,
        ...this.searchField
      };
      api
        .ajax({
          data,
          method: "listCustomer"
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
    add() {
      this.addShow = true;
    },
    edit(record, index) {
      window.sessionStorage.setItem("client", JSON.stringify(record));
      this.$router.push("/client/detail");
      // this.addShow = true;
      // this.formData = {
      //   area: record.area.split(" "),
      //   birthday: record.birthday,
      //   gender: record.gender,
      //   name: record.name,
      //   phone: record.phone,
      //   remark: record.remark,
      //   type: 1,
      //   customerId: record.id
      // };
    },
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let data = {
            area: values.area[0] ? `${values.area[0]} ${values.area[1]} ${values.area[2]}` : '',
            birthday: values.birthday
              ? values.birthday.format("YYYY-MM-DD")
              : "",
            gender: values.gender,
            name: values.name,
            phone: values.phone,
            remark: values.remark,
            type: this.formData.type
          };
          this.formData.customerId &&
            (data.customerId = this.formData.customerId);
          api
            .ajax({
              data,
              method: "createOrEditCustomer"
            })
            .then(res => {
              this.$message.info(res.data.data);
              this.handleCancel();
              this.getList()
            })
            .catch(() => {
              console.log("error");
            });
        }
      });
    },
    handleCancel(e) {
      this.addShow = false;
      this.formData = {
        area: [],
        birthday: null,
        gender: "",
        name: "",
        phone: "",
        remark: "",
        type: 0
      };
    },
    setTag(data) {
      this.setTagShow = true;
      this.editData = data;
    },
    handleTagOk() {
      this.tagForm.validateFields((err, values) => {
        if (!err) {
          console.log(values, this.editData)
          const data = {tagIds: values.tagIds, customerId: this.editData.id}
          api
          .ajax({
            data,
            method: "customerAddTag"
          })
          .then(res => {
            this.$message.info(res.data.data);
            this.setTagShow = false;
            this.editData = {}
            this.getList()
          })
          .catch(() => {
            console.log("error");
          });
        }
      })
    },
    handleTagCancel() {
      this.setTagShow = false;
      this.editData = {}
    }
  }
};
</script>
<style lang="less" scoped>
.client-list {
  .page_btn {
    margin-top: 10px;
    text-align: right;
  }
  .page_table {
    margin-top: 10px;
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
    .ant-select-dropdown-menu {
      text-align: center;
    }
  }
}
</style>
