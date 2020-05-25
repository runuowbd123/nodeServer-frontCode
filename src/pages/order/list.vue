<template>
  <div class="order-orderAll">
    <div class="search__Box">
      <!-- <TableSearchForm @handleSubmit="searchFun" :formList="formList" /> -->
        <Toolbar :tools="formList" @onSearch="searchFun"/>
    </div>

    <div class="page_tabs">
      <a-tabs :activeKey="activeKey" @change="changeTab">
        <a-tab-pane v-for="(itm, idx) in tabs" :key="idx" :tab="itm" >
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="orderTableTitle">
      <a-table class="table-title" :bordered="false" :pagination="false" :columns="columns" :dataSource="[]">
        <div slot="img" slot-scope="text, record, index"></div>
        <div slot="afterSale" slot-scope="text, record, index"></div>
        <div slot="state" slot-scope="text, record, index"></div>
        <div slot="action" slot-scope="text, record, index"></div>
      </a-table>
    </div>
    <div class="list-item orderTablebody" v-for="(itm, idx) in listData" :key="idx">
      <div class="item-title">
        <span>订单号：{{ itm.orderNum }}</span>
        <span>下单时间：{{ itm.inputTime }}</span>
        <!-- 【订单来源 1:微信小程序,2:h5】 -->
        <span>{{itm.orderResource==1?'微信小程序':'h5'}}</span>
        <div class="fr">
          <router-link class="blue" :to="'/order/detail?id=' + itm.id">查看详情</router-link>
          -
          <span @click="add(itm, idx)" v-if="$permission.hasPermission('ORDER_MANAGER_REMARK')" class="blue">备注</span>
        </div>
      </div>
      <a-table class="table-content" :bordered="true" :pagination="false" :columns="returnColumn(itm.copys)" :rowKey="record => record.id" :dataSource="itm.copys">
        <div slot="img" slot-scope="text, record, index">
          <router-link class="blue" :to="'/goods/goodsedit?id=' + record.goodsId + '&index=3'">
            <div class="img-txt">
              <img class="table-img" :src="record.mainPic" />
              <div>{{record.goodsName}}</div>
              <div class="attri">
                 {{record.specifications.replace(/\"/ig,'').replace('{','').replace('}','')}}
              </div>
            </div>
          </router-link>
        </div>
        <div slot="afterSale" slot-scope="text, record, index">
           <router-link class="blue" :to="'/order/refundDetail?id=' + record.refundId ">
           {{record.afterSale}}
           </router-link>
        </div>

        <!-- <div slot="state" slot-scope="text, record, index">
          <span class="yel" v-if="record.state == 1">等待付款</span>
          <span class="ger" v-else-if="record.state == 2">等待使用</span>
          <span class="" v-if="record.state == 3">已完成</span>
          <span class="" v-if="record.state == 4">关闭交易</span>
        </div> -->
        <!-- <div slot="action" slot-scope="text, record, index">
          <span v-if="record.state == 1" @click="handleOrderOpen(record, index)" class="blue">取消订单</span>
        </div> -->
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

    <a-modal title="取消订单" v-if="deletelShow" :visible="deletelShow" @ok="handleOkOrder" @cancel="handleCancelOrder">
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
            ]"
            placeholder="请选择一个取消订单的理由"
            @change="handleOrderChange">
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
    </a-modal>
    <a-modal width="800px" title="发货" v-if="sendGoodsShow" :visible="sendGoodsShow"  @ok="handleOkSend" @cancel="handleCancelSend">
      <sendGoodsModal :orderId="orderId" @getSelectGoodsData="getSelectGoodsData" ></sendGoodsModal>
    </a-modal>
  </div>
</template>
<script>
import api from "@/api/user";
import moment from "moment";
// import TableSearchForm from "../../components/TableSearchForm";
import Toolbar from "../../components/ToolBar.vue"
import sendGoodsModal from './components/sendGoods';
export default {
  name: "orderList",
  components: { Toolbar,sendGoodsModal},
  data() {
    return {
      addShow: false,
      deletelShow: false,
      sendGoodsShow:false,
      closeType:'',
      deletelId: "",
      form: this.$form.createForm(this, { name: "save" }),
      form1: this.$form.createForm(this, { name: "save1" }),
      tabs: ["全部订单", "待付款", "待发货", "已发货", "已完成", "已关闭", "退款中"],
      activeKey: 0,
      listData: [],
      orderId:'',
      sendGoodsOption:{},
      columns: [
        {
          title: "商品",
          align: "left",
          width: "20%",
          dataIndex: "goodsName",
          key: "1",
          scopedSlots: { customRender: "img" }
        },
        {
          title: "单价（元）",
          width: "10%",
          align: "center",
          dataIndex: "goodsPrice",
          key: "3"
        },
        {
          title: "数量",
          width: "8%",
          align: "center",
          dataIndex: "goodsCount",
          key: "4"
        },
        {
          title: "售后",
          width: "10%",
          align: "center",
          dataIndex: "afterSale",
          key: "5",
          scopedSlots: { customRender: "afterSale"}  // 【售后 1:全额退款，2:部分退款】
        },
        {
          title: "买家/收货人",
          width: "12%",
          align: "center",
          colspan:4,
          dataIndex: "buyerName",
          key: "6",
          customRender:(value,row,index)=>{
            return row.buyerName + row.nickname + row.buyerPhone
          }
        },
        // {
        //   title: "手机号",
        //   width: "12%",
        //   align: "center",
        //   dataIndex: "buyerPhone",
        //   key: "7"
        // },
        {
          title: "实收金额( 元）",
          width: "12%",
           colspan:5,
          align: "center",
          dataIndex: "practicalDealPrice",
          key: "8",
        },
        {
          title: "订单状态",
          width: "8%",
          align: "center",
          colspan:6,
          dataIndex: "state",
          key: "9",
          scopedSlots: { customRender: "state" },  //【订单状态:1待付款、2待发货、3已发货、4已完成、5已关闭、6退款中
        },
        {
          title: "操作",
          align: "center",
          dataIndex: "age",
          colspan:7,
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
            key: 'queryOrderNum',
            defaultValue: null,
        },

        {
            type: 'input',
            title: '买家电话:',
            placeholder: '请输入',
            key: 'buyerPhone',
            defaultValue: null,
        },
        {
            type: 'input',
            title: '商品名称:',
            placeholder: '请输入',
            key: 'queryGoodsName',
            defaultValue: null,
        },
        {
            type: 'select',
            title: '订单来源:',
            key: 'orderResource',
            defaultValue: null,
            allowClear: true,
            options:[{value:1,name:"微信小程序"},{value:2,name:'h5'}]
        },
        {
            type: 'dateRange',
            title: '下单时间:',
            key: 'queryDateArr',
            defaultValue:null,
            ranges: {
              今天: [moment(), moment()],
              昨天: [moment().subtract(1, "days"), moment().subtract(1, "days")],
              近7天: [moment().subtract(6, "days"), moment()],
              近30天: [moment().subtract(29, "days"), moment()]
            }
        },
        {
          type: 'search',
          title: '筛选',
        }
      ],
      queryId:''
    };
  },
  created() {
   let queryOrderNum = this.$route.query
    if(queryOrderNum&&queryOrderNum.id){
      this.searchField.queryOrderNum = queryOrderNum.id
      this.formList[0].defaultValue = queryOrderNum.id
    }
    this.getList();
  },
  methods: {
    moment,
    renderContent(value,row,index,length){
      const obj = {
        children: value,
        attrs: {},
      }
      if (index === 0) {
        obj.attrs.rowSpan = length;
      }
      if( index > 0 ){
        obj.attrs.rowSpan = 0;
      }
      return obj;
    },
    returnColumn(list) {
      let that = this
      let columns= [
        {
          title: "商品",
          align: "left",
          width: "20%",
          dataIndex: "goodsName",
          key: "1",
          scopedSlots: { customRender: "img" }
        },
        {
          title: "单价（元）",
          width: "10%",
          align: "center",
          dataIndex: "goodsPrice",
          key: "3",
          customRender:(value,row,index)=>{
            let obj = {
              children:(
                <span class="red">￥{value}</span>
              ),
              attrs:{}
            }
            return obj;
          }
        },
        {
          title: "数量",
          width: "8%",
          align: "center",
          dataIndex: "goodsCount",
          key: "4",
          customRender:(value,row,index)=>{
            // let obj = that.renderContent(value,row,index,list.length)
            return value+'件'
          }
        },
        {
          title: "售后",
          width: "10%",
          align: "center",
          dataIndex: "afterSale",
          key: "5",
          scopedSlots: { customRender: "afterSale"}  // 【售后 1:全额退款，2:部分退款】
        },
        {
          title: "买家/收货人",
          width: "15%",
          align: "center",
          colspan:4,
          dataIndex: "buyerName",
          key: "6",
          customRender:(value,row,index,)=>{
            let obj = that.renderContent(value,row,index,list.length)
            obj.children = row.buyerName + row.buyerPhone
            let newObj = {
              children:(
                <div>
                    <p class="blue">{row.buyerName }</p>
                    <p>{row.buyerPhone}</p>
                </div>
              ),
              attrs:obj.attrs
            }
            return newObj
          }
        },
        // {
        //   title: "手机号",
        //   width: "12%",
        //   align: "center",
        //   dataIndex: "buyerPhone",
        //   key: "7"
        // },
        {
          title: "实收金额( 元）",
          width: "12%",
           colspan:5,
          align: "center",
          dataIndex: "practicalDealPrice",
          key: "8",
          customRender:(value,row,index)=>{
            let obj = that.renderContent('￥'+value,row,index,list.length)
            console.log('obj2222',typeof row.freightAmount)
            let newObj = {
              children:(
                <div>
                  <strong>{obj.children}</strong>
                  { row.freightAmount!== 0 && <p style="color:#a0a0a0;">(含运费: {row.freightAmount})</p> }
                </div>

              ),
              attrs:obj.attrs
            }
            return newObj
          }
        },
        {
          title: "订单状态",
          width: "8%",
          align: "center",
          colspan:6,
          dataIndex: "state",
          key: "9",
          scopedSlots: { customRender: "state" },  //【订单状态:1待付款、2待发货、3已发货、4已完成、5已关闭、6退款中
          customRender:(value,row,index)=>{
            const state = {
              '1':'待付款',
              '2':'待发货',
              '3':'已发货',
              '4':'已完成',
              '5':'已关闭',
              '6':'退款中',
            }
            let obj = that.renderContent(state[value],row,index,list.length)
            return obj
          }
        },
        {
          title: "操作",
          align: "center",
          dataIndex: "age",
          colspan:7,
          key: "10",
          scopedSlots: { customRender: "action" },
          customRender: (value, row, index) => {
            const that = this
            const obj = {
              children:(
                <div>
                {
                  (row.state == 1&&this.$permission.hasPermission('ORDER_MANAGER_CANCER')) &&   <a type="primary" key={index} style={{ margin: '10px 20px',}} onClick={() => { that.handleOrderOpen(row, index) }} >取消订单</a>
                }
                {
                  (row.state == 2&&this.$permission.hasPermission('ORDER_MANAGER_DELIVER')) && <a-button type="primary" key={index} style={{ margin: '10px 20px'}} onClick={() => { that.handleSendGoods(row, index) }} > 发货</a-button>
                }
                </div>
              ),
              attrs: {},
            };
            if (index === 0) {
              obj.attrs.rowSpan = list.length;
            }
            if( index > 0 ){
              obj.attrs.rowSpan = 0;
            }
            return obj;
          }
        }
      ]
      return columns
    },

    searchFun(values) {
      this.pager.currentPage = 1
      let { queryDateArr,...others } = values
      console.log('搜索',values,queryDateArr)
      this.searchField = others;
      this.searchField.queryDateArr = []
      if(queryDateArr&&queryDateArr.length){
        this.searchField.queryDateArr[0] = queryDateArr[0].format('YYYY-MM-DD')
        this.searchField.queryDateArr[1] = queryDateArr[1].format('YYYY-MM-DD')
      }else{
        this.searchField.queryDateArr[0] = ''
        this.searchField.queryDateArr[1] = ''
      }
      this.getList();
    },
    changeTab(key) {
      this.activeKey = key;
      this.pager.currentPage = 1;
      this.getList();
    },
    getList() {
      let data = {
        ...this.pager,
        ...this.searchField,
        // state: this.activeKey || "",
        // refundStatus:1 // 如果退款中
      };
      if(this.activeKey == 6){
          data.refundStatus = 1  //refundStatus【退款状态；0-无退款；1-退款中】
      }else{
        data.state =  this.activeKey || ""
      }
      console.log('列表参数',data)
      api
        .ajax({
          data,
          method: "storeListPageOrder"
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
    handleOrderOpen(record, index) {
      console.log('我点击了取消订单')
      this.deletelShow = true;
      this.deletelId = record.orderId;
      // console.log(this.deletelId)
    },
    handleSendGoods(row,index){
      console.log('我点击了静态发货')
      this.orderId = row.orderId
      this.sendGoodsShow = true
      console.log(row,index)

    },
    handleCancelSend(){ // 关闭发货
      this.sendGoodsShow = false
    },
    getSelectGoodsData(data){
      console.log(data)
      this.sendGoodsOption = data
    },
    handleOkSend(){
      console.log(this.sendGoodsOption)
      const data = this.sendGoodsOption
      if(data.itemId.length == 0){
        return this.$message.info("请选择要发货的商品");
      }
      if(data.deliveryType==1&&data.waybillNum==''){
       return this.$message.info("请填写运单号");
      }
      const option = {
        deliveryType:data.deliveryType,
        id:this.orderId,
        itemIds:data.itemId,
        waybillNum:data.waybillNum
      }
      api
        .ajax({
          data:option,
          method: "deliverGoods"
        })
        .then(res => {
          this.$message.info(res.data.message);
          this.getList();
          this.handleCancelSend();
        }).catch(error => {
          console.log("error", error);
        });
    },
    handleCancelOrder() {
      this.deletelShow = false;
      this.deletelId = "";
    },
    handleOkOrder() { //orderId
      this.form1.validateFields((err, values) => {
        if(!err){
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
        }
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
    background-color: #fff;
    .ant-tabs-top-bar {
      background-color: #fff;
      margin: 0;
      border-bottom: none;
    }
  }
  .list-item {
    margin-top: 10px;
    background-color: #fff;
    .table-content {
      // border: 1px solid rgba(230, 230, 230, 1);
      border-bottom:none;
      .ant-table-placeholder,
      .ant-table-thead {
        display: none;
      }
      .img-txt {
        img {
          float: left;
          vertical-align: middle;
        }
        div {
          margin-left: 70px;
        }
        .attri{
          margin-top:10px;
          color:rgba(0, 0, 0, 0.65);
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
  .red{
    color:#ff0000
  }
</style>
<style lang="less">
  .orderTableTitle{
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
  .orderTablebody .ant-table-thead{ display:none}
</style>
