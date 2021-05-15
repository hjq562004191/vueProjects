<template>
  <div class="phone_c">
    <div class="background">
        <img src="../assets/123.png" alt="avatar" />
    </div>
    <div class="phone_box">
      <!-- 手机号 -->
      <div class="phone_form_box">
        <el-form
          ref="phoneFormRef"
          :model="phoneForm"
          :rules="phoneFormRules"
          label-width="50px"
          class="phone_form"
        >
          <el-form-item label="" prop="phone">
            <el-input
              type="text"
              maxlength="11"
              suffix-icon="el-icon-mobile-phone"
              placeholder="手机号"
              v-model="phoneForm.phone"
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 验证码 -->
      <el-form
        ref="phoneFormRef"
        :model="phoneForm"
        label-width="50px"
        class="code_form"
      >
        <el-form-item label="" prop="code">
          <el-input
            type="text"
            maxlength="6"
            suffix-icon="el-icon-lock"
            placeholder="验证码"
            v-model="phoneForm.code"
          />
          <el-button class="get_code" :disabled="disabled" @click="getCode">{{
            valiBtn
          }}</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">验证</el-button>
          <el-button type="info" @click="back">返回</el-button>
        </el-form-item>
        <el-form-item class="radio">
          <el-radio-group v-model="phoneForm.radio">
            <el-radio :label="1">学生</el-radio>
            <el-radio :label="2">教师</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      phoneForm: {
        phone: "",
        code: "",
        radio: 1,
      },
      autoLogin: false,
      dialogVisible: false, // 对话框显示和隐藏
      valiBtn: "获取验证码",
      disabled: false,
      // 表单验证
      phoneFormRules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入正确手机号", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //获取验证码
    //获取验证码 并只验证手机号 是否正确
    getCode() {
      this.$refs.phoneFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return false;
        let postData = new FormData();
        postData.append("phoneNumber", this.phoneForm.phone);
        postData.append("radio", this.phoneForm.radio);
        // this.$http.post('login', this.loginForm): 返回值为promise
        // 返回值为promise，可加await简化操作 相应的也要加async
        const { data: res } = await this.$http.post(
          "/utils/getPhoneCode",
          postData
        );
        if (res.status !== 0) return this.$message.error("账号已存在");
        this.$message.success("获取验证码成功");
        this.tackBtn(); //验证码倒数60秒
      });
    },
    tackBtn() {
      //验证码倒数60秒
      let time = 60;
      let timer = setInterval(() => {
        if (time == 0) {
          clearInterval(timer);
          this.valiBtn = "获取验证码";
          this.disabled = false;
        } else {
          this.disabled = true;
          this.valiBtn = time + "秒后重试";
          time--;
        }
      }, 1000);
    },
    onSubmit() {
      this.$refs.phoneFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) {
          this.dialogVisible = true;
          return false;
        }
        let postData = new FormData();
        postData.append("phoneNumber", this.phoneForm.phone);
        postData.append("code", this.phoneForm.code);

        const { data: res } = await this.$http.post(
          "/utils/judgePhoneCode",
          postData
        );
        if (res.status !== 0) return this.$message.error("验证失败");
        this.$message.success("验证成功");

        this.$router.push({
          path: "/register",
          query: { phone: this.phoneForm.phone, radio: this.phoneForm.radio },
        });
      });
    },
    back() {
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="less" scoped>
.phone_c {
  .background {
    img {
      width: 100%;
      height: 100%;
    }
  }
}

.phone_box {
  width: 450px;
  height: 300px;
  background-color:  rgba(179, 194, 188, 0.315);
  border-radius: 7px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.phone_form_box {
  width: 450px;
  height: 150px;
  // background-color:  rgba(179, 194, 188, 0.315);
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
}

.phone_form {
  position: absolute;
  bottom: 50px;
  width: 90%;
  padding: 0 20px;
  box-sizing: border-box;
}
.code_form {
  position: absolute;
  bottom: 0px;
  width: 64%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: space-between;
}
.info {
  font-size: 13px;
  margin: 10px 15px;
}
.radio {
  display: flex;
  justify-content: center;
}

.get_code {
  position: absolute;
  bottom: 0px;
  width: 60%;
  padding: 60 20px;
  box-sizing: border-box;
}
.el-button--primary {
  width: 50%;
  color: #fff;
  background-color: #fc813b;
  border-color: #fc813b;
}
</style>

