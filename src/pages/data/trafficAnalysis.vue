<template>
  <div class="dataview">
    <div class='title-bar'>
     <div style="font-size: 14px;font-weight: bold">
       数据总览
     </div>
      <div style="display: flex; align-items: center;">
        <div>
          统计时间
        </div>
        <a-select style="width: 100px;margin-left: 10px" @change="(val) => {changeSelect(val, 'select1')}" :value='select1'>
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

    <a-spin tip="加载中..." :spinning="dataSpin">
      <div class="visit-data">
        <div class="button-bar">
          <div :class="visitSelect === '2' ? 'item selected' : 'item'" @click="selectVisit('2')">
            <div class='title'>全部</div>
            <div class="content">访客数</div>
          </div>
          <div :class="visitSelect === '0' ? 'item selected' : 'item'" @click="selectVisit('0')">
            <div class='title'>H5</div>
            <div class="content">访客数</div>
          </div>
          <div :class="visitSelect === '1' ? 'item selected' : 'item'" @click="selectVisit('1')">
            <div class='title'>小程序</div>
            <div class="content">访客数</div>
          </div>
        </div>
        <div class="data-bar">
          <div class="data-title">
            <img src="../../assets/images/_01.png" alt="图片" class='img'>
            浏览访问
          </div>
          <a-row class="row">
            <a-col :span="5" class="data-item" >
              访客数
                <div class="data-content">
                  {{dataNumber('访客数')}}
                </div>
            </a-col>
            <a-col :span="5" class="data-item">
              新访客数
                <div class="data-content">
                  {{dataNumber('新访客数')}}
                </div>
            </a-col>
            <a-col :span="5" class="data-item">
              浏览量
                <div class="data-content">
                  {{dataNumber('浏览量')}}
                </div>
            </a-col>
            <a-col :span="5" class="data-item">
              人均浏览量
                <div class="data-content">
                  {{dataNumber('人均浏览量')}}
                </div>
            </a-col>
          </a-row>
        </div>
        <div class="data-bar" style="border-top: none">
          <div class="data-title">
            <img src="../../assets/images/_04.png" alt="图片" class='img'>
            成交转化
          </div>
          <a-row class="row">
            <a-col :span="5" class="data-item" >
              支付人数
                <div class="data-content">
                  {{dataNumber('支付人数')}}
                </div>
            </a-col>
            <a-col :span="5" class="data-item">
              访问-支付转化率
                <div class="data-content">
                  {{dataNumber('访问-支付转化率')}}%
                </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-spin>

    <div class='title-bar' style="margin-bottom: 10px">
     <div style="font-size: 14px;font-weight: bold">
       流量趋势
     </div>
      <div style="display: flex; align-items: center;">
        <div>
          统计时间
        </div>
        <a-select style="width: 100px;margin-left: 10px" @change="(val) => {changeSelect2(val, 'select2')}" :value='select2'>
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
            <a-date-picker @change="(val) => {changeTime2(val, 'select22')}" :value="select22" :allowClear="false"/>
          </div>
          <div v-else-if="select2 === 'month'" class='left10'>
            <a-month-picker @change="(val) => {changeTime2(val, 'select22')}" :value="select22" :allowClear="false"/>
          </div>
      </div>
    </div>
    <div class="traffic-bar">
      <div class="title">
        <div>
          浏览访问:
        </div>
        <div>
          成交转化:
        </div>
      </div>
      <a-radio-group @change="changeRadio" v-model="radio" class="radio-list">
        <a-row>
          <a-col :span="6" v-for="(item, index) in radioList" :key="index" class='radio-item'>
            <a-radio :value="item.value">{{item.name}}</a-radio>
          </a-col>
        </a-row>
      </a-radio-group>
    </div>
    <div style="background: #fff;padding: 30px 0 10px 10px;">
      <a-radio-group v-model="trafficButton" @change="changeTrafficButton" buttonStyle="solid">
        <a-radio-button :value="2" class="button">全部</a-radio-button>
        <a-radio-button :value="0" class="button">H5</a-radio-button>
        <a-radio-button :value="1" class="button">小程序</a-radio-button>
      </a-radio-group>
      <a-spin tip="加载中..." :spinning="spin">
        <div class="data-line" id="data-line"></div>
      </a-spin>
    </div>

  </div>
