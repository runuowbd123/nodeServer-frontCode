<template>
  <div class="order-orderAll refundMabage">
    <div class="search__Box">
       <Toolbar :tools="formList" @onSearch="searchFun"/>
    </div>

    <div class="page_tabs">
      <a-tabs :activeKey="activeKey" @change="changeTab">
        <a-tab-pane v-for="(itm) in tabs" :key="itm.key" :tab="itm.name">
        </a-tab-pane>
      </a-tabs>
    </div>
   <div class="refundTableTitle">
    <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'" class="table-title" :bordered="false" :pagination="false" :columns="columns" :dataSource="[]">
      <div slot="img" slot-scope="text, record, index"></div>
      <div slot="afterSale" slot-scope="text, record, index"></div>
      <div slot="state" slot-scope="text, record, index"></div>
      <div slot="action" slot-scope="text, record, index"></div>
    </a-table>
   </div>
    <div class="list-item refundTablebody" v-for="(itm, idx) in listData" :key="idx">
      <div class="item-title">
        <span>退款编号：{{ itm.refundNum }}</span>
        <span>订单编号：{{ itm.orderNum }}</span>
        <!-- <div class="fr">
          <router-link class="blue" :to="'/order/detail?id=' + itm.id">查看详情</router-link>
          -
          <span @click="add(itm, idx)" class="blue">备注</span>
        </div> -->
      </div>
      <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'" class="table-content" :bordered="false" :pagination="false" :columns="columns" :rowKey="record => record.id" :dataSource="[itm]">
        <div slot="img" slot-scope="text, record, index">
          <router-link class="blue" :to="'/goods/goodsedit?id=' + record.goodsId + '&index=3'">
            <div class="img-txt-tuik">
              <img class="table-img" :src="record.mainPic" />
              <div>{{ record.goodsName }}</div>
            </div>
          </router-link>
        </div>

        <div slot="afterSale" slot-scope="text, record, index">
          {{ record.afterSale === 1 ? "全额退款" : record.afterSale === 2 ?"部分退款":"" }}
        </div>

        <div slot="state" slot-scope="text, record, index">
          <span class="yel" v-if="record.state == 1">等待付款</span>
          <span class="ger" v-else-if="record.state == 2">等待使用</span>
          <span class="" v-if="record.state == 3">已完成</span>
          <span class="" v-if="record.state == 4">关闭交易</span>
        </div>
        <div slot="action" slot-scope="text, record, index" v-if="$permission.hasPermission('ORDER_REFUND_EDIT')">
          <span v-if="record.refundState == 0 || record.refundState == 0" @click="handleRefund(record, index)" class="blue">处理退款</span>
          <span v-else  @click="handleRefund(record, index)" class="blue">查看详情</span>
        </div>
      </a-table>
      <div class="item-title2" v-if="itm.sellerRemark">
        <span>卖家备注：{{ itm.sellerRemark }}</span>
      </div>
    </div>

    <div class="page_pagination">
      <a-pagination showQuickJumper showSizeChanger :total="pager.total" v-model="pager.currentPage" @change="paginationChange" :pageSize="pager.pageSize" @showSizeChange="onShowSizeChange" :pageSizeOptions="pager.pageSizeOptions" :showTotal="total => `共有 ${pager.total} 条/${pager.totalPage}页`">
        <template slot="buildOptionText" slot-scope="props">
          <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
        </template>
      </a-pagination>
    </div>

    <a-modal title="备注" v-if="addShow" :visible="addShow" @ok="handleOk" @cancel="handleCancel">
      <a-form :form="form">
        <a-form-item :colon="false">
          <a-textarea maxLength="256" :autosize="{ minRows: 2, maxRows: 6 }" v-decorator="[
              'sellerRemark',
              {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请填写商家备注'
                  }
                ]
              }
            ]" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- <a-modal title="取消订单" v-if="deletelShow" :visible="deletelShow" @ok="handleOkOrder" @cancel="handleCancelOrder">
      <a-form :form="form1">
        <a-form-item label="取消原因" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
          <a-select v-decorator="[
              'closeType',
              {
                rules: [
                  {
                    required: true,
                    message: '请选择取消原因'
                  }
                ]
              }
            ]" @change="handleOrderChange">
            <a-select-option :value="1">无法联系上买家</a-select-option>
            <a-select-option :value="2">买家误拍或重拍了</a-select-option>
            <a-select-option :value="3">买家无诚意完成交易</a-select-option>
            <a-select-option :value="4">已经缺货无法交易</a-select-option>
            <a-select-option :value="5">其他</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="closeType == 5" label="其他：" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
          <a-textarea maxLength="120" :autosize="{ minRows: 2, maxRows: 6 }" v-decorator="[
              'closeReason',
              {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请填写原因'
                  }
                ]
              }
            ]" />
        </a-form-item>
      </a-form>
    </a-modal> -->
  </div>
