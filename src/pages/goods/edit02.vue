<template>
  <div class="goodsedit__Box">
    <a-row class="step__box">
      <a-col class="step1" :span="12"><span>1</span> 编辑基本信息 </a-col>
      <a-col class="step" :span="12"><span>2</span> 编辑商品详情 </a-col>
    </a-row>
    <div class="edit_content">
      <div class="mobile">
        <div class="mobile_title">商品详情效果预览</div>
        <div class="img-box" v-for="(itm, idx) in detailArr" :key="idx">
          <img v-if="itm.type === 1" :src="itm.resource" />
          <pre
            v-if="itm.type === 2"
            :style="'background:' + JSON.parse(itm.resource).backgroundColor + ';font-size:' + JSON.parse(itm.resource).fontSize + ';color:' + JSON.parse(itm.resource).textColor + ';text-align:' + JSON.parse(itm.resource).textAlign + ';padding:10px;'"
          >{{JSON.parse(itm.resource).text}}</pre>
          <video style="width:100%;height:166px;" v-if="itm.type === 4" :src="itm.resource" :poster="itm.videoPic || ''" controls controlsList='nodownload'  />
          <a-icon type="close-circle" @click="deleteImg(idx)" />
        </div>
        <div class="componets_title">基础组件</div>
        <div class="componets_btn">
          <button @click="imgBtn">图片</button>
          <button @click="textBtn">文本</button>
          <button @click="videoBtn">小视频</button>
        </div>
      </div>
      <div class="componets_content" v-if="showImg">
        <div class="image">
          <div class="componets_title2">添加图片</div>
          <div>
            <a-upload-dragger
              name="file1"
              action="/api/uploadJson"
              listType="picture-card"
              :showUploadList="false"
              :beforeUpload = "beforeUploadLimit"
              accept=".png,.jpg,.jpeg,.bmp"
              @change="imgChange"
            >
              <p class="ant-upload-text">+添加一个图片</p>
              <p class="ant-upload-hint">建议宽度750像素</p>
            </a-upload-dragger>
          </div>
        </div>
      </div>
      <div class="componets_content text-content" v-if="showText">
        <div class="image">
          <div class="componets_title2">添加文本</div>
          <div>
            <a-form class="step__form" :form="form">
              <a-form-item label="文本" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
                <a-textarea
                  :autosize="{ minRows: 5, maxRows: 5 }"
                  v-decorator="[
                    'text',
                    {
                      initialValue: '',
                      validateTrigger: ['change', 'blur'],
                      rules: [
                        { 
                          required: true,
                          whitespace: true,
                          message: '请输入文本',
                        }
                      ]
                    }
                ]" />
              </a-form-item>
              <a-form-item label="字体大小" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
                <a-radio-group
                  v-decorator="[
                    'fontSize',
                    {
                      initialValue: ''
                    }
                  ]"  
                >
                  <a-radio value="18px">大</a-radio>
                  <a-radio value="14px">中</a-radio>
                  <a-radio value="12px">小</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="文本颜色" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
                <input
                  v-decorator="[
                    'textColor',
                    {
                      initialValue: '#333333'
                    }
                  ]"
                type="color">
                <a-button @click="resetTextColor">重置</a-button>
              </a-form-item>
              <a-form-item label="背景颜色" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
                <input
                  v-decorator="[
                    'backgroundColor',
                    {
                      initialValue: '#f6f6f6'
                    }
                  ]" type="color">
                <a-button @click="resetBackgroundColor">重置</a-button>
              </a-form-item>
              <a-form-item label="显示位置" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
                <a-radio-group
                  v-decorator="[
                    'textAlign',
                    {
                      initialValue: ''
                    }
                  ]"  
                >
                  <a-radio value="left">居左</a-radio>
                  <a-radio value="center">居中</a-radio>
                  <a-radio value="right">居右</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label=" " :colon="false" :label-col="{ span: 9 }" :wrapper-col="{ span: 9 }">
                <a-button @click="setText">保存</a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
      <div class="componets_content video-content" v-if="showVideo">
        <div class="image">
          <div class="componets_title2">添加视频</div>
          <div>
            <a-form class="step__form" :form="form">
              <a-form-item label="视频" extra="建议视频宽高比16:9" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
                <div class="text">选择视频</div>
                <a-upload
                  style="display:inline-block"
                  v-decorator="[
                    'video',
                    {
                      valuePropName: 'fileList',
                      getValueFromEvent: normFile,
                      rules: [
                        { 
                          required: true,
                          validator: validator
                        }
                      ]
                    },
                  ]"
                  name="file1"
                  action="/api/uploadJson"
                  listType="picture-card"
                  :showUploadList="false"
                  :beforeUpload = "beforeUploadVideo"
                  accept=".MP4,.WebM,.Ogg"
                  @change="videoChange"
                >
                  <!-- <img v-if="videoUrl" :src="videoUrl" alt="avatar" /> -->
                  <!-- <div v-else> -->
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                  <!-- </div> -->
                </a-upload>
                <video style="width:160px;height:90px;" v-if="videoUrl" :src="videoUrl" controls controlsList='nodownload' />
              </a-form-item>
              <a-form-item label="封面图" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
                <a-radio-group
                  v-decorator="[
                    'coverImg',
                    {
                      initialValue: 0
                    }
                  ]" 
                  @change="coverImgUrl = ''"
                >
                  <a-radio :value="0">原视频封面</a-radio>
                  <a-radio :value="1">自定义封面</a-radio>
                </a-radio-group>
                <a-form-item v-if="form.getFieldValue('coverImg') === 1" label="" extra="建议图片宽高比16:9" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
                  <a-upload
                    v-decorator="[
                      'dragger',
                      {
                        valuePropName: 'fileList',
                        getValueFromEvent: normFile,
                      },
                    ]"
                    name="file1"
                    action="/api/uploadJson"
                    listType="picture-card"
                    :showUploadList="false"
                    :beforeUpload = "beforeUploadLimit"
                    accept=".jpeg,.jpg,.png "
                    @change="coverImgChange"
                  >
                    <img style="width:110px;height:110px;" v-if="coverImgUrl" :src="coverImgUrl" alt="avatar" />
                    <div v-else>
                      <a-icon type="plus" />
                    </div>
                  </a-upload>
                </a-form-item>
              </a-form-item>
              <a-form-item label=" " :colon="false" :label-col="{ span: 9 }" :wrapper-col="{ span: 9 }">
                <a-button @click="setVideo">保存</a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
    </div>
    <div class="btn_bottom">
      <a-button @click="save(1)">上一步</a-button>
      <a-button type="primary" @click="save(3)">保存查看</a-button>
    </div>
  </div>
