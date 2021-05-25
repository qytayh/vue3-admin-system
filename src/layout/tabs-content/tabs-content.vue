<!--  -->
<template>
  <div class="tabs-content">
    <div class="title">
      {{ visitedRoutes.name }}
    </div>
    <div class="views">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import { useRoute, useRouter } from "vue-router";
import { watch, reactive, toRefs } from "vue";
export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      activeKey: route.fullPath,
      visitedRoutes: {
        fullPath: route.fullPath,
        name: route.meta.title,
      },
    });

    watch(
      () => route.fullPath,
      (to) => {
        if (state.visitedRoutes.fullPath !== to) {
          const { fullPath, meta, path } = route;
          const routes = { fullPath, name: meta.title, path };
          state.visitedRoutes = routes;
          state.activeKey = to;
        } else {
          state.activeKey = to;
        }
      }
    );

    //切换tab
    const changePage = (key) => {
      state.activeKey = key;
      router.push(key);
    };
    return {
      ...toRefs(state),
      changePage,
    };
  },
};
</script>
<style lang='less' scoped>
.tabs-content {
  .title {
    height: 30px;
    line-height: 30px;
    font-size: 20px;
    font-weight: 800;
    padding-left: 20px;
  }
  border-top: 1px solid #eee;
  .views {
    margin: 5px 8px;
    background: #fff;
    padding: 10px 10px;
    border-radius: 5px;
    height: 100%;
  }
}
</style>