<template>
  <div class="client__detail__Box">
    <div class="title-sub">基本信息</div>
    <div class="content-sub">
      <div class="fl">
        <img v-if="client.wxPic" :src="client.wxPic" />
        <img v-else src="../../assets/images/ava.png" />
      </div>
      <div class="conne">
        <p v-if="show || this.client.wxUserId">{{ client.name }}</p>
        <p v-else>
          <a-input v-model.trim="name" class="width200" />
        </p>
        <span>成为客户：{{ client.beCusTime }}</span>
        <span>最近浏览：{{ client.latelyBrowseTime }}</span>
        <span>手机号：{{ client.phone }}</span>
      </div>
    </div>
    <div class="title-sub">客户资料</div>
    <div class="content-sub">
      <span v-if="show || this.client.wxUserId">性别：{{ client.gender }}</span>
      <span v-else class="marginRight20">
        <span class="marginRight0">性别：</span>
        <a-select class="width200" v-model="gender">
          <a-select-option value="男">男</a-select-option>
          <a-select-option value="女">女</a-select-option>
        </a-select>
      </span>

      <span v-if="show || this.client.wxUserId"
        >生日：{{ client.birthday }}
      </span>
      <span v-else class="marginRight20">
        <span class="marginRight0">生日：</span>
        <a-date-picker
          class="width200"
          v-model="birthday"
          format="YYYY-MM-DD"
        />
      </span>

      <span v-if="show || this.client.wxUserId">地区：{{ client.area }}</span>
      <span v-else class="marginRight20">
        <span class="marginRight0">地区:</span>
        <a-input v-model.trim="area" class="width200" />
      </span>
    </div>
    <div class="title-sub">标签信息</div>
    <div class="content-sub tagList" v-if="show">
      <div v-for="(item, index) in tagIds || []" :key="index" class="tag-item">
        {{
          (
            tagList.find(it => {
              return it.id === item;
            }) || {}
          ).name
        }}
      </div>
    </div>
    <div
      v-else
      style="background: rgba(255, 255, 255, 1);
      border-bottom: 1px solid rgba(230, 230, 230, 1);
      overflow: hidden;
      padding: 0 20px 30px;"
    >
      <a-select
        mode="multiple"
        style="width: 500px"
        placeholder="请选择标签"
        v-model="tagIds"
        :maxTagCount="3"
      >
        <a-select-option
          v-for="item in tagList"
          :key="item.id"
          :disabled="item.type === 1"
        >
          {{ item.name }}
        </a-select-option>
      </a-select>
    </div>

    <div class="title-sub">备注信息</div>
    <div class="content-sub">
      <span v-if="show">{{
        client.remark ? client.remark : "无备注内容"
      }}</span>
      <a-textarea
        :maxLength="256"
        v-else
        placeholder="无备注内容"
        v-model="remark"
        :autoSize="{ minRows: 2, maxRows: 6 }"
      />
    </div>
    <div class="title-sub">交易统计</div>
    <div class="content-sub">
      <span>最近下单时间：{{ client.commitOrderTime }}</span>
      <span>累计消费金额：￥{{ client.totalCostPrice }}</span>
      <span>累计消费订单数：{{ client.totalCostOrder }}</span>
      <span>累计退款金额：￥{{ client.totalRefundPrice }}</span>
      <span>累计退款订单数：{{ client.totalRefundOrder }}</span>
    </div>
    <div
      class="page_btn"
      v-if="$permission.hasPermission('CUSTOMER_MANAGER_EDIT')"
    >
      <a-button type="primary" @click="open" v-if="show">编辑</a-button>
      <a-button type="primary" v-else @click="handleSubmit">保存</a-button>
    </div>
  </div>
</template>
<script>
import api from "@/api/user";
import moment from "moment";
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: "save" }),
      show: true,
      client: {},
      name: "",
      gender: "",
      birthday: null,
      area: "",
      remark: "",
      tagList: [],
      tags: [],
      tagIds: []
    };
  },
  created() {
    this.getTagList();
    let client = window.sessionStorage.getItem("client");
    // console.log(client, '从sessionstorage里取来的client的客户信息')
    this.client = client ? JSON.parse(client) : {};
    this.name = this.client.name;
    this.gender = this.client.gender;
    this.birthday = this.client.birthday ? moment(this.client.birthday) : null;
    this.area = this.client.area;
    this.remark = this.client.remark;
    this.tags = this.client.tagList;
    this.tagIds = (this.tags || []).map(item => item.tagId);
    console.log(this.client);
  },
  methods: {
    getTagList() {
      api
        .ajax({
          method: "tagList"
        })
        .then(res => {
          console.log(res.data);
          this.tagList = res.data.data;
        })
        .catch(() => {
          console.log("error");
        });
    },
    moment,
    open() {
      this.show = false;
    },
    handleSubmit(e) {
      if (!this.name) {
        return this.$message.info("请输入名称");
      }
      let data = {
        area: this.area,
        birthday: this.birthday ? this.birthday.format("YYYY-MM-DD") : "",
        gender: this.gender,
        name: this.name,
        remark: this.remark,
        type: 1,
        customerId: this.client.id,
        tagIds: this.tagIds
      };
      this.client.phone && (data.phone = this.client.phone);
      api
        .ajax({
          data: data,
          method: "createOrEditCustomer"
        })
        .then(res => {
          this.show = true;
          this.client = {
            ...this.client,
            ...{
              area: this.area,
              birthday: this.birthday ? this.birthday.format("YYYY-MM-DD") : "",
              gender: this.gender,
              name: this.name,
              remark: this.remark
            }
          };
        })
        .catch(() => {
          console.log("error");
        });
    }
  }
};
</script>
<style lang="less" scoped>
.client__detail__Box {
  .title-sub {
    background: rgba(255, 255, 255, 1);
    font-size: 14px;
    color: rgba(51, 51, 51, 1);
    padding: 30px 20px;
  }
  .content-sub {
    background: rgba(255, 255, 255, 1);
    overflow: hidden;
    padding: 0 20px 30px;
    border-bottom: 1px solid rgba(230, 230, 230, 1);
    .fl {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .conne {
      margin-left: 80px;
      p {
        font-size: 16px;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        line-height: 30px;
        margin: 0;
      }
    }
    span {
      font-size: 12px;
      color: rgba(51, 51, 51, 1);
      line-height: 16px;
      margin-right: 60px;
    }
  }
  .tagList {
    display: flex;
    align-items: center;
    .tag-item {
      margin-right: 20px;
      border: 1px solid #999;
      padding: 5px 10px;
      border-radius: 6px;
      background: rgb(242, 242, 242);
    }
  }
  .page_btn {
    margin-top: 15px;
    text-align: right;
  }
  .width200 {
    width: 200px;
    span {
      margin-right: 0;
    }
  }
  span.marginRight0 {
    margin-right: 0;
  }
  span.marginRight20 {
    margin-right: 20px;
  }
}
</style>
