<template>
  <div class="order-detail">
    <div class="top">
      <span>
        订单号：{{ info.orderNum }}
        <a-popover placement="bottomLeft">
          <template slot="content">
            <p>外部订单号: {{ info.outOrderNum }}</p>
            <p>支付流水号: {{ info.serialNum }}</p>
          </template>
          <span class="blue" style="margin:0;">更多</span>
        </a-popover>
      </span>
      <span>下单时间：{{ info.inputTime }}</span>
      <span>{{info.orderResource==1?'微信小程序':'h5'}}</span>
    </div>
    <div class="middle">
      <!-- //【订单状态:1待付款、2待发货、3已发货、4已完成、5已关闭、6退款中 -->
      <div class="right">
        <div v-if="info.state == 1">
          <div class="right-title">商家已拍下，等待买家付款</div>
          <div class="right-conete">
            如买家未在规定时间内付款，订单将 按照设置逾期自动关闭
          </div>
          <div class="right-bottom">
            <a-button type="primary"  @click="changePriceOpen" v-if="$permission.hasPermission('ORDER_MANAGER_CHANGE_PRICE')">改价</a-button>

            <a-button  @click="handleOrderOpen" v-if="$permission.hasPermission('ORDER_MANAGER_CANCER')">取消订单</a-button>
          </div>
        </div>
        <div v-else-if="info.state == 2&&refundGoodsList.length == 0">
          <div class="right-title">等待商家发货</div>
          <div class="right-conete">
            买家已付款至待结算账户，请尽快发货，否则买家有权申请退款
          </div>
          <!-- 实物才有发货 -->
          <div class="right-bottom"  v-if="info.orderType == 1&&$permission.hasPermission('ORDER_MANAGER_DELIVER')">
            <a-button type="primary"  @click="sendGoodsOpen">发货</a-button>
          </div>
        </div>
        <!-- <div v-else-if="info.state == 3">
          <div class="right-title">商家已核销，交易完成</div>
          <div class="right-conete">{{ info.closeReason }}</div>
        </div> -->

        <div v-if="info.state == 3&&refundGoodsList.length == 0">
          <div class="right-title">商家已发货</div>
          <div class="right-conete" v-if="info.orderType == 1">
            <p>{{info.storeOverTime.buyerAutoConfirmGoodsDay}}天后，交易将自动完成</p>
            <a-button type="primary" @click="modifyLogistics">修改物流</a-button>
            <a-button @click="extendedReceipt">延长收货</a-button>
          </div>
        </div>
        <div v-else-if="info.state == 4">
          <div class="right-title">交易完成</div>
          <div class="right-conete">{{ info.closeReason }}</div>
        </div>
        <div v-else-if="info.state == 5">
          <div class="right-title">交易关闭</div>
          <div class="right-conete">{{ info.closeReason }}</div>
        </div>
        <!-- 有退款的  分实物跟虚拟的 有退款未发货-->
         <!-- state【订单状态:1待付款、2待发货、3已发货、4已完成、5已关闭】 -->
        <div v-if="refundGoodsList.length > 0">
          <div class="right-title" v-if="info.state == 2">
              <div class="right-title">等待商家发货</div>
              <div class="right-conete">买家有退款申请，需先处理完退款申请才能进行后续发货</div>
          </div>
          <div v-if="info.state == 3">
             <div class="right-title">商家已发货</div>
             <div class="right-conete">买家申请了退款 </div>
          </div>
          <div v-for="(refund,index) in refundGoodsList" :key="index" class="refundGoodsList">
            <p>【{{refund.name}}】买家申请了退款</p>
            <router-link class="blue" :to="'/order/refundDetail?id=' + refund.refundId"><a-button type="primary">处理退款</a-button></router-link>
          </div>
        </div>
      </div>
      <div class="left"  v-if="info.state !== 5">
        <a-steps labelPlacement="vertical" :current="info.state">
          <a-step title="买家下单" :description="info.inputTime"></a-step>
          <a-step title="买家已付款" :description="info.payTime"></a-step>
          <a-step title="商家发货" :description="info.sendTime"></a-step>
          <a-step title="交易完成" :description="info.finishTime"></a-step>
        </a-steps>
      </div>
    </div>
    <div class="top2">商家备注：{{ info.sellerRemark }}</div>
    <div class="top4" v-if="info.orderType==1&&(info.state !=1)&&info.parcelList.length>0">
      <a-tabs
        :defaultActiveKey="1"
        tabPosition="top">
        <a-tab-pane v-for="(item,i) in info.parcelList" :tab="`包裹${i+1}`" :key="i+1">
          <div style="display:flex;">
            <div class="tab-left">
              <div style="display:flex;margin-bottom:10px;">
                <div class="info-left">发货方式：</div>
                <div class="info-right">{{item.deliveryType == 1?'自己联系快递':'无需物流'}}</div>
              </div>
              <div style="display:flex;margin-bottom:10px;">
                <div class="info-left">发货人：</div>
                <div class="info-right">{{item.deliveryName}}</div>
              </div>
              <div style="display:flex;margin-bottom:10px;">
                <div class="info-left">发货时间：</div>
                <div class="info-right">{{item.deliveryTime}}</div>
              </div>
              <div style="display:flex;margin-bottom:10px;">
                <div class="info-left">物流公司：</div>
                <div class="info-right">{{item.logisticsCompany}}</div>
              </div>
              <div style="display:flex;margin-bottom:10px;">
                <div class="info-left">运单号：</div>
                <div class="info-right">{{item.waybillNum}}</div>
              </div>
              <div v-for="(it,idx) in item.parcelGoodsList" :key="idx">
                <img :src="it.mainPic" alt="" width="48" height="48">
                <div>{{it.goodsName}}</div>
                <div>数量：{{it.goodsCount}}</div>
              </div>
            </div>
            <div class="tab-right">
              物流状态：
              <div v-if="item.parcelDetail!=''" style="line-height:25px;">
              <p v-for="(tag,idx) in JSON.parse(item.parcelDetail)" :key="idx" style="margin-bottom:5px;">
                {{tag.time}}   {{tag.context}}
              </p>
              </div>
              <div v-else> 暂无信息 </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="top3">
      <div v-if="info.orderType==1&&info.address">
        <p class="topTitle">收货人信息</p>
        <div>
          <span class="label">收货人：</span>
          <span>{{ info.address.buyerName }}</span>
        </div>
        <div>
          <span class="label">联系电话：</span>
          <span>{{ info.address.buyerPhone }}</span>
        </div>
        <div>
          <span class="label">收货地址：</span>
          <span>{{ info.address.address }}</span>
        </div>
      </div>
      <div v-if="info.orderType==1&&info.deliveryType">
        <p class="topTitle">配送信息</p>
        <div>
          <span class="label">配送方式：</span>
          <span>{{ info.deliveryType }}</span>
        </div>
      </div>
      <div v-if="info.payTime">
        <p class="topTitle">付款信息</p>
        <div>
          <span class="label">实付金额：</span>
          <span>￥{{ info.priceQuota.practicalDealPrice }}元</span>
        </div>
        <div>
          <span class="label">付款方式：</span>
          <span>{{ info.payType }}</span>
        </div>
        <div>
          <span class="label">付款时间：</span>
          <span>{{ info.payTime }}</span>
        </div>
        <div>
          <span class="label">付款状态：</span>
          <span>{{ info.priceQuota.practicalDealPrice!==''?'已付款':'未付款' }}</span>
        </div>
      </div>
      <div v-else>
        <p class="topTitle">付款信息</p>
        <div>
          <span class="label">付款状态：</span>
          <span>待支付</span>
        </div>
      </div>
      <div>
        <p class="topTitle">买家信息</p>
        <div>
          <span class="label">买家：</span>
          <span>{{ info.buyerInfoName }}</span>
        </div>
        <div>
          <span class="label">买家电话：</span>
          <span>{{ info.buyerInfoPhone }}</span>
        </div>
        <div>
          <span class="label">买家留言：</span>
          <span>{{ info.buyerRemark }}</span>
        </div>

      </div>
    </div>
    <div class="page_table">
       <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'" :bordered="false" :pagination="false" :columns="returnColumns()" :dataSource="list" :rowKey="record => record.orderItemId" class="table-content">
            <div slot="img"  slot-scope="text, record, index">
              <!-- <router-link class="blue" :to="'/goods/goodsedit?id=' + record.goodsId + '&index=3'"> -->
              <div  class="img-txt" >
                <img class="table-img" :src="record.mainPic" />
                <div>{{record.goodsName}}</div>
                <div class="attri">
                  <!-- {{record.specifications.replace(/\"/ig,'').replace('{','').replace('}','')}} -->
                </div>
              </div>
              <!-- </router-link> -->
            </div>
            <div slot="afterSaleStatus" slot-scope="text, record, index">
              <div v-if="record.refundList.length">
                有退款
                <a-popover placement="topRight" >
                  <template slot="content" >
                    <p v-for="(ittem, indexx) in record.refundList" :key="indexx">
                      {{ ittem.refundOwner==1?'买家申请退款':'商家主动退款' }} ￥{{ ittem.refundAmount }}元
                    </p>
                  </template>
                  <span class="blue" style="margin:0;">记录</span>
                </a-popover>
              </div>
              <div v-else>--</div>
            </div>
            <div slot="action" slot-scope="text, record, index">
              <a-button  @click="changeBackOpen(record)" :disabled="record.canRefund==1?false:true">主动退款</a-button>
              <a-popover placement="topRight"  v-if="info.state == 1">
                <template slot="content" >
                    买家未支付，无法退款给买家
                </template>
                <a-icon type="question-circle" />
              </a-popover>
            </div>
          </a-table>
    </div>
    <div class="bottom-box" v-if="info.priceQuota">
      <div >商品总价：￥{{ info.priceQuota.totalPrice }}</div>
      <div v-if="info.priceQuota.changePrice">
        改价：
        {{ info.priceQuota.changePrice > 0 ? "+" : info.priceQuota.changePrice < 0 ? "-" : "" }}￥{{ Math.abs(info.priceQuota.changePrice) }}
      </div>
      <div >
        优惠：
        <span v-if="info.priceQuota.couponAmount!==0">-</span>￥{{info.priceQuota.couponAmount}}
      </div>
      <div>
        运费：
        ￥{{info.priceQuota.freightAmount || 0}}
      </div>
      <div >
        实收金额：<span>￥{{ info.priceQuota.practicalDealPrice }}</span>
      </div>
    </div>
  <!-- 虚拟商品 已发货的状态会有核销列表 orderType  0-虚拟商品订单；1-实物商品订单-->
  <div v-if="info.orderType==0" style="margin-bottom:30px;">
    <div class="page_table" v-if="info.checkQuota&&info.checkQuota.checkRecordList.length">
      <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'" :bordered="false" :pagination="false" :columns="checkscolumns" :dataSource="info.checkQuota.checkRecordList" :rowKey="record => record.id">、
        <div slot="time" slot-scope="text, record, index">
          {{record.validStartTime | showTime}}--{{record.validEndTime |showTime}}
        </div>
        <!-- state【核销状态:1:待核销、2:已核销、3:已失效】 -->
        <div slot="state" slot-scope="text, record, index">{{record.state == 1?'待核销':record.state == 2?'已核销':record.state == 3?'已失效':''}}</div>
      </a-table>
    </div>
  </div>
    <a-modal title="取消订单" :maskClosable='false'  v-if="deletelShow" :visible="deletelShow" @ok="handleOkOrder" @cancel="handleCancelOrder">
      <a-form :form="form">
        <a-form-item label="取消原因" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
          <a-select v-decorator="[
              'closeType',
              {
                rules: [
                  {
                    required: true,
                    message: '请选择取消原因'
                  }
                ],

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

    <a-modal width="800px" :maskClosable='false' title="改价" v-if="changePriceShow" :visible="changePriceShow" @ok="changePricehandleOk" @cancel="changePriceCancel">
      <p style="color:red">只有订单未付款时才支持改价，改价后请联系买家刷新订单核实订单金额后再支付</p>
      <p>订单原价：<span>￥ {{ info.priceQuota.totalPrice }} 元</span></p>
      <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'" class="change-table" bordered :dataSource="list" :pagination="false" :rowKey="record => record.id" :columns="dataSourcecolumns">
      </a-table>
    </a-modal>

    <a-modal width="800px" title="发货" :maskClosable='false' v-if="sendGoodsShow" :visible="sendGoodsShow"  @ok="handleOkSend" @cancel="handleCancelSend">
      <sendGoodsModal :orderId="orderId" ref="sendGoods" @getSelectGoodsData="getSelectGoodsData" ></sendGoodsModal>
    </a-modal>

    <a-modal width="700px" title="商家主动退款" :maskClosable='false' v-if="backShow" :visible="backShow" @ok="changeBackOk" @cancel="changeBackCancel">
      <p>商家主动退款功能仅作为退款维权业务的补充能力，请勿过度依赖和使用</p>
      <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'" class="change-table" bordered :dataSource="backList" :pagination="false" :rowKey="record => record.orderItemId" :columns="backcolumns">
        <div slot="goodsName" slot-scope="text, record, index">
          <p><img :src="record.mainPic" width="50px" height="50" /></p>
          <p>{{record.goodsName}}</p>
          </div>
        <div slot="canRefundMoney" slot-scope="text, record, index">￥{{record.canRefundMoney}}</div>
        <!-- orderType 0-虚拟  1-实物  实物 是没有商品数量的-->
        <div slot="canBackWaresCount" slot-scope="text, record, index" v-if="record.orderType == 0">
          <a-input-number id="canBackWaresCount" :precision="0" :min="0" :max="record.canBackWaresCount" v-model="refundNum" />
        </div>
        <div slot="refunkMoney" slot-scope="text, record, index">
          <a-input-number placeholder="请输入退款金额" id="refunkMoney" :precision="2" :min="0" :max="record.canRefundMoney" v-model="refundAmount" />
        </div>
      </a-table>
        <template slot="footer">
          <a-button key="back" @click="changeBackCancel">
            取消
          </a-button>
          <a-button key="submit" type="primary" :loading="refundLoading" @click="changeBackOk">
            确定
          </a-button>
        </template>
    </a-modal>

    <a-modal width="700px" title="修改物流" :maskClosable='false' v-model="logistics" @ok="editLogistics" @cancel="changeBackCancel">
      <div style="max-height:450px;overflow:auto;">
        <a-form :form="form">
          <div v-for="(item, index) in logisticsData" :key="index">
            <div class="title">
              <span class="bold">包裹{{index + 1}}</span>
              <span>共{{logisticsData.length}}件商品</span>
            </div>
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="发货方式" style="margin-bottom:0;">
               <!-- @change="changeCheckType($event,item)" -->
              <a-radio-group :disabled="true" v-decorator="[
                  `parcelList[${index}].deliveryType`,
                  {
                    initialValue: item.deliveryType
                  }
                ]">
                <a-radio :value="1">需要物流</a-radio>
                <a-radio :value="2">无需物流</a-radio>
              </a-radio-group>
            </a-form-item>
            <div style="display:flex;" v-if="item.deliveryType == 1">
              <a-form-item :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }" label="运单编号" class="inline">
                <a-input
                  v-decorator="[
                    `parcelList[${index}].waybillNum`,
                    {
                      initialValue:'',
                      rules: [{ required: true, message: '请输入运单编号' }]
                    }
                  ]"
                  placeholder="请填写运单编号"
                />
              </a-form-item>
              <a-form-item :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }" label="快递公司" class="inline">
                <a-select
                  show-search
                  v-decorator="[
                    `parcelList[${index}].parcelCom`,
                    {
                      initialValue:undefined,
                    }
                  ]"
                  placeholder="请选择公司"
                  style="width:150px;">
                    <a-select-option v-for="(item) in companyList" :key="item.sort" :value="item.simpleName">{{item.expName}}</a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div style="display:none;">
            <a-form-item>
                <a-input
                  v-decorator="[
                    `parcelList[${index}].id`,
                    {
                      initialValue: item.id,
                    }
                  ]"
                  placeholder="请填写运单编号"
                />
            </a-form-item>
            </div>
          </div>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import api from "@/api/user";
