<template>
  <div class="statistic">
    <!-- <a-spin tip="加载中..." :spinning="spin"></a-spin> -->
    <div class='title-bar'>
      <div>
        优惠券整体概览
      </div>
      <div class='bar-right'>
        <a-select style="width: 100px" @change="(val) => {changeSelect(val, 'select1')}" :value='select1'>
          <a-select-option value="now">今日实时</a-select-option>
          <a-select-option value="7">近7天</a-select-option>
          <a-select-option value="30">近30天</a-select-option>
          <a-select-option value="day">自然日</a-select-option>
          <a-select-option value="month">自然月</a-select-option>
        </a-select>
        <div v-if="select1 === '7'" class='left10'>
          {{moment().subtract(6, "days").format("YYYY-MM-DD")}} 至 {{moment().format("YYYY-MM-DD")}}
        </div>
        <div v-else-if="select1 === '30'" class='left10'>
          {{moment().subtract(29, "days").format("YYYY-MM-DD")}} 至 {{moment().format("YYYY-MM-DD")}}
        </div>
        <div v-else-if="select1 === 'day'" class='left10'>
          <a-date-picker @change="(val) => {changeTime(val, 'select11')}" :value="select11" :allowClear="false"/>
        </div>
        <div v-else-if="select1 === 'month'" class='left10'>
          <a-month-picker @change="(val) => {changeTime(val, 'select11')}" :value="select11" :allowClear="false"/>
        </div>
      </div>
    </div>

    <div class='product-view'>
      <div class="title">
        <div class="title-item">
          <img src="../../assets/images/_01.png" alt="图片" class='img'>
          活动曝光
        </div>
        <div class="title-item">
          <img src="../../assets/images/_02.png" alt="图片" class='img'>
          活动下单
        </div>
      </div>
      <div class="list">
        <div class="list-item">
          浏览量
          <div class='word'>
            {{getObj(0).data}}
          </div>
        </div>
        <div class="list-item">
          访客量
          <div class='word'>
            {{getObj(8).data}}
          </div>
        </div>
        <div class="list-item">
          领取量
          <div class='word'>
            {{getObj(1).data}}
          </div>
        </div>
        <div class="list-item">
          下单单数
          <div class='word'>
            {{getObj(2).data}}
          </div>
        </div>
        <div class="list-item">
          下单人数
          <div class='word'>
            {{getObj(9).data}}
          </div>
        </div>
        <div class="list-item">
         下单金额
          <div class='word'>
            {{getObj(3).data}}
          </div>
        </div>
      </div>
      <div class="title" style="margin-top: 20px;">
        <div class="title-item">
          <img src="../../assets/images/_03.png" alt="图片" class='img'>
          支付转化
        </div>
      </div>
      <div class="list">
        <div class="list-item">
          支付单数
          <div class='word'>
            {{getObj(4).data}}
          </div>
        </div>
        <div class="list-item">
          支付人数
          <div class='word'>
            {{getObj(10).data}}
          </div>
        </div>
        <div class="list-item">
          应收金额
          <div class='word'>
            {{getObj(5).data}}
          </div>
        </div>
        <div class="list-item">
          实收金额
          <div class='word'>
            {{getObj(6).data}}
          </div>
        </div>
      </div>
    </div>

    <div class='title-bar' style="margin-top:20px">
      <div>
        活动趋势
      </div>
      <div class='bar-right'>
        <a-select style="width: 100px" @change="(val) => {changeSelectActivity(val, 'select2')}" :value='select2'>
          <a-select-option value="now">今日实时</a-select-option>
          <a-select-option value="7">近7天</a-select-option>
          <a-select-option value="30">近30天</a-select-option>
          <a-select-option value="day">自然日</a-select-option>
          <a-select-option value="month">自然月</a-select-option>
        </a-select>
        <div v-if="select2 === '7'" class='left10'>
          {{moment().subtract(6, "days").format("YYYY-MM-DD")}} 至 {{moment().format("YYYY-MM-DD")}}
        </div>
        <div v-else-if="select2 === '30'" class='left10'>
          {{moment().subtract(29, "days").format("YYYY-MM-DD")}} 至 {{moment().format("YYYY-MM-DD")}}
        </div>
        <div v-else-if="select2 === 'day'" class='left10'>
          <a-date-picker @change="(val) => {changeTimeActivity(val, 'select22')}" :value="select22" :allowClear="false"/>
        </div>
        <div v-else-if="select2 === 'month'" class='left10'>
          <a-month-picker @change="(val) => {changeTimeActivity(val, 'select22')}" :value="select22" :allowClear="false"/>
        </div>
      </div>
    </div>

    <a-spin tip="加载中..." :spinning="spin">
        <div class="data-line" id="data-line"></div>
    </a-spin>
    
  </div>
