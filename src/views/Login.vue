<template>
  <div class="page">
    <div class="banner"></div>
    <div class="login">
      <div class="logo"><img src="../assets/img/logo.png"></div>
      <div class="title"><span>欢迎登录</span></div>
      <form class="form">
        <div class="form-item">
          <div class="form-item-icon"><img src="../assets/img/img1.png"></div>
          <div class="form-item-content"><input type="text" v-model="param.account" placeholder="用户名"></div>
        </div>
        <div class="form-item">
          <div class="form-item-icon"><img src="../assets/img/img2.png"></div>
          <div class="form-item-content"><input type="password" v-model="param.password" minlength=1 maxlength=16
              placeholder="密码"></div>
        </div>
        <div class="form-item">
          <div class="form-item-icon"><img src="../assets/img/img3.png"></div>
          <div class="form-item-content"><input type="text" v-model="param.verifyCode" placeholder="验证码">
            <!-- <s-identify class="code" :identifyCode="identifyCode" @click="refreshCode"></s-identify> -->
            <div class="code" @click="refreshCode">{{identifyCode}}</div>
          </div>
        </div>
        <div class="form-error">{{errMsg}}</div>
        <div class="btn-submit" @click="submitForm">登录</div>
      </form>
    </div>
  </div>
</template>
<script>
  import SIdentify from "../components/SIdentify";
  import { setStore } from "../assets/js/utils.js"
  export default {
    data() {
      return {
        param: {
          account: '',
          password: '',
          verifyCode: ''
        },
        errMsg: '',
        identifyCodes: "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        identifyCode: "",
        codeUrl: '',
        imgCode: ''

      };
    },
    watch: {
      'param.password'() {
        this.param.password = this.param.password.replace(/[\W]/g, '');
      },
      'param.verifyCode'() {
        this.param.verifyCode = this.param.verifyCode.replace(/[\W]/g, '');
      }
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
        this.param.account = this.param.account.replace(/[ ]/g, "").replace(/[\r\n]/g, "");
        this.param.password = this.param.password.replace(/[ ]/g, "").replace(/[\r\n]/g, "");
        if (this.param.account == '') {
          this.errMsg = '用户名不能为空'
          return false;
        } else if (this.param.password == '') {
          this.errMsg = '密码不能为空'
          return false;
        } else if (this.param.verifyCode == '') {
          this.errMsg = '验证码不能为空'
          return false;
        } else if (this.param.verifyCode.toLowerCase() != this.identifyCode.toLowerCase()) {
          this.errMsg = '验证码不正确'
          return false;
        }
        this.$http('/backstage/login', this.param).then(res => {
          if (res.code == 200) {
            setStore('token', res.data)
            this.$router.push('/hotel')
          } else {
            this.errMsg = res.msg;
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
  .page {
    display: flex;
    /* object-fit: cover; */
    background-image: url(../assets/img/bg.png);
    background-size: 100% 100%;


    overflow: hidden;
    height: 100%;
    /* overflow-y: scroll; */


    .banner {
      width: 68.9%;
      /* min-height: 100%; */


    }

    .login {
      width: calc(100% - 68.9%);
      text-align: center;
      padding: 0 4.01rem 1.5rem;
      overflow-y: scroll;


    }

    .logo {
      width: 11.9rem;
      margin: 0 auto;
      margin-top: 7.35rem;
      height: 3.35rem;

      img {
        width: 100%;

      }

    }

    .title {

      font-size: 1.8rem;
      line-height: 3.6rem;
      color: #000;
      text-align: center;
      margin-top: 6.25rem;

      span {
        padding-bottom: 0.85rem;
        border-bottom: 1px solid #2151E9;
      }
    }

    .form {
      margin: 0 auto;
      margin-top: 1.75rem;

      .form-item {
        display: flex;
        position: relative;

        line-height: 4.3rem;
      }

      .form-item-icon {
        width: .9rem;
        height: .9rem;
        margin-right: .9rem;
      }

      .form-item-icon img {
        width: 100%;
        height: 100%;
      }

      .form-item-content {
        width: 100%;
      }

      .form-item-content input {
        display: inline-block;
        width: 100%;
        font-size: 1.2rem;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #8D8D8E;
        line-height: 3.6rem;
        border: none;
        border-bottom: 1px solid #f1eff5;
        outline: none;
      }

      .form-item-content input:hover {
        border-bottom: 1px solid #003374;
      }

      .code {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #cf2c09;
        background-color: #dfdfdd;
        padding: .25rem 0;
        font-style: italic;
        font-weight: 700;
        letter-spacing: .25rem;
        cursor: pointer;
        width: 4.6rem;
        text-align: center;
        height: 1.8rem;
        color: #cf2c09;
        font-size: 1.2rem;
      }
    }

    .btn-submit {
      margin-top: 2.75rem;
      width: 100%;
      height: 3.9rem;
      background: #003374;
      border-radius: 6px;
      font-size: 1.2rem;
      font-family: SourceHanSansSC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 3.6rem;
      cursor: pointer;
    }
  }

  .form .form-error {
    color: red;
    font-size: .9rem;
    margin-top: 1.5rem;
    text-align: left;
  }
</style>