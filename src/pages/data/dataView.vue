<template>
  <div class="dataview">
    <a-spin tip="加载中..." :spinning="spin">
      <div style="margin-bottom: 10px">
      今日概况
    </div>
    <div class="data">
      <a-row type="flex" justify="space-around">
        <a-col :span="4" v-for="(item, index) in data1" :key="index" @click="chooseBlock(item.name)">
          <div :class="selectData === item.name ? 'data-block selected' : 'data-block'" >
            <div class="word">
              {{item.name}}
            </div>
            <div  class="number">
              {{item.number}} 
            </div>
            <div v-if="item.rise"  class="percent red">
              {{item.percent}}% <a-icon type="arrow-up" class="icon"/>
            </div>
            <div v-else class="percent green">
              {{item.percent}}% <a-icon type="arrow-down" class="icon"/>
            </div>
          </div>
          
        </a-col>
      </a-row>
      <a-row type="flex" justify="space-around">
        <a-col :span="4" v-for="(item, index) in data2" :key="index" @click="chooseBlock(item.name)">
          <div :class="selectData === item.name ? 'data-block selected' : 'data-block'">
            <div class="word">
              {{item.name}}
            </div>
            <div  class="number">
              {{item.number}}
              <span v-if="item.name === '店铺支付转化率' || item.name === '店铺复购率'">%</span>
            </div>
            <div v-if="item.rise"  class="percent red">
              {{item.percent}}% <a-icon type="arrow-up" class="icon"/>
            </div>
            <div v-else class="percent green">
              {{item.percent}}% <a-icon type="arrow-down" class="icon"/>
            </div>
          </div>
          
        </a-col>
      </a-row>
    </div>
    <a-spin tip="加载中..." :spinning="chartLoading">
      <div class="data-line" id="data-line"></div>
    </a-spin>
    

    <div class="bottom">
      <div class="bottom-block left">
        <div class="title">
          访问支付转化
        </div>
        <div class="content">
          <img src="../../assets/images/dataView.jpg" alt="" class="img">
          <div class='center fang-number'>
              访问人数<br>{{findObj(transferList, "访问人数").repData}}
          </div>
          <div class='center xia-number'>
              下单人数<br>{{findObj(transferList, "下单人数").repData}}
          </div>
          <div class='center zhi-number'>
              支付人数<br>{{findObj(transferList, "支付人数").repData}}
          </div>
          <div class='center fang-xia'>
              访问下单转化率<br>{{findObj(transferList, "访问下单转化率").repData}}%
          </div>
          <div class='center fang-zhi'>
              访问支付转化率<br>{{findObj(transferList, "访问支付转化率").repData}}%
          </div>
          <div class='center xia-zhi'>
              下单支付转化率<br>{{findObj(transferList, "下单支付转化率").repData}}%
          </div>
        </div>
      </div>
      <div class="bottom-block right">
        <div class="title">
          热销TOP5商品榜单
        </div>
        <a-row type="flex" justify="space-between" class="row-title">
          <a-col :span="5">商品名称</a-col>
          <a-col :span="6">访问人数</a-col>
          <a-col :span="6">支付人数</a-col>
          <a-col :span="7">访问支付转化率</a-col>
        </a-row>
        <a-row type="flex" justify="space-between" class="row" v-for="(item, index) in top5" :key="index">
          <a-col :span="5">
            <span v-if="(item.goodsName || '').length < 8">
              {{item.goodsName}}
            </span>
            <ToolTip v-else :str="item.goodsName" :max="7"/>
          </a-col>
          <a-col :span="6">{{item.visitCusNum}}</a-col>
          <a-col :span="6">{{item.payCusNum}}</a-col>
          <a-col :span="7">{{item.transferRate}}%</a-col>
        </a-row>
      </div>
    </div>

    </a-spin>
  </div>
</template>
<script>
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import api from "@/api/user";
import ToolTip from '../../components/Tooltip'
import moment from 'moment'

