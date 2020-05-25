<template>
  <div class="product">
    <!-- <a-spin tip="加载中..." :spinning="spin"></a-spin> -->
    <div class='title-bar'>
      <div>
        商品整体概览
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
          商品概况
        </div>
        <div class="title-item">
          <img src="../../assets/images/_02.png" alt="图片" class='img'>
          商品流量
        </div>
      </div>
      <div class="list">
        <div class="list-item">
          被访问商品数
          <div class='word'>
            {{getObj(8).data}}
          </div>
        </div>
        <div class="list-item">
          动销商品数
          <div class='word'>
            {{getObj(9).data}}
          </div>
        </div>
        <div class="list-item">
        </div>
        <div class="list-item">
          商品曝光数
          <div class='word'>
            {{getObj(1).data}}
          </div>
        </div>
        <div class="list-item">
          商品浏览量
          <div class='word'>
            {{getObj(0).data}}
          </div>
        </div>
        <div class="list-item">
         商品访客数
          <div class='word'>
            {{getObj(7).data}}
          </div>
        </div>
      </div>
      <div class="title" style="margin-top: 20px;">
        <div class="title-item">
          <img src="../../assets/images/_04.png" alt="图片" class='img'>
          商品转化
        </div>
      </div>
      <div class="list">
        <div class="list-item">
          加购件数
          <div class='word'>
            {{getObj(5).data}}
          </div>
        </div>
        <div class="list-item">
          下单件数
          <div class='word'>
            {{getObj(4).data}}
          </div>
        </div>
        <div class="list-item">
          支付件数
          <div class='word'>
            {{getObj(3).data}}
          </div>
        </div>
      </div>
    </div>

    <div class='title-bar' style="margin-top:10px">
      <div>
        商品趋势分析
      </div>
      <div class='bar-right'>
        <a-select style="width: 100px" @change="(val) => {changeSelectAnalysis(val, 'select2')}" :value='select2'>
          <a-select-option value="7">近7天</a-select-option>
          <a-select-option value="30">近30天</a-select-option>
          <a-select-option value="month">自然月</a-select-option>
        </a-select>
        <div v-if="select2 === '7'" class='left10'>
          {{moment().subtract(6, "days").format("YYYY-MM-DD")}} 至 {{moment().format("YYYY-MM-DD")}}
        </div>
        <div v-else-if="select2 === '30'" class='left10'>
          {{moment().subtract(29, "days").format("YYYY-MM-DD")}} 至 {{moment().format("YYYY-MM-DD")}}
        </div>
        <div v-else-if="select2 === 'month'" class='left10'>
          <a-month-picker @change="(val) => {changeTimeAnalysis(val, 'select22')}" :value="select22" :allowClear="false"/>
        </div>
      </div>
    </div>

    <a-spin tip="加载中..." :spinning="spinAnalysis">
        <div class="data-line" id="data-line"></div>
    </a-spin>

    <div class='title-bar' style="margin-top:10px">
      <div>
        商品排行榜
      </div>
      <div class='bar-right'>
        <a-select style="width: 100px" @change="(val) => {changeSelectTop(val, 'select3')}" :value='select3'>
          <a-select-option value="7">近7天</a-select-option>
          <a-select-option value="30">近30天</a-select-option>
          <a-select-option value="month">自然月</a-select-option>
        </a-select>
        <div v-if="select3 === '7'" class='left10'>
          {{moment().subtract(6, "days").format("YYYY-MM-DD")}} 至 {{moment().format("YYYY-MM-DD")}}
        </div>
        <div v-else-if="select3 === '30'" class='left10'>
          {{moment().subtract(29, "days").format("YYYY-MM-DD")}} 至 {{moment().format("YYYY-MM-DD")}}
        </div>
        <div v-else-if="select3 === 'month'" class='left10'>
          <a-month-picker @change="(val) => {changeTimeTop(val, 'select33')}" :value="select33" :allowClear="false"/>
        </div>
      </div>
    </div>

    <div class="bottom">
      <div class="bottom-block">
        <div class="title">
          支付金额TOP5
        </div>
        <a-row type="flex" justify="space-between" class="row-title">
          <a-col :span="8">排名</a-col>
          <a-col :span="8">商品名称</a-col>
          <a-col :span="8">支付金额</a-col>
        </a-row>
        <a-row type="flex" justify="space-between" class="row" v-for="(item, index) in payTop5" :key="index">
          <a-col :span="8">{{index + 1}}</a-col>
          <a-col :span="8">
            <span v-if="(item.goodsName || '').length < 8">
              {{item.goodsName}}
            </span>
            <ToolTip v-else :str="item.goodsName" :max="7"/>
          </a-col>
          <a-col :span="8">{{item.payPrice}}</a-col>
        </a-row>
      </div>
      <div class="bottom-block">
        <div class="title">
          访客数TOP5
        </div>
        <a-row type="flex" justify="space-between" class="row-title">
          <a-col :span="5">排名</a-col>
          <a-col :span="6">商品名称</a-col>
          <a-col :span="6">访客数</a-col>
          <a-col :span="7">访问支付转化率</a-col>
        </a-row>
        <a-row type="flex" justify="space-between" class="row" v-for="(item, index) in visitTop5" :key="index">
          <a-col :span="5">{{index + 1}}</a-col>
          <a-col :span="6">
            <span v-if="(item.goodsName || '').length < 8">
              {{item.goodsName}}
            </span>
            <ToolTip v-else :str="item.goodsName" :max="7"/>
          </a-col>
          <a-col :span="6">{{item.visitorNum}}</a-col>
          <a-col :span="7">{{item.transferRate}}%</a-col>
        </a-row>
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
import moment from 'moment';
import ToolTip from '../../components/Tooltip'
export default {
  components: {
    ToolTip
  },
  data() {
    return {
      moment,
      spinAnalysis: false,
      myChart: null,
      select1: 'now',
      select11: moment(),
      dataView: [],
      select2: '7',
      select22: moment(),
      select3: '7',
      select33: moment(),
      payTop5: [],
      visitTop5: []
    }
  },
  mounted() {
    this.getproductView()
    this.getChart();
    this.getTopData();
  },
  methods: {
    getproductView() {
      console.log(this.select1, this.select11)
      const timeObj = this.dealTime(this.select1, this.select11)
      api
        .ajax({
          data: timeObj,
          method: "goodsOverView"
        })
        .then(res => {
          console.log(res.data.data, '概览数据')
          this.dataView = res.data.data
        })
        .catch(() => {
          console.log("error");
        });
    },
    getObj(type) {
      const obj = this.dataView.find((item) => {
        return item.type == type
      })
      return obj || {data: 0}
    },
    changeSelect(val, target) {
      // console.log(val, target)
      this[target] = val;
      if (val !== 'day' && val !== 'month') {
        this.getproductView();
      }
    },
    changeTime(val, target) {
      // console.log(val, target)
      this[target] = val;
      this.getproductView();
    },
    getproductAnalysis() {
      console.log(this.select2, this.select22);
      this.myChart.clear();
      this.getChart()
    },
    getChart() {
      this.spinAnalysis = true;
      const timeObj = this.dealTime(this.select2, this.select22)
      api
        .ajax({
          data: timeObj,
          method: "goodsTrend"
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
          this.spinAnalysis = false;
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
        return item.goodsData['在架商品数']
      });
      y[1] = dataList.map((item) => {
        return item.goodsData['被访问商品数']
      });
      y[2] = dataList.map((item) => {
        return item.goodsData['动销商品数']
      });
      return {x,y}
    },
    changeSelectAnalysis(val, target) {
      // console.log(val, target)
      this[target] = val;
      if (val !== 'day' && val !== 'month') {
        this.getproductAnalysis();
      }
    },
    changeTimeAnalysis(val, target) {
      // console.log(val, target)
      this[target] = val;
      this.getproductAnalysis();
    },
    canvas(x_values, y_values) {
      this.myChart = echarts.init(document.getElementById("data-line"));
      let options = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['在架商品数', '被访问商品数', '动销商品数'],
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
            name: '在架商品数',
            data: y_values[0],
            type: "line",
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle : {
              normal : {
                color:'#f2d12c',
                lineStyle:{
                  color:'#f2d12c'
                }
              }
            },
          },
          {
            name: '被访问商品数',
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
            name: '动销商品数',
            data: y_values[2],
            type: "line",
            smooth: true,
            symbol: 'square',
            symbolSize: 8,
            itemStyle : {
              normal : {
                color:'#a7d57c',
                lineStyle:{
                  color:'#a7d57c'
                }
              }
            },
          }
        ]
      };
      this.myChart.setOption(options);
    },
    getTopData() {
      console.log(this.select3, this.select33)
      const timeObj = this.dealTime(this.select3, this.select33)
      api
        .ajax({
          data: timeObj,
          method: "goodsRankingList"
        })
        .then(res => {
          console.log(res.data.data, '排行榜数据')
          // this.dataView = res.data.data
          this.payTop5 = res.data.data.pRank;
          this.visitTop5 = res.data.data.vRank
        })
        .catch(() => {
          console.log("error");
        });

    },
    changeSelectTop(val, target) {
      // console.log(val, target)
      this[target] = val;
      if (val !== 'day' && val !== 'month') {
        this.getTopData();
      }
    },
    changeTimeTop(val, target) {
      // console.log(val, target)
      this[target] = val;
      this.getTopData();
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
  }
};
</script>
<style lang="less" scoped>
  .product{
    .title-bar{
      display: flex;
      background: #f1f2f5;
      align-items: center;
      justify-content: space-between;
      height: 45px;
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
      margin-top:10px;
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
          white-space: nowrap;
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
      padding: 20px 0;
      height: 400px;
      margin-top:10px;
      background: rgba(255, 255, 255, 1);
    }
    .bottom{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0 20px;
      .bottom-block{
        background: #fff;
        height: 320px;
        width: 49%;
        font-size: 12px;
        padding-bottom: 10px;
        .title{
          height: 40px;
          line-height: 40px;
          padding-left: 10px;
          border-bottom: 1px solid #e8e8e8;
          font-weight: bold;
        }
        .row-title{
          align-items: center;
          text-align: center;
          height: 40px;
          font-weight: bold;
        }
        .row{
          align-items: center;
          text-align: center;
          height: 45px;
        }
      }
    }

  }
</style>
