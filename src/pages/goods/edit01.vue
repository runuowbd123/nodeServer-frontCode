<template>
  <div class="goodsedit01__Box">
    <a-row class="step__box">
      <a-col class="step1" :span="12"><span>1</span> 编辑基本信息 </a-col>
      <a-col class="step" :span="12"><span>2</span> 编辑商品详情 </a-col>
    </a-row>
    <a-spin tip="加载中..." :spinning="infoLoading || tagLoading || groupLoading">
      <a-form class="step__form" :form="form">
        <div class="sub-title">基本信息</div>
        <a-form-item label="商品类型：" :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <!-- <div class="fl proType">
              <div>实物商品</div>
              <span>（物流发货）</span>
            </div>
            <div class="fl proType">
              <div>虚拟商品</div>
              <span>（无需物流）</span>
            </div> -->
            <a-radio-group
              :disabled="!!goodsId"
              @change="changeGoodsType"
              buttonStyle="outline"
              v-decorator="[
                'goodsType',
                {
                  initialValue: formData.goodsType,
                  rules: [
                    { required: true, message: '请选择商品类型' }
                  ]
                }
              ]"
            >
              <a-radio-button :value="1" style="width: 130px;height:50px;">
                <div class="fl proType">
                  <div>实物商品</div>
                  <span>（物流发货）</span>
                </div>
              </a-radio-button>
              <a-radio-button :value="0" style="width: 130px;height:50px;">
                <div class="fl proType">
                  <div>虚拟商品</div>
                  <span>（无需物流）</span>
                </div>
              </a-radio-button>
            </a-radio-group>
          </a-form-item>

        <a-form-item label="商品名称：" :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="[
              'goodsName',
              {
                initialValue: formData.goodsName,
                rules: [
                  { required: true, message: '输入商品名称!' },
                  { max: 50, message: '最多可输入50字' }
                ]
              }
            ]" />
        </a-form-item>

        <a-form-item label="分享描述：" :colon="false" extra="微信分享给好友时会显示，建议36个字以内" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="[
              'shareDesc',
              {
                initialValue: formData.shareDesc,
                rules: [{ max: 36, message: '36个字以内' }]
              }
            ]" />
        </a-form-item>

        <a-form-item label="商品图：" extra="建议尺寸：800*800像素，最多上传10张，默认第一张为主图封面" :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <div style="display: flex; flex-wrap: wrap">
            <div v-for="(itm, idx) in fileList" :key="idx" class="ant-upload-list ant-upload-list-picture-card my-ant-upload-list">
              <a-upload name="file1" action="/api/uploadJson" @change="imgChange($event, itm)" listType="picture-card" :showUploadList="false" :beforeUpload="beforeImg" accept=".png,.jpg,.jpeg,.bmp">
                <div class="my-ant-upload-list-item">
                  <img :src="itm" />
                </div>
              </a-upload>
              <a-icon style="fontSize:18px" class="close-delete-icon" type="close-circle" @click="deleteImg(idx)" />
            </div>
            <div class="ant-upload-list ant-upload-list-picture-card my-ant-upload-list">
              <a-upload name="file1" action="/api/uploadJson" @change="imgAdd" :beforeUpload="beforeImg" listType="picture-card" :showUploadList="false" accept=".png,.jpg,.jpeg,.bmp" v-decorator="[
                  'fileList',
                  {
                    initialValue: fileList,
                    rules: [
                      {
                        required: true,
                        message: '请上传商品图'
                      }
                    ]
                  }
                ]">
                <div>
                  <a-icon type="plus" />
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
            </div>
          </div>
        </a-form-item>

        <a-form-item label="商品分组" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            mode="multiple"
            v-decorator="[
              'groupIds',
              {
                initialValue: formData.groupIds
              }
            ]"
            placeholder="选择商品分组"
          >
            <a-select-option v-for="(item, index) in groupArr" :key="index" :label="item.name" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="商品标签" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            :allowClear="true"
            v-decorator="[
              'tagIds',
              {
                initialValue: formData.tagIds
              }
            ]"
            placeholder="选择商品标签"
          >
            <a-select-option v-for="(item, index) in tagArr" :key="index" :label="item.name" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>

        <div class="sub-title">库存价格</div>
        <a-form-item
          v-if="formData.goodsType === 1"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
          label="商品规格"
          extra="如有颜色、尺码等多种规格，请添加商品规格"
        >
          <a-radio-group
            v-decorator="[
            'hasSpec',
              {
                initialValue: formData.hasSpec != null ? formData.hasSpec : 0,
                rules: [{ required: true, message: '请选择商品规格' }]
              }
            ]"
            @change="changeSpec"
          >
            <a-radio :value="0">
              统一规格
            </a-radio>
            <a-radio :value="1">
              多规格
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <div v-if="formData.hasSpec === 1 && formData.goodsType === 1">
          <a-form-item
            label=" "
            :colon="false"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 12 }"
          >
            <div class="attrList-content" v-for="(item, index) in formData.goodsAttrList" :key="index">
              <a-icon class="close-icon" v-if="formData.goodsAttrList.length > 1 && index !== 0" type="close-circle" @click="deleteGoodsAttr(index)" />
              <a-form-item label="规格名" style="display:flex;width: 100%;" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                <a-input
                @blur="changeAttrKeyName($event,index)"
                  v-decorator="[
                    `attrKeyName${index}`,
                    {
                      initialValue: item.attrKeyName,
                      validateTrigger: ['change', 'blur'],
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: '请输入规格名',
                        },
                        { max: 4, message: '最大可输入4字' }
                      ]
                    }
                  ]"
                />
              </a-form-item>
              <a-form-item label="规格值" style="display:flex;width: 100%;" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                  <div style="display:flex;width:100%;flex-wrap:wrap;flex-shrink: 0;">
                    <a-form-item v-for="(obj, ind) in item.valueList" :key="ind" style="margin-right:20px;width:90px;flex-shrink: 0;">
                      <div class="rule-box">
                        <a-input
                          @blur="changeAttrValueName($event,index,ind)"
                          v-decorator="[
                            `attrKeyName${index}attrValueName${ind}`,
                            {
                              initialValue: obj.attrValueName,
                              validateTrigger: ['change', 'blur'],
                              rules: [
                                {
                                  required: true,
                                  whitespace: true,
                                  message: '请输入规格值',
                                },
                                { max: 10, message: '最大可输入10字' }
                              ]
                            }
                          ]"
                        />
                        <a-icon class="close-icon" v-if="item.valueList.length > 1" type="close-circle" @click="deleteAttrValueName(index, ind)" />
                      </div>
                    </a-form-item>
                  </div>
                  <span class="add-rule-value" v-if="item.valueList.length < 10 " style="flex-shrink: 0;color: #1890ff;cursor:pointer;user-select: none;" @click="addAttrValueName(index)">添加规格值</span>
              </a-form-item>
            </div>
            <a-button style="margin-bottom:20px;" @click="addGoodsAttr" v-if="formData.goodsAttrList.length < 3">添加商品规格</a-button>
          </a-form-item>
          <a-form-item label=" " :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
            <div class="page_table_product_edit">
              <a-table 
                :bordered="true"
                :pagination="false"
                :columns="tableColumns"
                :dataSource="formData.goodsSpecList"
                :rowKey="(record,index) => index"
              >
                <span slot="actualPriceT">
                  <span style="color: red">*</span>
                  价格
                </span>
                <span slot="numT">
                  <span style="color: red">*</span>
                  库存
                  <a-tooltip placement="topLeft">
                    <template slot="title">
                      <span>此处库存仍然为商品的可售卖库存，可以直接进行修改，修改后，买家看到的商品可售库存数量会进行变化</span>
                    </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                </span>
                <span slot="costPriceT">
                  <!-- <span style="color: red">*</span> -->
                  成本价
                  <a-tooltip placement="topLeft">
                    <template slot="title">
                      <span>成本价未来会用于营销建议，利润分析等</span>
                    </template>
                    <a-icon type="question-circle" />
                  </a-tooltip>
                </span>
                <div :slot="0" slot-scope="text,record">
                  {{record[(formData.goodsAttrList[0] || {}).attrKeyName]}}
                </div>
                <div :slot="1" slot-scope="text,record">
                  {{record[(formData.goodsAttrList[1] || {}).attrKeyName]}}
                </div>
                <div :slot="2" slot-scope="text,record">
                  {{record[(formData.goodsAttrList[2] || {}).attrKeyName]}}
                </div>
                <div slot="actualPrice" slot-scope="text,record,index" style="width: 100px;">
                  <a-form-item :label="null" style="margin: 0;" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" >
                    <div class="rule-box">
                      <a-input-number
                        @change="changeInput($event,'actualPrice', index)"
                        :min="0.01"
                        :step="0.01"
                        v-decorator="[
                          `actualPrice${index}`,
                          {
                            initialValue: text,
                            validateTrigger: ['change', 'blur'],
                            rules: [
                              {
                                required: true,
                                message: '请输入价格',
                              },
                              {
                                validator: function(rule, value, callback) {
                                  if (value && value > 9999999) {
                                    callback('不能超过9999999')
                                  }
                                  callback();
                                }
                              }
                            ]
                          }
                        ]"
                      />
                    </div>
                  </a-form-item>
                </div>
                <div slot="num" slot-scope="text,record,index" style="width: 100px;">
                  <a-form-item :label="null" style="margin: 0;" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" >
                    <div class="rule-box">
                      <a-input-number
                        @change="changeInput($event,'num', index)"
                        :min="0"
                        v-decorator="[
                          `num${index}`,
                          {
                            initialValue: text,
                            validateTrigger: ['change', 'blur'],
                            rules: [
                              {
                                required: true,
                                message: '请输入库存',
                              },
                              {
                                validator: function(rule, value, callback) {
                                  if (value && value > 10000000) {
                                    callback('不能超过10000000')
                                  }
                                  callback();
                                }
                              }
                            ]
                          }
                        ]"
                      />
                    </div>
                  </a-form-item>
                </div>
                <div slot="costPrice" slot-scope="text,record,index" style="width: 100px;">
                  <a-form-item :label="null" style="margin: 0;" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" >
                    <div class="rule-box">
                      <a-input-number
                        @change="changeInput($event,'costPrice', index)"
                        :min="0"
                        v-decorator="[
                          `costPrice${index}`,
                          {
                            initialValue: text,
                            validateTrigger: ['change', 'blur'],
                            rules: [
                              {
                                validator: function(rule, value, callback) {
                                  if (value && value > 9999999) {
                                    callback('不能超过9999999')
                                  }
                                  callback();
                                }
                              }
                              //{
                              //  required: true,
                              //  message: '请输入价格',
                              //}
                            ]
                          }
                        ]"
                      />
                    </div>
                  </a-form-item>
                </div>
              </a-table>
            </div>
          </a-form-item>
          <a-form-item label=" " :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <div class="batch-operation-box" v-if="formData.hasSpec === 1 && formData.goodsSpecList.length > 0">
              <div class="batch-operation-text">批量设置：</div>
              <div class="handle-box" v-if="!batchOperation">
                <span class="batch-btn" @click="chooseSet(true,true,false)">价格</span>
                <span class="batch-btn" @click="chooseSet(true,false,true)">库存</span>
              </div>
              <div class="handle-box" v-if="batchOperation">
                <a-input-number style="width: 180px;" v-model="setNum" id="inputNumber" :min="handlePrice ? 0.01 : 0" :step="handlePrice ? 0.01 : 1" :max="handlePrice ? 9999999 : 10000000"/>
                <div class="handle-box">
                  <span class="batch-btn" @click="batchOperationSet">保存</span>
                  <span class="batch-btn" @click="chooseSet(false,false,false)">取消</span>
                </div>
              </div>
            </div>
          </a-form-item>

          <a-form-item label="库存扣减方法：" :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <span>拍下减库存</span>
          </a-form-item>
          <a-form-item label="序号：" :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input-number :min="0" style="width:100%" v-decorator="[
                'sort',
                {
                  initialValue: formData.sort
                }
              ]" />
          </a-form-item>
        </div>

        <div v-else>
          <a-form-item label="商品价格：" :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input-number :precision="2" :min="0" style="width:100%" v-decorator="[
                'realPrice',
                {
                  initialValue: formData.realPrice,
                  rules: [
                    { type: 'number', required: true, message: '输入商品价格' }
                  ]
                }
              ]" />
          </a-form-item>

          <a-form-item label="商品原价：" :colon="false" extra="不填写则不显示" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input-number :precision="2" :min="0" style="width:100%" v-decorator="[
                'originalPrice',
                {
                  initialValue: formData.originalPrice
                }
              ]" />
          </a-form-item>

          <a-form-item label="库存扣减方法：" :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <span>拍下减库存</span>
          </a-form-item>

          <a-form-item class="shop_pro_num" label="库存：" :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input-number :precision="0" :min="0" :max="10000000" style="width:100%" v-decorator="[
                'stock',
                {
                  initialValue: formData.stock,
                  rules: [{ required: true, message: '输入库存' }]
                }
              ]" />
          </a-form-item>

          <a-form-item label=" " :colon="false" extra="库存为0是，会放到 <已售罄> 的商品列表里，保存后买家看到的商品可售库存同步更新" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-checkbox-group v-decorator="[
                'showRemainStock',
                {
                  initialValue: formData.showRemainStock ===1?[]:[0],
                }
              ]" style="width: 100%;">
              <a-checkbox :value="0">
                商品详情不显示剩余件数
              </a-checkbox>
            </a-checkbox-group>
          </a-form-item>

          <a-form-item label="序号：" :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input-number :precision="0" :min="0" style="width:100%" v-decorator="[
                'sort',
                {
                  initialValue: formData.sort
                }
              ]" />
          </a-form-item>
        </div>

        <div class="sub-title" v-if="formData.goodsType === 1">物流信息</div>
          <a-form-item v-if="formData.goodsType === 1" label="配送方式：" :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
              快递发货
          </a-form-item>
          <a-form-item v-if="formData.goodsType === 1" label="快递运费：" :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-radio-group v-decorator="[
                'freightType',
                {
                  initialValue: formData.freightType,
                  rules: [{ required: true, message: '请选择运费标准' }]
                }
              ]" @change="changeFreightType">
              <a-row style="display: flex; height: 40px;align-items: center;">
                <a-radio :value="0">统一运费</a-radio>
                <span class="open_date" style="margin-right: 10px;">￥</span>
                <a-form-item class="open_date" v-if="formData.freightType === 0" style="height: 40px;margin-bottom: 0;">
                  <a-input-number :precision="2" class="open_date" :min="0" style="width:176px;" v-decorator="[
                    'standardFreight',
                    {
                      initialValue: formData.standardFreight,
                      rules: [
                        { type: 'number', required: true, message: '输入商品价格' }
                      ]
                    }
                  ]" />
                </a-form-item>
              </a-row>
              <a-row style="display: flex; height: 40px;align-items: center;">
                <a-radio :value="1">运费模板</a-radio>
                <a-form-item class="open_date" v-if="formData.freightType === 1">
                  <a-select style="width: 200px" placeholder="请选择"
                    v-decorator="[
                      'freightTemplate',
                      {
                        initialValue: formData.freightTemplate,
                        rules: [
                          {required: true, message: '请选择运费模板' }
                        ]
                      }
                    ]">
                    <a-select-option v-for="(item,index) in freightList" :key="index" :value="item.id">
                      {{item.name}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-row>
            </a-radio-group>
          </a-form-item>

        <div class="sub-title">其他信息</div>

        <a-form-item label="上架时间：" :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-radio-group
            v-decorator="[
              'upperSheifStatus',
              {
                initialValue: formData.upperSheifStatus,
                rules: [{ required: true, message: '请选择上架时间' }]
              }
            ]" @change="upperSheifStatusChange">
            <a-row style="display: flex; height: 40px;align-items: center;">
              <a-radio :value="0">立即上架售卖</a-radio>
            </a-row>
            <a-row style="display: flex; height: 40px;align-items: center;">
              <a-radio :value="1">自定义上架时间</a-radio>
              <a-form-item v-if="formData.upperSheifStatus === 1" class="open_date" style="height: 40px;margin-bottom: 0;">
                <a-date-picker
                  class="width200"
                  format="YYYY-MM-DD HH:mm:ss"
                  :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
                  v-decorator="[
                    'upperSheifTime',
                    {
                      initialValue: formData.upperSheifTime
                        ? moment(formData.upperSheifTime, 'YYYY-MM-DD HH:mm:ss')
                        : null,
                      rules: [{ required: true, message: '请选择自定义上架时间' }]
                    }
                  ]" />
              </a-form-item>
            </a-row>
            <a-row style="display: flex; height: 40px;align-items: center;">
              <a-radio :value="2">暂不售卖</a-radio>
            </a-row>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="展示：" :colon="false" extra="选择后该商品可在慧云名片内展示（如需使用请开通商城应用）" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-checkbox-group v-decorator="['showCard', { initialValue: [formData.showCard] }]" style="width: 100%;">
            <a-checkbox :value="1">
              在慧云名片内展示
            </a-checkbox>
          </a-checkbox-group>
        </a-form-item>

        <div class="sub-title">购买须知</div>

        <a-form-item v-if="formData.goodsType === 0" label="核销有效期：" :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-radio-group @change="checkTypeChange" v-decorator="[
              'checkType',
              {
                initialValue: formData.checkType,
                rules: [{ required: true, message: '请选择核销有效期类型' }]
              }
            ]">
            <a-row style="display: flex; align-items: center;height: 40px;">
              <a-radio :value="0">指定日期</a-radio>
              <a-form-item v-if="formData.checkType === 0" class="open_date" style="height: 40px;">
                <a-range-picker :disabledDate="disabledDate" v-decorator="[
                    'checkSellDate',
                    {
                      initialValue: checkSellDate,
                      rules: [{ required: true, message: '请选择日期' }]
                    }
                  ]" />
              </a-form-item>
            </a-row>
            <a-row style="display: flex; align-items: center;height: 40px;">
              <a-radio :value="1">相对日期</a-radio>
              <div v-if="formData.checkType === 1" style="display: flex; align-items: center;height: 40px;">
                购买
                <a-form-item style="margin-bottom: 0;height: 40px;">
                  <a-input-number style="margin: 0 5px;" :min="0" v-decorator="[
                      'checkRelativeDay',
                      {
                        initialValue: formData.checkRelativeDay,
                        rules: [{ required: true, message: '请输入天数' }]
                      }
                    ]" />
                </a-form-item>
                天内有效
              </div>
            </a-row>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="规则提醒：" :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="[
              'ruleTip',
              {
                initialValue: formData.ruleTip,
                rules: [{ max: 120, message: '最大可输入120字' }]
              }
            ]" />
        </a-form-item>

        <a-form-item label="温馨提示：" :colon="false" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-textarea v-decorator="[
              'warmTip',
              {
                initialValue: formData.warmTip,
                rules: [{ max: 120, message: '最大可输入120字' }]
              }
            ]" :autosize="{ minRows: 2, maxRows: 6 }" />
        </a-form-item>

        <a-form-item label=" " :colon="false" :label-col="{ span: 15 }" :wrapper-col="{ span: 9 }">
          <a-button @click="save(1)" :loading="saveLoading">保存并查看</a-button>
          <a-button class="next-step" type="primary" @click="save(2)" :loading="saveLoading">下一步</a-button>
        </a-form-item>
      </a-form>
    </a-spin>

  </div>
