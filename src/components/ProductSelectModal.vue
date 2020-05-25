<template>

  <a-modal :maskClosable='false' width="780px" :title="title" v-if="modalShow" :visible="modalShow" @ok="handleOk" @cancel="handleCancel" wrapClassName="product-select">
      <a-spin tip="加载中..." :spinning="spin">  
        <div class="product-block">
          <div style="font-size:12px;display: flex; padding: 0 10px; align-items: center;justify-content: space-between;height: 40px">
            <!-- <a-checkbox @change="leftCheck">
              {{leftSelectList.length}}/{{filterLeftList.length}}  项
            </a-checkbox> -->
            <div>
              <!-- {{leftSelectList.length}}/{{filterLeftList.length}}  项 -->
              {{leftSelectList.length}}/{{(filterLeftList.filter((item) => {return (item.goodsName || '').indexOf(leftSearchText) > -1})).length}}  项
            </div>
            <a href="javascript:;" @click="leftCheck">
              全选
            </a>
          </div>
          <a-input
            placeholder="搜索商品名称"
            class="product-search"
            @change="searchChangeLeft"
            :value="leftSearchText"
          />
          <div class="product-list">
            <a-checkbox-group v-model="leftSelectList" @change="onChangLeft" v-if="leftNoDataNotShow">
              <a-checkbox
                v-for="(item) in filterLeftList"
                :value="item.goodsId"
                :key="item.goodsId"
                v-show="(item.goodsName || '').indexOf(leftSearchText) > -1"
              >
                <div class="product-item">
                  <div class="pic">
                    <img :src="item.mainPic" alt="商品图片" class="pic">
                  </div>
                  <div>
                    <Tooltip :str="item.goodsName" :max="5"/>
                    <div style="display: flex; margin-top:5px; width: 140px">
                      <div style="width: 50%">
                        ￥ {{item.price}}
                      </div>
                      <span>
                        库存 {{item.stock}}
                      </span>
                    </div>
                  </div>
                </div>
              </a-checkbox>
            </a-checkbox-group>
            <div v-else style="line-height: 330px; text-align: center;color: #ccc">
              暂无数据
            </div>
          </div>
        </div>
      </a-spin>
      <div class="button-block">
        <a-button type="primary" @click="addProduct">
          添加 >
        </a-button>
        <a-button style="margin-top:20px"  @click="removeProduct">
          {{'&#60;'}} 移除
        </a-button>
      </div>
      <a-spin tip="加载中..." :spinning="spin">
        <div class="product-block">
          <div style="font-size:12px;display: flex; padding: 0 10px; align-items: center;justify-content: space-between;height: 40px">
              <div>
                {{rightSelectList.length}}/{{(rightList.filter((item) => {return (findProductObj(item).goodsName || '').indexOf(rightSearchText) > -1 })).length}}  项
              </div>
              <a href="javascript:;" @click="rightCheck">
                全选
              </a>
            </div>
            <a-input
              placeholder="搜索商品名称"
              class="product-search"
              @change="searchChangeRight"
              :value="rightSearchText"
            />
          <div class="product-list">
            <a-checkbox-group v-model="rightSelectList" @change="onChangRight" v-if="rightNoDataNotShow">
              <a-checkbox
                v-for="(item) in rightList"
                :value="item"
                :key="item"
                v-show="(findProductObj(item).goodsName || '').indexOf(rightSearchText) > -1"
              >
                <div class="product-item">
                  <img :src="findProductObj(item).mainPic" alt="商品图片" class="pic">
                  <div>
                    <Tooltip :str="findProductObj(item).goodsName" :max="5"/>
                    <div style="display: flex; margin-top:5px; width: 140px">
                      <div style="width: 50%">
                        ￥ {{findProductObj(item).price}}
                      </div>
                      <span>
                        库存 {{findProductObj(item).stock}}
                      </span>
                    </div>
                  </div>
                </div>
              </a-checkbox>
            </a-checkbox-group>
            <div v-else style="line-height: 330px; text-align: center;color: #ccc">
              暂无数据
            </div>
          </div>
        </div>
      </a-spin>
  </a-modal>
</template>

