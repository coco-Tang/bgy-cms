<template>
  <div class="login">
    <div class="content">
      <div class="ulang-voice">
        <img src="../assets/images/ulang.png" alt="加载中">
      </div>
      <div class="login-module">
        <div class="system-name">
          <h1>智&nbsp;能&nbsp;茶&nbsp;壶&nbsp;系&nbsp;统&nbsp;</h1>
          <h4>&nbsp;后台服务平台</h4>
        </div>
        <!-- <div class="login-title">智能茶壶系统后台服务平台</div> -->
        <div class="login-content">
          <el-form ref="loginForm" :model="loginForm" class="login-form">
            <el-form-item :class="{'form-item-error': showaccountError}" prop="account">
              <span class="svg-container">
                <i class="iconfont">&#xe6cb;</i>
              </span>
              <el-input
                ref="account"
                v-model="loginForm.account"
                placeholder="用户名"
                name="account"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
              <span>
                <svg-icon icon-class="" />
              </span>
            </el-form-item>

            <el-tooltip v-model="capsTooltip" content="大写键盘已打开" placement="right" manual>
              <el-form-item prop="password">
                <span class="svg-container">
                  <i class="iconfont">&#xe6ca;</i>
                </span>
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="密码"
                  name="password"
                  tabindex="2"
                  auto-complete="on"
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="loginSubmit"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </el-form-item>
            </el-tooltip>

            <el-form-item class="form-item-remember">
              <el-checkbox v-model="loginForm.rememberPassword">记住密码</el-checkbox>
            </el-form-item>

            <div class="form-error" v-if="errorMsg !== 0">{{errorMsg}}</div>

            <el-button :loading="loading" type="primary" style="width:100%;margin:60px 0 0;border-radius: 26px;" @click.native.prevent="loginSubmit">登录</el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        account: "",
        password: "",
        rememberPassword: true
      },
      errorMsg: "",
      errorCode: "",
      passwordType: "password",
      capsTooltip: false,
      loading: false
    };
  },
  computed: {
    showaccountError() {
      return this.errorCode === 1 || this.errorCode === 3;
    },
    showPasswordError() {
      return this.errorCode === 2 || this.errorCode === 3;
    }
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.focus();
      }
    }
  },
  created() {
    
  },
  mounted() {
    // if (getCookie('account') && getCookie('password')) {
    //   this.loginForm.account = getCookie('account');
    //   this.loginForm.password = getCookie('password');
    // }
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && (key >= "a" && key <= "z")) ||
          (!shiftKey && (key >= "A" && key <= "Z"))
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    loginSubmit() {
      // let account = this.loginForm.account;
      // let password = new MD5().update(this.loginForm.password).digest('hex');
      let { account, password } = this.loginForm;
      if (account === "") {
        this.errorMsg = "用户名/邮箱不能为空";
        this.errorCode = 1;
        return;
      } else {
        this.errorMsg = "";
        this.errorCode = 0;
      }
      if (password === "") {
        this.errorMsg = "密码不能为空";
        this.errorCode = 2;
        return;
      } else {
        this.errorMsg = "";
        this.errorCode = 0;
      }

      this.loading = true;
      this.$store
        .dispatch("user/login", { account, password })
        .then(() => {
          console.log('login.vue登录成功')
          this.$router.push({ path: this.redirect || "/" });
          this.loading = false;
        })
        .catch(() => {
          console.log('login.vue登录失败')
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="scss">
.el-input__inner {
  border: none;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../styles/variables.scss";
$error-color: rgb(255, 98, 68);
$dark_gray: #889aa4;
$light_gray: #eee;

.login {
  width: 100%;
  min-height: 100%; //保证高度填充整个浏览器可视区高度
  background-color: $themeColor;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 200px 355px;
  overflow: hidden;

  .content {
    width: 1209px;
    height: 671px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;

    .ulang-voice {
      width: 50%;
      >img {
        display: block;
        background-size: 100% 100%;
      }
    }

    .login-module {
      width: 50%;
      // max-width: 100%;
      // padding: 70px; //保持在手机，pad屏幕下处于居中状态
      // height: 670px;
      color: $themeColor;
      background-color: #fff;
      text-align: center;
      padding: 80px 80px;


      .system-name {
        display: flex;
        align-items: center;
        justify-content: center;
        > h4 {
          margin-left: 10px;
          padding-left: 5px;
          border-left: 1px solid $themeColor;
        }
      }

      .login-content {
        // background-color: rgba(233, 233, 233, 0.2);
        // padding: 16px;
        // height: 360px;
        // border-radius: 0 0 4px 4px;
        // text-align: center;
        // position: relative;
        // width: 809px;
        // height: 654px;
        margin-top: 30px;

        .login-form {
          // background-color: #fff;
          // border-radius: 3px;
          height: 410px;
          padding: 0 33px;

          .form-error {
            color: $error-color;
          }

          .el-form-item {
            border-bottom: 1px solid #ccc;
            &:nth-of-type(n + 3) {
              border: none;
            }
            .el-input {
              display: inline-block;
              height: 47px;
              width: 85%;
              input {
                background: transparent;
                border: 0px;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $light_gray;
                height: 47px;
                // caret-color: $cursor;

                &:-webkit-autofill {
                  // box-shadow: 0 0 0px 1000px $bg inset !important;
                  // -webkit-text-fill-color: $cursor !important;
                }
              }
            }
            margin-bottom: 0;
            margin-top: 40px;
            // background-color: rgb(232, 240, 254);
            &:first-child {
              margin-top: 0;
            }
            &:focus {
              box-shadow: none;
            }
            &.form-item-remember {
              // margin-top: 30px;
              padding-left: 20px;
              text-align: left;
              .el-form-item__content {
                border-bottom: 1px solid red;
                vertical-align: middle;
                font-size: 22px;
              }
            }

            .btn-login {
              width: 100%;
              height: 40px;
              background-color: #3a77e9;
              border-radius: 3px;
              border: none;
              color: #fff;
              font-size: 22px;
            }
            &.form-item-error {
              .form-input {
                border-bottom-color: $error-color;
              }
              &:after {
                content: "×××";
                color: $error-color;
                position: absolute;
                right: 10px;
                font-size: 14px;
              }
              .input-wrapper {
                // display: flex;
              }
            }
          }

          .svg-container {
            color: $dark_gray;
          }
        }
      }
    }

    // @media only screen and (max-width: 1200px) {
    //   .ulang-voice {
    //     display: none;
    //   }
    // }
  }
}
</style>
