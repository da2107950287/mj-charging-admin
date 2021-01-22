<template>
  <div class="login-wrap">
    <div class="login-box">
      <div class="login-title">米京快充管理后台</div>
      <div class="ms-login">
        <div class="ms-title">登录</div>
        <el-form :model="param" :rules="rules" ref="form" label-width="0px" class="ms-content">
          <el-form-item prop="account">
            <el-input v-model="param.account" placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="密码" v-model="param.password"></el-input>
          </el-form-item>
          <el-form-item prop="verifyCode" class="verify-code">
            <el-input class="verify-code-input" placeholder="验证码" v-model="param.verifyCode"
              @keyup.enter.native="submitForm()"></el-input>
            <div @click="refreshCode" class="verify-code-button">
              <s-identify :identifyCode="identifyCode"></s-identify>
            </div>
          </el-form-item>
          <div class="login-btn">
            <el-button type="primary" @click="submitForm()">登录</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import SIdentify from "../components/SIdentify";
  import { setStore } from "../assets/js/utils.js"
  export default {
    data() {
      var validateCode = (rule, value, callback) => {
        if (value.toLowerCase() != this.identifyCode.toLowerCase()) {
          return callback(new Error("验证码不正确"))
        } else {
          return callback();
        }
      }
      return {
        param: {
          account: '',
          password: '',
          verifyCode: ''
        },
        identifyCodes: "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        identifyCode: "",
        codeUrl: '',
        checked: true,
        rules: {
          account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
          password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
          verifyCode: [
            { required: true, message: '验证码不能为空', trigger: 'blur' },
            { validator: validateCode, trigger: 'blur' },
          ],

        },
      };
    },
    mounted() {
      this.refreshCode();
    },
    methods: {
      // 生成随机数
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      },
      // 切换验证码
      refreshCode() {
        this.identifyCode = "";
        this.makeCode(this.identifyCodes, 4);
      },
      // 生成四位随机验证码
      makeCode(o, l) {
        for (let i = 0; i < l; i++) {
          this.identifyCode += this.identifyCodes[
            this.randomNum(0, this.identifyCodes.length)
          ];
        }
      },
      //登录
      submitForm() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$http('/backstage/login', this.param).then(res => {
              if (res.code == 200) {
                setStore('token', res.data)
                this.$router.push('/hotel')
              }else{
                this.$message.error(res.msg)
                this.refreshCode()
              }
            })
          }
        })
      }
    },
    components: {
      SIdentify
    }
  };
</script>

<style lang="scss" scoped>
  .verify-code>.el-form-item__content {
    width: 100% !important;
  }

  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/login.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .login-box {
    text-align: center;
    width: 400px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -70%);
  }

  .login-title {
    font-size: 44px;
    font-weight: 500;
    color: #fff;
    margin-bottom: 50px;
  }

  .ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 32px;
    color: #fff;

  }

  .ms-login {
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }

  .ms-content {
    padding: 30px 30px;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
  }

  .margin0 {
    margin-bottom: 5px;

  }

  .verify-code-input {
    width: 62%;
    margin-right: 4%;
  }

  .verify-code-button {
    text-align: right;
    height: 40px;

    display: inline-block;
    vertical-align: middle;


  }
</style>