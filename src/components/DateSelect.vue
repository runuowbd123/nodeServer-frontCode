<template>
  <div>
    
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    typeList:{
      type: Array,
      required: false,
      default: ['now', '7', '30', 'day', 'month']
    },
    defaultType: {
      type: String,
      required: false,
    },
    defaultDate: {
      type: Date,
      required: false,
    },
    disabledDate: {
      type: Date,
      required: false,
    }
  },
  data() {
    return {
        moment,
        type: 'now'
    };
  },
  created() {
    if(this.defaultType && this.typeList.includes(this.defaultType)) {
        this.type = this.defaultType
    } else {
        this.type = this.typeList[0]
    }
  },
  methods: {
      
  }
};
</script>

<style lang="less">

</style>
