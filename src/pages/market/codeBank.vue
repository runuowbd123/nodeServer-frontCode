<template>
  <div class="client-list">
    <div style="display: flex; flex-wrap: wrap">
      <Toolbar :tools="tools" @onChange="changeTool" @onSearch="onSearch"/>
      <a-button
        type="primary"
        @click="batchVoid"
        style="margin-top: 10px"
        :disabled="this.selectedRowKeys.length === 0"
        v-if="$permission.hasPermission('SALE_COUPON_EDIT')"
      >
        批量作废
      </a-button>
    </div>

    <div class="page_table">
      <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'"
        :bordered="false"
        :pagination="false"
        :columns="columns"
        :dataSource="listData"
        :rowKey="record => record.id"
        :rowSelection="rowSelection"
        :loading="tableLoading"
      >
        <div slot="customerHead" slot-scope="text">
          <img v-if="!!text" :src="text" alt="头像图片" style="display: block;height: 50px;width: 50px;border-radius: 25px;">
          <img class="table-img" v-else src="../../assets/images/ava.png" />
        </div>
        <div slot="status" slot-scope="text">
          <div v-if="text == 0">
            未使用
          </div>
          <div v-else-if="text == 1">
            已使用
          </div>
          <div v-else>
            已作废
          </div>
        </div>
        <div slot="action" slot-scope="text, record, index">
          <a href="javascript:;" style="margin-right: 10px" @click="goToOrder(record)" v-if="record.status == 1 && $permission.hasPermission('SALE_COUPON_EDIT')">查看订单</a>
          <a href="javascript:;" @click="deleteCode(record, index)" v-if="record.status == 0 && $permission.hasPermission('SALE_COUPON_EDIT')" >作废</a>
          <div v-if="record.status == -1 || !$permission.hasPermission('SALE_COUPON_EDIT')">-</div>
          <!-- <a href="javascript:;" style="margin-right: 10px" @click="goToOrder(record)" >查看订单</a>
          <a href="javascript:;" @click="deleteCode(record, index)"  >作废</a> -->
        </div>
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
      />
    </div>

    <a-modal title="码作废" v-if="!!deleteModal" :visible="!!deleteModal" @ok="handleOk" @cancel="handleCancel" :maskClosable='false'>
      <div style="color: red;text-align: center;margin-bottom: 20px">
        作废后可能会给用户带来不好的体验，请谨慎选择！
      </div>
      <a-form :form="form">
        <a-form-item label="作废原因" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <a-textarea
              placeholder="请输入作废原因"
              style="resize:none"
              :rows="6"
              v-decorator="[
                'remark',
                {
                  initialValue: '',
                  rules: [
                    {
                      max: 60,
                      message: '最多输入60个字'
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
import moment from "moment";
import Toolbar from "../../components/ToolBar.vue"
export default {
  components: {
    Toolbar
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: "save" }),
      toolValue: {
        searchText: null,
        dateRange: []
      },
      tools: [
        {
            type: 'input',
            title: '姓名:',
            placeholder: '请输入姓名',
            key: 'searchText',
            defaultValue: null,
        },
        {
            type: 'dateRange',
            title: '领取日期:',
            key: 'dateRange',
        },
        {
            type: 'search',
            title: '筛选',
        }
      ],
      tableLoading: false,
      listData: [],
      selectedRowKeys: [],
      columns: [
        {
          title: "头像",
          align: "center",
          dataIndex: "customerHead",
          key: "customerHead",
          scopedSlots: { customRender: "customerHead" },
        },
        {
          title: "姓名",
          dataIndex: "customerName",
          key: "customerName",
          align: "center",
        },
        {
          title: "领券时间",
          dataIndex: "inputTime",
          key: "inputTime",
          scopedSlots: { customRender: "inputTime" },
          align: "center",
        },
        {
          title: "优惠券内容",
          dataIndex: "content",
          key: "content",
          align: "center",
        },
        {
          title: "当前状态",
          dataIndex: "status",
          key: "status",
          align: "center",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "用券日期",
          dataIndex: "useTime",
          key: "useTime",
          align: "center",
          scopedSlots: { customRender: "useTime" },
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          scopedSlots: { customRender: "action" },
          align: "center",
        }
      ],
      pager: {
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        currentPage: 1,
        pageSize: 10,
        total: 1,
        totalPage: 1
      },
      deleteModal: false,
    };
  },
  computed:{
    rowSelection() {
        return {
          selectedRowKeys: this.selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            this.selectedRowKeys = selectedRowKeys
            console.log(selectedRowKeys, 'selectedRows: ', selectedRows);
          },
          getCheckboxProps: record => ({
            props: {
              name: record.name,
              disabled: record.status === -1
            },
          }),
        };
      },
  },
  mounted() {
    this.getList()
  },
  methods: {
    batchVoid() {
      this.deleteModal = 'batch'
      console.log(this.selectedRowKeys)
    },
    changeDate(value){
      this.dateRange = value
    },
    changeInput(e) {
      const { value } = e.target
      this.searchText = value
    },
    changeTool(key, value, obj) {
      console.log(key, value, obj);
    },
    onSearch (obj) {
      this.pager.currentPage = 1;
      this.toolValue = JSON.parse(JSON.stringify(obj))
      this.selectedRowKeys = [];
      this.getList()
    },
    getList() {
      let data = {
        couponId: this.$route.query.id,
        currentPage: this.pager.currentPage,
        pageSize: this.pager.pageSize,
        searchText: this.toolValue.searchText,
        queryDateArr: this.toolValue.dateRange.length > 0 ? [moment(this.toolValue.dateRange[0]).format('YYYY-MM-DD'),moment(this.toolValue.dateRange[1]).format('YYYY-MM-DD')] : []
      };
      // console.log(data)
      this.tableLoading = true;
      api
        .ajax({
          data,
          method: "listPageSaleCouponReceive"
        })
        .then(res => {
          const data = res.data.data;
          console.log(data)
          this.listData=data.list
          this.pager = {
            ...this.pager,
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
    deleteCode(data) {
      this.deleteModal = data
    },
    goToOrder(data) {
      this.$router.push({path: '/order/orderAll', query: {id: data.orderId}})  
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        console.log(this.deleteModal, values)
        if (!err) {
          api
            .ajax({
              data: {
                ids: this.deleteModal === 'batch' ? this.selectedRowKeys : [this.deleteModal.id],
                remark: values.remark
              },
              method: "cancelSaleCouponReceive"
            })
            .then(res => {
              this.$message.info(res.data.message);
              this.deleteModal = false;
              this.selectedRowKeys = [];
              this.getList();
            })
            .catch(() => {
              console.log("error");
            });
        }
      });
    },
    handleCancel(){
      this.deleteModal = false;
    }
  }
};
</script>
<style lang="less" scoped>
.client-list {
  .toolbar{
    display: flex;
    align-items: center;
    margin-top: 15px;
    flex-wrap: wrap;
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
