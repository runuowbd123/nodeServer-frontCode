<template>
    <div class="">
     <p><strong>选择商品</strong> <span>待发货({{sendGoods.waitDeliveryCount}})</span> <span>已发货({{sendGoods.alreadyDeliveryCount}})</span></p>
      <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'" :bordered="false" :rowSelection="sendGoodsRowSelection" :pagination="false"  :rowKey="record => record.id" :columns="sendGoodsClumns" :dataSource="sendGoods.deliveryGoodsList" >
        <div slot="goodsName"  slot-scope="text, record, index">
            <div class="img-txt2">
              <img class="table-img" :src="record.mainPic" />
              <div>{{record.goodsName}}</div>
            </div>
        </div>
      </a-table>
      <div class="sendsGoodsStyle">
        <p>配送信息</p>
        <div>
          <p>配送方式：{{sendGoods.deliveryType}}</p>
          <p>收货人：{{sendGoods.buyerName}}</p>
          <p>收货地址：{{sendGoods.address}}</p>
        </div>
      </div>
      <div class="sendsGoodsStyle">
        <p>发货方式</p>
        <div>
          <a-radio-group @change="changeLogistics" v-model="GoodsLogistics">
            <a-radio :value="1">自己联系快递</a-radio>
            <a-radio :value="2">无需物流</a-radio>
          </a-radio-group>
          <div v-if="GoodsLogistics==1" style="display:flex; margin-top:10px;">
            <div><span style="color:red">*</span>快递单号: <a-input type="text" placeholder="请输入快递单号" @change="changeWaybillNum" v-model="waybillNum" style="width:150px;"/></div>
            <div style="margin-left:10px;">快递公司:
              <a-select
                show-search
                placeholder="请选择公司"
                v-model="parcelCom"
                style="width:150px;">
                  <a-select-option v-for="(item) in companyList" :key="item.sort" :value="item.simpleName">{{item.expName}}</a-select-option>
              </a-select>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import api from "@/api/user";
export default {
    name: "sendGoodsModal",
    components: {},
    props:{
      orderId:{
        type:String,
        default:''
      }
    },
    data() {
      return {
        sendGoods:[],
        GoodsLogistics:2,
        waybillNum:'',
        parcelCom:undefined,
        goodsItemIds:[],
        sendGoodsClumns:[
          {
            title:'商品',
            align:'center',
            dataIndex:'goodsName',
            width:"30%",
            key:1,
            scopedSlots: { customRender: 'goodsName' },
          },
          {
            title:'数量',
            align:'center',
            dataIndex:'goodsCount',
            key:2,
          },
          {
            title:'状态',
            align:'center',
            dataIndex:'sendStatus',  //【发货状态：0-未发货；1-已发货】
            key:3,
            customRender:(value,row,index)=>{
              const obj = {
                '0':'待发货',
                '1':'已发货'
              }
              return obj[value]
            }
          },
          {
            title:'运单号',
            align:'center',
            dataIndex:'waybillNum',
            key:4,
          },
        ],
        companyList:[]
      }
    },
    computed:{
      sendGoodsRowSelection(){
        const { selectedRowKeys } = this;
        return {
          onChange: (selectedRowKeys, selectedRows) => {
            this.goodsItemIds = selectedRowKeys
            this.$emit('getSelectGoodsData',{itemId:this.goodsItemIds,waybillNum:this.waybillNum,deliveryType:this.GoodsLogistics,parcelCom:this.parcelCom})
          },
          getCheckboxProps: record => ({
            props:{
              disabled:record.sendStatus === 1,
            }
          })
        }
      },
  },
    created(){
       this.getCompanyList()
       this.$emit('getSelectGoodsData',{itemId:this.goodsItemIds,waybillNum:this.waybillNum,deliveryType:this.GoodsLogistics,parcelCom:this.parcelCom})
       console.log('我是发货的弹窗')
       api
        .ajax({
          data: { id: this.orderId },
          method: "deliverList"
        })
        .then(res => {
          this.sendGoods = res.data.data
          // this.sendGoodsShow = true
          console.log('发货订单数据',res.data.data)

        }).catch(error => {
          console.log("error", error);
        });
    },
    mounted(){},
    methods: {
      getCompanyList(){
        api
          .ajax({
            data: { expName:'' },
            method: "listExpressCompany"
          })
          .then(res => {
             this.companyList = res.data.data
             console.log(res,'公司列表')

          }).catch(error => {
            console.log("error", error);
          });
      },
      changeLogistics(){
        this.$emit('getSelectGoodsData',{itemId:this.goodsItemIds,waybillNum:this.waybillNum,deliveryType:this.GoodsLogistics,parcelCom:this.parcelCom})
      },
      changeWaybillNum(){
        this.$emit('getSelectGoodsData',{itemId:this.goodsItemIds,waybillNum:this.waybillNum,deliveryType:this.GoodsLogistics,parcelCom:this.parcelCom})
      },
    }
}
</script>

<style lang="less" scoped>
.img-txt2 {
  text-align: left;
  img {
    float: left;
    vertical-align: middle;
    width:58px;
    height:58px;
  }
  div {
    margin-left: 70px;
  }
  .attri{
    margin-top:10px;
    color:rgba(0, 0, 0, 0.65);
  }
}
.sendsGoodsStyle{
  margin-top:20px;
    display:flex;
    p{
      margin-right:20px;
    }
}
</style>
