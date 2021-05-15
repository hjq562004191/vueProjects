<template>
  <div class="reg_c">
    <div class="background">
        <img src="../assets/123.png" alt="avatar" />
    </div>
    <div class="reg_box">
      <!-- 注册表单 -->
      <div>
        <el-form
          ref="regFormRef"
          :model="regForm"
          :rules="regFormRules"
          label-width="70px"
          class="reg_form"
        >
          <!-- 账号 -->
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="regForm.phone" disabled></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="密码" prop="passWord">
            <el-input v-model="regForm.passWord"></el-input>
          </el-form-item>
          <!-- 姓名 -->
          <el-form-item label="姓名" prop="name">
            <el-input v-model="regForm.name" placeholder="例如:张三"></el-input>
          </el-form-item>

          <!-- 注册按钮 -->
          <el-form-item class="btns">
            <el-button type="primary" @click="register">注册</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
            <el-button type="info" @click="back">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created(){
    this.regForm.phone = this.$route.query.phone
  },
  data() {
    return {
      regForm: {
        phone: "",
        passWord: "",
        name: "",
        classNum: "",
        studentNum: "",
      },
      // 表单验证
      regFormRules: {
        passWord: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 10, message: "请输入正确姓名", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 表单重置按钮
    resetForm() {
      // console.log(this)
      // resetFields：element-ui提供的表单方法
      this.$message.success("已重置");
      this.$refs.regFormRef.resetFields();
    },
    register() {
      // 表单预验证
      this.$refs.regFormRef.validate(async (valid) => {
        let Base64 = require('js-base64').Base64;
        if (!valid) return false;
        //密码加密 
        var passWord = Base64.encode(this.regForm.passWord);
        if(this.$route.query.radio == 1){
        let postData = new FormData();
        postData.append("phoneNumber", this.$route.query.phone);
        postData.append("studentPassWord", passWord);
        postData.append("studentName", this.regForm.name);
        
        const { data: res } = await this.$http.post(
          "/regist/studentRegister",
          postData
        );
        if (res.status !== 0) return this.$message.error("注册失败");
        this.$message.success("注册成功");
        }else{
        //密码加密 
        var passWord = Base64.encode(this.regForm.passWord);
        let postData = new FormData();
        postData.append("phoneNumber", this.$route.query.phone);
        postData.append("teacherPassWord", passWord);
        postData.append("teacherName", this.regForm.name);
        
        const { data: res } = await this.$http.post(
          "/regist/teacherRegister",
          postData
        );
        if (res.status !== 0) return this.$message.error("注册失败");
        this.$message.success("注册成功");
        }
        
        this.$router.push("/login");
      });
    },
    back(){
      this.$router.push("/login");
    }
  },
};
</script>

<style lang="less" scoped>
.reg_c {
  .background {
    img {
      width: 100%;
      height: 100%;
    }
  }
}

.reg_box {
  width: 450px;
  height: 300px;
  background-color: rgba(179, 194, 188, 0.315);
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.reg_form {
  top: 10%;
  position: absolute;
  bottom: 60px;
  width: 95%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: center;
}
.info {
  font-size: 13px;
  margin: 10px 15px;
}
.el-button--primary {
  color: #fff;
  background-color: #fc813b;
  border-color: #fc813b;
}
</style>

