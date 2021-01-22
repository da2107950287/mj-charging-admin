<template>
  <el-row style="margin:20px 0px;text-align: right;">
          <el-col :span="24">
          <el-pagination 
            background 
            prev-text="上一页" 
            next-text="下一页" 
            layout="total,sizes,prev, pager, next, jumper"
            :total="total" 
            :page-sizes="[1,10,20,30]" 
            :page-size="PageSize" 
            :current-page="PageNumber"
            @current-change="changeCurrentPage"
            @size-change="handleSizeChange">
          </el-pagination>
        </el-col>
    </el-row>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: ['total','PageSize','PageNumber'],
  methods: {
    //改变当前页数
    changeCurrentPage(val) {
      this.$emit('update:PageNumber', val)
      this.$emit('current-change');
    },
    //改变每页显示条数
    handleSizeChange(val) {
      this.$emit('update:PageSize', val )
      this.$emit('update:PageNumber', 1)
      this.$emit('size-change');
    },
  }
}
</script>

<style>

</style>