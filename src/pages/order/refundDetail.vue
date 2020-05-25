<template>
  <div class="refund-detail-wrapper refundMabageDetail">
      <!-- sendStatus【发货状态；0-未发货；1-已发货】 -->
      <!-- refundState【退款状态：0-待商家处理；1-待买家发货；2-待商家确认收货；3-退款成功；4-退款关闭。】 -->
       <!-- refundMode【退款方式：0-仅退款；1-退货退款。】 -->
    <div class="info-top" v-if="info.orderRefund.refundMode == 1">
      <a-steps labelPlacement="vertical" :current="info.orderRefund.refundState">
        <a-step title="买家申请维权" :description="info.orderRefund.applyTime"></a-step>
        <a-step title="商家处理退款申请" :description="info.orderRefund.sellerHandleTime"></a-step>
        <a-step title="买家退货给商家" :description="info.orderRefund.buyerSendGoodsTime"></a-step>
        <a-step v-if="info.orderRefund.refundState==4" title="退款关闭" :description="info.orderRefund.sellerConfirmReceivedTime?info.orderRefund.sellerConfirmReceivedTime:info.orderRefund.sellerHandleTime"></a-step>
        <a-step v-else-if="info.orderRefund.refundState==3" title="退款完成" :description="info.orderRefund.sellerConfirmReceivedTime?info.orderRefund.sellerConfirmReceivedTime:info.orderRefund.sellerHandleTime"></a-step>
        <a-step v-else title="退款完成" ></a-step>
      </a-steps>
    </div>
    <div  class="info-top" v-else>
       <a-steps labelPlacement="vertical" :current="info.orderRefund.refundState">
        <a-step title="买家申请维权" :description="info.orderRefund.applyTime"></a-step>
        <a-step title="商家处理退款申请" :description="info.orderRefund.sellerHandleTime"></a-step>
        <a-step  v-if="info.orderRefund.refundState==4" title="退款关闭" :description="info.orderRefund.sellerHandleTime"></a-step>
        <a-step  v-else-if="info.orderRefund.refundState==3" title="退款完成" :description="info.orderRefund.sellerHandleTime"></a-step>
        <a-step  v-else title="退款完成"></a-step>
      </a-steps>
    </div>

    <div class="info-bottom">
      <div class="left">
        <div class="left-top">
          <img :src="info.goods.mainPic" width="50" height="50" />
          <div class="left-top-right">
            <div class="product-name">{{info.goods.goodsName}}</div>
            <!-- <div class="product-size">XL</div> -->
          </div>
        </div>
        <div class="left-bottom">
          <ul class="info-list top">
            <li class="info-item">
              <div class="info-item-left">期望结果：</div>
              <div class="info-item-right">{{info.orderRefund.refundMode==0?'仅退款':'退货退款'}}</div>
            </li>
            <li class="info-item">
              <div class="info-item-left">退款金额：</div>
              <div class="info-item-right">{{info.orderRefund.refundAmount}}</div>
            </li>
            <li class="info-item">
              <div class="info-item-left">维权原因：</div>
              <div class="info-item-right">{{info.orderRefund.refundReason}}</div>
            </li>
            <li class="info-item">
              <div class="info-item-left">维权编号：</div>
              <div class="info-item-right">{{info.orderRefund.refundNum}}</div>
            </li>
          </ul>
          <ul class="info-list">
            <li class="info-item">
              <div class="info-item-left">订单编号：</div>
              <div class="info-item-right">{{info.orderRefund.orderNum}}</div>
            </li>
            <li class="info-item">
              <div class="info-item-left">付款时间：</div>
              <div class="info-item-right">{{info.order.payTime}}</div>
            </li>
            <li class="info-item">
              <div class="info-item-left">物流信息：</div>
              <!-- deliveryType【发货方式 1:自己联系快递,2无需物流】 -->
              <div class="info-item-right" v-if="info.deliveryType ==2 ">
                无需物流
              </div>
              <div class="info-item-right" v-else-if="info.deliveryType == 1&&info.parcelDetail!=''">
                {{JSON.parse(info.parcelDetail)[0].time}}  {{JSON.parse(info.parcelDetail)[0].context}}
              </div>
              <div class="info-item-right" v-else>暂无信息</div>
            </li>
            <li class="info-item">
              <div class="info-item-left">运费：</div>
              <div class="info-item-right">{{info.order.freightAmount}}元</div>
            </li>
            <li class="info-item">
              <div class="info-item-left">合计优惠：</div>
              <div class="info-item-right">{{info.order.couponAmount}}元</div>
            </li>
            <li class="info-item">
              <div class="info-item-left">实付金额：</div>
              <div class="info-item-right">{{info.order.practicalDealPrice}}元</div>
            </li>
          </ul>
        </div>
      </div>
      <!-- refundState【退款状态：0-待商家处理；1-待买家发货；2-待商家确认收货；3-退款成功；4-退款关闭。】 -->
      <!-- state【订单状态:1待付款、2待发货、3已发货、4已完成、5已关闭】 -->
      <!-- sendStatus【发货状态；0-未发货；1-已发货】 -->
      <!-- refundMode【退款方式：0-仅退款；1-退货退款。】 -->
      <!-- $permission.hasPermission('ORDER_REFUND_EDIT') -->
      <div class="right">
        <div class="right-top" v-if="info.orderRefund.refundState === 0">
          <div class="right-title">等待商家处理退款申请</div>
          <div class="right-info">收到买家仅退款申请，请尽快处理</div>
          <div class="right-info">请在 <Timer :timer="info.surplusTime+5"></Timer> 处理本次退款，如逾期，则自动退款</div>
          <div class="btn-box">
            <a-button type="primary" style="margin-right:20px;" @click="agreeAndSendAdress" v-if="info.orderRefund.refundMode==1&&$permission.hasPermission('ORDER_REFUND_EDIT')">同意退货，发送退货地址</a-button>
            <a-button type="primary" style="margin-right:20px;" @click="agreeRefundApply" v-if="info.orderRefund.refundMode==0&&$permission.hasPermission('ORDER_REFUND_EDIT')">同意买家退款</a-button>
            <a-button @click="rejectRefundApplication">拒绝退款申请</a-button>
          </div>
        </div>
        <div class="right-top" v-if="info.orderRefund.refundState === 1">
          <div class="right-title">商家已同意退款，等待买家退货给商家</div>
          <div class="right-info">你已同意退款协议，请等待买家处理</div>
          <div class="right-info">买家在 <Timer :timer="info.surplusTime"></Timer> 内未响应，退款申请自动关闭</div>
          <div class="btn-box">
            <a-button type="primary" style="margin-right:20px;" @click="agreeAndRefund" v-show="$permission.hasPermission('ORDER_REFUND_EDIT')">已收到退货，同意退款</a-button>
          </div>
        </div>
        <div class="right-top" v-if="info.orderRefund.refundState === 2">
          <div class="right-title">已退货，等待商家确认收货</div>
          <div class="right-info">买家已发货</div>
          <div class="right-info" v-if="info.orderRefund.parcelCompany">物流公司：{{info.orderRefund.parcelCompany}}</div>
          <div class="right-info">物流订单：{{info.orderRefund.parcelWaybillNum}}</div>
          <div class="right-info">请在  <Timer :timer="info.surplusTime+5"></Timer> 处理本次退款，如逾期，将自动退款给买家</div>
          <div class="btn-box">
            <a-button type="primary" style="margin-right:20px;" @click="confirmAndRefund" v-if="$permission.hasPermission('ORDER_REFUND_EDIT')">确认收货并退款</a-button>
            <a-button @click="refuseConfirmReceipt" v-if="$permission.hasPermission('ORDER_REFUND_EDIT')">拒绝确认收货</a-button>
          </div>
        </div>
        <div class="right-top" v-if="info.orderRefund.refundState === 3">
          <div class="right-title">退款完成</div>
          <div class="right-info">退款金额：{{info.orderRefund.refundAmount}}元</div>
        </div>

        <div class="right-top" v-if="info.orderRefund.refundState === 4">
          <div class="right-title">退款关闭</div>
          <div class="right-info">商家拒接退款，退款原因:{{(info.orderRefund.refuseRefundReason||info.orderRefund.refuseReceivedReason)||info.orderRefund.closeReason}}</div>
        </div>

        <div class="right-bottom">
          <div class="buyer-info"><strong>买家：{{info.orderRefund.applyTime}}</strong></div>
          <div class="extra"><strong>发起了退款申请，等待商家处理</strong></div>
          <ul class="info-list no-border">
            <li class="info-item">
              <div class="info-item-left">退款原因：</div>
              <div class="info-item-right">{{info.orderRefund.refundReason}}</div>
            </li>
            <li class="info-item">
              <div class="info-item-left">处理方式：</div>
              <div class="info-item-right">{{info.orderRefund.refundMode==0?'仅退款':'退货退款'}}</div>
            </li>
            <li class="info-item">
              <div class="info-item-left">退款金额：</div>
              <div class="info-item-right">￥{{info.orderRefund.refundAmount}}元</div>
            </li>
            <li class="info-item">
              <div class="info-item-left">退款说明：</div>
              <div class="info-item-right">{{info.orderRefund.refundExplain}}</div>
            </li>
            <li class="info-item">
              <div class="info-item-left">联系电话：</div>
              <div class="info-item-right">{{info.orderRefund.phoneNumber}}</div>
            </li>
            <li class="info-item">
              <div class="info-item-left">商品配图：</div>
              <div class="info-item-right img-box">
                <div class="img-item" v-for="(item, index) in imgArr" :key="index" @mouseenter="showPreview(item)" @mouseleave="hidePreview(item)">
                  <a-avatar shape="square" :size="40" icon="user" :src="item.url" />
                  <div class="cover" v-show="item.isShow">
                    <a-icon type="eye" style="color: #fff;cursor:pointer" @click="previewImgFun(item.url)" />
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <a-modal v-model="visible" :footer="null" :maskClosable='false'>
      <img class="preview-img" :src="previewImg" />
    </a-modal>
    <a-modal title="退货地址" v-model="isAgree" @ok="save(1)" :maskClosable='false'>
      <p>处理方式：{{info.orderRefund.refundMode==0?'仅退款':'退货退款'}}</p>
      <!-- //  实务的仅退款 无退款数量  orderType【订单类型;0-虚拟商品订单；1-实物商品订单】-->
      <p v-if="!(info.orderRefund.refundMode==0&&info.order.orderType==1)">
        退款数量：{{info.orderRefund.refundGoodsCount}}
        </p>
      <p>退款金额：￥{{info.orderRefund.refundAmount}}元</p>
      <p>退货地址：</p>
      <a-radio-group v-model="adress" style="width:100%;position:relative;">
       <a-radio-group  v-model="agreeOption.addrId">
          <a-radio :style="radioStyle" :value="item.id" v-for="(item,index) in receiveAddress" :key="index">
            {{item.province}}{{item.city}}{{item.area}}{{item.detailAddress}}
          </a-radio>
        </a-radio-group>
      </a-radio-group>
    </a-modal>
    <a-modal title="同意退款" v-model="isAgreeApply" :maskClosable='false'>
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="agreeloading" @click="save(1)">同意</a-button>
      </template>
      <p>处理方式：{{info.orderRefund.refundMode==0?'仅退款':'退货退款'}}</p>
      <p>退款金额：￥{{info.orderRefund.refundAmount}}元</p>
    </a-modal>
    <a-modal title="拒绝退款" v-model="refuseToRefund" :maskClosable='false'>
         <!-- @click="refuseRefundHandleOk" -->
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="refuseRefundloading"  @click="save(0)">拒绝</a-button>
      </template>
      <p>处理方式：{{info.orderRefund.refundMode==0?'仅退款':'退货退款'}}</p>
      <p v-if="info.orderRefund.refundMode!=0">退款数量：{{info.orderRefund.refundGoodsCount}}</p>
      <p>退款金额：￥{{info.orderRefund.refundAmount}}元</p>
      <div style="height:94px;">拒绝理由：<a-textarea placeholder="请填写你的拒绝理由" style="float:right;width:400px;margin-bottom: 1em;" :rows="4" v-model="agreeOption.refuseReason"/>
      </div>
    </a-modal>


    <a-modal title="拒绝收货" v-model="refuseToAcceptGoods" :maskClosable='false' >
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="refuseloading" @click="handleOk(0)">未收货，拒绝退款</a-button>
      </template>
       <p>处理方式：{{info.orderRefund.refundMode==0?'仅退款':'退货退款'}}</p>
      <p>退款数量：{{info.orderRefund.refundGoodsCount}}</p>
      <p>退款金额：￥{{info.orderRefund.refundAmount}}元</p>
      <p>退货地址：{{info.orderRefund.sellerReceiveAddr}}</p>
      <div style="height:94px;">拒绝理由：<a-textarea placeholder="请填写你的拒绝理由" style="float:right;width:400px;margin-bottom: 1em;" :rows="4"  v-model="refuseAcceputGoods"/>
      </div>
    </a-modal>
    <a-modal title="确认收到退货" v-model="confirmReceiptOfReturn" :maskClosable='false'>
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk(1)">确认收到退货，同意退款</a-button>
      </template>
      <p>处理方式：{{info.orderRefund.refundMode==0?'仅退款':'退货退款'}}</p>
      <p>退款数量：{{info.orderRefund.refundGoodsCount}}</p>
      <p>退款金额：￥{{info.orderRefund.refundAmount}}元</p>
      <p>退货地址：{{info.orderRefund.sellerReceiveAddr}}</p>
    </a-modal>
  </div>
