<template>
  <div class="container">

    <div class="list">
      <el-table :data="list" class="table" :header-cell-style="{background:'#eef1f6',color:'#333'}" ref="multipleTable"
        header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" align="center"> </el-table-column>
        <el-table-column prop="hours" label="时间（单位：小时）" align="center"></el-table-column>
        <el-table-column prop="price" label="费用" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span @click="editCost(scope.row)" class="pointer">编辑</span>

          </template>
        </el-table-column>

      </el-table>
      <el-dialog title="编辑" center :visible.sync="dialogVisible" width="450px">
        <el-form ref="form" :rules="rules" :model="form" label-width="80px">
          <el-form-item prop="price" label="费用">
            <el-input v-model="form.price" type="number" maxlength=4></el-input>
          </el-form-item>
          <div class="btns">
            <el-button type="primary" size="small" @click="dialogVisible=false" plain>取消</el-button>
            <el-button type="primary" size="small" @click="updateCost">保存</el-button>

          </div>
        </el-form>
      </el-dialog>

    </div>
  </div>
</template>
<script>
  export default {
    data() {
      var validatePrice = (rule, value, callback) => {

        if (value == 0) {
          return callback(new Error("价格不能为0"))
        } else if (value == '') {
          return callback(new Error("价格不能为空"))
        } else if (value < 0) {
          return callback(new Error("价格不能为负数"));
        } else if (!/^\d{1,8}(\.\d{0,2})?$/.test(value)) {
          return callback(new Error("价格输出超出限制,整数不能超过8位，小数不能超过两位"));
        } else {
          return callback();
        }
      }
      return {
        list: [],
        form: {},
        dialogVisible: false,
        rules: {
          price: [
            { required: true, validator: validatePrice, trigger: "change" },
          ]
        }
      }
    },
    created() {
      this.getCost();
    },
    methods: {
      getCost() {
        this.$http('/backstage/getCost').then(res => {
          if (res.code == 200) {
            this.list = res.data;
          }
        })
      },
      editCost(row) {
        this.dialogVisible = true;
        this.form = JSON.parse(JSON.stringify(row))
      },
      updateCost() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$http('/backstage/updateCost', this.form).then(res => {
              if (res.code == 200) {
                this.dialogVisible = false;
                this.$message.success(res.msg)
                this.getCost()
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        })
      }
    },

  }
</script>
<style scoped>
  .index {

    background: #f6f6f6;
  }

  .pointer {
    cursor: pointer;
    color: #02a7f0;
    margin-right: 10px;
  }

  .list {
    margin: 0;
  }

  .btns {
    text-align: center;
  }
</style>