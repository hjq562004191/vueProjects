<template>
  <div class="login_c">
    <div class="background">
      <!-- 图片分辨率 宽1100 高530 -->
        <img src="../assets/123.png" alt="avatar" />
    </div>
  
    <div class="login_box">
      <!-- 登录表单 -->
      <div>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginFormRules"
          label-width="30px"
          class="login_form"
        >
          <!-- 账号 -->
          <el-form-item label="" prop="phone">
            <el-input
              v-model="loginForm.phone"
              prefix-icon="iconfont icon-user"
              placeholder="手机号"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="" prop="passWord">
            <el-input
              v-model="loginForm.passWord"
              type="password"
              placeholder="密码"
              prefix-icon="iconfont icon-3702mima"
            ></el-input>
          </el-form-item>

          <!-- 登录注册按钮 -->
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="primary" @click="register">注册</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>

          <el-form-item class="radio">
            <el-radio-group v-model="loginForm.radio">
              <el-radio :label="1">学生</el-radio>
              <el-radio :label="2">教师</el-radio>
              <el-radio :label="3">管理员</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        phone: "",
        passWord: "",
        radio: 1,
      },
      // 表单验证
      loginFormRules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确手机号", trigger: "blur" },
        ],
        passWord: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 表单重置按钮
    resetLoginForm() {
      // console.log(this)
      // resetFields：element-ui提供的表单方法
      this.$message.success("已重置");
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      // 表单预验证
      // valid：bool类型
      this.$refs.loginFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return false;

        //密码加密 
        let Base64 = require('js-base64').Base64;
        var passWord = Base64.encode(this.loginForm.passWord);
        let postData = new FormData();
        postData.append("phone", this.loginForm.phone);
        postData.append("passWord", passWord);
        // this.$http.post('login', this.loginForm): 返回值为promise
        // 返回值为promise，可加await简化操作 相应的也要加async
        if (this.loginForm.radio === 1) {
          const { data: res } = await this.$http.post(
            "/login/studentLogin",
            postData
          );
          if (res.status !== 0) return this.$message.error("登录失败");
          this.$message.success("登录成功");
          window.sessionStorage.setItem("token", res.data);
        } else if (this.loginForm.radio === 2) {
          const { data: res } = await this.$http.post(
            "/login/teacherLogin",
            postData
          );
          if (res.status === -1) return this.$message.error("登录失败");
          if (res.status === 1)
            return this.$message.error("请通知管理员激活账号");
          this.$message.success("登录成功");
          window.sessionStorage.setItem("token", res.data);
        } else {
          const { data: res } = await this.$http.post(
            "/login/adminLogin",
            postData
          );
          if (res.status !== 0) return this.$message.error("登录失败");
          this.$message.success("登录成功");
          window.sessionStorage.setItem("token", res.data);
        }
        window.sessionStorage.setItem("phone", this.loginForm.phone);
        window.sessionStorage.setItem("type", this.loginForm.radio);
        this.$router.push("/home");
      });
    },
    // 注册
    register() {
      this.$router.push("/phone");
    },
  },
};
</script>

<style lang="less" scoped>
.login_c {
  .background {
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: rgba(179, 194, 188, 0.315);
  border-radius: 7px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.login_form {
  position: absolute;
  bottom: 5px;
  width: 95%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: center;
}
.radio {
  display: flex;
  justify-content: center;
}
.info {
  font-size: 13px;
  margin: 10px 15px;
}
</style>

