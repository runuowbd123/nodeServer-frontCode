<template>
  <div class="">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" @submit="handleSubmit">
        <a-form-item label="模板名称">
          <a-input
            style="width:170px;"
            v-decorator="[
             'name',
            {
              initialValue:name,
              rules: [{ required: true, message: '请输入模板名称' }]
            }]"
          />
        </a-form-item>
        <a-form-item label="计算方式">
          <a-radio defaultChecked :disabled="true">按计件</a-radio>
        </a-form-item>
        <a-form-item label="配送区域">
          <p>除指定地区外，其余地区的与非采用“默认运费”</p>
         <div class="defaultTeplate">
            <a-form-item v-show="false">
             <a-input-number
                  class="numInput"
                  v-decorator="[
                    `details[0].type`,
                    {
                      initialValue:0,
                    }
                  ]"
                  placeholder="请输入" hidden>
              </a-input-number>
            </a-form-item>
              <a-form-item v-show="false">
                <a-input-number v-if="templateDefault.id"
                  class="numInput"
                  v-decorator="[
                    `details[0].id`,
                    {
                      initialValue:templateDefault.id,
                    }
                  ]"
                  placeholder="请输入" hidden>
              </a-input-number>
              </a-form-item>
          <a-row :gutter="8">
            <a-col  :span="3">默认运费</a-col>
            <a-col :span="5">
               <a-form-item>
                <a-input-number
                    class="numInput"
                    :min="1"
                    v-decorator="[
                      `details[0].initialNum`,
                      {
                        initialValue:templateDefault.initialNum,
                        rules: [{ required: true, message: '请输入' }]
                      }
                    ]"
                    placeholder="请输入">
                  </a-input-number> 件内
                  </a-form-item>
            </a-col>
             <a-col :span="4">
                <a-form-item>
                  <a-input-number
                    class="numInput"
                    :precision="2"
                    :min="0"
                    v-decorator="[
                      `details[0].initialMoney`,
                      {
                        initialValue:templateDefault.initialMoney,
                        rules: [{ required: true, message: '请输入' }]
                      }
                    ]"
                    placeholder="请输入">

                  </a-input-number> 元
                </a-form-item>
            </a-col>
             <a-col :span="6">
               <a-form-item>
              增加 <a-input-number
                  class="numInput"
                  :min="1"
                  v-decorator="[
                    `details[0].nextNum`,
                    {
                      initialValue:templateDefault.nextNum,
                      rules: [{ required: true, message: '请输入' }]
                    }
                  ]"
                  placeholder="请输入">

                </a-input-number> 件
                </a-form-item>
            </a-col>
             <a-col :span="6">
               <a-form-item >
               增加运费 <a-input-number
                  class="numInput"
                  :precision="2"
                  :min="0"
                  v-decorator="[
                    `details[0].nextMoney`,
                    {
                      initialValue:templateDefault.nextMoney,
                      rules: [{ required: true, message: '请输入' }]
                    }
                  ]"
                  placeholder="请输入">

                </a-input-number> 元
                </a-form-item>
            </a-col>
          </a-row>
          </div>
        </a-form-item>
        <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
            <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'" :columns="columns" :dataSource="templateData"  class="templateTable" :rowKey="record => record.id" >
                <div  slot="areas"  slot-scope="text, record, index">
                  <a-form-item>
                     <!-- :defaultValue = record.areasId -->
                  <a-tree-select
                      style="width:250px;"
                      :treeData="treeAreasData"
                      v-model="areasArry[index]"
                      treeCheckable
                      :showCheckedStrategy="SHOW_PARENT"
                      placeholder="选择可配送地区"
                    />
                    <a-form-item v-show="false">
                      <a-input
                        v-decorator="[
                          `details[${index+1}].type`,
                          {
                            initialValue:1
                          }
                        ]"
                        type="text" hidden />
                      </a-form-item>
                      <a-form-item v-show="false">
                      <a-input v-if="record.id"
                        v-decorator="[
                          `details[${index+1}].id`,
                          {
                            initialValue:record.id || null
                          }
                        ]"
                        type="text" hidden />
                      </a-form-item>

                    <span v-for="(item,idx) in  record.areas" :key="idx">
                        <!-- {{item.name}} -->
                        <a-form-item v-show="false">
                        <a-input
                        v-decorator="[
                          `details[${index+1}].areas[${idx}].id`,
                          {
                            initialValue:item.id
                          }
                        ]"
                        type="text" hidden />
                      </a-form-item>
                        <!-- <a-input
                        v-decorator="[
                          `details[${index+1}].areas[${idx}].name`,
                          {
                            initialValue:item.name
                          }
                        ]"
                        type="text" hidden /> -->

                    </span>
                  </a-form-item>
                </div>
                <div slot="initialNum" slot-scope="text, record, index">
                  <a-form-item>
                  <a-input-number
                    class="numInput"
                    v-decorator="[
                    `details[${index+1}].initialNum`,
                    {
                      initialValue:record.initialNum,
                      rules: [{ required: true, message: '请输入' }]
                    }
                  ]"></a-input-number>
                    </a-form-item>
                </div>
                <div slot="initialMoney" slot-scope="text, record, index">
                    <a-form-item>
                  <a-input-number
                  class="numInput"
                  :precision="2"
                  :min="0"
                    v-decorator="[
                    `details[${index+1}].initialMoney`,
                    {
                      initialValue:record.initialMoney,
                      rules: [{ required: true, message: '请输入' }]
                    }
                  ]"></a-input-number>
                    </a-form-item>
                </div>
                <div slot="nextNum" slot-scope="text, record, index">
                    <a-form-item>
                  <a-input-number
                    class="numInput"
                    v-decorator="[
                    `details[${index+1}].nextNum`,
                    {
                      initialValue:record.nextNum,
                      rules: [{ required: true, message: '请输入' }]
                    }
                  ]"></a-input-number>
                    </a-form-item>
                </div>
                <div slot="nextMoney" slot-scope="text, record, index">
                    <a-form-item>
                  <a-input-number
                  class="numInput"
                  :precision="2"
                  :min="0"
                    v-decorator="[
                    `details[${index+1}].nextMoney`,
                    {
                      initialValue:record.nextMoney,
                      rules: [{ required: true, message: '请输入' }]
                    }
                  ]"></a-input-number>
                    </a-form-item>
                </div>
                <div slot="handle" slot-scope="text, record, index">
                    <span style="color:blue;margin-bottom:24px;" @click="deleteTemplate(index)">删除</span>
                </div>
            </a-table>
            <a-button @click="addTableRow" style="margin-top:10px" type="primary">+为指定地区城市设置运费</a-button>
        </a-form-item>
        <!-- <a-button style="margin-left:230px;" type="primary">为指定地区城市设置运费</a-button> -->
        <!-- <a-tree-select
        style="width:150px;"
        :treeData="treeAreasData"
        v-model="areasArry"
        treeCheckable
         :showCheckedStrategy="SHOW_PARENT"
        placeholder="选择可配送地区"/> -->
         <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
           <a-row>
             <a-col :span="8"></a-col>
             <a-col :span="4"><a-button @click="back">返回</a-button></a-col>
             <a-col :span="8"><a-button type="primary" @click="handleSubmit"> 保存</a-button></a-col>
           </a-row>
        </a-form-item>
      </a-form>
  </div>
