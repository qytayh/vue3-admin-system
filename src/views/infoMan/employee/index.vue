<template>
  <div class="employee">
    <a-form
      layout="inline"
      :model="formState"
      @finish="handleFinish"
      @finishFailed="handleFinishFailed"
    >
      <a-form-item label="姓名">
        <a-input v-model:value="form.name"> </a-input>
      </a-form-item>
      <a-form-item label="电话">
        <a-input v-model:value="form.tel"> </a-input>
      </a-form-item>
      <a-form-item label="身份证">
        <a-input v-model:value="form.num">
          <template #prefix
            ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
          /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" @click="queryList">
          查询
        </a-button>
        <a-button @click="reset" style="margin-left: 15px"> 重置 </a-button>
      </a-form-item>
      <a-form-item class="addBtnGroups">
        <a-button
          type="danger"
          html-type="submit"
          class="addBtn"
          @click="addEmployee"
        >
          添加
        </a-button>
        <a-button type="primary" class="importBtn" @click="importExcel">
          批量导入<input
            ref="filElem"
            type="file"
            class="upload-file"
            @change="getFile"
            style="display: none"
            id="fileUpload"
          />
        </a-button>
      </a-form-item>
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
        <a-button type="link" @click="edit(record)">编辑</a-button>
        <a-button type="link" @click="del(record)">删除</a-button>
      </template>
    </a-table>

    <a-modal
      v-model:visible="dialogs.visible"
      title="员工信息"
      @ok="handleOk"
      width="400px"
      okText="确定"
      cancelText="取消"
    >
      <a-form :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
        <a-form-item ref="name" label="姓名" name="name">
          <a-input v-model:value="dialogs.models.name" />
        </a-form-item>
        <a-form-item ref="tel" label="电话" name="tel">
          <a-input v-model:value="dialogs.models.tel" />
        </a-form-item>
        <a-form-item ref="num" label="身份证" name="num">
          <a-input v-model:value="dialogs.models.num" />
        </a-form-item>
        <a-form-item ref="note" label="备注" name="note">
          <a-textarea v-model:value="dialogs.models.note" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import { importEmployee } from "@/api/upload";
import {
  employeeList,
  delEmployee,
  createEmployee,
  editEmployee,
} from "@/api/user";
import { message, Modal } from "ant-design-vue";

const columns = [
  {
    title: "姓名",
    dataIndex: "name",
    width: "10%",
    slots: { customRender: "name" },
  },
  {
    title: "电话",
    dataIndex: "tel",
    width: "15%",
    slots: { customRender: "tel" },
  },
  {
    title: "身份证",
    dataIndex: "num",
    width: "20%",
    slots: { customRender: "num" },
  },
  {
    title: "备注",
    dataIndex: "note",
    width: "40%",
    slots: { customRender: "note" },
  },
  {
    title: "操作",
    dataIndex: "operation",
    slots: { customRender: "operation" },
  },
];
const pagination = {
  pageSize: 20,
  showTotal: (total) => `共 ${total} 条数据`,
};
export default defineComponent({
  setup() {
    const state = reactive({
      form: {
        name: "",
        tel: "",
        num: "",
      },
      dialogs: {
        visible: false,
        models: {
          name: "",
          tel: "",
          num: "",
          note: "",
        },
      },
      tableData: [],
    });
    onMounted(() => {
      queryList();
    });
    const filElem = ref(null);
    const getFile = (e) => {
      let file = e.target.files;
      for (let i = 0; i < file.length; i++) {
        //取出上传文件的扩展名
        var index = file[i].name.lastIndexOf(".");
        var ext = file[i].name.substr(index + 1);
        if (ext == "xlsx") {
          let formData = new FormData();
          formData.append("files", file[i]); // 文件对象
          importEmployee(formData).then((res) => {
            if (res.code == 1) {
              message.success("导入完毕");
              queryList();
            }
          });
        } else {
          message.warning("上传文件类型错误");
        }
      }
      document.getElementById("fileUpload").value = null;
    };
    const importExcel = () => {
      filElem.value.dispatchEvent(new MouseEvent("click"));
    };
    const reset = () => {
      state.form = {
        name: "",
        tel: "",
        num: "",
      };
    };
    const queryList = () => {
      employeeList(state.form).then((res) => {
        if (res.code == 1) {
          state.tableData = res.data;
        }
      });
    };
    const addEmployee = () => {
      state.dialogs = {
        visible: true,
        models: {
          name: "",
          tel: "",
          num: "",
          note: "",
        },
      };
    };
    const edit = (val) => {
      state.dialogs.models = val;
      state.dialogs.visible = true;
    };
    const del = (val) => {
      Modal.confirm({
        title: '系统提示',
        content: `请确认是否删除${val.name}!!!`,
        okText:"确定",
        cancelText:"取消",
        onOk() {
          delEmployee({ id: val.id }).then((res) => {
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
      if (state.dialogs.models.id) {
        editEmployee(state.dialogs.models).then((res) => {
          if (res.code == 1) {
            message.success("编辑成功！");
            state.dialogs.visible = false;
            queryList();
          } else {
            message.error("编辑失败");
          }
        });
      } else {
        createEmployee(state.dialogs.models).then((res) => {
          if (res.code == 1) {
            message.success("创建成功！");
            state.dialogs.visible = false;
            queryList();
          } else {
            message.error("创建失败");
          }
        });
      }
    };
    /* 返回 */
    return {
      ...toRefs(state),
      importExcel,
      getFile,
      filElem,
      queryList,
      reset,
      columns,
      pagination,
      edit,
      del,
      handleOk,
      addEmployee,
    };
  },
});
</script>

<style lang='less' scoped>
.employee {
  min-width: 800px;
  .addBtnGroups {
    float: right;
    margin-top: 3px;
    color: #fff;
    .addBtn {
      margin-right: 15px;
    }
    .importBtn {
      background: rgb(247, 107, 12);
      border: rgb(247, 107, 12);
    }
  }
  .table {
    margin-top: 20px;
  }
}
</style>