</template>
<script>
import api from "@/api/user";
import moment from "moment";
import TableSearchForm from "../../components/TableSearchForm";
import Toolbar from "../../components/ToolBar.vue"
// import moment from 'moment';
export default {
  name: "orderList",
  components: { TableSearchForm,Toolbar },
  data() {
    return {
      addShow: false,
      deletelShow: false,
      deletelId: "",
      form: this.$form.createForm(this, { name: "save" }),
      form1: this.$form.createForm(this, { name: "save1" }),
      tabs: [
        {
          key:0,
          name:'全部订单'
        },
        {
          key:'seller',
          name:'待商家处理'
        },
        {
          key:'buyer',
          name:'待买家处理'
        }],
      activeKey: 0,
      listData: [
      ],
      columns: [
        {
          title: "商品",
          align: "left",
          width: "19%",
          dataIndex: "goodsName ",
          key: "1",
          scopedSlots: { customRender: "img" }
        },
        {
          title: "发货状态",
          width: "10%",
          align: "center",
          dataIndex: "sendStatus",
          key: "4",
          customRender:(value,row,index)=>{
              let obj={
                '0':'未发货',
                '1':'已发货'
              }
              return obj[value]
          }
        },
        {
          title: "订单金额（元）",
          width: "13%",
          align: "center",
          dataIndex: "orderPrice",
          key: "3",
          customRender:(value)=>{
            return '￥'+ value
          }
        },
        {
          title: "退款金额（元）",
          width: "13%",
          align: "center",
          dataIndex: "refundAmount",
          key: "11",
          customRender:(value)=>{
            return '￥'+ value
          }
        },
        {
          title: "申请时间",
          width: "19%",
          align: "center",
          dataIndex: "applyTime",
          key: "8"
        },
        {
          title: "退款状态",
          width: "16%",
          align: "center",
          dataIndex: "refundState",
          key: "15",
          // scopedSlots: { customRender: "state" },
          customRender:(value,row,index)=>{
            let obj={
              '0':'待商家处理',
              '1':'待买家发货',
              '2':'待商家确认收货',
              '3':'退款成功',
              '4':'退款关闭'
            }
            return obj[value]
          }
        },
        {
          title: "操作",
          width: "13%",
          align: "center",
          dataIndex: "age",
          key: "10",
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
      searchField: {},
      formList: [
        {
            type: 'input',
            title: '订单编号:',
            placeholder: '请输入',
            key: 'orderNum',
            defaultValue: null,
        },
         {
            type: 'dateRange',
            title: '申请时间:',
            key: 'startDate',
            defaultValue:null,
            ranges: {
              今天: [moment(), moment()],
              昨天: [moment().subtract(1, "days"), moment().subtract(1, "days")],
              近7天: [moment().subtract(6, "days"), moment()],
              近30天: [moment().subtract(29, "days"), moment()]
            }
        },
        {
            type: 'input',
            title: '退款编号:',
            placeholder: '请输入',
            key: 'refundNum',
            defaultValue: null,
        },
        {
            type: 'input',
            title: '运单编号:',
            placeholder: '请输入',
            key: 'sellerWaybillNum',
            defaultValue: null,
        },
        {
            type: 'input',
            title: '商品名称:',
            placeholder: '请输入',
            key: 'goodsName',
            defaultValue: null,
        },
        {
            type: 'select',
            title: '退款类型:',
            key: 'refundType',
            defaultValue:null,
            allowClear: true,
            options:[{value:0,name:'售中退款'},{value:1,name:"售后退款"}]
        },
        {
            type: 'select',
            title: '退款方式:',
            key: 'refundMode',
            defaultValue: null,
            allowClear: true,
            options:[{value:0,name:'仅退款'},{value:1,name:"退货退款"}]
        },
        {
            type: 'select',
            title: '退款状态:',
            key: 'refundState',
            defaultValue: null,
            allowClear: true,
            options:[{value:0,name:'待商家处理'},{value:1,name:"待买家发货"},{value:2,name:"待商家确认收货"},{value:3,name:"退款成功"},{value:4,name:"退款关闭"}]
        },
        {
            type: 'select',
            title: '发货状态:',
            key: 'sendStatus',
            defaultValue: null,
            allowClear: true,
            options:[{value:0,name:'未发货'},{value:1,name:"已发货"}]
        },
        {
          type: 'search',
          title: '筛选',
        }
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    moment,
    searchFun(values) {
      this.pager.currentPage = 1
      let { startDate,...others } = values
      this.searchField = others;
      if(startDate&&startDate.length){
        this.searchField.startDate = values.startDate[0].format('YYYY-MM-DD')
        this.searchField.endDate = values.startDate[1].format('YYYY-MM-DD')
      }else{
        this.searchField.startDate = ''
        this.searchField.endDate = ''
      }
      this.getList();
    },
    // 商家：seller；买家：buyer
    changeTab(key) {
      this.activeKey = key;
      this.pager.currentPage = 1;
      this.getList();
    },
    getList() {
      let data = {
        ...this.pager,
        ...this.searchField,
        handlerType: this.activeKey?this.activeKey:''
      };
      api
        .ajax({
          data,
          method: "sellerRefundList"
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
    add(record, index) {
      this.addShow = true;
      this.deletelId = record.id;
      setTimeout(() => {
        this.form.setFieldsValue({
          sellerRemark: record.sellerRemark
        });
      }, 50);
    },
    handleOk(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          api
            .ajax({
              data: {
                sellerRemark: values.sellerRemark,
                id: this.deletelId
              },
              method: "remarkOrder"
            })
            .then(res => {
              this.$message.info(res.data.message);
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
      setTimeout(() => {
        this.form.setFieldsValue({
          sellerRemark: ""
        });
        this.addShow = false;
        this.deletelId = "";
      }, 50);
    },

    handleOrderChange(value) {
      this.closeType = value;
    },
    // handleOrderOpen(record, index) {
    //   this.deletelShow = true;
    //   this.deletelId = record.id;
    // },
    handleRefund(record, index) {
      this.$router.push({
        path: 'refundDetail',
        query: {
          id: record.id
        }
      })
    },
    handleCancelOrder() {
      this.deletelShow = false;
      this.deletelId = "";
    },
    handleOkOrder() {
      this.form1.validateFields((err, values) => {
        api
          .ajax({
            data: {
              closeType: values.closeType,
              closeReason: values.closeReason,
              id: this.deletelId
            },
            method: "cancelOrder"
          })
          .then(res => {
            this.$message.info(res.data.message);
            this.getList();
            setTimeout(() => {
              this.handleCancelOrder();
            }, 1500);
          })
          .catch(() => {
            console.log("error");
          });
      });
    }
  }
};
</script>
<style lang="less" scoped>
.order-orderAll {
  padding-bottom:50px;
  .page_tabs {
    margin-top: 15px;
    border: 1px solid #e8e8e8;
    // border-bottom: none;
    .ant-tabs-top-bar {
      background-color: #fff;
      margin: 0;
      border-bottom: none;
    }
  }

  .table-title {
    .ant-table-placeholder,
    .ant-table-tbody {
      display: none;
    }
    .ant-table-thead {
      border: 1px solid #e8e8e8;
      th {
        background-color: #fff;
        font-size: 12px;
        padding: 10px 16px;
      }
    }
  }

  .list-item {
    margin-top: 10px;
    background-color: #fff;
    .table-content {
      border: 1px solid rgba(230, 230, 230, 1);
      border-bottom:none;
      .ant-table-placeholder,
      .ant-table-thead {
        display: none;
      }
      .img-txt-tuik {
        display: flex;
        align-items: center;
        img {
          float: left;
          vertical-align: middle;
        }
        div {
          margin-left: 10px;
        }
      }

      .table-img {
        width: 58px;
        height: 58px;
        border: 1px solid rgba(230, 230, 230, 1);
      }
      td {
        font-size: 12px;
      }
    }
    .item-title {
      margin-top: 10px;
      font-size: 12px;
      line-height: 42px;
      padding: 0 30px;
      background: #f7f8fa;
      border-right: 1px solid rgba(229, 229, 229, 1);
      border-left: 1px solid rgba(229, 229, 229, 1);
      border-top: 1px solid rgba(229, 229, 229, 1);
      span {
        margin-right: 20px;
      }
    }
    .item-title2 {
      font-size: 12px;
      line-height: 42px;
      color: #FF0000;
      padding: 0 20px;
      border-right: 1px solid rgba(229, 229, 229, 1);
      border-left: 1px solid rgba(229, 229, 229, 1);
      span {
        margin-right: 20px;
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
  .blue {
    color: #3e7bf8;
    cursor: pointer;
  }
  .yel {
    color: #fe7c24;
  }
  .ger {
    color: #00ba26;
  }
}
</style>
<style lang="less">
  .refundTableTitle{
  .table-title {
    .ant-table-placeholder,
    .ant-table-tbody {
      display: none;
    }
    .ant-table-thead {
      border: 1px solid #e8e8e8;
      th {
        background-color: #fff;
        font-size: 12px;
        padding: 10px 16px;
      }
    }
  }
  }
  .order-orderAll {
    .ant-tabs-top-bar {
      background-color: #fff;
      margin: 0;
      border-bottom: none;
    }
  }
 .refundTablebody .ant-table-thead{
    display: none;
 }


</style>
