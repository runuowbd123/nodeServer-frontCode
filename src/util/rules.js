// 判断是否有emoji 符号
export function validateMobile(rule, value, callback) {
  let reg = /^1[3456789]\d{9}$/;
  if (value && (!reg.test(value) || value.length != 11)) {
    callback("手机号码格式错误！")
  }
  callback();
}

export function validateMobile2(rule, value, callback) {
  let reg = /^1[3456789]\d{9}$/;
  let reg2=/^0\d{2,3}-?\d{7,8}$/;
  if (value && (reg.test(value) || reg2.test(value))) {
    callback()
  } else {
    callback("号码格式错误！");
  }
}

export function validateNumber(rule, value, callback) {
  let reg = /^[0-9]*$/;
  if (value && reg.test(value)) {
    callback('请勿输入纯数字')
  }
  callback();
}

export function checkMail(rule, value, callback){
  var rexp= /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
  if(value === "" || value === undefined){
    callback()
  }
  if (value && !rexp.test(value)) {
      callback('邮箱格式不正确！')
  }

  // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
  callback()
}

export function checkPic(rule, value, callback){
  if (value && value.length > 0 ) {
      callback()
  } else {
    callback('请上传图片')
  }
  callback()
}

let validateFuns = {
    validateMobile,
    validateNumber,
    validateMobile2,
    checkMail,
    checkPic
}

export default validateFuns
