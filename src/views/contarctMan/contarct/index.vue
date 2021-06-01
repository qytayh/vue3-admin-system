<template>
  <div class="contractList">
    <a-form layout="inline" :form="form">
      <a-form-item label="工程名称">
        <a-input v-model:value="form.project"> </a-input>
      </a-form-item>
      <a-form-item label="时间范围">
        <a-range-picker v-model:value="form.date"></a-range-picker>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" @click="queryList"> 查询 </a-button>
        <a-button @click="reset" style="margin-left: 15px"> 重置 </a-button>
      </a-form-item>
      <a-button class="add" @click="goAdd"> 新增 </a-button>
    </a-form>
    <a-table
      class="table"
      size="small"
      :columns="columns"
      :dataSource="tableData"
      bordered
      :pagination="pagination"
    >
      <template #operation="{ record }">
        <a-button type="link" @click="detail(record)">详情</a-button>
        <a-button type="link" @click="del(record)">删除</a-button>
      </template>
    </a-table>
    <a-modal
      v-model:visible="dialogs.visible"
      title="创建工程"
      @ok="handleOk"
      width="400px"
      okText="确定"
      cancelText="取消"
    >
      <a-form :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
        <a-form-item ref="project" label="工程名称" name="project">
          <a-input v-model:value="dialogs.models.project" />
        </a-form-item>
        <a-form-item ref="note" label="备注" name="note">
          <a-textarea v-model:value="dialogs.models.note" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { projectList, projectAdd, projectDel } from "@/api/project";
import { dateFormat } from "@/utils/format";
import { message, Modal } from "ant-design-vue";

const columns = [
  {
    title: "工程名称",
    dataIndex: "project",

    slots: { customRender: "project" },
  },
  {
    title: "备注",
    dataIndex: "note",
    slots: { customRender: "note" },
  },
  {
    title: "时间",
    width: "200px",
    dataIndex: "createdAt",
    slots: { customRender: "createdAt" },
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
    const router = useRouter();
    const state = reactive({
      form: {
        project: "",
        date: [],
      },
      dialogs: {
        visible: false,
        models: {
          project: "",
          note: "",
        },
      },
      tableData: [],
    });
    const goAdd = () => {
      state.dialogs = {
        visible: true,
        models: {
          project: "",
          note: "",
        },
      };
    };
    const detail = ({ id }) => {
      router.push({ path: "/contarctMan/contractDetail", query: { id } });
    };
    const del = (val) => {
      Modal.confirm({
        title: "系统提示",
        content: `请确认是否删除${val.project}!!!`,
        okText: "确定",
        cancelText: "取消",
        onOk() {
          projectDel({ id: val.id }).then((res) => {
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
    const queryList = () => {
      projectList(state.form).then((res) => {
        res.data.forEach((item) => {
          item.createdAt = dateFormat("yyyy-MM-dd", new Date(item.createdAt));
        });
        state.tableData = res.data;
      });
    };
    const reset = () => {
      state.form = {
        project: "",
        date: [],
      };
    };
    const handleOk = () => {
      projectAdd(state.dialogs.models).then((res) => {
        if (res.code == 1) {
          message.success("创建成功！");
          state.dialogs.visible = false;
          queryList();
        } else {
          message.error("创建失败");
        }
      });
    };
    onMounted(() => {
      queryList();
    });
    return {
      ...toRefs(state),
      goAdd,
      columns,
      pagination,
      detail,
      queryList,
      reset,
      del,
      handleOk,
    };
  },
});
</script>

<style lang="less" scoped>
.contractList {
  min-width: 800px;
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
