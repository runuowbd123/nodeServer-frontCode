<template>
  <div class="client-list">
    <Toolbar :tools="tools" @onChange="changeTool" @onSearch="onSearch"/>
    <div style="display: flex;flex-direction: row-reverse" v-if="$permission.hasPermission('SALE_COUPON_EDIT')">
      <a-button type="primary" @click="addCoupon" style="margin-top: 10px">新建优惠券</a-button>
    </div>
    

    <div class="page_table">
      <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'"
        :bordered="false"
        :pagination="false"
        :columns="columns"
        :dataSource="listData"
        :rowKey="record => record.id"
        :loading="spin"
      >
        <div slot="type" slot-scope="text">
          <div v-if="text == 1">
            满减券
          </div>
          <div v-else>
            折扣券
          </div>
        </div>
        <div slot="content" slot-scope="text">
          {{text || '-'}}
        </div>
        <div slot="status" slot-scope="text">
          {{statusObj[text] || '-'}}
        </div>
        <div slot="used" slot-scope="text">
          {{text != null ? text : 0}}
        </div>
        <div slot="orderNum" slot-scope="text">
          {{text != null ? text : 0}}
        </div>
        <div slot="orderAmount" slot-scope="text">
          {{text != null ? text : 0}}
        </div>
        <div slot="discountsAmount" slot-scope="text">
          {{text != null ? text : 0}}
        </div>
        <div slot="received" slot-scope="text, record">
          {{text ? text : 0}}/{{record.amount - (text ? text : 0)}}
        </div>
        <div slot="action" slot-scope="text, record, index" style="min-width: 120px;display: flex;flex-wrap: wrap;justify-content: center">
          <a href="javascript:;" style="margin-right: 10px; display: block;" v-show="record.status == 2" @click="startCoupon(record, index)" v-if="$permission.hasPermission('SALE_COUPON_EDIT')">开始发券</a>
          <a href="javascript:;" style="margin-right: 10px; display: block;" v-show="record.status != -1" @click="goToCoupon(record, 'look')">详情</a>
          <a href="javascript:;" style="margin-right: 10px; display: block" v-show="record.status == 3" @click="stopCoupon(record, index)" v-if="$permission.hasPermission('SALE_COUPON_EDIT')">停止发券</a>
          <a href="javascript:;" style="margin-right: 10px; display: block" v-show="record.status == 3 || record.status == 4" @click="gotoCodeBank(record)" v-if="$permission.hasPermission('SALE_COUPON_EDIT')">码库</a>
          <a href="javascript:;" style="margin-right: 10px; display: block" v-show="record.status == 3" @click="getShare(record)">分享</a>
          <a href="javascript:;" style="margin-right: 10px; display: block; " v-show="record.status == -1" @click="goToCoupon(record, 'resubmit')" v-if="$permission.hasPermission('SALE_COUPON_EDIT')">重新提交</a>
          <a href="javascript:;" style="display: block" @click="deleteCoupon(record, index)" v-show="record.status == -1 || record.status == 4" v-if="$permission.hasPermission('SALE_COUPON_EDIT')">删除</a>
        </div>
      </a-table>
    </div>

    <div class="page_pagination">
      <a-pagination
        showQuickJumper
        showSizeChanger
        :total="pager.total"
        v-model="pager.currentPage"
        @change="paginationChange"
        :pageSize="pager.pageSize"
        @showSizeChange="onShowSizeChange"
        :pageSizeOptions="pager.pageSizeOptions"
        :showTotal="total => `共有 ${pager.total} 条/${pager.totalPage}页`"
      />
    </div>

    <a-modal title="分享" v-if="!!shareModal" :visible="!!shareModal" @cancel="shareCancel" :maskClosable='false' :footer="null" :width="600">
      <div style="display: flex;">
        <div style="border: 1px solid #ccc; width: 260px;">
          <div style="display: flex;flex-direction: column;align-items: center;justify-content: space-between;height:150px;padding: 10px 0 5px">
            {{shareModal.name}}
            <div style="font-size: 18px;font-weight: bold">
              {{shareModal.content}}
            </div>
            <div style="font-size: 14px;color: #ccc">
              <!-- {{moment(shareModal.validStartTime).format('YYYY-MM-DD')}}至{{moment(shareModal.validEndTime).format('YYYY-MM-DD')}} -->
              使用时间: {{shareModal.validTime}}
            </div>
          </div>
          
          <div style="height: 245px;display: flex;flex-direction: column;align-items: center;justify-content:center;border-top: 1px solid #ccc">
            <img :src="shareModal.qrCode" alt="二维码图" style="width: 120px;height: 120px;display: block;margin-bottom: 10px">
            <div>
              扫码参与/分享
            </div>
          </div>

        </div>
        <div style="margin-left:20px">
          <p>分享链接</p>
          <div>
            <a-input-search
              :value="shareModal.url"
              @search="copy"
              enterButton="复制"
              style="margin-bottom: 10px;"
              id="copy"
            />
          </div>
          <a href="javascript:;" style="margin-right: 10px" @click="share()">下载二维码</a>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import api from "@/api/user";
