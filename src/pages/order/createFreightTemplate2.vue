<template>
  <div class="createdTemplateStyle">
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" ref="createdTemplate"  >
      <a-form-model-item label="模板名称" prop="name" :rules="templateRules">
        <a-input v-model="form.name" placeholder="请输入"/>
      </a-form-model-item>
      <a-form-model-item v-show="false">
        <a-input v-model="form.id" placeholder="请输入" v-if="form.id!==''"/>
      </a-form-model-item>
      <a-form-model-item label="计算方式">
        <a-radio defaultChecked :disabled="true">按计件</a-radio>
      </a-form-model-item>
      <a-form-model-item label="配送区域">
        <p>除指定地区外，其余地区的与非采用“默认运费”</p>
        <div class="defaultTemplate">
          默认运费
          <a-form-model-item prop="defaultTeplate.initialNum" :rules="templateRules">
            <a-input v-model="form.defaultTeplate.initialNum" placeholder ="请输入" />  件内
          </a-form-model-item>
          <a-form-model-item prop="defaultTeplate.initialMoney" :rules="templateRules">
            <a-input v-model="form.defaultTeplate.initialMoney" placeholder ="请输入" /> 元
          </a-form-model-item>
          <a-form-model-item prop="defaultTeplate.nextNum" :rules="templateRules">
            增加 <a-input v-model="form.defaultTeplate.nextNum" placeholder ="请输入" /> 件
          </a-form-model-item>
          <a-form-model-item prop="defaultTeplate.nextMoney" :rules="templateRules">
            增加运费  <a-input v-model="form.defaultTeplate.nextMoney" placeholder ="请输入" />元
          </a-form-model-item>
          <a-form-model-item v-show="false" v-if="form.defaultTeplate.type">
            <a-input-number v-model="form.defaultTeplate.type" />
          </a-form-model-item>
        </div>
        <div>
          <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'" :columns="columns"  :dataSource="form.details" :rowKey="record => record.id" class="tableStyle">
              <div  slot="areas"  slot-scope="text, record, index">
                <a-form-model-item>
                  <a-tree-select
                    style="width:200px;"
                    :treeData="treeAreasData"
                    v-model="form.details[index].areas"
                    treeCheckable
                    :showCheckedStrategy="SHOW_PARENT"
                    placeholder="选择可配送地区" />
                  </a-form-model-item>
                  <a-form-model-item v-if="record.id" v-show="false">
                    <a-input-number v-model="form.details[index].id" />
                  </a-form-model-item>
                  <a-form-model-item v-if="record.type" v-show="false">
                    <a-input-number v-model="form.details[index].type" />
                  </a-form-model-item>
              </div>
              <div slot="initialNum" slot-scope="text, record, index">
                <a-form-model-item  :prop="'details.'+index+'.initialNum'" :rules="templateRules">
                  <a-input-number v-model="form.details[index].initialNum" placeholder ="请输入" />
                </a-form-model-item>
              </div>
              <div slot="initialMoney" slot-scope="text, record, index">
                <a-form-model-item  :prop="'details.'+index+'.initialMoney'" :rules="templateRules">
                  <a-input-number
                    :precision="2"
                    :min="0"
                    v-model="form.details[index].initialMoney"

                    placeholder ="请输入"
                  />
                </a-form-model-item>
              </div>
              <div slot="nextNum" slot-scope="text, record, index">
                <a-form-model-item :prop="'details.'+index+'.nextNum'" :rules="templateRules">
                  <a-input-number v-model="form.details[index].nextNum" placeholder ="请输入" />
                </a-form-model-item>
              </div>
              <div slot="nextMoney" slot-scope="text, record, index">
                <a-form-model-item>
                  <a-input-number
                    :precision="2"
                    :min="0"
                    v-model="form.details[index].nextMoney"
                    placeholder ="请输入"
                    />
                </a-form-model-item>
              </div>
              <div slot="handle" slot-scope="text, record, index" class="delete">
                <span style="color:#3e7bf8;margin-bottom:24px;" @click="deleteTemplate(index)">删除</span>
              </div>
          </a-table>
        </div>
        <a-form-model-item>
          <a-button @click="addTableRow" style="margin-top:10px" type="primary">+为指定地区城市设置运费</a-button>
        </a-form-model-item>
      </a-form-model-item>
      <a-form-model-item>
        <div class="buttonTemp">
          <a-button @click="back">返回</a-button>
          <a-button type="primary" @click="handleSubmit"> 保存</a-button>
        </div>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
