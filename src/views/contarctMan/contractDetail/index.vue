<template>
  <div class="contractDetail">
    <a-button type="danger" @click="edit = true" v-if="!edit">编辑</a-button>
    <a-button type="primary" @click="submitProject" v-if="edit">确定</a-button>
    <a-button style="margin-left: 20px" @click="cancelProject" v-if="edit">取消</a-button>
    <a-row>
      <a-col :span="8">
        <span>工程名称</span><a-input v-model:value="project.project" :disabled="!edit" />
      </a-col>
      <a-col :span="8">
        <span>时间</span>
        <div><a-date-picker v-model:value="project.createdAt" :disabled="!edit" /></div>
      </a-col>
      <a-col :span="8">
        <span>工程总价</span>
        <a-input v-model:value="totalPrice" disabled />
      </a-col>
      <a-col :span="16">
        <span>备注</span><a-input v-model:value="project.note" :disabled="!edit" />
      </a-col>
    </a-row>
    <div style="text-align: right">
      <a-button type="danger" @click="add">新增</a-button>
    </div>
    <a-table
      class="table"
      size="small"
      :columns="columns"
      :dataSource="content"
      bordered
      :pagination="pagination"
    >
      <template #operation="{ record }">
        <a-button type="link" @click="detail(record)">编辑</a-button>
        <a-button type="link" @click="del(record)">删除</a-button>
      </template>
    </a-table>
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
import { message, Modal } from "ant-design-vue";
import {
  projectGet,
  projectEdit,
  contentDel,
  contentEdit,
  contentAdd,
} from "@/api/project";
import { useRoute } from "vue-router";
import { dateFormat } from "@/utils/format";

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
const pagination = {
  pageSize: 10,
  showTotal: (total) => `共 ${total} 条数据`,
};
export default defineComponent({
  setup() {
    const route = useRoute();
    const state = reactive({
      id: route.query.id,
      edit: false,
      project: {},
      content: [],
      totalPrice:'',
      dialogs: {
        visible: false,
        models: {},
      },
    });
    const getDetail = () => {
      projectGet({ id: state.id }).then((res) => {
        const { note, project, createdAt } = res.data;
        state.project = {
          note,
          project,
          createdAt,
        };
        let total = 0
        res.data.content.forEach((item) => {
          total= total+item.totalPrice
          item.invoiceDateText = dateFormat("yyyy-MM-dd", new Date(item.invoiceDate));
        });
        state.totalPrice=total
        state.content = res.data.content;
      });
    };
    onMounted(() => {
      getDetail();
    });
    const cancelProject = () => {
      state.edit = false;
      getDetail();
    };
    const submitProject = () => {
      projectEdit({ ...state.project, id: state.id }).then((res) => {
        if (res.code == 1) {
          message.success("编辑成功！");
          state.edit = false;
          getDetail();
        } else {
          message.error("编辑失败");
        }
      });
    };
    const add = () => {
      state.dialogs = {
        visible: true,
        models: {
          pid: state.id,
          content: "",
          unit: "",
          totalPrice: "",
          contractor: "",
          invoiceNo: "",
          invoiceDate: "",
          iou: "",
          records: "",
          signature: "",
          payWay: "",
          payDesc: "",
          note: "",
        },
      };
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
            getDetail();
          });
        },
        onCancel() {},
      });
    };
    const handleOk = () => {
      if (!state.dialogs.models.id) {
        contentAdd(state.dialogs.models).then((res) => {
          if (res.code == 1) {
            message.success("创建成功！");
            state.dialogs.visible = false;
            getDetail();
          } else {
            message.error("创建失败");
          }
        });
      } else {
        contentEdit(state.dialogs.models).then((res) => {
          if (res.code == 1) {
            message.success("编辑成功！");
            state.dialogs.visible = false;
            getDetail();
          } else {
            message.error("编辑失败");
          }
        });
      }
    };
    return {
      ...toRefs(state),
      cancelProject,
      submitProject,
      pagination,
      columns,
      detail,
      del,
      add,
      handleOk,
    };
  },
});
</script>

<style lang="less" scoped>
.contractDetail {
  min-width: 800px;
  .ant-row {
    .ant-col {
      padding: 5px 8px 0 8px;
    }
  }
  .add {
    float: right;
    margin-top: 3px;
    background: rgb(247, 107, 12);
    border: rgb(247, 107, 12);
    color: #fff;
  }
  .table {
    margin-top: 20px;
  }
}
</style>
