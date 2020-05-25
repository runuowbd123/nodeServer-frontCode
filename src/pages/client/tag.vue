<template>
  <div class="client-list">
    <div class="search__Box">
      <TableSearchForm @handleSubmit="searchFun" :formList="searchFormList" />
    </div>
    <div class="page_btn">
      <a-button type="primary" @click="addTag" v-if="$permission.hasPermission('CUSTOMER_LABEL_EDIT')">新建标签</a-button>
    </div>

    <div class="page_table">
      <a-table :rowClassName="(rec,index) => index % 2 === 0 ? 'jishu' : 'oushu'"
        :bordered="false"
        :pagination="false"
        :columns="columns"
        :dataSource="listData"
        :rowKey="record => record.id"
      >
        <div slot="type" slot-scope="text">
          <div v-if="text === 1">
            自动标签
          </div>
          <div v-else>
            手动标签
          </div>
        </div>
        <div slot="condition" slot-scope="text, record">
          <div v-if='record.type === 0'>
            -
          </div>
          <div v-else>
            <a href="javascript:;" @click="viewDetail(record)">
              查看详情
            </a>
          </div>
        </div>
        <div slot="action" slot-scope="text, record, index">
          <a href="javascript:;" @click="editTag(record.id)" style="margin-right: 10px">编辑</a>
          <a href="javascript:;" @click="deleteTag(record, index)">删除</a>
        </div>
      </a-table>
    </div>

    <div class="page_pagination">
      <a-pagination
        showQuickJumper
        showSizeChanger
        :total="pager.total"
        v-model="pager.currentPage"
        @change="paginationChange"
        :pageSize="pager.pageSize"
        @showSizeChange="onShowSizeChange"
        :pageSizeOptions="pager.pageSizeOptions"
        :showTotal="total => `共有 ${pager.total} 条/${pager.totalPage}页`"
      />
    </div>
  </div>