import api from "@/api/user";
import { TreeSelect} from 'ant-design-vue';
export default {
    name: "create2",
    components: {},
    props:{},
    data() {
      return {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
        treeAreasData:[],
        SHOW_PARENT:TreeSelect.SHOW_PARENT,
        form:{
          name:'',
          id:'',
          defaultTeplate:{
            initialNum:'',
            initialMoney:'',
            nextNum:'',
            nextMoney:'',
            type:0
          },
          details:[{
            areas:[],
            initialNum:'',
            initialMoney:'',
            nextNum:'',
            nextMoney:'',
            id:0,
            type:1
          }]
        },
        rules:{
          name:[ { required: true, message: '请输入', trigger: 'blur' }],
          initialNum:{required: true, message: '请输入', trigger: 'blur' },
          initialMoney:{required: true, message: '请输入', trigger: 'blur' }
        },
        templateRules:{required: true, message: '请输入', trigger: 'blur' },
        templateData:[],
        columns: [
          {
            title: '可配送区域',
            width: '30%',
            dataIndex: "areas",
            key: "1",
            scopedSlots: { customRender: "areas" },
          },{
            title: '首件（个）',
            width: '15%',
            dataIndex: "initialNum",
            key: "2",
            scopedSlots: { customRender: "initialNum" }

          },{
            title: '运费（元）',
            width: '15%',
            dataIndex: "initialMoney",
            key: "3",
            scopedSlots: { customRender: "initialMoney" }
          },{
            title: '续件（个）',
            width: '15%',
            dataIndex: "nextNum",
            key: "4",
            scopedSlots: { customRender: "nextNum" }
          },{
            title: '续费（元）',
            width: '15%',
            dataIndex: "nextMoney",
            key: "5",
            scopedSlots: { customRender: "nextMoney" }
          },{
            title: '操作',
            width: '15%',
            dataIndex: "handle",
            key: "6",
            scopedSlots: { customRender: "handle" }
          },
      ],
      }
    },
    created(){
       this.templateId = this.$route.query.id;
       this.form.id = this.$route.query.id;
       console.log('订单id',this.form.id)
        if(this.form.id){
          this.getTemplateDetail()
          console.log(2)
        }
       this.getAreas()
    },
    mounted(){},
    methods: {
      getAreas(){
        api
        .ajax({
          data: {},
          method: "treeSysCity"
        })
        .then(res => {
          let data = res.data.data
          let newData = this.treeChangeData(data)
          this.treeAreasData = newData
        })
        .catch(error => {
          console.log("error", error);
        });
      },

      treeChangeData(array){
        array.map((item, index) => {
        item['value'] = item.id;
        item['key'] = item.id;
        item['title'] = item.name;
        // delete item['id'];
        delete item['name'];
        if(item.children.length>0){
          this.treeChangeData(item.children);
        }
      })
      return array;
      },
       getTemplateDetail(){
        console.log(3)
          api
          .ajax({
            data: {id:this.form.id},
            method: "infoFreightTemplate"
          })
          .then(res => {
            console.log(res,'===================')
            let data = res.data.data.details
            this.templateData = res.data.data.details
            this.form.name = res.data.data.name
            this.form.id = res.data.data.id

            console.log('订单详情',res.data.data)

            data.map((item,index)=>{
              this.form.details[index] = {
                initialMoney:item.initialMoney,
                initialNum:item.initialNum,
                nextMoney:item.nextMoney,
                nextNum:item.nextNum,
                type:item.type,
                id:item.id
              }
              if(item.areas.length>0){
                item.areas.map((itm,idx)=>{
                  this.form.details[index].areas.push(itm.id)
                })
              }
            })
          })
          .catch(error => {
            console.log("error", error);
          });
      },
      addTableRow(){
      this.form.details.push({
        areas:[],
        initialNum :'1',
        type:1,
        initialMoney:'0',
        nextNum:'1',
        nextMoney:'0',
        // id:0
        id:this.form.details.length
      })
        // this.areasArry[this.templateData.length-1] = []
      },
      deleteTemplate(){},
      handleSubmit(){
        this.$refs.createdTemplate.validate((valid) => {
          if(valid){
            console.log(this.form)
          }
        })
      },
      back(){
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="less" scoped>
  .createdTemplateStyle{
      input{
        width:130px;
      }
      p{
        margin-bottom:10px;
      }
      .defaultTemplate{
        margin-left:-73px;
        display:flex;
        justify-content: space-between;
        input{
          width:100px;
        }
      }
  }
  .buttonTemp{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tableStyle{
    background:#fff;
  }
  .delete{
    margin-top:-21px;
  }
</style>
<style lang="less">
  .tableStyle .ant-form-item{
    // margin-bottom:0;
  }
</style>
