<template>
  <div class="goods-goodsManage">
    <div class="top-box">
      <!-- <div class="left-box">
        <a-button v-if="!isSpread" @click="spreadAll">展开全部</a-button>
        <a-button v-else @click="closeAll">收起全部</a-button>
      </div>
      <div class="right-box">
        <a-input-search placeholder="搜索" style="width: 150px" @search="onSearch" />
        <a-button type="primary" @click="addGroup">新增分组</a-button>
      </div> -->
      <div class="left-box">
        <a-button @click="addNewTemplate" type="primary" v-if="$permission.hasPermission('ORDER_FREIGHT_EDIT')">新建运费模板</a-button>
      </div>
    </div>
    <div class="content-wrapper">
      <a-collapse v-model="activeKey" :bordered="false" @change="changeActivekey" accordion>
        <a-collapse-panel v-for="(item,index) in collapseArr" :key="item.id+','+index" >
          <template v-slot:header>
            <div class="collapse-header">
              <div class="left-info">{{item.name}}</div>
              <div class="right-info" v-if="$permission.hasPermission('ORDER_FREIGHT_EDIT')">
                <span class="handle-btn" @click="editFun($event,item)" >
                   <router-link class="blue" :to="'/order/modifyFreightTemplate?id=' + item.id">修改</router-link>
                  </span>
                <span class="handle-btn" @click="deleteFun($event,item.id)">删除</span>
              </div>
            </div>
          </template>
          <a-table  style="margin:0 -16px;background:#fff;" :bordered="true"   :pagination="false"  :loading="loading" :columns="columns" :dataSource="item.data" :rowKey="record => record.id" >
          </a-table>
        </a-collapse-panel>
      </a-collapse>
      <div class="page_pagination">
       <a-pagination v-model="current" :total="pagination.totalRecord" :pageSize="pagination.pageSize" @change="changePage" />
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/user";
import moment from "moment";
import TableSearchForm from "../../components/TableSearchForm";
export default {
  data() {
    return {
      current:1,
      isSpread: true,
      activeKey: [],
      columns: [
        {
          title: '可配送区域',
          width: '52%',
          dataIndex: "areas",
          key: "1",
          customRender:(value,row,index)=>{
            let str = []
            row.areas.map(it=>{
              str.push(it.name)
            })
            if(row.type == 0){
              return '中国'
            }
            return str.join(',')
          }
        },{
          title: '首件（个）',
          width: '12%',
          dataIndex: "initialNum",
          key: "2",
        },{
          title: '运费（元）',
          width: '12%',
          dataIndex: "initialMoney",
          key: "3",
        },{
          title: '续件（个）',
          width: '12%',
          dataIndex: "nextNum",
          key: "4",
        },{
          title: '续费（元）',
          width: '12%',
          dataIndex: "nextMoney",
          key: "5",
        },
      ],
      collapseArr: [],
      addText: '',
      isAddOrEdit: false,
      confirmLoading: false,
      loading:false,
      pagination:{
        pageSize:20
      }
    };
  },
  created() {
    this.getTemplate();
  },
  methods: {
    changePane(key){
      console.log(key)
    },
    getTemplate(){
      api
        .ajax({
          data:this.pagination,
          method: "listPageFreightTemplate"
        })
        .then(res => {
          let data = res.data.data
          this.collapseArr = data.list
          this.collapseArr.map((item)=>{
            item.data = []
          })
          this.activeKey[0] =  this.collapseArr[0].id+','+'0'
          console.log('运费模板',res.data.data, this.activeKey)
          let {currentPage,totalPage,pageSize,totalRecord } = data
          this.pagination = {currentPage,totalPage,pageSize,totalRecord,...this.pagination}
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    addNewTemplate() {
      this.isAddOrEdit = true;
      this.addText = '新增分组';
      this.$router.push({
        path: '/order/createFreightTemplate',
        query: {
          type: '0'
        }
      })
    },
    changeActivekey(key) {
      let arr = []
      if(key){
        arr = key.split(',')
        this.getTemplateDetail(arr)
      }
    },
    getTemplateDetail(arr){
      this.loading = true
      api
      .ajax({
        data: {id:arr[0]},
        method: "infoFreightTemplate"
      })
      .then(res => {
        this.collapseArr[arr[1]].data = res.data.data.details
        this.$forceUpdate()
        console.log(res.data.data.details,'===========')
        this.loading = false
      })
      .catch(error => {
        console.log("error", error);
      });
    },
    editFun(e,obj) {
      e.stopPropagation();
      this.isAddOrEdit = true;
      this.addText = '编辑分组';
    },
    deleteFun(e,id) {
      e.stopPropagation();
      let that = this
      this.$confirm({
        title: '删除',
        content: '是否确认删除运费模板？',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          api
          .ajax({
              data: {id:id},
              method: "delFreightTemplate"
            })
            .then(res => {
              that.$message.info('删除成功!')
              that.getTemplate();
              that.$forceUpdate()
            })
            .catch(error => {
              console.log("error", error);
            });
        },
      });
    },
    // 切换页码
    changePage(page,pageSize){
      console.log(page)
      this.getTemplate()
    }
  }
};
</script>
<style lang="less" scoped>
.ant-collapse-header {
  background: #f7f8fa;
}
.ant-collapse-content {
  max-height: 270px;
  overflow: auto;
}
.ant-transfer-list-content-item {
  display: flex;
  align-items: center;
}
.group-name {
  width: 100%;
  height: 34px;
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
  line-height: 34px;
  // text-align: right;
  .error {
    font-size: 12px;
    line-height: 20px;
  }
}
.group-product {
  width: 100%;
  display: flex;
  align-items: flex-start;
}
.red {
  color: #e83030;
}
.hidden {
  color: transparent;
}
.custom-item {
  height: 40px;
  display: flex;
  justify-content: space-between;
  // flex-direction: column;
}
.right-pro-info {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .pro-top {
    font-size: 14px;
  }
  .pro-bottom {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    .pro-remain {
      margin-left: 40px;
    }
  }
}
.is-visible {
  height: auto !important;
}
.goods-goodsManage {
  padding-bottom:50px;
  .top-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
    .right-box {
      width: 250px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .content-wrapper {
    .collapse-header {
      height: 30px;
      // background: #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 20px;
      .right-info {
        width: 100px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .handle-btn {
          color: blue;
          user-select: none;
        }
      }
    }
    .scroll-item {
      height: 54px;
      line-height: 54px;
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
}
.left-box{
    width:100%;
    text-align: right;
    button{}
}
</style>
