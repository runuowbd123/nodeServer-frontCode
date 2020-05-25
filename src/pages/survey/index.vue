<template>
  <div class="survey__Box">
    <div class="survey-top">
      <img src="../../assets/images/background.png" alt="bg" class="bg">
      <div class="fl" style="z-index: 99;position: relative">
        <span class="shop-name">{{ indexData.storeName }}</span>
        <span class="shop-tag" v-if="indexData.isTry">试用店铺</span>
        <div>
          <span v-if="indexData.cloudStartDate&&indexData.cloudEndDate">店铺有效期：{{ indexData.cloudStartDate }}~{{ indexData.cloudEndDate }}</span>
          <!-- <span class="shop-tag2">续期</span> -->
        </div>
      </div>
      <div class="fr qr" style="z-index: 99;position: relative">
        <span class="hover">
          <img :src="qr" />
          <img class="hov" :src="qr" />
        </span>
        <span>扫一扫进入商城</span>
      </div>
    </div>
    <div v-if="$permission.hasPermission('INDEX_BANNER')">
      <a-spin :spinning="dataLoading">
        <a-row>
          <a-col :span="15" class="statistic">
            <a-row>
              <a-col :span="8" class="statistic-item">
                <div class="statistic-title statistic-title01">支付订单数</div>
                <div class="statistic-num">{{ indexData.totalPayOrder }}</div>
                <div class="statistic-tag">昨日 {{ indexData.yesterdayPayOrder }}</div>
              </a-col>
              <a-col :span="8" class="statistic-item">
                <div class="statistic-title statistic-title02">支付金额</div>
                <div class="statistic-num">
                  <span>￥</span>
                  {{ indexData.totalPayMoney }}
                </div>
                <div class="statistic-tag">昨日 {{ indexData.yesterdayPayMoney }}</div>
              </a-col>
              <a-col :span="8" class="statistic-item">
                <div class="statistic-title statistic-title03">浏览数</div>
                <div class="statistic-num">{{ indexData.totalPageViews }}</div>
                <div class="statistic-tag">昨日 {{ indexData.yesterdayPageViews }}</div>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8" class="statistic-item">
                <div class="statistic-title statistic-title04">店铺余额</div>
                <div class="statistic-num">
                  <span>￥</span>
                  {{ indexData.balanceAmount }}
                </div>
              </a-col>
              <a-col :span="8" class="statistic-item">
                <div class="statistic-title statistic-title05">待结算</div>
                <div class="statistic-num">
                  <span>￥</span>
                  {{ indexData.settlementAmount }}
                </div>
              </a-col>
              <a-col :span="8" class="statistic-item"></a-col>
            </a-row>
          </a-col>
          <a-col :span="9" class="app-action">
            <div v-if="$permission.hasPermission('INDEX_SHORTCUT')">
              <a-row>
                <div class="app-action-subtitle">常用功能</div>
                <a-col :span="12" v-if="$permission.hasPermission('INDEX_SHORTCUT_NEW_GOODS')">
                  <div class="app-action-title-wrap">
                    <router-link to="/goods/goodsadd">
                      <div class="app-action-title app-action-title01">发布商品</div>
                    </router-link>
                  </div>
                </a-col>
                <a-col :span="12" v-if="$permission.hasPermission('INDEX_SHORTCUT_ORDER_QUERY')">
                  <div class="app-action-title-wrap">
                    <router-link to="/order/orderAll">
                      <div class="app-action-title app-action-title02">订单查询</div>
                    </router-link>
                  </div>
                </a-col>
                <a-col :span="12" v-if="$permission.hasPermission('INDEX_SHORTCUT_INCOME')">
                  <div class="app-action-title-wrap">
                  <router-link to="/asset/drawal">
                    <div class="app-action-title app-action-title03">收入提现</div>
                  </router-link>
                  </div>
                </a-col>
                <a-col :span="12" v-if="$permission.hasPermission('INDEX_SHORTCUT_CUSTOMER_MANAGER')">
                  <div class="app-action-title-wrap">
                  <router-link to="/client/list">
                    <div class="app-action-title app-action-title04">客户管理</div>
                  </router-link>
                  </div>
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </a-spin>
      
      <div class="p-line" v-if="$permission.hasPermission('INDEX_DEAL_CHART') || $permission.hasPermission('INDEX_VISIT_CHART')">
        <div class="p-line-tab-box">
          <div
            class="p-line-tab"
            :class="tabIndex === 0 ? 'p-line-tab-active' : ''"
            @click="changeTab(0)"
            v-if="$permission.hasPermission('INDEX_DEAL_CHART')"
          >交易趋势
          </div>
          <div
            class="p-line-tab"
            :class="tabIndex === 1 ? 'p-line-tab-active' : ''"
            @click="changeTab(1)"
            v-if="$permission.hasPermission('INDEX_VISIT_CHART')"
          >
            访客趋势
          </div>
        </div>
        <div class="fr">
          时间维度：
          <a-select :defaultValue="0" style="width: 120px" @change="changeTime">
            <a-select-option :value="0">天</a-select-option>
            <a-select-option :value="1">周</a-select-option>
            <a-select-option :value="2">月</a-select-option>
          </a-select>

          <a-date-picker v-if="type==0" @change="change" :disabledDate="disabledDate" :value="queryDate" />
          <a-week-picker v-if="type==1" @change="change" :disabledDate="disabledDate" :value="queryDate"/>
          <a-month-picker v-if="type==2" @change="change" :disabledDate="disabledDate" :value="queryDate"/>
        </div>
      </div>
      <a-spin :spinning="chartLoading">
        <div class="pp-line" id="pp-line" v-if="$permission.hasPermission('INDEX_DEAL_CHART') || $permission.hasPermission('INDEX_VISIT_CHART')"></div>
      </a-spin>
      
    </div>
    <div v-else style="text-align:center;">
      <div style="margin-top: 150px; ">
        <img src="../../assets/images/welcome.png" alt="logo" style="width: 200px;display: block; margin: 0 auto 20px;">
        企蜂商城欢迎您!
      </div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import api from "@/api/user";