</template>
<script>
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import api from "@/api/user";
import moment from 'moment'
const radioList = [
  {
    name: '访客数',
    value: 0
  },
  {
    name: '新访客数',
    value: 1
  },
  {
    name: '浏览量',
    value: 2
  },
  // {
  //   name: '平均停留时长（秒）',
  //   value: '4'
  // },
  {
    name: '人均浏览量',
    value: 3
  },
  // {
  //   name: '跳失率',
  //   value: '6'
  // },
  {
    name: '支付人数',
    value: 4
  },
  {
    name: '访问-支付转化率',
    value: 5
  },
]
export default {
  data() {
    return {
      moment,
      dataSpin: false,
      dataList: [],
      spin: false,
      myChart: null,
      select1: 'now',
      select11: moment(),
      select2: 'now',
      select22: moment(),
      visitSelect: '2',
      radioList,
      radio: 0,
      trafficButton: 2,
    }
  },
  mounted() {
    this.getData()
    this.getChart();
  },
  methods: {
    getData() {
      const date = this.dealTime(this.select1, this.select11)
      console.log(this.select1, this.select11, date, this.visitSelect)
      this.dataSpin = true;
      api.ajax({
        method: 'flowOverView',
        data: {
          ...date,
          sourceType: this.visitSelect
        }
      }).then((res) => {
        console.log(res.data.data, '获取数据总览数据');
        this.dataList = res.data.data;
        this.dataSpin = false;
      }).catch((e) => {
        console.log(e)
      })
    },
    dataNumber(type) {
      const typeObj = this.dataList.find((item) => {
        return item.dataType === type
      });
      return (typeObj || {repData: 0}).repData
    },
    changeSelect(val, target) {
      // console.log(val, target)
      this[target] = val;
      if (val !== 'day' && val !== 'month') {
        this.getData();
      }
    },
    changeTime(val, target) {
      // console.log(val, target)
      this[target] = val;
      this.getData();
    },
    selectVisit(val) {
      this.visitSelect = val;
      this.getData()
    },
    changeSelect2(val, target) {
      // console.log(val, target)
      this[target] = val;
      if (val !== 'day' && val !== 'month') {
        this.myChart.clear();
        this.getChart();
      }
    },
    changeTime2(val, target) {
      // console.log(val, target)
      this[target] = val;
      this.myChart.clear();
      this.getChart();
    },
    changeRadio(e) {
      console.log('radio checked', e.target.value);
      this.radio = e.target.value
      this.myChart.clear();
      this.getChart();
    },
    changeTrafficButton(e) {
      // console.log('radio button checked', e.target.value);
      this.trafficButton = e.target.value
      this.myChart.clear();
      this.getChart();
    },
    getChart() {
      const date = this.dealTime(this.select2, this.select22)
      console.log(date, this.radio, this.trafficButton)
      this.spin = true;
      api.ajax({
        method: 'flowTrend',
        data: {
          ...date,
          queryType: this.radio,
          sourceType: this.trafficButton
        }
      }).then((res) => {
        console.log(res.data.data, '获取echart图数据');
        const x = res.data.data.map((item) => {
          return moment(item.queryDate).format('MM-DD')
        });
        const y = res.data.data.map((item) => {
          return item.repData
        })
        this.spin = false;
        this.canvas(x, y)
      }).catch((e) => {
        console.log(e)
      })
    },
    canvas(x_values, y_values) {
      const target = this.radioList.find((item) => {
        return item.value === this.radio
      })
      console.log(target)
      this.myChart = echarts.init(document.getElementById("data-line"));
      let options = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
          data: [target.name],
          left: 40
        },
        grid: {
          left: "80px",
          right: "80px",
          top: "50px",
          bottom: "20px"
        },
        itemStyle: {
          color: "#2589ff"
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
            name: target.name,
            data: y_values,
            type: "line",
            smooth: true
          }
        ]
      };
      this.myChart.setOption(options);
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
  .dataview{
    padding-bottom: 10px;
    .title-bar{
      display: flex;
      background: #f1f2f5;
      justify-content: space-between;
      align-items: center;
      height: 45px;
      padding: 0 5px;
      .left10{
          margin-left: 10px;
        }
    }

    .visit-data{
      height: 400px;
      padding: 30px 20px 0;
      background: #fff;
      margin: 10px 0;
      .button-bar{
        margin-bottom: 30px;
        display: flex;
        .item{
          cursor: pointer;
          width: 130px;
          height: 60px;
          margin-right: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid #ccc;
          border-radius: 4px;
          .title{
            margin-bottom: 5px;
            font-weight: bold;
          }
          .content{
            font-size: 12px
          }
        }
        .selected{
          border-color: #1890ff;
          color: #fff;
          background: #1890ff;
        }
      }
      .data-bar{
        display: flex;
        align-items: center;
        height: 110px;
        .data-title{
            width: 90px;
            height: 110px;
            line-height: 110px;
            text-align: center;
          }
        .row{
          flex: 1;
          .data-item{
            margin: 25px 0;
            height: 60px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .data-content{
              margin-top: 10px;
              font-weight: bold;
            }
          }
        }
      }
    }

    .traffic-bar{
      padding: 10px 15px 20px;
      display: flex;
      background: #fff;
      height: 120px;
      border-bottom: 1px solid #ccc;
      .title{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        padding-right: 20px;
        flex: none;
      }
      .radio-list{
        flex: 1;
        font-size: 12px;
        .ant-row{
          height: 90px;
          .radio-item{
            height: 45px;
            line-height: 45px;
          }
        }
        
      }
    }
    .button{
      width: 90px;
      text-align: center;
    }
    .data-line {
      height: 390px;
      background: rgba(255, 255, 255, 1);
      padding: 40px 0 60px;
    }
  }
</style>