<script>
import Tooltip from '@/components/Tooltip'
import api from "@/api/user";
export default {
  name: "",
  components: {Tooltip},
  props: { // handleTagOk弹窗点击确定函数  handleTagCancel弹窗点击取消函数
    modalShow: { // 弹窗显示隐藏
      type: Boolean,
      default: false
    },
    title: { // 弹窗title
      type: String,
      default: '选择商品'
    },
    getProductListUrl: { // 如需在内部请求获取全部商品列表可传该参数
      type: String,
      default: '',
      required:false
    },
    productsList: { // 全部商品列表，该列表中的每个元素是对象
      type: Array,
      default: function () {
          return []
      }
    },
    rightKeyList: { // 右边已经存在的商品keys列表, 该列表中的每个元素是商品的id
      type: Array,
      default: []
    },
  },
  data() {
    return {
      spin: false,
      rightList: this.rightKeyList,
      productList: this.productsList,
      leftSearchText: '',
      rightSearchText: '',
      leftSelectList: [],
      rightSelectList: []
    };
  },
  mounted() {
    console.log(this)
    if (this.getProductListUrl) {
      console.log('去请求');
      this.getProductList(this.getProductListUrl)
    }
  },
  computed: {
    filterLeftList(){
      const filterList = this.productList.filter((item) => {
        const canfind = this.rightList.find((it) => {
          return it === item.goodsId
        });
        if (!!canfind) {
          return false
        } else {
          return true
        }
      })
      return filterList;
    },
    leftNoDataNotShow(){
      const filterList = this.productList.filter((item) => {
        const canfind = this.rightList.find((it) => {
          return it == item.goodsId
        });
        if (!!canfind) {
          return false
        } else {
          return true
        }
      }) 
      const filterList2 = (filterList || []).filter((item) => {
        return (item.goodsName || '').indexOf(this.leftSearchText) > -1
      })
      return filterList2.length > 0
    },
    rightNoDataNotShow() {
      const filterList = this.rightList.filter((item) => {
        return (this.findProductObj(item).goodsName || '').indexOf(this.rightSearchText) > -1
      })
      return filterList.length > 0
    }
  },
  methods: {
    getProductList(url) {
      this.spin= true;
      api
        .ajax({
          method: url,
          data: {
            type: 0
          }
        })
        .then(res => {
          console.log(res);
          const data = res.data.data
          this.productList = data;
          this.spin= false;
        })
        .catch(() => {
          console.log("error");
        });
    },
    findProductObj(id){
      const obj = this.productList.find((it) => {return it.goodsId == id}) || {}
      return obj
    },
    onChangLeft(checkedValues) {
      console.log(checkedValues, '---左边选中的商品', this.leftSelectList)
      this.leftSelectList = checkedValues
    },
    onChangRight(checkedValues) {
      console.log(checkedValues)
      this.rightSelectList = checkedValues
    },
    searchChangeLeft(e) {
      console.log(e.target.value)
      this.leftSearchText = e.target.value
    },
    searchChangeRight(e) {
      console.log(e.target.value)
      this.rightSearchText = e.target.value
    },
    addProduct() {
      const addList = this.leftSelectList;
      this.rightList = this.rightList.concat(addList);
      this.leftSelectList = []
    },
    removeProduct() {
      const removeList = this.rightSelectList;
      this.rightList = this.rightList.filter((item) => {
        let flag = true;
        removeList.forEach((it) => {
          if(it === item) {
            flag = false
          }
        })
        return flag
      })
      this.rightSelectList = [];
    },
    leftCheck(e) {
      // console.log(e.target.checked);
      // this.leftSelectList = this.filterLeftList.map((item) => item.goodsId);
      const nowlist = (this.filterLeftList.filter((item) => {return (item.goodsName || '').indexOf(this.leftSearchText) > -1})).map((item) => {return item.goodsId})
      this.leftSelectList = this.uniq(nowlist.concat(this.leftSelectList))
    },
    rightCheck(e) {
      // console.log(e.target.checked)
      // this.rightSelectList = this.rightList;
      const nowlist = this.rightList.filter((item) => {return (this.findProductObj(item).goodsName || '').indexOf(this.rightSearchText) > -1 });
      this.rightSelectList = this.uniq(nowlist.concat(this.rightSelectList))
    },
    handleOk() {
      const rightListObj = this.rightList.map((item) => {
        return this.findProductObj(item)
      })
      this.$emit('handleOk', this.rightList, rightListObj);
    },
    handleCancel() {
      this.$emit('handleCancel');
    },
    uniq(array){
      let temp = []; //一个新的临时数组
      for(let i = 0; i < array.length; i++){
          if(temp.indexOf(array[i]) == -1){
              temp.push(array[i]);
          }
      }
      return temp;
    }
  },
  watch: {
    // productList: {
    //   handler() {
    //     const filterList = this.productList.filter((item) => {
    //       const canfind = this.rightList.find((it) => {
    //         return it === item.goodsId
    //       });
    //       if (!!canfind) {
    //         return false
    //       } else {
    //         return true
    //       }
    //     })
    //     this.filterLeftList = filterList;
    //   },
    //   deep: true
    // },
    // rightList: {
    //   handler() {
    //     const filterList = this.productList.filter((item) => {
    //       const canfind = this.rightList.find((it) => {
    //         return it === item.goodsId
    //       });
    //       if (!!canfind) {
    //         return false
    //       } else {
    //         return true
    //       }
    //     })
    //     this.filterLeftList = filterList;
    //   },
    //   deep: true
    // }
  }
};
</script>
<style lang="less">
.product-select{
  .ant-modal-body{
    display: flex !important;
    justify-content: space-around;
  }
  .product-block{
    width: 260px;
    height: 420px;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    .product-search{
      width: 260px;
      margin: -1px 0 10px -1px;
      display: block;
      border-radius: 0px;
      flex: none;
    }
    .product-list{
      flex: 1;
      overflow: auto;
      .ant-checkbox-wrapper{
        display: flex;
        align-items: center;
        margin: 0 0 10px 5px;
        .product-item{
          background: rgb(242,242,242);
          width: 200px;
          height: 60px;
          padding: 10px;
          display: flex;
          font-size: 12px;
          .pic{
            display: block;
            height: 40px;
            width: 40px;
            margin-right: 5px;
          }
        }
      }
    }
  }
  .button-block{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