import sendGoodsModal from './components/sendGoods';
export default {
  components:{ sendGoodsModal },
  data() {
    return {
      form: this.$form.createForm(this, { name: "save" }),
      deletelShow: false,
      closeType: "",
      list: [],
      orderId: "",
      info: {state:6,priceQuota:{}},
      changePriceShow: false,
      changePriceValue: "",
      changeDealPrice:'',
      companyList:'',
      dataSourcecolumns: [
        {
          title: "商品",
          align: "center",
          dataIndex: "goodsName",
          key: "1"
        },
        {
          title: "单价（元）",
          align: "center",
          dataIndex: "price",
          key: "2",
          customRender:(value)=>{
            return "￥" + value
          }
        },
        {
          title: "数量（件）",
          align: "center",
          dataIndex: "count",
          key: "3",
          customRender:(value)=>{
            return value +'件'
          }
        },
        {
          title: "小计（元）",
          align: "center",
          dataIndex: "subtotal",
          key: "4",
          customRender:(value)=>{
            return "￥"+value
          }
        },
        {
          title: "涨价或减价",
          align: "center",
          // colspan:4,
          dataIndex: "count",
          key: "5",
          customRender:(value,row,index)=>{
            let that = this
            const obj = {
              children:(
                <div>
                  <a-input-number  id={that.inputNumber} precision={2} min={-row.totalPrice} onChange={that.priceChangeValue} value={that.changePriceValue} />
                </div>
              ),
              attrs:{}
            }
            if (index === 0) {
              obj.attrs.rowSpan = this.list.length;
            }
            if( index > 0 ){
              obj.attrs.rowSpan = 0;
            }
            return obj;
          }
        },
        {
          title: "实付金额",
          align: "center",
          dataIndex: "practicalDealPrice",
          key: "6",
          customRender:(value,row,index)=>{

            const obj = {
              children:'￥'+  this.changeDealPrice,
              attrs:{}
            }
            if (index === 0) {
              obj.attrs.rowSpan = this.list.length;
            }
            if( index > 0 ){
              obj.attrs.rowSpan = 0;
            }
            return obj;
          }
        }
      ],
      backShow: false,
      backList: [],
      backcolumns:[],
      backcolumnsRefound: [
        {
          title: "商品",
          align: "center",
          dataIndex: "goodsName",
          key: "1",
          scopedSlots: { customRender: "goodsName" }
        },
        {
          title: "可退商品数量",
          align: "center",
          dataIndex: "canBackWaresCount",
          key: "2",
        },
        {
          title: "可退金额（元）",
          align: "center",
          dataIndex: "canRefundMoney",
          key: "3",
          scopedSlots: { customRender: "canRefundMoney" }
        },
        {
          title: "退款金额（元）",
          align: "center",
          dataIndex: "refunkMoney",
          key: "5",
          scopedSlots: { customRender: "refunkMoney" }
        }
      ],
      backcolumnsObj:{
        title: "退款数量",
        align: "center",
        dataIndex: "canBackWaresCount",
        key: "4",
        scopedSlots: { customRender: "canBackWaresCount" }
      },
      sendGoodsShow:false,
      sendGoods:{},
      refundNum: 0,
      refundAmount: "",
      // sendGoodsOption:{},
      checkscolumns: [
        {
          title: "核销码",
          align: "center",
          dataIndex: "checkCode",
          key: "1"
        },
        {
          title: "有效期",
          align: "center",
          dataIndex: "waresPictrueUrl",
          key: "2",
          scopedSlots: { customRender: "time" }
        },
        {
          title: "核销时间",
          align: "center",
          dataIndex: "checkTime",
          key: "3"
        },
        {
          title: "核销人",
          align: "center",
          dataIndex: "checkName",
          key: "4"
        },
        {
          title: "核销状态",
          align: "center",
          dataIndex: "state",
          key: "5",
          scopedSlots: { customRender: "state" }
        }
      ],
      formItemLayout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 18 },
      },
      logistics: false,
      logisticsData: [
      ],
      refundGoodsList:[],// 退款商品列表
      refundLoading:false
    };
  },

  created() {
    this.orderId = this.$route.query.id;
    this.getInfo();
    this.form.getFieldDecorator('logisticsData', { initialValue: [], preserve: true });

  },
  methods: {
    returnColumns(){
      let columns = [
        {
          title: "商品",
          align: "center",
          dataIndex: "goodsName",
          key: "1",
          width: "20%",
          scopedSlots: { customRender: "img" }
        },
        {
          title: "单价（元）",
          align: "center",
          dataIndex: "price",
          key: "2",
          customRender:(value)=>{
            return "￥"+value
          }
        },
        {
          title: "优惠（元）",
          align: "center",
          dataIndex: "couponAmount",
          key: "3",
          customRender:(value)=>{
            return "￥"+value
          }
        },
        {
          title: "数量",
          align: "center",
          dataIndex: "count",
          key: "4",
          customRender:(value)=>{
            return value+'件'
          }
        },
        {
          title: "小计（元）",
          align: "center",
          dataIndex: "subtotal",
          key: "5",
          customRender:(value)=>{
            return "￥"+value
          }
        },
        {
          title: "退款状态",
          align: "center",
          dataIndex: "afterSaleStatus",
          key: "6",
          scopedSlots: { customRender: "afterSaleStatus" }
        },
        {
          title: "操作",
          align: "center",
          dataIndex: "action",
          key: "7",
          scopedSlots: { customRender: "action" }
        },
         {
          title: "发货状态",
          align: "center",
          dataIndex: "sendStatus",
           customRender:(value,row,index)=>{  //0-未发货；1-已发货
            const obj = {
              '0':'待发货',
              '1':'已发货',
            }
            return obj[value]
          }
        }
      ]
  //【订单状态:1待付款、2待发货、3已发货、4已完成、5已关闭、6退款中
      if(this.info.state == 1){
        columns.splice(columns.length-1,1)
      }else if(this.info.state == 5){
        columns.splice(columns.length-1,1)
      }else if(this.info.state == 3&&this.info.orderType==0){
         columns.splice(columns.length-1,1)
      }
      return columns
    },
    getInfo() {
      this.refundGoodsList = []
      api
        .ajax({
          data: { id: this.orderId },
          method: "storeInfoOrder"
        })
        .then(res => {
          const data = res.data.data;
          this.info = data;
          this.list = data.goodsList
          this.changeDealPrice = (this.info.priceQuota.practicalDealPrice).toFixed(2)
            data.goodsList.map((it)=>{
              if(it.afterSaleStatus == 1){
                  this.refundGoodsList.push({
                    name:it.goodsName,
                    refundId:it.refundId
                  })
              }
            })
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    handleOrderChange(value) {
      this.closeType = value;
    },
    handleOrderOpen() {
      this.deletelShow = true;
    },
    handleCancelOrder() {
      this.deletelShow = false;
    },
    handleOkOrder() {
      this.form.validateFields((err, values) => {
        if(!err){
          api
          .ajax({
            data: {
              closeType: values.closeType,
              closeReason: values.closeReason,
              id: this.orderId
            },
            method: "cancelOrder"
          })
          .then(res => {
            this.$message.info(res.data.message);
            this.getInfo();
            setTimeout(() => {
              this.handleCancelOrder();
            }, 1500);
          })
          .catch(() => {
            console.log("error");
          });
        }
      });
    },
    changePriceOpen() {
      this.changePriceShow = true;
    },
    changePriceCancel() {
      this.changePriceShow = false;
      this.changePriceValue = "";
    },
    priceChangeValue(e) {
      console.log(e,'----')
      if (typeof e === "number") {
        // this.list[0].practicalDealPrice = (this.info.totalPrice + e).toFixed(2);
        this.changePriceValue = e
        this.changeDealPrice = (this.info.priceQuota.practicalDealPrice + e).toFixed(2)
      } else {
        // this.list[0].practicalDealPrice = this.info.priceQuota.practicalDealPrice;
        this.changePriceValue = ''
        this.changeDealPrice = this.info.priceQuota.practicalDealPrice
      }
    },
    changePricehandleOk() {
      if (
        this.changePriceValue < -this.info.totalPrice ||
        typeof this.changePriceValue !== "number"
      ) {
        return this.$message.info("价格设置有误");
      }
      api
        .ajax({
          data: {
            id: this.orderId,
            changePrice: this.changePriceValue,
            // practicalDealPrice: this.list[0].practicalDealPrice
          },
          method: "orderEditPrice"
        })
        .then(res => {
          this.$message.info(res.data.message);
          this.getInfo();
          setTimeout(() => {
            this.changePriceCancel();
          }, 1500);
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    //发货
    sendGoodsOpen(){
      //  api
      //   .ajax({
      //     data: { id: this.orderId },
      //     method: "deliverList"
      //   })
      //   .then(res => {
      //     this.sendGoods = res.data.data
      setTimeout(()=>{
        this.sendGoodsShow = true
      })

        // }).catch(error => {
        //   console.log("error", error);
        // });
    },
    getSelectGoodsData(data){
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
      // 00053b9def174aa2bcabc1425ec6b6a0
      api
        .ajax({
          data:option,
          method: "deliverGoods"
        })
        .then(res => {
          this.$message.info(res.data.message);
          this.getInfo();
          this.handleCancelSend();
        }).catch(error => {
          console.log("error", error);
        });
    },
    handleCancelSend(){
       this.sendGoodsShow = false
    },
    // 主动退款
    changeBackOpen(row) {
      this.backShow = true;
      this.backList = []
      this.backList.push(row)
      this.backList[0].orderType = this.info.orderType
      this.backcolumns = []
      this.backcolumns = [...this.backcolumnsRefound]

      //1 实物商品不需要 退款数量
      if(this.info.orderType == 0){
        this.backcolumns.splice(3,0,this.backcolumnsObj)
      }
    },
    changeBackCancel() {
      this.backShow = false;
    },
    changeBackOk() {
      if (!this.refundAmount) {
        return this.$message.info("请输入退款金额");
      }
      let data = {
        orderId: this.orderId,
        orderItemId:this.backList[0].orderItemId,//订单详情id
        refundAmount: this.refundAmount || 0,
      }
      if(this.info.orderType == 0){
        data.refundNum = this.refundNum || 0
         if (!(this.refundNum > 0 || this.refundNum === 0)) {
            return this.$message.info("请输入数量");
          }
      }
      console.log('参数',data)
      this.refundLoading = true
      api
        .ajax({
          data,
          method: "sellerActiveRefund"
        })
        .then(res => {
          this.$message.info(res.data.message);
          this.getInfo();
          setTimeout(() => {
            this.refundLoading = false
            this.changeBackCancel();
          }, 1500);
        })
        .catch(error => {
          console.log("error", error);
           this.refundLoading = false
        });
    },
    modifyLogistics() {
      this.logistics = true;
      this.getCompanyList()
      this.getLogisticsList()
    },
    extendedReceipt() {
      const that = this;
      this.$confirm({
        title: '延长收货',
        content: '确认后订单自动确认时间将会延长 3 天',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          console.log('确认延长收货');
          api
             .ajax({
              data: {
                id: that.orderId,
                delayReceiveDay: 3
              },
              method: "sellerDelayReceiveDay"
            })
            .then(res => {
                that.$message.info('延长收货成功！')
                that.getInfo()
            }).catch(error => {
              console.log("error", error);
            });
        }
      });
    },
    // 商品物流列表
    getLogisticsList(){
        api
          .ajax({
            data:{
              id:this.orderId
            },
            method:"editDeliverList"
          })
          .then(res=>{
            this.logisticsData = res.data.data
          })
    },
    // changeCheckType(e,item) {
    //   console.log(e,item)
    //   item.checkType = e.target.value;
    // },
    editLogistics() {
      this.form.validateFields((err, values) => {
        if (!err) {
          api
            .ajax({
              data:{
                id:this.orderId,
                parcelList:values.parcelList
              },
              method:"editDelivery"
            })
            .then(res=>{
              this.getInfo();
              this.cancelEdit();
              this.$message.info('物流修改成功')
            })
        }
      })
    },
    cancelEdit() {
      this.logistics = false
      console.log('取消修改物流')
    },
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
  },
  filters: {
    showTime(str) {
      if (str) {
        return str.slice(0, 10);
      } else {
        return "";
      }
    }
  }
};
</script>
<style lang="less" scoped>
.order-detail {
  .top {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    background: rgba(255, 255, 255, 1);
    border-bottom: 1px solid rgba(229, 229, 229, 1);
    span {
      margin-right: 20px;
    }
  }
  .top2 {
    font-size: 12px;
    padding: 0 20px;
    color: rgba(51, 51, 51, 1);
    line-height: 60px;
    background: rgba(255, 255, 255, 1);
    border-bottom: 1px solid rgba(229, 229, 229, 1);
  }
  .middle {
    overflow: hidden;
    background: rgba(255, 255, 255, 1);
    border-bottom: 1px solid rgba(229, 229, 229, 1);
    .right {
      float: left;
      width: 259px;
      padding-left: 30px;
      padding-right: 30px;
      border-right: 1px solid rgba(229, 229, 229, 1);
      .right-title {
        font-size: 16px;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        padding-top: 20px;
      }
      .right-conete {
        padding: 10px 0 20px;
        font-size: 12px;
        color: rgba(51, 51, 51, 1);
      }
      .right-bottom {
        font-size: 12px;
        color: rgba(62, 123, 248, 1);
        padding-bottom: 20px;
      }
    }
    .left {
      margin-left: 260px;
      padding: 60px 20px 30px;
      .ant-steps-item-title {
        position: absolute;
        left: 28px;
        top: -30px;
        color: rgba(153, 153, 153, 1);
        font-size: 12px;
      }
      .ant-steps-item-finish .ant-steps-item-title {
        color: rgba(62, 123, 248, 1);
      }
      .ant-steps-item-process .ant-steps-item-icon {
        border-color: rgba(0, 0, 0, 0.25);
        background-color: #fff;
        span {
          color: rgba(0, 0, 0, 0.25);
        }
      }
      .ant-steps-item-description {
        font-size: 12px;
        width: 130px;
      }
    }
  }
  .top4 {
    margin-top: 10px;
    overflow: hidden;
    padding: 30px;
    background: rgba(255, 255, 255, 1);
  }
  .top3 {
    margin-top: 10px;
    overflow: hidden;
    padding: 30px;
    background: rgba(255, 255, 255, 1);
    & > div {
      width: 25%;
      float: left;
      p {
        font-size: 14px;
        color: rgba(51, 51, 51, 1);
      }
      & > div {
        overflow: hidden;
        padding-right: 40px;
        margin-top: 5px;
      }
      span.label {
        font-size: 12px;
        color: rgba(51, 51, 51, 1);
        width: 60px;
        margin-left: 0;
        float: left;
      }
      p{
        font-weight: bold;
      }
      span {
        display: block;
        font-size: 12px;
        margin-left: 65px;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
  .page_table {
    background-color: #fff;
    margin-top: 15px;
    .ant-table-thead {
      tr {
        th {
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
      // background-color: #f7f8fa;
    }
    .ant-table-body {
      table {
        border: 1px solid #e8e8e8;
        border-top: none;
        td {
          border-bottom: none;
        }
      }
    }
  }
  .bottom-box {
    text-align: right;
    background-color: #fff;
    padding: 0 40px 30px;
    font-size: 12px;
    color: rgba(128, 128, 128, 1);
    & > div {
      padding-top: 15px;
      span {
        font-size: 18px;
        font-weight: bold;
        color: #f94444;
      }
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
  .table-img {
    width: 58px;
    height: 58px;
    border: 1px solid rgba(230, 230, 230, 1);
  }
}
.tab-left {
  width: 30%;
  .info-left {
    width: 70px;
  }
  .info-right {
    width: calc(100% - 70px);
  }
}
.tab-right {
  width: 70%;
  padding-left: 20px;
}
.title {
  line-height: 30px;
  .bold {
    font-weight: bold;
    margin-right: 10px;
  }
}
.inline {
  width: 50%;
}
.refundGoodsList{
  margin-bottom:15px;
  // display:flex;
  p{
    margin-bottom:0;
    width:190px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    margin-right:10px;
  }
}
</style>