</template>

<script>
import api from "@/api/user";
import moment from "moment";
import utils from "@/util/common";
export default {
  props: ["goodsId"],
  data() {
    return {
      form: this.$form.createForm(this, { name: "save" }),
      info: {},
      infoLoading: false,
      groupArr: [],
      groupLoading: false,
      tagArr: [],
      tagLoading: false,
      freightList: [], // 运费模板
      freightLoading: false, // 运费模板列表获取loading
      infoFirst: true, // 是否是第一次进入该页面并且获取多规格信息
      skuChanged: 0,
      batchOperation: false, // 多规格批量设置按钮显示
      setNum: 0, // 批量设置的价格
      handlePrice: false, // 批量设置价格
      handleNum: false, // 批量设置库存
      saveLoading: false, // 保存按钮loading
      inGoodsSpecList: [], // 编辑时初次传入的多规格商品列表用作更改规格对比
      LastGoodsSpecList: [], // 上一次的规格列表数据
      formData: {
        goodsName: "",
        shareDesc: "",
        realPrice: "",
        originalPrice: "",
        stock: "",
        showRemainStock: 1,
        sort: "",
        upperSheifStatus: 0,
        upperSheifTime: "",
        showCard: 0,
        checkType: "",
        checkSellStartDate: "",
        checkSellEndDate: "",
        checkRelativeDay: "",
        ruleTip: "",
        warmTip: "",
        type: 0, // 0创建 1编辑
        hasSpec: 0, // 商品规格
        goodsType: 1, // 商品类型
        groupIds: [], // 商品分组
        tagIds: [], // 商品标签
        freightType: 0, //快递运费类型
        standardFreight: 0, // 运费价格
        freightTemplate: null, // 运费模板id
        goodsAttrList: [
          {
            attrKeyName: '',
            ifTop: 1,
            valueList: [
              {
                attrValueName: ''
              },
              {
                attrValueName: ''
              }
            ]
          }
        ],
        goodsSpecList: []
      },
      tableColumns: [{
          align: "center",
          dataIndex: "actualPrice",
          key: "actualPrice",
          slots: { title: 'actualPriceT' },
          scopedSlots: { customRender: "actualPrice" },
          width: 120
        },
        {
          align: "center",
          dataIndex: "num",
          key: "num",
          slots: { title: 'numT' },
          scopedSlots: { customRender: "num" },
          width: 120
        },
        {
          align: "center",
          dataIndex: "costPrice",
          key: "costPrice",
          slots: { title: 'costPriceT' },
          scopedSlots: { customRender: "costPrice" },
          width: 120
        },],
      fileList: [],
      checkSellDate: []
    };
  },
  created() {
    if (this.goodsId) {
      this.getInfo();
    }
    this.getGroupList();
    this.getLabelList();
    this.getFreightList();
  },
  methods: {
    moment,
    beforeImg(file) {
      if (this.fileList.length >= 10) {
        this.$message.error("最多上传10张");
        return false;
      }
      return utils.beforeUploadLimit(file);
    },
    getGroupList() {
      let data = {};
      this.groupLoading = true;
      api
        .ajax({
          data,
          method: "listGroupForGoods"
        })
        .then(res => {
          const data = res.data.data;
          this.groupArr = data.list;
          this.groupLoading = false;
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    getLabelList() {
      let data = {};
      this.tagLoading = true;
      api
        .ajax({
          data,
          method: "listTagForGoods"
        })
        .then(res => {
          const data = res.data.data;
          this.tagArr = data.list;
          this.tagLoading = false;
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    getFreightList() { //获取运费模板列表
      this.freightLoading = true;
      api
        .ajax({
          data: {},
          method: "listFreightTemplate"
        })
        .then(res => {
          const data = res.data.data;
          this.freightList = data;
          console.log('-----运费模板列表----', this.freightList)
          this.freightLoading = false;
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    getInfo() {
      this.infoLoading = true;
      api
        .ajax({
          data: { goodsId: this.goodsId },
          method: "goodsDetail"
        })
        .then(res => {
          const data = res.data.data;
          this.fileList = [];
          this.fileList.push(data.mainPic);
          this.fileList = this.fileList.concat(data.noMainPics);
          this.checkSellDate = [];
          if (data.checkSellStartDate && data.checkSellEndDate) {
            this.checkSellDate = [
              moment(data.checkSellStartDate),
              moment(data.checkSellEndDate)
            ];
          }
          this.formData = {
            goodsName: data.goodsName,
            shareDesc: data.shareDesc,
            realPrice: data.realPrice,
            originalPrice: data.originalPrice,
            stock: data.stock,
            showRemainStock: data.showRemainStock,
            sort: data.sort,
            upperSheifStatus: data.upperSheifStatus,
            upperSheifTime: data.upperSheifTime,
            showCard: data.showCard,
            checkType: data.checkType,
            checkSellStartDate: data.checkSellStartDate,
            checkSellEndDate: data.checkSellEndDate,
            checkRelativeDay: data.checkRelativeDay,
            ruleTip: data.ruleTip,
            warmTip: data.warmTip,
            type: 1,
            goodsId: this.goodsId,
            groupIds: data.groupIds,
            tagIds: data.tagIds,
            goodsType: data.goodsType,
            hasSpec: data.hasSpec,
            freightType: data.freightType,
            standardFreight: data.standardFreight,
            freightTemplate: data.freightTemplate,
            goodsSpecList: data.attrAndSkuList ? data.attrAndSkuList.skuList : [],
            goodsAttrList: data.attrAndSkuList ? data.attrAndSkuList.attrList: []
          };
          this.inGoodsSpecList = data.attrAndSkuList ? data.attrAndSkuList.skuList : [];
          console.log(this.formData, '---------------formData-------------------')
          this.infoLoading = false;
        })
        .catch(error => {
          console.log("error", error);
        });
    },

    disabledDate(current) {
      return current && current < moment().startOf("day");
    },
    disabledDateTime() {
      return {
        // disabledHours: () => this.range(0, 24).splice(4, 20),
        // disabledMinutes: () => this.range(30, 60),
        // disabledSeconds: () => [55, 56]
      };
    },
    range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },
    imgChange(info, item) {
      // console.log(info, item)
      if (info.file.status === "done") {
        this.fileList = this.fileList.map((it) => {
          if(it === item) {
            return info.file.response.data[0]
          } else {
            return it
          }
        })
        this.form.setFieldsValue({ fileList: this.fileList });
      } else if (info.file.status === "error") {
        this.$message.error(info.file.response.message);
      }
    },
    imgAdd(info) {
      if (info.file.status === "done") {
        this.fileList.push(info.file.response.data[0]);
        this.form.setFieldsValue({ fileList: this.fileList });
      } else if (info.file.status === "error") {
        this.$message.error(info.file.response.message);
      }
    },
    deleteImg(idx) {
      this.fileList.splice(idx, 1);
      this.form.setFieldsValue({ fileList: this.fileList });
    },
    upperSheifStatusChange(e) {
      this.formData.upperSheifStatus = e.target.value;
    },
    checkTypeChange(e) {
      this.formData.checkType = e.target.value;
    },

    save(num) {
      this.form.validateFields((err, values) => {
        console.log('---values---',values, '-----goodsAttrList----',this.formData.goodsAttrList, "----goodsSpecList----",this.formData.goodsSpecList, "----skuChanged----",this.skuChanged)
        if (!err) {
          // this.saveLoading=true;
          let data = {
            goodsName: values.goodsName,
            shareDesc: values.shareDesc,
            realPrice: values.realPrice,
            originalPrice: values.originalPrice,
            stock: values.stock,
            mainPic: this.fileList[0],
            noMainPics: this.fileList.slice(1),
            showRemainStock: 1,
            sort: values.sort,
            upperSheifStatus: values.upperSheifStatus,
            showCard: 0,
            checkType: values.checkType,
            checkRelativeDay: values.checkRelativeDay,
            ruleTip: values.ruleTip,
            warmTip: values.warmTip,
            goodsType: values.goodsType,
            groupIds: values.groupIds,
            tagIds: values.tagIds,
            freightType: values.freightType,
            standardFreight: values.standardFreight,
            freightTemplate: values.freightTemplate,
            skuChanged: this.skuChanged,
            hasSpec: values.hasSpec || 0
          };
          if (
            values.showRemainStock &&
            values.showRemainStock.indexOf(0) !== -1
          ) {
            data.showRemainStock = 0;
          }

          if (values.showCard.indexOf(1) != -1) {
            data.showCard = 1;
          }
          if (values.upperSheifStatus === 1) {
            data.upperSheifTime = values.upperSheifTime.format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          if (values.checkType === 0 && values.checkSellDate.length == 2) {
            data.checkSellEndDate = values.checkSellDate[1].format(
              "YYYY-MM-DD"
            );
            data.checkSellStartDate = values.checkSellDate[0].format(
              "YYYY-MM-DD"
            );
          }
          if (values.hasSpec === 1) {
            let finalGoodsSpecList = this.formData.goodsSpecList.map((item,index) => {
              return {
                ...item,
                actualPrice: values[`actualPrice${index}`],
                num: values[`num${index}`],
                costPrice: values[`costPrice${index}`]
              }
            })
            if (this.goodsId) { // 编辑情况下需要把之前有的没变动的规格数据附上id字段
              console.log('---------this.inGoodsSpecList',this.inGoodsSpecList)
              data.spec = {
                goodsAttrList: this.formData.goodsAttrList,
                goodsSpecList: finalGoodsSpecList.map((item) => {
                  let newItem = item
                  this.inGoodsSpecList.forEach((itIn) => {
                    if(itIn.specifications === item.specifications) {
                      newItem.skuId = itIn.id
                    }
                  });
                  return newItem
                })
              }
            } else {
              data.spec = {
                goodsAttrList: this.formData.goodsAttrList,
                goodsSpecList: finalGoodsSpecList
              }
            }
          }
          console.log('----data---',data, '----formData----',this.formData)
          if (this.goodsId) {
            data.detailPic = this.info.detailPic;
            data.type = 1;
            data.goodsId = this.goodsId;
            api
              .ajax({
                data,
                method: "createOrEditGoods"
              })
              .then(res => {
                this.saveLoading=false;
                if (num == 1) {
                  this.$emit("changeStep", 3);
                } else if (num == 2) {
                  this.$emit("changeStep", 2);
                }
              })
              .catch(error => {
                this.saveLoading=false;
                console.log("error", error);
              });
          } else {
            api
              .ajax({
                data: {},
                method: "obtainFutureGoodsId"
              })
              .then(res => {
                data.type = 0;
                data.goodsId = res.data.data;
                api
                  .ajax({
                    data,
                    method: "createOrEditGoods"
                  })
                  .then(res => {
                    this.saveLoading=false;
                    if (num == 1) {
                      this.$emit("changeId", res.data.data);
                      this.$emit("changeStep", 3);
                    } else if (num == 2) {
                      this.$emit("changeId", res.data.data);
                      this.$emit("changeStep", 2);
                    }
                  })
                  .catch(error => {
                    this.saveLoading=false;
                    console.log("error", error);
                  });
              })
              .catch(() => {
                console.log("error");
              });
          }
        }
      });
    },
    changeGoodsType(e) {
      console.log(e.target.value)
      this.formData.goodsType = e.target.value
      if(e.target.value === 0) {
        this.formData.hasSpec = 0
      }
    },
    changeSpec(e) { // 切换商品规格
      console.log(e.target.value);
      const value = e.target.value;
      this.formData.hasSpec = value
      if (value === 1) {
        this.formData.goodsAttrList=[
          {
            attrKeyName: '',
            ifTop: 1,
            valueList: [
              {
                attrValueName: ''
              },
              {
                attrValueName: ''
              }
            ]
          },
        ]
      }
      this.skuChang()
    },
    addGoodsAttr() { // 添加商品规格
      const { form } = this;
      let goodsAttrList = this.formData.goodsAttrList;
      let flag = false;
      console.log(goodsAttrList)
      if (goodsAttrList.length >= 3) {
        this.$message.info('最多可添加3种不同规格');
        return;
      }
      for (let i = 0; i < goodsAttrList.length; i++) {
        if (!goodsAttrList[i].attrKeyName) {
          flag = true;
        }
        for(let j = 0; j < goodsAttrList[i].valueList.length; j++) {
          if (!goodsAttrList[i].valueList[j].attrValueName) {
            flag = true;
          }
        }
      }
      if(flag) {
        this.$message.info('请先完成已添加的规格后再操作');
        return;
      }
      let obj = {
        attrKeyName: '',
        valueList: [
          {
            attrValueName: ''
          },{
            attrValueName: ''
          },
        ]
      }
      goodsAttrList.push(obj);
      this.formData.goodsAttrList = goodsAttrList;
      this.skuChang()
    },
    deleteGoodsAttr(index) { // 删除商品规格
      console.log(index, this.formData.goodsAttrList);
      let newGoodsAttrList = this.formData.goodsAttrList;
      newGoodsAttrList.splice(index, 1)
      console.log(newGoodsAttrList)
      this.formData.goodsAttrList = newGoodsAttrList;
      let obj = {};
      for (let i = 0; i < newGoodsAttrList.length; i++) {
        obj['attrKeyName' + i] = newGoodsAttrList[i].attrKeyName;
        for (let j = 0; j < newGoodsAttrList[i].valueList.length; j++) {
          obj['attrKeyName' + i + 'attrValueName' + j] = newGoodsAttrList[i].valueList[j].attrValueName;
        }
      }
      console.log(obj)
      this.form.setFieldsValue(obj);
      this.skuChang()
    },
    addAttrValueName(index) { // 添加规格值
      const { form } = this;
      let goodsAttrList = this.formData.goodsAttrList;
      console.log(goodsAttrList)
      if(goodsAttrList[index].valueList.length > 9) {
        this.$message.info('最多添加十个规格值');
        return;
      }
      this.formData.goodsAttrList[index].valueList.push({
        attrValueName: ''
      })
      this.skuChang()
    },
    deleteAttrValueName(index, ind) { // 删除规格值
      let newGoodsAttrList = this.formData.goodsAttrList.map((item1, index1) => {
        if(index1 === index) {
          let newItem = item1;
          newItem.valueList.splice(ind, 1)
          return newItem
        } else {
          return item1
        }
      })
      let obj = {};
      for (let i = 0; i < newGoodsAttrList.length; i++) {
        obj['attrKeyName' + i] = newGoodsAttrList[i].attrKeyName;
        for (let j = 0; j < newGoodsAttrList[i].valueList.length; j++) {
          obj['attrKeyName' + i + 'attrValueName' + j] = newGoodsAttrList[i].valueList[j].attrValueName;
        }
      }
      this.form.setFieldsValue(obj);
      this.skuChang()
    },
    changeAttrKeyName(e, index){ // 商品规格名失去焦点，校验加给formdata赋值
      let value = e.target.value.replace(/\s/g, '');
      for (let i = 0; i < this.formData.goodsAttrList.length; i++) {
        if (value === this.formData.goodsAttrList[i].attrKeyName.replace(/\s/g, '') && index !== i) {
          this.$message.error('规格名重复');
          e.target.value= ''
          value = ''
        }
      }
      this.formData.goodsAttrList = this.formData.goodsAttrList.map((item1, index1) => {
        if (index === index1) {
          return {
            ...item1,
            attrKeyName: value
          }
        } else {
          return item1
        }
      })
      this.skuChang()
      // console.log(value, this.formData.goodsAttrList)
    },
    changeAttrValueName(e, index, ind) { // 规格值失去焦点，校验加给formdata赋值
      console.log(e.target.value, index, ind);
      let value = e.target.value.replace(/\s/g, '');
      for (let i = 0; i < this.formData.goodsAttrList[index].valueList.length; i++) {
        if (value!=='' && value === this.formData.goodsAttrList[index].valueList[i].attrValueName.replace(/\s/g, '') && ind !== i) {
          this.$message.error('规格值重复');
          e.target.value = '';
          value = ''
        }
      }
      this.formData.goodsAttrList = this.formData.goodsAttrList.map((item1, index1) => {
        if (index === index1) {
          let newItem = item1 ;
          newItem.valueList = newItem.valueList.map((item2,index2) => {
            return index2 === ind ? {...item2, attrValueName: value} : item2
          })
          return newItem
        } else {
          return item1
        }
      })
      console.log(value, this.formData.goodsAttrList)
      this.skuChang()
    },
    dealtableColumns(goodsAttrList) {
      const rightColumns = [
        {
          align: "center",
          dataIndex: "actualPrice",
          key: "actualPrice",
          slots: { title: 'actualPriceT' },
          scopedSlots: { customRender: "actualPrice" },
          width: 120
        },
        {
          align: "center",
          dataIndex: "num",
          key: "num",
          slots: { title: 'numT' },
          scopedSlots: { customRender: "num" },
          width: 120
        },
        {
          align: "center",
          dataIndex: "costPrice",
          key: "costPrice",
          slots: { title: 'costPriceT' },
          scopedSlots: { customRender: "costPrice" },
          width: 120
        },
      ]
      let leftColumns = []
      if(goodsAttrList.length === 1) {
        leftColumns.push({
          title: goodsAttrList[0].attrKeyName,
          align: "center",
          dataIndex: goodsAttrList[0].attrKeyName,
          key: 0,
          scopedSlots: { customRender: 0 },
        })
      } else if(goodsAttrList.length === 2) {
        goodsAttrList.forEach((item, index) => {
          leftColumns.push({
            title: goodsAttrList[index].attrKeyName,
            align: "center",
            dataIndex: index,
            key: index,
            scopedSlots: { customRender: index },
            customRender: (text, row, ind) => {
              const obj = {
                children: row[(this.formData.goodsAttrList[index] || {}).attrKeyName],
                attrs: {},
              };
              if (index === 0) {
                if (ind % goodsAttrList[index + 1].valueList.length === 0 || ind === 0) {
                  obj.attrs.rowSpan = goodsAttrList[index + 1].valueList.length;
                } else {
                  obj.attrs.rowSpan = 0;
                }
              }
              return obj;
            },
          })
        })
      } else if (goodsAttrList.length === 3) {
        goodsAttrList.forEach((item, index) => {
          leftColumns.push({
            title: goodsAttrList[index].attrKeyName,
            align: "center",
            dataIndex: index,
            key: index,
            scopedSlots: { customRender: index },
            customRender: (text, row, ind) => {
              const obj = {
                children: row[(this.formData.goodsAttrList[index] || {}).attrKeyName],
                attrs: {},
              };
              if (index === 0) {
                if (ind % (goodsAttrList[index + 1].valueList.length * goodsAttrList[index + 2].valueList.length) === 0 || ind === 0) {
                  obj.attrs.rowSpan = goodsAttrList[index + 1].valueList.length * goodsAttrList[index + 2].valueList.length;
                } else {
                  obj.attrs.rowSpan = 0;
                }
              } else if (index === 1) {
                if (ind % goodsAttrList[index + 1].valueList.length === 0 || ind === 0) {
                  obj.attrs.rowSpan = goodsAttrList[index + 1].valueList.length;
                } else {
                  obj.attrs.rowSpan = 0;
                }
              }
              return obj;
            },
          })
        })
      }
      console.log('这是动态新加的列',leftColumns)
      return leftColumns.concat(rightColumns)
    },
    skuChang() {
      this.skuChanged = 1; //是多规格模块是否编辑过
    },
    changeFreightType(e) { // 运费类型
      this.formData.freightType = e.target.value;
    },
    chooseSet(b1,b2,b3) { // 多规格批量设置类型选择
      this.batchOperation = b1;
      this.handlePrice=b2;
      this.handleNum=b3;
      this.setNum = b2 ? 0.01 : 0
    },
    batchOperationSet() { //多规格价格批量设置
      let obj = {};
      for (let i = 0; i < this.formData.goodsSpecList.length; i++) {
          if (this.handlePrice) {
            obj['actualPrice' + i] = this.setNum;
          } else {
            obj['num' + i] = this.setNum;
          }
        }
        let newLastGoodsSpecList = this.LastGoodsSpecList.map((item, ind) => {
          if(this.handlePrice) {
            return {
              ...item,
              actualPrice: this.setNum
            }
          } else {
            return {
              ...item,
              num: this.setNum
            }
          }
        });
        this.LastGoodsSpecList = newLastGoodsSpecList;
        this.formData.goodsSpecList = newLastGoodsSpecList;
        this.form.setFieldsValue(obj);
        this.setNum = 0;
        this.batchOperation = false;
        this.handlePrice = false;
        this.handleNum = false;
        this.skuChang();
    },
    changeInput(value, target, index) {
      this.skuChang()
      console.log(value, target, index);
      let newList = this.LastGoodsSpecList.map((item, ind) => {
        if(ind === index) {
          return {
            ...item,
            [target]: value
          }
        } else {
          return item
        }
      });
      this.LastGoodsSpecList = newList;
      this.formData.goodsSpecList = newList;
    }
  },
  watch: {
    "formData.goodsAttrList": {//深度监听，可监听到对象、数组的变化
      handler(val, oldVal){
        console.log(val, oldVal);
        const goodsAttrList = val;
        let goodsSpecList = [];
        if (this.infoFirst && this.goodsId) { //编辑情况第一次渲染要给默认数据到表格中
          if (goodsAttrList.length === 1) {
            for (var i = 0; i < goodsAttrList[0].valueList.length; i++) {
              let oriObj = {};
              oriObj[goodsAttrList[0].attrKeyName] = goodsAttrList[0].valueList[i].attrValueName;
              oriObj.actualPrice = 0.01;
              oriObj.num = 0;
              oriObj.costPrice = 0;
              oriObj.specifications = JSON.stringify({
                [goodsAttrList[0].attrKeyName]: goodsAttrList[0].valueList[i].attrValueName
              })
              goodsSpecList.push(oriObj)
            }
          } else if (goodsAttrList.length === 2) {
            for (var i = 0; i < goodsAttrList[0].valueList.length; i++) {
              for (var j = 0; j < goodsAttrList[1].valueList.length; j++) {
                let oriObj = {}
                oriObj.actualPrice = 0.01;
                oriObj.num = 0;
                oriObj.costPrice = 0;
                oriObj[goodsAttrList[0].attrKeyName] = goodsAttrList[0].valueList[i].attrValueName;
                oriObj[goodsAttrList[1].attrKeyName] = goodsAttrList[1].valueList[j].attrValueName;
                oriObj.specifications = JSON.stringify({
                  [goodsAttrList[0].attrKeyName]: goodsAttrList[0].valueList[i].attrValueName,
                  [goodsAttrList[1].attrKeyName]: goodsAttrList[1].valueList[j].attrValueName
                })
                goodsSpecList.push(oriObj);
              }
            }
          } else if (goodsAttrList.length === 3) {
            for (var i = 0; i < goodsAttrList[0].valueList.length; i++) {
              for (var j = 0; j < goodsAttrList[1].valueList.length; j++) {
                for (var k = 0; k < goodsAttrList[2].valueList.length; k++) {
                  let oriObj = {}
                  oriObj.actualPrice = 0.01;
                  oriObj.num = 0;
                  oriObj.costPrice = 0;
                  oriObj[goodsAttrList[0].attrKeyName] = goodsAttrList[0].valueList[i].attrValueName;
                  oriObj[goodsAttrList[1].attrKeyName] = goodsAttrList[1].valueList[j].attrValueName;
                  oriObj[goodsAttrList[2].attrKeyName] = goodsAttrList[2].valueList[k].attrValueName;
                  oriObj.specifications = JSON.stringify({
                    [goodsAttrList[0].attrKeyName]: goodsAttrList[0].valueList[i].attrValueName,
                    [goodsAttrList[1].attrKeyName]: goodsAttrList[1].valueList[j].attrValueName,
                    [goodsAttrList[2].attrKeyName]: goodsAttrList[2].valueList[k].attrValueName
                  })
                  goodsSpecList.push(oriObj);
                }
              }
            }
          }
          goodsSpecList = goodsSpecList.map((item, index) => {
            return {
              ...item,
              actualPrice: this.formData.goodsSpecList[index].actualPrice,
              num: this.formData.goodsSpecList[index].num,
              costPrice: this.formData.goodsSpecList[index].costPrice
            }
          })
          this.LastGoodsSpecList = goodsSpecList;
        } else {
          if (goodsAttrList.length === 1) {
            for (var i = 0; i < goodsAttrList[0].valueList.length; i++) {
              let oriObj = {};
              oriObj[goodsAttrList[0].attrKeyName] = goodsAttrList[0].valueList[i].attrValueName;
              oriObj.actualPrice = 0.01;
              oriObj.num = 0;
              oriObj.costPrice = 0;
              oriObj.specifications = JSON.stringify({
                [goodsAttrList[0].attrKeyName]: goodsAttrList[0].valueList[i].attrValueName
              })
              goodsSpecList.push(oriObj)
            }
          } else if (goodsAttrList.length === 2) {
            for (var i = 0; i < goodsAttrList[0].valueList.length; i++) {
              for (var j = 0; j < goodsAttrList[1].valueList.length; j++) {
                let oriObj = {}
                oriObj.actualPrice = 0.01;
                oriObj.num = 0;
                oriObj.costPrice = 0;
                oriObj[goodsAttrList[0].attrKeyName] = goodsAttrList[0].valueList[i].attrValueName;
                oriObj[goodsAttrList[1].attrKeyName] = goodsAttrList[1].valueList[j].attrValueName;
                oriObj.specifications = JSON.stringify({
                  [goodsAttrList[0].attrKeyName]: goodsAttrList[0].valueList[i].attrValueName,
                  [goodsAttrList[1].attrKeyName]: goodsAttrList[1].valueList[j].attrValueName
                })
                goodsSpecList.push(oriObj);
              }
            }
          } else if (goodsAttrList.length === 3) {
            for (var i = 0; i < goodsAttrList[0].valueList.length; i++) {
              for (var j = 0; j < goodsAttrList[1].valueList.length; j++) {
                for (var k = 0; k < goodsAttrList[2].valueList.length; k++) {
                  let oriObj = {}
                  oriObj.actualPrice = 0.01;
                  oriObj.num = 0;
                  oriObj.costPrice = 0;
                  oriObj[goodsAttrList[0].attrKeyName] = goodsAttrList[0].valueList[i].attrValueName;
                  oriObj[goodsAttrList[1].attrKeyName] = goodsAttrList[1].valueList[j].attrValueName;
                  oriObj[goodsAttrList[2].attrKeyName] = goodsAttrList[2].valueList[k].attrValueName;
                  oriObj.specifications = JSON.stringify({
                    [goodsAttrList[0].attrKeyName]: goodsAttrList[0].valueList[i].attrValueName,
                    [goodsAttrList[1].attrKeyName]: goodsAttrList[1].valueList[j].attrValueName,
                    [goodsAttrList[2].attrKeyName]: goodsAttrList[2].valueList[k].attrValueName
                  })
                  goodsSpecList.push(oriObj);
                }
              }
            }
          }
          console.log('---------goodsSpecList', goodsSpecList, this.LastGoodsSpecList)
          goodsSpecList = goodsSpecList.map((item, index) => {
            let newItem = item;
            this.LastGoodsSpecList.forEach((itIn) => {
              if (item.specifications === itIn.specifications) {
                newItem = {
                  ...newItem,
                  actualPrice: itIn.actualPrice,
                  num: itIn.num,
                  costPrice: itIn.costPrice
                }
              }
            })
            return newItem
          })
        }
        this.infoFirst = false
        this.tableColumns = this.dealtableColumns(val)
        this.formData.goodsSpecList = goodsSpecList
        this.LastGoodsSpecList = goodsSpecList
        goodsSpecList.forEach((item, index) => {
          this.form.setFieldsValue({
            [`actualPrice${index}`]: item.actualPrice,
            [`num${index}`]: item.num,
            [`costPrice${index}`]: item.costPrice
          })
        })

        console.log('规格数组字段goodsAttrList',val,'goodsSpecList',goodsSpecList, 'infoFirst', this.infoFirst)
      },
      deep:true
    }
  },
};
</script>

<style lang="less" scoped>
.goodsedit01__Box {
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
      background: url("../../assets/images/_bg01.png") no-repeat right center;
      background-size: 24px 38px;
      background-color: #76b0de;
    }
    .step {
      background-color: #f3f4f8;
      color: rgba(106, 105, 110, 1);
    }
  }
  .step__form {
    background-color: #ffffff;
    padding-top: 20px;
  }
  .sub-title {
    padding: 10px 0 10px 20px;
    border-bottom: 1px solid rgba(222, 222, 222, 1);
    font-size: 16px;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 20px;
  }
  .proType {
    width: 130px;
    height: 50px;
    // border: 1px solid rgba(222, 222, 222, 1);
    text-align: center;
    font-size: 0;
    cursor: pointer;
    user-select: none;
    position: absolute;
    top: 0;
    left: 0;
    div {
      font-size: 12px;
      color: rgba(51, 51, 51, 1);
      line-height: 28px;
    }
    span {
      display: inline-block;
      vertical-align: top;
      font-size: 10px;
      line-height: 16px;
      color: #939393;
    }
  }
  .proType-sele {
    background: #1890ff;
    color: #fff;
  }
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
      cursor: pointer;
    }
  }
  .shop_pro_num {
    margin-bottom: 0;
  }
  .open_date {
    display: inline-block;
    margin-bottom: 0;
  }
  .next-step {
    margin-left: 20px;
  }
  .width200 {
    width: 200px;
  }

  .attrList-content {
    border-radius: 8px;
    padding: 20px 0 5px 0;
    margin-bottom: 20px;
    background: #f5f5f5;
    position: relative;
    .rule-box {
      position: relative;
      .rule-label {
        flex-shrink: 0;
        margin-right: 10px;
      }
    }
    .close-icon {
      font-size: 14px;
      position: absolute;
      top: -7px;
      right: -7px;
      // color: #d9d9d9;
      cursor: pointer;
      user-select: none;
      background: transparent;
      z-index: 10;
    }
  }
  .page_table_product_edit {
    background-color: #fff;
    td {
      background: #fff !important;
    }
    // .ant-table-row.ant-table-row-level-0:nth-child(odd) {
    //   background-color: #f7f8fa;
    // }
  }
  .batch-operation-box {
    width: 400px;
    display: flex;
    align-items: center;
    margin-top: 20px;
    .handle-box {
      margin-left: 10px;
      display: flex;
      align-items: center;
      .batch-btn {
        color: #1890ff;
        cursor: pointer;
        user-select: none;
        margin-right: 10px;
      }
    }
  }
  .open_date {
    display: inline-block;
    margin-bottom: 0;
  }
}
</style>
<style lang="less">
  .xiangd-time .ant-form-explain{
    position: absolute;
    bottom:-20px;
    left:5px;
  }
</style>