</template>

<script>
import api from "@/api/user";
import Timer from "./components/timer"
let setStartTime;
export default {
  components: {Timer},
  data() {
    return {
      orderId:'',
      info: {
        goods:{},
        orderRefund:{},
        order:{}
      },
      imgArr: [],
      status: 1,
      visible: false,
      previewImg: '',
      isAgree: false,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      adress: 1,
      form: this.$form.createForm(this, { name: 'save' }),
      confirmReceiptOfReturn: false,
      loading: false,
      refuseToAcceptGoods: false,
      refuseloading: false,
      refuseToRefund: false,
      refuseRefundloading: false,
      isAgreeApply: false,
      agreeloading: false,
      receiveAddress:[],
      receiveAddressSelect:'',
      agreeOption:{
        addrId:'', // 地址id
        handlerType:'',//【处理结果：0-拒绝申请；1-同意申请】
        id:'',  // 退款记录id
        refuseReason:''  // 商家拒接理由
      },
      // currentAddress:'',
      refuseAcceputGoods:''

    }
  },
  created(){
    this.orderId = this.$route.query.id;
    this.getInfo()
  },
  methods: {
    //获取详情页信息
    getInfo(){
      api
      .ajax({
        data: { id: this.orderId },
        method: "sellerRefundDetail"
      })
      .then(res => {
        let  data = res.data.data
        this.info = data
        // this.imgArr = this.info.refundVoucherList
        data.refundVoucherList.map((item,index)=>{
            this.imgArr.push({
              url: item,
              isShow: false
            })
        })
        console.log(res.data.data,'退款订单详情')
      })
      .catch(error => {
        console.log("error", error);
      });
    },
    showPreview(obj) {
      obj.isShow = true;
      console.log(this.imgArr)
    },
    agreeAndSendAdress() {
      this.isAgree = true;
      api
      .ajax({
        data:{"currentPage":1,"pageSize":20},
        method: "listAddr"
      })
      .then(res => {
        this.receiveAddress = res.data.data.list
        console.log(res.data.data,'地址========')
      })
      .catch(error => {
        console.log("error", error);
      });
    },
    save(type) {
      let data= {}
      // handlerType【处理结果：0-拒绝申请；1-同意申请】
      if(type==1){  // 同意申请
        data ={
          addrId:this.agreeOption.addrId,
          handlerType:1,
          id:this.info.orderRefund.id
        }
        // this.receiveAddress.map((item,index)=>{
        //   if(item.id == this.agreeOption.addrId){
        //     this.currentAddress =  item.province+item.city+item.area+item.detailAddress
        //   }
        // })
      }else if(type==0){
        data ={
          handlerType:0,
          id:this.info.orderRefund.id,
          refuseReason:this.agreeOption.refuseReason
        }
      }
      api
        .ajax({
          data,
          method: "handlerRefundRequest"
        })
        .then(res => {
          this.$message.info(res.data.message)
          this.isAgree = false
          this.isAgreeApply = false
          this.refuseToRefund =false
          this.getInfo()
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    // 买家线下发货
    agreeAndRefund() {
      api
        .ajax({
          data:{id:this.orderId},
          method: "agreeReturnRefund"
        })
        .then(res => {
          this.$message.info(res.data.message)
          this.getInfo()
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    // 确认收货
    confirmAndRefund() {
      console.log('确认收货并退款');
      this.confirmReceiptOfReturn = true;
    },
    handleOk(type) {
      // handlerType【处理结果：0-拒绝申请；1-同意申请】
      console.log('确认收到退货，同意退款')
      let data = {}
      if(type==1){  // 确认收货
        data = {
          id:this.orderId,
          handlerType:1,
        }
      }else if(type == 0){
        data = {
          id:this.orderId,
          handlerType:0,
          refuseReason:this.refuseAcceputGoods
        }
      }
      console.log('确认收货参数',data)
      api
        .ajax({
          data,
          method: "handlerReturnRefund"
        })
        .then(res => {
          this.$message.info(res.data.message)
          this.getInfo()
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    // 倒计时时间到了 刷新页面
    bwCountdown(){
      this.getInfo()
    },
    agreeRefundApply() {
      this.isAgreeApply = true;
    },






    rejectRefundApplication() {
      console.log('拒绝退款申请');
      this.refuseToRefund = true;
    },


    refuseConfirmReceipt() {
      console.log('拒绝确认收货');
      this.refuseToAcceptGoods = true;
    },

    hidePreview(obj) {
      obj.isShow = false;
    },
    previewImgFun(url) {
      this.visible = true;
      this.previewImg = url;
    },
    manageAdress(e) {
      e.stopPropagation();
      console.log(123)
      this.$router.push({
        path:'/set/businessAddress'
      })
    },

    refuseHandleOk() {
      console.log('未收货，拒绝退款')
    },
    // agreeRefund() {
    //   console.log('同意退款给买家');
    // },
    // refuseRefundHandleOk() {
    //   console.log('拒绝退款');
    // },
    // refuseRefundApply() {
    //   console.log('拒绝退款申请');
    // },

    // agree() {
    //   console.log('同意退款');
    // },
    // handleChange(val) {
    //   console.log(val)
    //   let that = this;
    //   if (val.target.value === 4) {
    //     that.$nextTick(() => {
    //       that.form = that.$form.createForm(that, { name: 'save' });
    //     })
    //   }
    // },
    // clearStartTime(){
		// 		return new Promise( (res,rel) => {
		// 			clearInterval(setStartTime);
		// 			setStartTime = null;
		// 			this.cdStr = '';
		// 			res();
    //     })
    // },
    // formatSeconds(t) {
    //   let mi = 60,hh = mi*60,dd = hh*24;
    //   let d = this.formatBit( Math.floor(t/dd)),
    //       h = this.formatBit( Math.floor((t - d*dd)/hh)),
    //       m = this.formatBit( Math.floor((t - d*dd - h*hh)/mi)),
    //       s = this.formatBit( Math.floor((t - d*dd - h*hh - m*mi)));
    //   let tstr = d+'天'+h+'小时'+m+"分"+s+'秒';
    //   return tstr;
    // },
    // formatBit(v){
    //   v = +v
    //   return v > 9 ? v : '0' + v
    // },
    // initTime(time){
    //   this.clearStartTime().then( ()=> {
    //     this.cdTime = Math.floor(time);
    //     console.log(this.cdTime);
    //     setStartTime = setInterval(() => {
    //       this.cdTime--;
    //       this.cdStr = this.formatSeconds(this.cdTime);
    //       // console.log(this.cdStr);
    //       if (this.cdTime <= 0) {
    //         clearInterval(setStartTime)
    //         this.$emit('bwCountdown');
    //       }
    //     }, 1000)
    //   })
		// },
  }
}
</script>
<style lang="less" scoped>
.refund-detail-wrapper {
  background:#fff;
  padding:20px 0;
  .info-top {
    margin: 0 30px;
    border: 1px solid #d9d9d9;
    padding: 20px 40px;
  }
  .info-bottom {
    margin: 20px 30px 0;
    border: 1px solid #d9d9d9;
    display: flex;
    .left {
      width: 50%;
      border-right: 1px solid #d9d9d9;
      padding: 20px 40px;
      .left-top {
        display: flex;
        .left-top-right {
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .product-name {
            margin-bottom: 10px;
          }
        }
      }
    }
    .right {
      width: 50%;
      padding: 20px 40px;
      .right-top {
        min-height: 150px;
        .right-title {
          font-weight: bold;
          line-height: 40px;
        }
        .btn-box {
          margin-top: 30px;
          padding-bottom: 30px
        }
      }
      .right-bottom {
        border-top: 2px dashed #d9d9d9;
        padding: 20px 0;
      }
    }
    .info-list {
      margin-bottom: 0;
      border-top: 2px dashed #d9d9d9;
      list-style: none;
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .info-item {
        display: flex;
        .info-item-left {
          width: 70px;
          margin-right: 5px;
          text-align: right;
        }
        .info-item-right {
          width: calc(100% - 75px);
          word-break: break-all;
        }
      }
    }
    .no-border {
      border: none;
    }
    .top {
      margin-top: 30px;
    }
    .img-box {
      display: flex;
      .img-item {
        position: relative;
        width: 40px;
        height: 40px;
        margin: 0 10px 0 0;
        .cover {
          position: absolute;
          top: 0;
          left: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          width: 100%;
          height: 100%;
          align-items: center;
        }
      }
    }
  }
}
.adress-name {
  display: inline-block;
  width: 350px;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.new-adress,.mana-adress {
  color: #1890ff;
}
.mana-adress {
  // float: right;
  position: absolute;
  top: 90px;
  right: 10px;
  cursor: pointer;
  user-select: none;
  z-index: 100;
}
.preview-img {
  width: 100%;
  margin-top: 20px;
}
</style>
<style lang="less">
  .refundMabageDetail .ant-steps-label-vertical .ant-steps-item-content{
    width:128px;
  }
</style>


