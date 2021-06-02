<template>
  <div>111</div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from "vue";

export default defineComponent({
  setup(){
    const state = reactive({
    })
    onMounted(() => {})
    return{
      ...toRefs(state)
    }
  }
})
</script>

<style>

</style>