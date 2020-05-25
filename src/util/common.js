import {
  message
} from 'ant-design-vue'
export default {
  beforeUploadLimit(file) {
    const isLt2M = file.size / 1024 / 1024 < 2;
    const fileType = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp');
    if (!fileType) {
      message.error('图片格式必须是jpg/png/bmp');
    }
    if (!isLt2M) {
      message.error('图片大小必须小于2M!');
    }
    return fileType && isLt2M;
  }
}