</template>
<script>
import { TreeSelect } from 'ant-design-vue';
// const SHOW_PARENT = TreeSelect.SHOW_PARENT;
import api from "@/api/user";
export default {
  name:'createTemplate',
  props:{},
  data() {
    return {
      form: this.$form.createForm(this, { name: "create" }),
      details:{},
      name:'',
      SHOW_PARENT:TreeSelect.SHOW_PARENT,
      templateDefault:{},
      formTailLayout : {
        labelCol: { span: 8 },
        wrapperCol: { span: 16, offset: 5 },
      },
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
      templateId:'',
      treeAreasData:[

      ],
      areasArry:[]
    };
  },
  created() {
    this.templateId = this.$route.query.id;
    if(this.templateId){
      this.getTemplateDetail()
    }
    this.getAreas();

  },
  methods: {
    handleSubmit(values){
      this.form.validateFields((err, values) => {
        console.log('==========',values)
        let option = values
        let areasArry =  this.areasArry
        areasArry.map((item,index)=>{
            if(item.length == 0){
              return  this.$message.warning('请选择配送区域！')
            }
            option.details[index+1].areas = []
            item.map((it,idx)=>{
              option.details[index+1].areas.push({id:it })
            })
        })
        console.log(this.areasArry,'33333333333')
        if(!err){
          let  data = option
          if(this.templateId){ // 新建就不需要传这个id
            data.id = this.templateId
          }
           api
          .ajax({
            data: data,
            method: "saveFreightTemplate"
          })
          .then(res => {
            this.$message.info('保存成功！')
            this.$router.go(-1)
          })
          .catch(error => {
            console.log("error", error);
          });
        }
      })
    },
    getTemplateDetail(){
      api
      .ajax({
        data: {id:this.templateId},
        method: "infoFreightTemplate"
      })
      .then(res => {
        let data = res.data.data.details
        this.templateData = res.data.data.details
        this.name = res.data.data.name
        data.map((item,index)=>{
            if(item.type == 0){
              this.templateDefault = item
              this.templateDefault.areas = []
              this.templateData.splice(index,1)
            }
            item.areasId = []
            if(item.areas.length>0){
                (item.areas).map((it,idx)=>{
                  item.areasId.push(it.id)

                })
            }
            if(item.areasId.length){
              this.areasArry[index] = item.areasId
            }
        })
        console.log( this.areasArry)
        console.log('编辑的详情',this.templateData)
      })
      .catch(error => {
        console.log("error", error);
      });
    },
    deleteTemplate(index){
      let that = this
      this.$confirm({
        title: '提示',
        content: '你确定要删除该配送区域',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          that.templateData.splice(index,1)
          that.areasArry.splice(index,1)
        }
      });
    },
    getAreas(){
      api
      .ajax({
        data: {},
        method: "treeSysCity"
      })
      .then(res => {
        console.log(res.data.data,'111111111111111')
        let data = res.data.data
        let newData = this.treeChangeData(data)
        this.treeAreasData = newData
        console.log(newData,'222222222222222')
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
    addTableRow(){
      this.templateData.push({
        areas:[],
        initialNum :'1',
        type:1,
        initialMoney:'0',
        nextNum:'1',
        nextMoney:'0',
        // id:this.templateData.length
      })
      this.areasArry[this.templateData.length-1] = []
    },
    back(){
      this.$router.go(-1)
    }
  }
};
</script>
<style lang="less">
   .defaultTeplate{
     padding-top:20px;
     background:#f5f5f5;
     padding-left:10px;
     margin-bottom:-20px;
    .numInput{
       width:70px;
     }
     .ant-form-item-control-wrapper{
       width:100%;
     }
   }
   .templateTable{
     background:#fff;
     .ant-form-item{
      //  margin-bottom:0;
     }
     .ant-col-14{
      width:auto;
     }
     .ant-form-item-control{
       line-height:normal
     }
     .numInput{
       width:70px;
      }
   }
</style>
