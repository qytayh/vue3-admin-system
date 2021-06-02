<template>
  <div class="contractor">
    <a-row>
      <a-col :span="6" v-for="(item, i) in tableData" :key="i">
        <a-button type="link" @click="toDetail(item)">
          {{ item }}
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { contractorList } from "@/api/project";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const router =useRouter()
    const state = reactive({
      tableData: [],
    });
    const getList = () => {
      contractorList().then((res) => {
        state.tableData = res.data;
      });
    };
    const toDetail= (name)=>{
      router.push({ path: "/contarctMan/contractorDetail", query: { name } });
    }
    onMounted(() => {
      getList();
    });
    return {
      ...toRefs(state),
      toDetail
    };
  },
});
</script>

<style lang="less" scoped>
.contractor {
  min-width: 800px;
  .ant-row {
    .ant-col {
      padding: 5px 8px 0 8px;
    }
  }
}
</style>
