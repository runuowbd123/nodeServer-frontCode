<template>
  <div class="goods-goodsManage">
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model :model="formData" ref="roleForm" :rules="formRule">
        <a-form-model-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="角色名称"
          prop="roleName"
        >
          <a-input
            :disabled="look"
            v-model="formData.roleName"
            placeholder="请输入角色名称"
          />
        </a-form-model-item>
      
        <a-form-model-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="权限"
          prop="permissionIds"
        >
          <a-tree
            :disabled="look"
            checkable
            :replaceFields="replaceFields"
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            :checkedKeys="formData.permissionIds"
            @check="onCheck"
            :treeData="treeData"
          />
        </a-form-model-item>
        <div style="display: flex; flex-direction: row-reverse; padding-right: 20px;" v-if="look">
          <a-button @click="$router.go(-1);" type="primary">取消</a-button>
        </div>
        <div style="display: flex; flex-direction: row-reverse; padding-right: 20px;" v-else>
          <a-button @click="save" type="primary">保存</a-button>
        </div>
      </a-form-model>
    </a-spin>

  </div>
</template>
<script>
import api from "@/api/user";
export default {
  data() {
    return {
      look: false,
      loading: false,
      formData: {
        roleName: '',
        permissionIds: {
          checked: [],
          halfChecked: []
        }
      },
      formRule:{
        roleName: [{ required: true, message: '请输入角色名称' }],
      },
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
      },
      replaceFields: {
        children: 'children',
        title: 'name',
        key: 'id'
      },
      expandedKeys: [],
      autoExpandParent: true,
      treeData: []
    }
  },
  created() {
    this.look = this.$route.query.look
    this.getList();
  },
  methods: {
    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys, info) {
      console.log('onCheck', checkedKeys, info);
      this.formData.permissionIds = {
        checked: checkedKeys,
        halfChecked: info.halfCheckedKeys
      }
    },
    save() {
      let that = this;
      let id = that.$route.query.id;
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          let data = {
            roleName: that.formData.roleName,
            permissionIds: that.formData.permissionIds.checked.concat(that.formData.permissionIds.halfChecked),
            checkObj: JSON.stringify(that.formData.permissionIds)
          }
          if (id) {
            data.id = id;
          }
          console.log('---------提交数据-------',data)
          api
            .ajax({
              data,
              method: "saveSysRole"
            })
            .then(res => {
              const data = res.data;
              that.$message.success(data.msg);
              that.$router.go(-1);
            })
            .catch(error => {
              console.log("error", error);
            });
        }
      });
    },
    getList() {
      let data = {};
      this.loading = true;
      api
        .ajax({
          data,
          method: "treeSysPermission"
        })
        .then(res => {
          const data = res.data.data;
          console.log('--------treeData', data.children)
          this.treeData = data.children;
          let id = this.$route.query.id;
          if (id) {
            this.getDetail(id);
          } else {
            this.loading = false;
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    getDetail(id) {
      let data = {
        id: id
      };
      api
        .ajax({
          data,
          method: "infoSysRole"
        })
        .then(res => {
          const data = res.data.data;
          this.formData.roleName = data.roleName;       
          // 这是编辑新建的时候将全选和半选数组放到对象里存到后端
          this.formData.permissionIds = data.checkObj ? JSON.parse(data.checkObj) : {checked: [], halfChecked: []}

          console.log('-----详情接口返回数据----',data, this.checkedKeys) 

          // 这是前端算法去从计算出半选和全选的数组
          // const keyObj =this.getKeyObj(data.permissionIds)
          // this.formData.permissionIds = {
          //   checked: keyObj.checked,
          //   halfChecked: keyObj.halfChecked
          // };
          this.loading = false;
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    getKeyObj(list) {
      let newList1 = list.filter((item) => {
        let flag = this.ishalfCheck(this.treeData, item)
        return flag
      })
      let newList = list.filter((item) => {
        let flag = true;
        newList1.forEach((it) => {
          if(it === item) {
            flag = false;
          }
        })
        return flag
      })
      console.log('---获取到的数组---',list,'----选中数组----', newList, '----半选数组-----',newList1)
      return {
        checked: newList,
        halfChecked: newList1
      }
    },
    ishalfCheck(list, id) {
      let flag = false;
      list.forEach((item) => {
        if (item.id === id) {
          if (item.children && item.children.length > 0) {
            item.children.forEach((item1) => {
              if (this.permissionIds.includes(item1.id)) {
                if(item1.children && item1.children.length > 0 && this.ishalfCheck(item.children,item.id)) {
                  flag = true
                }
              } else {
                flag = true
              }
            })
          }
        } else {
          if(item.children && item.children.length > 0) {
            if(this.ishalfCheck(item.children,id)) {
              flag = true
            }
          }
        }
      })
      return flag;
    }
  },
}
</script>
<style lang="less" scoped>
.goods-goodsManage {
  padding: 20px 0;
  background: #fff;
}
.label {
  text-align: right;
  line-height: 39px;
  color: rgba(0, 0, 0, 0.85);
}
.label::after {
  content: ':';
  position: relative;
  top: -0.5px;
  margin: 0 8px 0 2px;
}
</style>


