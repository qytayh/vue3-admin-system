<template>
  <div class="contractorDetail">
    <div class="constractor">负责人：{{ name }}</div>
    <div v-for="(v, i) in tableDate" :key="i">
      <div>
        <div class="title">
          {{ v.project }}
        </div>
        <div class="totalPrice">
          总价合计:<span style="color: red">￥{{ v.totalPrice }}</span>
        </div>
        <div>备注：{{ v.note }}</div>
      </div>
      <a-table
        class="table"
        size="small"
        :columns="columns"
        :dataSource="v.contentList"
        bordered
        :pagination="v.pagination"
      >
        <template #operation="{ record }">
          <a-button type="link" @click="detail(record)">详情</a-button>
          <a-button type="link" @click="del(record)">删除</a-button>
        </template>
      </a-table>
    </div>
    <a-modal
      v-model:visible="dialogs.visible"
      title="编辑"
      @ok="handleOk"
      width="800px"
      okText="确定"
      cancelText="取消"
    >
      <a-form :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
        <a-row>
          <a-col :span="12">
            <a-form-item ref="project" label="施工内容" name="project">
              <a-input v-model:value="dialogs.models.content" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item ref="totalPrice" label="总价" name="totalPrice">
              <a-input v-model:value="dialogs.models.totalPrice" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item ref="contractor" label="承包人" name="contractor">
              <a-input v-model:value="dialogs.models.contractor" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item ref="invoiceNo" label="发票号" name="invoiceNo">
              <a-input v-model:value="dialogs.models.invoiceNo" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item ref="invoiceDate" label="发票日期" name="invoiceDate">
              <a-date-picker v-model:value="dialogs.models.invoiceDate" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item ref="iou" label="欠条" name="iou">
              <a-select v-model:value="dialogs.models.iou">
                <a-select-option value="是">是</a-select-option>
                <a-select-option value="否">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item ref="records" label="考勤" name="records">
              <a-select v-model:value="dialogs.models.records">
                <a-select-option value="是">是</a-select-option>
                <a-select-option value="否">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item ref="signature" label="工资签字" name="signature">
              <a-select v-model:value="dialogs.models.signature">
                <a-select-option value="是">是</a-select-option>
                <a-select-option value="否">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item ref="payWay" label="付款方式" name="payWay">
              <a-select v-model:value="dialogs.models.payWay">
                <a-select-option value="现金">现金</a-select-option>
                <a-select-option value="银行卡">银行卡</a-select-option>
                <a-select-option value="私卡">私卡</a-select-option>
                <a-select-option value="华仁代付">华仁代付</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item ref="payDesc" label="付款" name="payDesc">
              <a-input v-model:value="dialogs.models.payDesc" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item ref="note" label="备注" name="note">
              <a-textarea v-model:value="dialogs.models.note" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { contentList, contentDel, contentEdit } from "@/api/project";
import { useRoute } from "vue-router";
import { dateFormat } from "@/utils/format";
import { message, Modal } from "ant-design-vue";

const columns = [
  {
    title: "施工内容",
    dataIndex: "content",
    slots: { customRender: "content" },
  },
  {
    title: "总价",
    dataIndex: "totalPrice",
    slots: { customRender: "totalPrice" },
  },
  {
    title: "承包人",
    dataIndex: "contractor",
    slots: { customRender: "contractor" },
  },
  {
    title: "发票号",
    dataIndex: "invoiceNo",
    slots: { customRender: "invoiceNo" },
  },
  {
    title: "发票日期",
    dataIndex: "invoiceDateText",
    slots: { customRender: "invoiceDateText" },
  },
  {
    title: "欠条",
    dataIndex: "iou",
    slots: { customRender: "iou" },
  },
  {
    title: "考勤",
    dataIndex: "records",
    slots: { customRender: "records" },
  },
  {
    title: "工资签字",
    dataIndex: "signature",
    slots: { customRender: "signature" },
  },
  {
    title: "付款方式",
    dataIndex: "payWay",
    slots: { customRender: "payWay" },
  },
  {
    title: "付款",
    dataIndex: "payDesc",
    slots: { customRender: "payDesc" },
  },
  {
    title: "备注",
    dataIndex: "note",
    slots: { customRender: "note" },
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: "200px",
    slots: { customRender: "operation" },
  },
];

export default defineComponent({
  setup() {
    const route = useRoute();
    const state = reactive({
      name: route.query.name,
      tableDate: [],
      dialogs: {
        visible: false,
        models: {},
      },
    });
    const queryList = () => {
      contentList({ name: state.name }).then((res) => {
        let arr = [];
        let pidList = Array.from(new Set(res.data.map((v) => v.pid)));
        pidList.forEach((v) => {
          let carr = res.data.filter((i) => {
            return v == i.pid;
          });
          let { project } = carr[0];
          let totalPrice = 0;
          let contentList = carr.map((data) => {
            totalPrice = totalPrice + data.totalPrice;
            return {
              id: data.id,
              content: data.content,
              unit: data.unit,
              totalPrice: data.totalPrice,
              contractor: data.contractor,
              invoiceNo: data.invoiceNo,
              invoiceDateText: dateFormat("yyyy-MM-dd", new Date(data.invoiceDate)),
              invoiceDate: data.invoiceDate,
              iou: data.iou,
              records: data.records,
              signature: data.signature,
              payWay: data.payWay,
              payDesc: data.payDesc,
              note: data.note,
            };
          });
          let obj = {
            ...project,
            totalPrice: totalPrice,
            contentList: contentList,
            pagination: {
              pageSize: 10,
              showTotal: (total) => `共 ${total} 条数据`,
            },
          };
          arr.push(obj);
        });
        state.tableDate = arr;
        console.log(state.tableDate);
      });
    };
    const detail = (val) => {
      state.dialogs.models = val;
      state.dialogs.visible = true;
    };
    const del = (val) => {
      Modal.confirm({
        title: "系统提示",
        content: `请确认是否删除这条施工内容!!!`,
        okText: "确定",
        cancelText: "取消",
        onOk() {
          contentDel({ id: val.id }).then((res) => {
            if (res.code) {
              message.success("删除成功！");
            } else {
              message.success("删除失败！");
            }
            queryList();
          });
        },
        onCancel() {},
      });
    };
    const handleOk = () => {
      contentEdit(state.dialogs.models).then((res) => {
        if (res.code == 1) {
          message.success("编辑成功！");
          state.dialogs.visible = false;
          queryList();
        } else {
          message.error("编辑失败");
        }
      });
    };
    onMounted(() => {
      queryList();
    });
    return {
      ...toRefs(state),
      columns,
      detail,
      del,
      handleOk,
    };
  },
});
</script>

<style lang="less" scoped>
.contractorDetail {
  min-width: 800px;
  .constractor {
    font-weight: 600;
    font-size: 24px;
  }
  .totalPrice{
    text-align: right;
  }
  .title {
    text-align: center;
    font-weight: 600;
    font-size: 24px;
  }
}
</style>