import moment from "moment";
import Toolbar from "../../components/ToolBar.vue"
const statusObj = {
  "1": "待审核",
  "-1": "驳回",
  "0": "未开始",
  "2": "未开始",
  "3": "进行中",
  "4": "已结束"
}
export default {
  components: {
    Toolbar
  },
  data() {
    return {
      moment,
      statusObj,
      toolValue: {
        searchText: null,
        status: 'null',
        type: 'null',
      },
      tools: [
        {
            type: 'input',
            title: '优惠券名称:',
            placeholder: '请输入优惠券名称',
            key: 'searchText',
            defaultValue: null,
        },
        {
            type: 'select',
            title: '优惠券状态:',
            key: 'status',
            defaultValue: null,
            allowClear: true,
            options: [
              // {value: 'null', name: '全部'},
              {value: '1', name: '待审核'},
              {value: '-1', name: '驳回'},
              {value: '2', name: '未开始'},
              {value: '3', name: '进行中'},
              {value: '4', name: '已结束'},
            ]
        },
        {
            type: 'select',
            title: '优惠券类型:',
            key: 'type',
            defaultValue: null,
            allowClear: true,
            options: [
              // {value: 'null', name: '全部'},
              {value: '1', name: '满减券'},
              {value: '2', name: '折扣券'},
            ]
        },
        {
            type: 'search',
            title: '筛选'
        }
      ],
      listData: [],
      spin: false,
      detailModal: false,
      detailDataList: [],
      shareModal: false,
      columns: [
        {
          title: "优惠券名称",
          align: "center",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "优惠类型",
          dataIndex: "type",
          key: "type",
          align: "center",
          scopedSlots: { customRender: "type" },
        },
        {
          title: "优惠内容",
          dataIndex: "content",
          key: "content",
          align: "center",
          scopedSlots: { customRender: "content" },
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          align: "center",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "已领/剩余",
          dataIndex: "received",
          key: "received",
          align: "center",
          scopedSlots: { customRender: "received" },
        },
        {
          title: "已使用",
          dataIndex: "used",
          key: "used",
          align: "center",
          scopedSlots: { customRender: "used" },
        },
        {
          title: "订单数",
          dataIndex: "orderNum",
          key: "orderNum",
          align: "center",
          scopedSlots: { customRender: "orderNum" },
        },
        {
          title: "订单总金额(元)",
          dataIndex: "orderAmount",
          key: "orderAmount",
          align: "center",
          scopedSlots: { customRender: "orderAmount" },
        },
        {
          title: "优惠总金额(元)",
          dataIndex: "discountsAmount",
          key: "discountsAmount",
          align: "center",
          scopedSlots: { customRender: "discountsAmount" },
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          scopedSlots: { customRender: "action" },
          align: "center",
        }
      ],
      pager: {
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        currentPage: 1,
        pageSize: 10,
        total: 1,
        totalPage: 1
      },
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    addCoupon() {
      console.log('新增')
      this.$router.push({path: '/market/addcoupon', query: {type: 'add'}})
    },
    goToCoupon(data, type) {
      // 查看详情或者是重新提交
      if(type === 'look') {
        this.$router.push({path: '/market/coupondetail', query: {type: type, id: data.id}})  
      } else if (type === 'resubmit') {
        this.$router.push({path: '/market/resubmitcoupon', query: {type: type, id: data.id}}) 
      }
    },
    gotoCodeBank(data) {
      this.$router.push({path: '/market/codebanck', query: {id: data.id}})  
    },
    changeTool(key, value, obj) {
      console.log(key, value, obj);
    },
    onSearch (obj) {
      this.pager.currentPage = 1;
      this.toolValue = JSON.parse(JSON.stringify(obj))
      this.getList()
    },
    getList() {
      let data = {
        currentPage: this.pager.currentPage,
        pageSize: this.pager.pageSize,
        status: this.toolValue.status,
        type: this.toolValue.type,
        searchText: this.toolValue.searchText
      };
      // console.log(data)
      this.spin = true;
      api
        .ajax({
          data,
          method: "listPageSaleCoupon"
        })
        .then(res => {
          const data = res.data.data;
          console.log(data)
          this.listData=data.list
          this.pager = {
            ...this.pager,
            pageSizeOptions: ["10", "20", "30", "40", "50"],
            currentPage: data.currentPage,
            pageSize: data.pageSize,
            total: data.totalRecord,
            totalPage: data.totalPage
          };
          this.spin = false;
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
    startCoupon(data) {
      const that = this
      this.$confirm({
        title: '开始发券',
        content: (
          <div>
            是否确认开始发券？
          </div>
        ),
        onOk() {
          api
            .ajax({
              data: {
                id: data.id
              },
              method: "startSaleCoupon"
            })
            .then(res => {
              that.$message.info(res.data.msg);
              that.getList()
            })
            .catch(error => {
              console.log("error", error);
            });
        },
        onCancel() {},
      });
    },
    stopCoupon(data) {
      const that = this
      this.$confirm({
        title: '停止发券',
        content: (
          <div>
            是否确认停止发券？
            <br/>
            停止发券后不会影响已领优惠券的使用，如果要作废可前往码库对优惠券进行作废
          </div>
        ),
        onOk() {
          api
            .ajax({
              data: {
                id: data.id
              },
              method: "stopSaleCoupon"
            })
            .then(res => {
              that.$message.info(res.data.msg);
              that.getList()
            })
            .catch(error => {
              console.log("error", error);
            });
        },
        onCancel() {},
      });
    },
    deleteCoupon(data) {
      const that = this
      this.$confirm({
        title: '删除',
        content: `是否确认删除 【${data.name}】 优惠券`,
        onOk() {
          api
            .ajax({
              data: {
                id: data.id
              },
              method: "delSaleCoupon"
            })
            .then(res => {
              that.$message.info(res.data.msg);
              that.getList()
            })
            .catch(error => {
              console.log("error", error);
            });
        },
        onCancel() {},
      });
    },
    getShare(data) {
      console.log(data)
      api
        .ajax({
          data: {
            id: data.id
          },
          method: "shareSaleCoupon"
        })
        .then(res => {
          this.shareModal = res.data.data;
          // this.shareModal = {
          //   url: 'www.qftx.com',
          //   qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEIwRjJFQzg5NzFEMTFFOUI1NjRFMTM0NTlDOERDRUIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEIwRjJFQzk5NzFEMTFFOUI1NjRFMTM0NTlDOERDRUIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4QjBGMkVDNjk3MUQxMUU5QjU2NEUxMzQ1OUM4RENFQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4QjBGMkVDNzk3MUQxMUU5QjU2NEUxMzQ1OUM4RENFQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuBwStsAAAGAUExURQIEDpTL/uj0/8uuWCVytI+Pjmq3/fLIUwB0+yNMcCUPA2xucACB/Emm/P/bc6yVTyKi/2RZNnK7/f7xqLXb/icpKv/+ghON/P/0e8nl/v7//yGq/4TD/bu4syKb/yKV/1Wt/Yd1RCc8UQ6K/CqY/aOgm9Lp/aLS/v/4fhuR/CSV/PL5/zAwL9rt/yCT/NnMqdfFkf7Vbv/9nSKF1onG/Tad/EdMWyNZh7jH0iKL5T6i/ObRlOTJXyGz///aav/ic8jLyVdbY47I/f/qcyZ6xCpEX//WYqjV/npoQRIVG6qVXhohNf7bYZqKTiNlnCeX/Cyq/wA/i8+1XcS4lP/oaZ3Q/l+x/X3A/f/veC2j///yeMjW42et5XV3fyKT8z87Mf3jeyUbFCQuNyczQgeH/MGlV6/Y/mFmdyKS/B8fIb7g/u3QfuDw/9PHXOrWbl2f2/DLatnh6AVTo0QtDUOc7CKZ9n6DjyKP7ouIgrWdYiKX+PLWbP/Yby2Z/CUlJSKU/JI3zk4AAAWfSURBVHjalFQLV9pIFJ4gsmGc0IhCJIkBCQIJkq4KstJStvFBoxWsFUJprZsaNXHd3e6zdsvjr+9NwLZn293TfieHhO/eb+5j7gzisy/Kgy9E+cVzHv3Kskln9EVwkiz7HP0ifKG7L2H/QIPk6CugZVDG+RqBM0CD0VdhImjJdgt+bbnls6rNtVTF1lTfBKSmeTZFmwhaMikzRJYJUyZgJYSkWjSRUzYhSourMpwq20qK4WRF9QUaFxWLvNgJiYVrMSSrVJvisyVqnm9Q7TJHsg2alEw6cEE3ovY4ghxqFwu5TigXKLZDdgYEhUSJuuBzVK5KFL6QEDu8cyUyfFX2Bao86lxddzKZTvGq0+Ig9wHVUTMMVR3JCtED1VCHFqu5aCdEWr5A0UpmImCmOuZ1wiwpJFeYF6lGoy02Agmi8iWaswdRii+UQqoyFihRKsBTpkjxxWhUIdfzpCOaphjiojxhqEYg0ElBelDUbUoKF9XbIdMM6fMloskiEw2Yum5mL1RTU+hRIUWbRWKT1jUjT/ZBhhV1QOiqaGstmb4IDBhmMH9NiKaFzIDORAuJRCJbKH8QgLco6mYia2ujFsmIeqmklxhaU5SLbKGY0xOEszPvI3BlXY9SF+AyTxF1xHVK+hjiSBkRrlilQ4V2I3dRqN4KBqVOOwM1lavtga2SbKDUBsBOlLkR1yqWPUGu3XgvII1EuUDoEgnp7YLC2dkSbQOIWqyCYHBNtRtXNKFJIDUWcAOekQuJi3aDF+lslJAsfwU1Jq6yXgSbCRRDesGW9Syf4cb7MKhyHCNCmR2F4zIaZ0bLDKCa0gfKSAMrnRI5WZ+HAON90GSYXphRAj1VFLVl25wP2RtwVZFhZEkLPGxVHX04QElJ+s/D+pFtLHAkQWCTSVZgnU8OrOMALYFNkJyJwEkKbDP9KhZ7FV4fsx/7S8Jm2LOlm5IA9xEIgAq6VrrSbIaHeIcVIEhyAu9eYcPYDTeblbRlNWE5ELDCDg7/CTnBE8TWek2ADx/wUdt0cZP1jVIFlmMH6Bmbxts1PxMnWavt4GCwUgnvAMLhSjBopWsTo1TbxmfsM3QYxpWad1l61b3crljYwh/BCgffTHrh1Jp45xBtY9z0bkuvukoM4+G/AMykF44QxDiIdrB19lLyqqu42Bp+BhCzIkEvpL/PLJxGaWxZm6wjbJ593n0sebUuJKU3loXPvJQqbFJYt/Dwf4DxtpBkm15Kh9tBCfwxjgHvup+4uj4Xs3AQFMHtQ28fkuwbC8dchAwAgtdE5vp/PMrwFJCVwPqjIbFneIjc2YPzqanzg6XZU3BxPf3p7NLe1NHU26VTZMRwTGKd8SwJTWyg2fv5/MJCbyGf70aODmYNY/bgqN4DrtfLx7f2XBTDFWE8fOybIUYH8V6kB4L6aj9S78W7R0fdeLce6a9GurDKQvznUzTE66w3S45QwehOPNJ7fGdv7/z+caQPiHS7/nu1vjv19u3B+Va8voJwWEiCQHoZQ4/ike7UzMzGxsbNt4/7H+Hxu6fAPjxZuh9/56Lhple0EEQrW93e0eXlBnRq/3LuePW9/25+cWPFNdyNk6XX8XMEQ+SNdxidx18f3VxCO43FaTSz9viD/9196JexeGL89fan/CO04423Y5wu1O/vXRoWco1pfhktr+3eJjS3g4aGx97sT9/pvTOMTRjvdQiwenzvDJ1OQ0rLiyg9NwnxIL6MhrGHKz57s/YgvoSCh+jwt9+36v3u033j9CTmDg3D3f92a5LR2glyV5ZPPRY9nNvtvoajg1JPlvKr/fxTYwhd8EfHeNq7FcwAZfgs2oC48dknVfQ8/E2339+6u387d8b+veNbwQ0Ixjy6XNtd7U2Fv0P89/fqkciDuYfGyhjGzNyDyBgLd/djt+ziWj/yw4+L/D8CDABiy4y938qwSQAAAABJRU5ErkJggg==',
          //   name: '超级',
          //   content: '满200减20优惠券',
          //   validTime: '2019-12-09至2019-12-10',
          // };
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    share() {
      this.downloadIamge(this.shareModal.qrCode, this.shareModal.name)
    },
    shareCancel() {
      this.shareModal = false;
    },
    downloadIamge(imgsrc, name) {//下载图片地址和图片名
      var image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
      
        var a = document.createElement("a"); // 生成一个a元素
        var event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "二维码"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    },
    copy(value) {
      console.log(value, this.shareModal);
      var oInput = document.getElementById("copy");
      oInput.select();
      document.execCommand("Copy");
      this.$message.success('复制成功');
    }
  }
};
</script>
<style lang="less" scoped>
.client-list {
  .toolbar{
    display: flex;
    align-items: center;
    margin-top: 15px;
    flex-wrap: wrap;
  }
  .page_table {
    margin-top: 15px;
    background-color: #fff;
    .ant-table-thead {
      tr {
        th {
          background-color: #fff;
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
      background-color: #f7f8fa;
    }
    .ant-table-body {
      table {
        border: 1px solid #e8e8e8;
        td {
          border-bottom: none;
        }
      }
    }
    .table-img {
      width: 58px;
      height: 58px;
      border-radius: 50%;
    }
  }

  // 分页
  .page_pagination {
    text-align: right;
    margin-top: 15px;
    padding-bottom: 20px;
    .ant-select-dropdown-menu {
      text-align: center;
    }
  }

}
</style>
