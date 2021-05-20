<template>
  <div class="contractDetail">
    <div class="tools">
      <a-form
        layout="inline"
        :form="form"
        @submit="handleSubmit"
        @submit.prevent
      >
        <a-form-item label="公司名">
          <a-input v-model:value="form.companyName"> </a-input>
        </a-form-item>
        <a-form-item label="负责人">
          <a-input v-model:value="form.employeeName"> </a-input>
        </a-form-item>
        <a-form-item label="时间范围">
          <a-range-picker v-model:value="form.date"></a-range-picker>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit"> 查询 </a-button>
        </a-form-item>
        <a-button class="add" @click="goAdd"> 新增 </a-button>
      </a-form>
    </div>
    <div class="table">
      <a-table
        :columns="columns"
        :dataSource="data"
        bordered
        :pagination="pagination"
      >
        <template #operation="{ record }">
          <a-button type="link" @click="detail(record)">详情</a-button>
          <a-button type="link" @click="del(record)">删除</a-button>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";

const columns = [
  {
    title: "name",
    dataIndex: "name",
    width: "25%",
    slots: { customRender: "name" },
  },
  {
    title: "age",
    dataIndex: "age",
    width: "15%",
    slots: { customRender: "age" },
  },
  {
    title: "address",
    dataIndex: "address",
    width: "40%",
    slots: { customRender: "address" },
  },
  {
    title: "operation",
    dataIndex: "operation",
    slots: { customRender: "operation" },
  },
];
const pagination = {
  pageSize: 10,
  showTotal: (total) => `共 ${total} 条数据`,
};

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
export default defineComponent({
  setup() {
    const router = useRouter();
    const state = reactive({
      form: {
        companyName: "",
        employeeName: "",
        date: "",
      },
    });
    const handleSubmit = () => {
      //   const { companyName, employeeName, date } = state.form;
    };
    const goAdd = () => {
      router.push("/contarctMan/contractDetail");
    };
    const detail = (val) => {
      console.log(val);
    };
    const del = (val) => {
      console.log(val);
    };
    return {
      ...toRefs(state),
      handleSubmit,
      goAdd,
      data,
      columns,
      pagination,
      detail,
      del,
    };
  },
});
</script>

<style lang='less' scoped>
.contractDetail {
  background: #fff;
  min-width: 800px;
  padding: 10px;
  border-radius: 5px;
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