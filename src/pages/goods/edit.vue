<template>
  <div>
    <Edit01
      v-if="index == 1"
      :goodsId="id"
      @changeId="changeId"
      @changeStep="changeStep"
    />
    <Edit02
      v-else-if="index == 2"
      :goodsId="id"
      @changeId="changeId"
      @changeStep="changeStep"
    />
    <Edit03
      v-else-if="index == 3"
      :goodsId="id"
      @changeId="changeId"
      @changeStep="changeStep"
    />
  </div>
</template>
<script>
import Edit01 from "./edit01.vue";
import Edit02 from "./edit02.vue";
import Edit03 from "./edit03.vue";
export default {
  data() {
    return {
      index: 1,
      id: ""
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.index= this.$route.query.index||1;
  },
  components: {
    Edit01,
    Edit02,
    Edit03
  },
  methods: {
    changeStep(index) {
      this.index = index;
    },
    changeId(id) {
      this.id = id;
    }
  }
};
</script>
<style lang="less" scoped></style>