import moment from "moment";
export default {
  data() {
    return {
      indexData: {},
      shopTradeTrendData: {},
      type: 0,
      queryDate: moment(),
      qr: "",
      tabIndex: this.$permission.hasPermission('INDEX_DEAL_CHART') ? 0 : 1,
      myChart: null,
      dataLoading: false,
      chartLoading: false,
    };
  },
  created() {
    this.getInfo();
    if (this.$permission.hasPermission('INDEX_DEAL_CHART') || this.$permission.hasPermission('INDEX_VISIT_CHART')) {
      this.getlist();
    }
  },
  methods: {
    moment,
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf("day");
    },
    changeTime(type) {
      this.type = type;
      this.queryDate = null;
    },
    change(date, dateString) {
      this.queryDate = date;
      this.getlist();
    },
    getInfo() {
      this.dataLoading = true;
      api
        .ajax({
          data: {},
          method: "shopSurvey"
        })
        .then(res => {
          this.indexData = res.data.data;
          this.dataLoading = false;
        })
        .catch(() => {
          console.log("error");
        });
      let shop = window.sessionStorage.getItem("userInfo");
      shop = shop ? JSON.parse(shop) : {};
      api
        .qrAjax({
          page: "pages/shop/shop",
          id: shop.storeId
        })
        .then(res => {
          let bytes = new Uint8Array(res.data);
          let storeData = "";
          let len = bytes.byteLength;
          for (let i = 0; i < len; i++) {
            storeData += String.fromCharCode(bytes[i]);
          }
          this.qr = "data:image/png;base64," + window.btoa(storeData);
        })
        .catch(() => {
          console.log("error");
        });
    },
    changeTab(index) {
      this.tabIndex = index;
      this.myChart.clear();
      this.getlist();
    },
    getlist() {
      this.chartLoading = true;
      api
        .ajax({
          data: {
            type: this.type,
            queryDate: this.queryDate.format("YYYY-MM-DD")
          },
          method: this.tabIndex === 0 ? "shopTradeTrend" : "shopVisitTrend"
        })
        .then(res => {
          if (this.tabIndex === 0) {
            this.shopTradeTrendData = res.data.data;
            /**
             * object_keys:数据的key值，作为x轴
             * object_values:数据的value值，作为y轴
             */
            let object_keys = Object.keys(this.shopTradeTrendData);
            let object_values = Object.values(this.shopTradeTrendData);
            this.canvas(object_keys, object_values);
          } else {
            const data = res.data.data;
            // const data = [
            //   {'2019-1': 1, '2019-2': 2, '2019-3': 3},
            //   {'2019-1': 11, '2019-2': 1, '2019-3': 21}
            // ]
            let object_keys = Object.keys(data[0]);
            let object_values = [];
            object_values[0] = Object.values(data[0]);
            object_values[1] = Object.values(data[1])
            this.canvasVisit(object_keys, object_values);
          }
          this.chartLoading = false;
        })
        .catch(() => {
          console.log("error");
        });
    },
    canvas(x_values, y_values) {
      this.myChart = echarts.init(document.getElementById("pp-line"));
      let options = {
        tooltip: {
          trigger: 'axis'
          // formatter: '{b0}: {c0}元'
        },
        legend: {
            data: ['交易金额'],
            left: 40
        },
        grid: {
          left: "80px",
          right: "80px",
          top: "40px",
          bottom: "30px"
        },
        itemStyle: {
          color: "#F3D12C"
        },
        xAxis: {
          type: "category",
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(247,249,252,1)"
            }
          },
          axisLabel: {
            color: "#808080"
          },
          splitLine: {
            show: false
          },
          data: x_values
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
            lineStyle: {
              color: "#eeeeee",
              width: 1,
              opacity: 0
            }
          },
          axisLabel: {
            color: "#808080"
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(247,249,252,1)"
            }
          }
        },
        series: [
          {
            name: '交易金额',
            data: y_values,
            type: "line",
            smooth: true,
            symbol: 'circle',
          }
        ]
      };
      if (this.tabIndex === 1) {
        options.legend = {
          show: true
        }
      }
      this.myChart.setOption(options);
    },
    canvasVisit(x_values, y_values) {
      this.myChart = echarts.init(document.getElementById("pp-line"));
      let options = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['访客数', '成交客户数'],
            left: 40
        },
        grid: {
          left: "80px",
          right: "80px",
          top: "40px",
          bottom: "30px"
        },
        xAxis: {
          type: "category",
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(247,249,252,1)"
            }
          },
          axisLabel: {
            color: "#808080"
          },
          splitLine: {
            show: false
          },
          data: x_values
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
            lineStyle: {
              color: "#eeeeee",
              width: 1,
              opacity: 0
            }
          },
          axisLabel: {
            color: "#808080"
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(247,249,252,1)"
            }
          }
        },
        series: [
          {
            name: '访客数',
            data: y_values[0],
            type: "line",
            smooth: true,
            symbol: 'circle',
            // symbolSize: 8,
            itemStyle : {
              normal : {
                color:'#F3D12C',
                lineStyle:{
                  color:'#F3D12C'
                }
              }
            },
          },
          {
            name: '成交客户数',
            data: y_values[1],
            type: "line",
            smooth: true,
            symbol: 'diamond',
            // symbolSize: 8,
            itemStyle : {
              normal : {
                color:'#2589ff',
                lineStyle:{
                  color:'#2589ff'
                }
              }
            },
          }
        ]
      };
      this.myChart.setOption(options);
    }
  }
};
</script>
<style lang="less" scoped>
.survey__Box {
  .map-title {
    margin-top: 10px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 36px;
    background: rgba(255, 255, 255, 1);
    padding-left: 40px;
  }
  .map-title::before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    background: rgba(243, 209, 44, 1);
    margin-right: 7px;
  }
  .pp-line {
    height: 362px;
    padding: 20px 0;
    margin-top: 10px;
    background: rgba(255, 255, 255, 1);
  }
  .p-line {
    margin-top: 10px;
    height: 34px;
  }
  .p-line-tab-box {
    width: 202px;
    height: 34px;
    text-align: center;
    float: left;
  }
  .p-line-tab {
    width: 100px;
    height: 32px;
    line-height: 30px;
    float: left;
    cursor: pointer;
    user-select: none;
    border: 1px solid #3e7bf8;
    background: #fff;
    color: #3e7bf8;
  }
  .p-line-tab-active {
    background: #3e7bf8;
    color: #fff;
    border: none;
    line-height: 30px;
  }
  .survey-top {
    width: 100%;
    height: 101px;
    // background: rgba(62, 123, 248, 1);
    // background: url(../../assets/images/background.png);
    padding: 10px 10px 0 20px;
    margin-bottom: 10px;
    position: relative;
    .bg{
      position: absolute;
      z-index:0;
      top:0;
      left:0;
      width: 100%;
      height: 101px;
    }
    .shop-name {
      display: inline-block;
      vertical-align: top;
      margin-top: 10px;
      font-size: 24px;
      font-family: Microsoft YaHei;
      color: rgba(255, 255, 255, 1);
      line-height: 28px;
    }
    .shop-tag {
      display: inline-block;
      vertical-align: top;
      margin-top: 17px;
      margin-left: 5px;
      text-align: center;
      line-height: 18px;
      width: 60px;
      height: 18px;
      background: rgba(243, 208, 36, 1);
      font-size: 12px;
      font-family: Microsoft YaHei;
      color: rgba(62, 123, 248, 1);
    }
    & > div > div {
      opacity: 0.75;
      margin-top: 15px;
      font-size: 14px;
      height: 18px;
      line-height: 18px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      .shop-tag2 {
        display: inline-block;
        vertical-align: top;
        text-align: center;
        width: 46px;
        height: 18px;
        border: 1px solid rgba(255, 255, 255, 1);
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 16px;
      }
    }
    .qr {
      img {
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 1);
        margin-right: 5px;
        cursor: pointer;
      }
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      .hover {
        position: relative;
        .hov {
          position: absolute;
          z-index: 10;
          top: -30px;
          right: 90px;
          width: 300px;
          height: 300px;
          padding: 20px;
          display: none;
          border: 1px solid rgba(222, 222, 222, 1);
        }
      }
      .hover:hover {
        .hov {
          display: block;
        }
      }
    }
  }
  .statistic {
    background: rgba(255, 255, 255, 1);
    height: 214px;
    .statistic-item {
      padding: 23px 30px 7px 20px;
      .statistic-title {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      .statistic-title:before {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        margin-right: 5px;
      }
      .statistic-title01:before {
        content: url("../../assets/images/_01.png");
      }
      .statistic-title02:before {
        content: url("../../assets/images/_02.png");
      }
      .statistic-title03:before {
        content: url("../../assets/images/_03.png");
      }
      .statistic-title04:before {
        content: url("../../assets/images/_04.png");
      }
      .statistic-title05:before {
        content: url("../../assets/images/_05.png");
      }
      .statistic-num {
        margin-left: 33px;
        font-size: 24px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        span {
          font-size: 14px;
        }
      }
      .statistic-tag {
        margin-left: 33px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
    }
  }
  .app-action {
    padding-left: 10px;
    & > div {
      background: rgba(255, 255, 255, 1);
      height: 214px;
      .app-action-subtitle {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        padding-left: 10px;
        padding-top: 10px;
        padding: 10px 0 28px 10px;
      }
      .app-action-title-wrap{
        width: 110px;
        margin-left: 39px;
        display: block;
      }
      .app-action-title {
        margin-bottom: 35px;
        width: 110px;
        color: rgba(77, 77, 77, 1);
      }
      .app-action-title:before {
        display: inline-block;
        vertical-align: middle;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        margin-right: 5px;
      }
      .app-action-title01:before {
        content: url("../../assets/images/_11.png");
      }
      .app-action-title02:before {
        content: url("../../assets/images/_12.png");
      }
      .app-action-title03:before {
        content: url("../../assets/images/_13.png");
      }
      .app-action-title04:before {
        content: url("../../assets/images/_14.png");
      }
    }
  }
}
</style>
