<template>
  <div>

    <a-form :form="form" @submit="handleSubmit">

      <a-form-item label="商品图" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <div class="ant-upload-list ant-upload-list-picture-card my-ant-upload-list">
          <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" listType="picture-card" :fileList="fileList" :showUploadList="false">
            <div class="my-ant-upload-list-item">
              <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" alt="xxx.png">
            </div>
          </a-upload>
          <a-icon style="fontSize:18px" class="close-delete-icon" type="close-circle" />
        </div>
        <div class="ant-upload-list ant-upload-list-picture-card my-ant-upload-list">
          <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" listType="picture-card" :fileList="fileList" :showUploadList="false">
            <div class="my-ant-upload-list-item">
              <img src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" alt="xxx.png">
            </div>
          </a-upload>
          <a-icon style="fontSize:18px" class="close-delete-icon" type="close-circle" />
        </div>
        <div class="ant-upload-list ant-upload-list-picture-card my-ant-upload-list">
          <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" listType="picture-card" :fileList="fileList" :showUploadList="false">
            <div>
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </div>
      </a-form-item>

      <a-form-item label="Note" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input v-decorator="['note', { rules: [{ required: true, message: 'Please input your note!' }] }]" />
      </a-form-item>

      <a-form-item label="Gender" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-select v-decorator="[
          'gender',
          { rules: [{ required: true, message: 'Please select your gender!' }] },
        ]" placeholder="Select a option and change input text above" @change="handleSelectChange">
          <a-select-option value="male">
            male
          </a-select-option>
          <a-select-option value="female">
            female
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" html-type="submit">
          Submit
        </a-button>
      </a-form-item>

    </a-form>

  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [
        {
          uid: "-1",
          name: "xxx.png",
          status: "done",
          url:
            "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        }
      ],
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" })
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        }
      });
    },
    handleSelectChange(value) {
      console.log(value);
      this.form.setFieldsValue({
        note: `Hi, ${value === "male" ? "man" : "lady"}!`
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
<style lang="less">
.my-ant-upload-list {
  position: relative;
  .ant-upload.ant-upload-select-picture-card {
    margin-right: 18px;
  }
  .my-ant-upload-list-item {
    float: left;
    width: 86px;
    height: 86px;

    img {
      width: 100%;
      height: 100%;
    }
  }
  .close-delete-icon {
    position: absolute;
    right: 10px;
    top: -5px;
  }
}
</style>