export default {
  components:{
    ToolTip
  },
  data() {
    return {
      spin: false,
      myChart: null,
      selectData: '浏览量',
      data1: {
        d1: {
          name: '浏览量',
          number: 0,
          percent: 0,
          rise: true
        },
        d2: {
          name: '访客量',
          number: 0,
          percent: 0,
          rise: true
        },
        d3: {
          name: '支付客数',
          number: 0,
          percent: 0,
          rise: true
        },
        d4: {
          name: '支付单数',
          number: 0,
          percent: 0,
          rise: true
        },
        d5: {
          name: '实收金额',
          number: 0,
          percent: 0,
          rise: true
        }
      },
      data2: {
        d11: {
          name: '客单价',
          number: 0,
          percent: 0,
          rise: true
        },
        d22: {
          name: '获取新客',
          number: 0,
          percent: 0,
          rise: true
        },
        d33: {
          name: '加购人数',
          number: 0,
          percent: 0,
          rise: true
        },
        d44: {
          name: '店铺支付转化率',
          number: 0,
          percent: 0,
          rise: true
        },
        d55: {
          name: '店铺复购率',
          number: 0,
          percent: 0,
          rise: true
        }
      },
      chartLoading: false,
      transferList: [],
      top5: []
    }
  },
  mounted() {
    this.getList()
    this.getChart();
  },
  methods: {
    findObj(list, typeName) {
      let returnObj = list.find((item) => {
        return item.type === typeName
      });
      return returnObj || {}
    },
    getList() {
      this.spin = true
      api
        .ajax({
          method: "todayOverView"
        })
        .then(res => {
          const data = res.data.data;
          console.log(data, '-----页面数据---')
          const data1 = {
            d1: {
              name: '浏览量',
              number: (data.overViewList[0] || {}).repData,
              percent: (data.overViewList[0] || {}).chainRate,
              rise: (data.overViewList[0] || {}).chainRate > 0
            },
            d2: {
              name: '访客量',
              number: (data.overViewList[1] || {}).repData,
              percent: (data.overViewList[1] || {}).chainRate,
              rise: (data.overViewList[1] || {}).chainRate > 0
            },
            d3: {
              name: '支付客数',
              number: (data.overViewList[2] || {}).repData,
              percent: (data.overViewList[2] || {}).chainRate,
              rise: (data.overViewList[2] || {}).chainRate > 0
            },
            d4: {
              name: '支付单数',
              number: (data.overViewList[3] || {}).repData,
              percent: (data.overViewList[3] || {}).chainRate,
              rise: (data.overViewList[3] || {}).chainRate > 0
            },
            d5: {
              name: '实收金额',
              number: (data.overViewList[4] || {}).repData,
              percent: (data.overViewList[4] || {}).chainRate,
              rise: (data.overViewList[4] || {}).chainRate > 0
            }
          };
          const data2 = {
            d11: {
              name: '客单价',
              number: (data.overViewList[5] || {}).repData,
              percent: (data.overViewList[5] || {}).chainRate,
              rise: (data.overViewList[5] || {}).chainRate > 0
            },
            d22: {
              name: '获取新客',
              number: (data.overViewList[6] || {}).repData,
              percent: (data.overViewList[6] || {}).chainRate,
              rise: (data.overViewList[6] || {}).chainRate > 0
            },
            d33: {
              name: '加购人数',
              number: (data.overViewList[7] || {}).repData,
              percent: (data.overViewList[7] || {}).chainRate,
              rise: (data.overViewList[7] || {}).chainRate > 0
            },
            d44: {
              name: '店铺支付转化率',
              number: (data.overViewList[8] || {}).repData,
              percent: (data.overViewList[8] || {}).chainRate,
              rise: (data.overViewList[8] || {}).chainRate > 0
            },
            d55: {
              name: '店铺复购率',
              number: (data.overViewList[9] || {}).repData,
              percent: (data.overViewList[9] || {}).chainRate,
              rise: (data.overViewList[9] || {}).chainRate > 0
            }
          };
          this.data1 = data1
          this.data2 = data2
          this.top5 = data.payRankList
          this.transferList = data.transferList
          this.spin = false
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    getChart() {
      this.chartLoading = true;
      api
        .ajax({
          method: "overViewHourlyDetail",
          data: {
            type: this.selectData
          }
        })
        .then(res => {
          const data = res.data.data;
          const x = ['0点', '1点', '2点', '3点', '4点', '5点', '6点', '7点', '8点', '9点', '10点', '11点', '12点', '13点', '14点', '15点', '16点', '17点', '18点', '19点', '20点','21点', '22点', '23点']
          const y = data.map((item) => {
            return item.repData
          })
          console.log(x,y, data)
          this.canvas(x, y)
          this.chartLoading = false;
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    chooseBlock(target) {
      this.myChart.clear();
      this.selectData = target;
      this.getChart();
    },
    canvas(x_values, y_values) {
      this.myChart = echarts.init(document.getElementById("data-line"));
      const that = this
      let options = {
        tooltip: {
            trigger: 'axis',
            // formatter(params) {
            //   console.log(params)
            //   const item = params[0];
            //   return `
            //           ${item.name}<br/>
            //           ${that.selectData}：${item.data} ${that.selectData === '店铺支付转化率' || that.selectData === '店铺复购率' ? '%' : ''}
            //         `;
            // }
        },
        grid: {
          left: "50px",
          right: "50px",
          top: "30px",
          bottom: "30px"
        },
        itemStyle: {
          color: "#2589ff"
        },
        xAxis: {
          name: '时间',
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
          // name: '单位: 次',
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
            name: this.selectData,
            data: y_values,
            type: "line",
            smooth: true
          }
        ]
      };
      this.myChart.setOption(options);
    }
  }
};
</script>
<style lang="less" scoped>
  .dataview{
    padding: 10px;
    .data{
      background: #fff;
      padding: 20px 0;
      .data-block{
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        height: 135px;
        margin-bottom: 20px;
        .word{
          font-size: 14px;
        }
        .number{
          font-size: 22px;
          font-weight: bold;
        }
        .percent{
          display: flex;
          font-size: 12px;
          align-items: center;
          .icon{
            margin-left: 10px
          }
        }
        .red{
          color: red;
        }
        .green{
          color: green;
        }
      }
      .selected{
        border: 1px solid rgb(0,153,255);
        border-radius: 6px;
      }
    }
    .data-line {
      margin-top: 20px;
      height: 262px;
      background: rgba(255, 255, 255, 1);
      padding: 20px 0;
    }
    .bottom{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 40px 0;
      .bottom-block{
        padding: 10px 0;
        background: #fff;
        height: 360px;
        width: 49%;
        font-size: 12px;
        .title{
          color: #000;
          font-size: 14px;
          padding-bottom: 30px;
          height: 30px;
          line-height: 30px;
          padding-left: 10px;
          border-bottom: 1px solid #e8e8e8;
        }
      }
      .left{
        
        .content{
          height: 270px;
          width: 350px;
          position: relative;
          margin: 20px auto 0;
          font-size: 12px;
          .img{
            width: 320px;
          }
          .center{
            text-align: center;
          }
          .fang-number{
            color: #fff;
            position: absolute;
            top: 19px;
            left: 85px;
          }
          .xia-number{
            color: #fff;
            position: absolute;
            top: 95px;
            left: 85px;
          }
          .zhi-number{
            color: #fff;
            position: absolute;
            top: 170px;
            left: 85px;
          }
          .fang-xia{
            position: absolute;
            width: 100px;
            top: 55px;
            left: 220px;
          }
          .fang-zhi{
            position: absolute;
            width: 100px;
            top: 90px;
            left: 315px;
          }
          .xia-zhi{
            position: absolute;
            width: 100px;
            top: 135px;
            left: 220px;
          }
        }
      }
      .right{
        .row-title{
          align-items: center;
          text-align: center;
          height: 40px;
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