</template>
<script>
import api from "@/api/user";
import moment from "moment";
import TableSearchForm from "@/components/TableSearchForm";
export default {
  components: {
    TableSearchForm
  },
  data() {
    return {
      inputVal: null,
      tagType: 'null',
      listData: [],
      detailModal: false,
      detailDataList: [],
      pager: {
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        currentPage: 1,
        pageSize: 10,
        total: 1,
        totalPage: 1
      },
      searchField: {},
      searchFormList: [
        {
          type: "select",
          name: "type",
          label: "标签类型",
          allowClear: true,
          child: [
            {
              name: "自动标签",
              value: 1
            },
            {
              name: "手动标签",
              value: 0
            }
          ]
        },
        {
          type: "input",
          name: "name",
          label: "标签名"
        },
      ]
    };
  },
  computed: {
    columns() {
      let columns = [
        {
          title: "标签名",
          // align: "center",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "客户",
          dataIndex: "customerCount",
          key: "customerCount",
          align: "center",
        },
        {
          title: "标签类型",
          dataIndex: "type",
          key: "type",
          scopedSlots: { customRender: "type" }
        },
        {
          title: "打标条件",
          dataIndex: "condition",
          key: "condition",
          scopedSlots: { customRender: "condition" }
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          scopedSlots: { customRender: "action" }
        }
      ];
      if(!this.$permission.hasPermission('CUSTOMER_LABEL_EDIT')) {
        columns = columns.filter((item) => {
          return item.title !== '操作'
        })
      }
      return columns;
    }
  },
  created() {
    this.getList()
  },
  methods: {
    addTag() {
      this.$router.push({path: '/client/tagadd'})
    },
    editTag(id) {
      this.$router.push({path: '/client/tagEdit', query: {id, edit: true}})
    },
    changeTagType(val) {
      this.tagType = val;
      this.pager.currentPage = 1;
      this.getList()
    },
    changeInput(e) {
      const { value } = e.target
      this.inputVal = value
    },
    searchFun (values) {
      console.log(values)
      this.searchField = values;
      this.getList()
    },
    getList() {
      let data = {
        ...this.pager,
        ...this.searchField
      };
      console.log(data)
      api
        .ajax({
          data,
          method: "customerTagList"
        })
        .then(res => {
          const data = res.data.data;
          console.log(data)
          this.listData=data.list
          this.pager = {
            ...this.pager,
            pageSizeOptions: ["10", "20", "30", "40", "50"],
            currentPage: data.currentPage,
            pageSize: data.pageSize,
            total: data.totalRecord,
            totalPage: data.totalPage
          };
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    onShowSizeChange(current, pageSize) {
      this.pager.pageSize = pageSize;
      this.pager.currentPage = 1;
      this.getList();
    },
    paginationChange(page, pageSize) {
      this.pager.pageSize = pageSize;
      this.pager.currentPage = page;
      this.getList();
    },
    deleteTag(data) {
      const that = this
      this.$confirm({
        title: '删除',
        content: `是否确认删除 【${data.name}】 标签`,
        onOk() {
          console.log('删除走你', data);
          api
          .ajax({
            data: {
              tagId: data.id
            },
            method: "delCustomerTag"
          })
          .then(res => {
            that.$message.info(res.data.data);
            that.getList()
          })
          .catch(error => {
            console.log("error", error);
          });
        },
        onCancel() {},
      });
    },
    viewDetail(data) {
      this.$info({
        title: '打标详情',
        width: 500,
        content: (
          <div>
            <div>
              满足以下条件即可:
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              {
                data.latelyConsumeStatus === 1
                ? (
                  <div
                    style={{
                      margin: '10px 10px 0 0',
                      border: '1px solid #ccc',
                      padding: '2px 5px',
                      borderRadius: '4px'
                    }}
                  >
                    最后消费时间
                  </div>
                )
                : null
              }
                {
                data.consumeNumberStatus === 1
                ? (
                  <div
                    style={{
                      margin: '10px 10px 0 0',
                      border: '1px solid #ccc',
                      padding: '2px 5px',
                      borderRadius: '4px'
                    }}
                  >
                    累计消费次数
                  </div>
                )
                : null
              }
                {
                data.consumeAmoutStatus === 1
                ? (
                  <div
                    style={{
                      margin: '10px 10px 0 0',
                      border: '1px solid #ccc',
                      padding: '2px 5px',
                      borderRadius: '4px'
                    }}
                  >
                    累计消费金额
                  </div>
                )
                : null
              }
                {
                data.customerUnitPriceStatus === 1
                ? (
                  <div
                    style={{
                      margin: '10px 10px 0 0',
                      border: '1px solid #ccc',
                      padding: '2px 5px',
                      borderRadius: '4px'
                    }}
                  >
                    客单价
                  </div>
                )
                : null
              }
            </div>
          </div>
        ),
        onOk() {},
        onCancel() {},
      });
    }
  }
};
</script>
<style lang="less" scoped>
.client-list {
  .page_btn {
    margin-top: 10px;
    text-align: right;
  }
  .toolbar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
  }
  .page_table {
    margin-top: 15px;
    background-color: #fff;
    .ant-table-thead {
      tr {
        th {
          background-color: #fff;
          padding: 10px 16px;
          .ant-table-column-sorter {
            position: relative;
            top: 0;
            right: 0;
            display: inline-block;
            vertical-align: top;
            margin-top: 2px;
            margin-left: 5px;
          }
        }
      }
    }
    .ant-table-row.ant-table-row-level-0:nth-child(odd) {
      background-color: #f7f8fa;
    }
    .ant-table-body {
      table {
        border: 1px solid #e8e8e8;
        td {
          border-bottom: none;
        }
      }
    }
    .table-img {
      width: 58px;
      height: 58px;
      border-radius: 50%;
    }
  }

  // 分页
  .page_pagination {
    text-align: right;
    margin-top: 15px;
    padding-bottom: 20px;
    .ant-select-dropdown-menu {
      text-align: center;
    }
  }

}
</style>