</template>
<script>
import api from "@/api/user";
import utils from "@/util/common"
export default {
  props: ["goodsId"],
  data() {
    return {
      form: this.$form.createForm(this, { name: "save" }),
      detailArr: [],
      info: {},
      showImg:false,
      showText: false,
      showVideo: false,
      videoUrl: '',
      coverImgUrl: '',
      loading: false
    };
  },
  created() {
    if (this.goodsId) {
      this.getInfo();
    }
  },
  methods: {
    beforeUploadLimit:utils.beforeUploadLimit,
    imgBtn(){
      this.showImg = true;
      this.showText = false;
      this.showVideo = false;
      this.videoUrl = '';
      this.coverImgUrl = '';
    },
    textBtn(){
      this.showText = true;
      this.showImg = false;
      this.showVideo = false;
      this.videoUrl = '';
      this.coverImgUrl = '';
    },
    videoBtn(){
      this.showVideo = true;
      this.showImg = false;
      this.showText = false;
    },
    resetTextColor() {},
    resetBackgroundColor() {},
    setText() {
      this.form.validateFields((err, values) => {
        console.log(values)
        if (!err) {
          let obj = {
            text: values.text,
            fontSize: values.fontSize,
            textColor: values.textColor,
            backgroundColor: values.backgroundColor,
            textAlign: values.textAlign
          }
          let resource = JSON.stringify(obj);
          this.detailArr.push({
            resource: resource,
            type: 2
          });
          this.showText = false;
        }
      })
    },
    setVideo() {
      this.form.validateFields((err, values) => {
        console.log(values)
        if (!err) {
          let obj = {
            resource: this.videoUrl,
            type: 4
          };
          if (this.coverImgUrl) {
            obj.videoPic = this.coverImgUrl;
          }
          this.detailArr.push(obj);
          this.showVideo = false;
          this.videoUrl = '';
          this.coverImgUrl = '';
        }
      })
    },
    normFile(e) {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    },
    pre() {
      this.$emit("changeStep", 1);
    },
    next() {
      this.$emit("changeStep", 3);
    },
    imgChange(info) {
      if (info.file.status === "done") {
        this.detailArr.push({
          resource: info.file.response.data[0],
          type: 1
        });
        this.showImg = false;
      } else if (info.file.status === "error") {
        this.$message.error(info.file.response.message);
      }
    },
    validator(rule, value, callback) {
      if(!this.videoUrl){
        callback('请上传视频')
      }
      callback()
    },
    beforeUploadVideo(file) {
      const isLt2M = file.size / 1024 / 1024 < 10;
      const fileType = (file.type === 'video/mp4' || file.type === 'video/ogg' || file.type === 'video/webm');
      if (!fileType) {
        this.$message.error('视频格式必须是mp4/ogg/webm');
      }
      if (!isLt2M) {
        this.$message.error('视频大小必须小于10M!');
      }
      return fileType && isLt2M;
    },
    videoChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
        this.loading = false;
        this.videoUrl = info.file.response.data[0];
      } else if (info.file.status === "error") {
        this.$message.error(info.file.response.message);
      }
    },
    coverImgChange(info) {
      if (info.file.status === "done") {
        this.coverImgUrl = info.file.response.data[0];
      } else if (info.file.status === "error") {
        this.$message.error(info.file.response.message);
      }
    },
    getInfo() {
      api
        .ajax({
          data: { goodsId: this.goodsId },
          method: "goodsDetail"
        })
        .then(res => {
          const data = res.data.data;
          this.info = data;
          this.detailArr = data.detailResource;
          // this.detailPic = data.detailPic;
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    save(num) {
      api
        .ajax({
          data: {
            goodsId: this.goodsId,
            resourceList: this.detailArr
          },
          method: "uploadGoodsResource"
        })
        .then(res => {
          this.$emit("changeStep", num);
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    deleteImg(index) {
      this.detailArr.splice(index, 1);
    }
  }
};
</script>
<style lang="less" scoped>
.goodsedit__Box {
  .step__box {
    & > div {
      height: 38px;
      line-height: 38px;
      text-align: center;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(243, 244, 248, 1);
      span {
        display: inline-block;
        vertical-align: top;
        font-size: 22px;
        margin-left: 5px;
      }
    }
    .step1 {
      background: url("../../assets/images/_bg02.png") no-repeat right center;
      background-size: 24px 38px;
      background-color: #76b0de;
    }
    .step {
      background-color: #76b0de;
    }
  }
  .edit_content {
    padding: 37px 20px 250px 70px;
    background-color: #fff;
    position: relative;
    .mobile {
      width: 327px;
      border: 1px solid rgba(222, 222, 222, 1);
      .mobile_title {
        height: 41px;
        line-height: 41px;
        text-align: center;
        font-size: 14px;
        color: rgba(51, 51, 51, 1);
        background: rgba(229, 229, 229, 1);
      }
      .componets_title {
        padding: 15px 0 0 10px;
        font-size: 12px;
        color: rgba(51, 51, 51, 1);
      }
      .componets_btn {
        padding: 0 10px 120px;
        button {
          margin-top: 10px;
          margin-bottom: 10px;
          width: 95px;
          height: 40px;
          line-height: 38px;
          font-size: 12px;
          color: rgba(51, 51, 51, 1);
          background: rgba(246, 246, 246, 1);
          border: 1px dotted rgba(222, 220, 220, 1);
          cursor: pointer;
        }
      }
    }
    .componets_content {
      position: absolute;
      left: 405px;
      bottom: 100px;

      .componets_title2 {
        font-size: 12px;
        color: rgba(51, 51, 51, 1);
        line-height: 18px;
        padding: 20px 0 10px;
      }
      .image {
        width: 344px;
        // height: 161px;
        background: rgba(246, 246, 246, 1);
        border: 1px solid rgba(222, 220, 220, 1);
        border-radius: 3px;
        padding: 0 20px;
        .ant-upload-text {
          font-size: 12px;
          color: rgba(62, 123, 248, 1);
          line-height: 18px;
        }
        .ant-upload-hint {
          font-size: 12px;
          color: #333333;
          line-height: 18px;
        }
        .ant-upload {
          padding: 25px 0;
          background: rgba(255, 255, 255, 1);
        }
      }
    }
    .text-content {
      bottom: 10px;
    }
    .video-content {
      bottom: 10px;
      .image {
        width: 370px;
      }
      .ant-upload {
        width: 70px;
        height: 70px;
        padding: 0 !important;
      }
    }
  }
  .btn_bottom {
    text-align: right;
    background-color: #fff;
    padding: 0 20px 100px 20px;
    button {
      margin: 0 5px;
    }
  }
  .img-box {
    padding: 0 15px 10px;
    position: relative;
    img {
      width: 100%;
    }
    i {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 16px;
      cursor: pointer;
    }
  }
}
pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: "微软雅黑";
}
</style>