</template>
<script>
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import api from "@/api/user";
import moment from 'moment';
export default {
  data() {
    return {
      moment,
      spin: false,
      dataList: [],
      myChart: null,
      select1: 'now',
      select11: moment(),
      select2: '7',
      select22: moment(),
    }
  },
  mounted() {
    this.getChart();
    this.getCouponView()
  },
  methods: {
    getChart() {
      this.spin = true;
      const timeObj = this.dealTime(this.select2, this.select22)
      api
        .ajax({
          data: timeObj,
          method: "couponTrend"
        })
        .then(res => {
          console.log(res.data.data, '图数据')
          // const x = ['1点', '2点', '3点', '4点', '5点', '6点', '7点']
          // let y = [
          //   [1,43,32,6,8,6,43],
          //   [43,32,6,33,32,23,4],
          //   [9,32,6,62,89,43,6],
          // ]
          const xyObj = this.dealChartData(res.data.data)
          this.canvas(xyObj.x, xyObj.y);
          this.spin = false;
        })
        .catch(() => {
          console.log("error");
        });
    },
    dealChartData(dataList) {
      const x = dataList.map((item) => {
        return moment(item.queryDate).format('MM-DD')
      });
      let y = [];
      y[0] = dataList.map((item) => {
        return item.couponData['下单单数']
      });
      y[1] = dataList.map((item) => {
        return item.couponData['支付单数']
      });
      y[2] = dataList.map((item) => {
        return item.couponData['使用率']
      });
      return {x,y}
    },
    getCouponView() {
      const timeObj = this.dealTime(this.select1, this.select11)
      console.log(this.select1, this.select11, timeObj)
      api
        .ajax({
          data: timeObj,
          method: "couponOverView"
        })
        .then(res => {
          console.log(res.data.data, '概览数据')
          this.dataList = res.data.data
        })
        .catch(() => {
          console.log("error");
        });
    },
    dealTime(select1, select2) {
      // <a-select-option value="now">今日实时</a-select-option>
      //     <a-select-option value="7">近7天</a-select-option>
      //     <a-select-option value="30">近30天</a-select-option>
      //     <a-select-option value="day">自然日</a-select-option>
      //     <a-select-option value="month">自然月</a-select-option>
      let startDate = moment();
      let endDate = moment();
      if (select1 === 'day') {
        startDate = select2
        endDate = select2
      } else if (select1 === 'month') {
        startDate = moment(select2).startOf('month')
        endDate = moment(select2).endOf('month')
      } else if (select1 === '7') {
        startDate = moment().subtract(6, "days");
        endDate = moment()
      } else if (select1 === '30') {
        startDate = moment().subtract(29, "days");
        endDate = moment()
      }
      return {
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD')
      }
    },
    getObj(type) {
      const obj = this.dataList.find((item) => {
        return item.type == type
      })
      return obj || {data: 0}
    },
    changeSelect(val, target) {
      // console.log(val, target)
      this[target] = val;
      if (val !== 'day' && val !== 'month') {
        this.getCouponView();
      }
    },
    changeTime(val, target) {
      // console.log(val, target)
      this[target] = val;
      this.getCouponView();
    },
    changeSelectActivity(val, target) {
      // console.log(val, target)
      this[target] = val;
      if (val !== 'day' && val !== 'month') {
        this.myChart.clear();
        this.getChart();
      }
    },
    changeTimeActivity(val, target) {
      // console.log(val, target)
      this[target] = val;
      this.myChart.clear();
      this.getChart();
    },
    canvas(x_values, y_values) {
      this.myChart = echarts.init(document.getElementById("data-line"));
      let options = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['下单单数', '支付单数', '使用率'],
            left: 10
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
              color: "#ccc"
            }
          },
          axisLabel: {
            color: "#999"
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
              color: "#999"
            }
          },
          axisLabel: {
            color: "#999"
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
            name: '下单单数',
            data: y_values[0],
            type: "line",
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle : {
              normal : {
                color:'#fda959',
                lineStyle:{
                  color:'#fda959'
                }
              }
            },
          },
          {
            name: '支付单数',
            data: y_values[1],
            type: "line",
            smooth: true,
            symbol: 'diamond',
            symbolSize: 8,
            itemStyle : {
              normal : {
                color:'#2589ff',
                lineStyle:{
                  color:'#2589ff'
                }
              }
            },
          },
          {
            name: '使用率',
            data: y_values[2],
            type: "line",
            smooth: true,
            symbol: 'square',
            symbolSize: 8,
            itemStyle : {
              normal : {
                color:'#9cdb00',
                lineStyle:{
                  color:'#9cdb00'
                }
              }
            },
          }
        ]
      };
      this.myChart.setOption(options);
    },
  }
};
</script>
<style lang="less" scoped>
  .statistic{
    padding: 10px 5px;
    .title-bar{
      display: flex;
      background: #f1f2f5;
      align-items: center;
      justify-content: space-between;
      height: 25px;
      padding: 0 5px;
      .bar-right{
        display: flex;
        padding-right: 20px;
        align-items: center;
        .left10{
          margin-left: 10px;
        }
      }
    }
    .product-view{
      background: #fff;
      height: 320px;
      margin-top:20px;
      display: flex;
      flex-direction: column;
      padding: 20px;
      .title{
        display: flex;
        align-items: center;
        .title-item{
          width: 42%;
          img{
            margin-right: 10px;
          }
        }
        margin-bottom: 20px;
      }
      .list{
        height: 80px;
        display: flex;
        .list-item{
          width: 14%;
          height: 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 30px;
          .word{
            margin-top: 5px;
            margin-left: 5px;
            font-size: 22px;
            font-weight: bold;
          }
        }
      }
    }
    .data-line{
      height: 400px;
      margin-top:20px;
      background: rgba(255, 255, 255, 1);
      padding: 20px 0;
    }

  }
</style>
