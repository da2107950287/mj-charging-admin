<template>
  <div class="container">
    <div class="update-psw">
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="原始密码：" prop="oldpassword">
          <el-input v-model="form.oldpassword" placeholder="请输入原始密码" class="handle-select mr10"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newpassword">
          <el-input v-model="form.newpassword" placeholder="请输入新密码" class="handle-select mr10"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="verifypassword">
          <el-input v-model="form.verifypassword" placeholder="请确认密码" class="handle-select mr10"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>
<script>
  export default {
    data() {
      var validatePassword1 = (rule, value, callback) => {
        if (value == this.form.oldpassword) {
          callback(new Error("新密码与旧密码一致!"));
        } else {
          callback();
        }
      };
      var validatePassword2 = (rule, value, callback) => {
        if (value != this.form.newpassword) {
          callback(new Error("与新密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        form: {
          oldpassword: '',
          newpassword: '',
          verifypassword: '',
        },
        rules: {
          oldpassword: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
          ],
          newpassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { validator: validatePassword1, trigger: 'blur' }],
          verifypassword: [
            { required: true, message: '请确认密码', },
            { validator: validatePassword2, trigger: 'blur' }
          ],

        },
      }
    },
    methods: {
      submit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$http("/backstage/updatePassword", this.form).then(res => {
              if (res.code == 200) {
                this.$message.success(res.msg)
                sessionStorage.removeItem("userinfo")
                this.$router.push("/login")
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
<style scoped>
  .handle-select {
    width: 400px;
  }

  .update-psw {
    background: #fff;
    padding: 40px 20px 20px;
  }
</style>