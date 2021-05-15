<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 修改学生用户的对话框 -->
    <el-dialog
      title="修改学生信息"
      :visible.sync="editDialogVisibleStu"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="editStuForm"
        ref="editUserFormRef"
        :rules="editStuFormRules"
        label-width="70px"
      >
        <el-form-item label="姓名" prop="studentName">
          <el-input v-model="editStuForm.studentName"></el-input>
        </el-form-item>
        <el-form-item label="学号" prop="studentNum">
          <el-input v-model="editStuForm.studentNum"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phoneNumber">
          <el-input v-model="editStuForm.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="studentPassWord">
          <el-input v-model="editStuForm.studentPassWord"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisibleStu = false">取 消</el-button>
        <el-button type="primary" @click="editStu">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改教师用户的对话框 -->
    <el-dialog
      title="修改教师信息"
      :visible.sync="editDialogVisibleTeacher"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="editTeacherForm"
        ref="editUserFormRef"
        :rules="editTeacherFormRules"
        label-width="70px"
      >
        <el-form-item label="姓名" prop="teacherName">
          <el-input v-model="editTeacherForm.teacherName"></el-input>
        </el-form-item>
        <el-form-item label="学院" prop="college">
          <el-input v-model="editTeacherForm.college"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phoneNumber">
          <el-input v-model="editTeacherForm.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="teacherPassWord">
          <el-input v-model="editTeacherForm.teacherPassWord"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisibleTeacher = false">取 消</el-button>
        <el-button type="primary" @click="editTeacher">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userlist: [],
      // 修改用户
      editDialogVisibleStu: false,
      editDialogVisibleTeacher:false,
      editStuForm: {},
      
      editTeacherForm: {},
      // 编辑用户表单验证
      editStuFormRules: {
        studentName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 15, trigger: "blur" },
        ],
        studentNum: [{ min: 8, max: 8, trigger: "blur" }],
        phoneNumber: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 11, trigger: "blur" },
        ],
        studentPassWord: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 18, trigger: "blur" },
        ],
      },
      editTeacherFormRules: {
        teacherName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 2, max: 15, trigger: "blur" },
        ],
        phoneNumber: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 11, trigger: "blur" },
        ],
        teacherPassWord: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 18, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    const phone = window.sessionStorage.getItem("phone");
    const type = window.sessionStorage.getItem("type");
    if (type === "1") {
      this.showEditStuDialog(phone);
    } else if (type === "2") {
      this.showEditTeacherDialog(phone);
    }
  },
  methods: {
    // 编辑用户信息
    async showEditStuDialog(phone) {
      let postData = new FormData();
      postData.append("phoneNumber", phone);
      const { data: res } = await this.$http.post("/user/getStudent", postData);
      if (res.status === -9) {
        window.sessionStorage.clear();
        this.$message.error("登录信息异常！");
        this.$router.push("/login");
      }
      if (res.status !== 0) {
        return this.$message.error("查询用户信息失败！");
      }
      this.editStuForm = res.data;
      let Base64 = require('js-base64').Base64;
      this.editStuForm.studentPassWord = Base64.decode(this.editStuForm.studentPassWord);
      this.editDialogVisibleStu = true;
    },
    // 编辑用户信息
    async showEditTeacherDialog(phone) {
      let postData = new FormData();
      postData.append("phoneNumber", phone);
      const { data: res } = await this.$http.post("/user/getTeacher", postData);
      if (res.status === -9) {
        window.sessionStorage.clear();
        this.$message.error("登录信息异常！");
        this.$router.push("/login");
      }
      if (res.status !== 0) {
        return this.$message.error("查询用户信息失败！");
      }
      this.editTeacherForm = res.data;
      let Base64 = require('js-base64').Base64;
      this.editTeacherForm.teacherPassWord = Base64.decode(this.editTeacherForm.teacherPassWord);
      this.editDialogVisibleTeacher = true;
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editUserFormRef.resetFields();
    },
    // 修改用户信息
    editStu() {
      // 提交请求前，表单预验证
      this.$refs.editUserFormRef.validate(async (valid) => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return;
        //密码加密 
        let Base64 = require('js-base64').Base64;
        var passWord = Base64.encode(this.editStuForm.studentPassWord);
        let postData = new FormData();
        postData.append("id", this.editStuForm.id);
        postData.append("studentName", this.editStuForm.studentName);
        postData.append("phoneNumber", this.editStuForm.phoneNumber);
        postData.append("className", this.editStuForm.className);
        postData.append("studentNum", this.editStuForm.studentNum);
        postData.append("studentPassWord",passWord);
        
        const { data: res } = await this.$http.post(
          "/user/changeStudent",
          postData
        );
        if (res.status !== 0) {
          this.$message.error("更新用户信息失败！");
        }
        // 隐藏添加用户对话框
        this.editDialogVisibleStu = false;
        this.$message.success("更新用户信息成功！");
      });
    },
    editTeacher() {
      // 提交请求前，表单预验证
      this.$refs.editUserFormRef.validate(async (valid) => {
         // 表单预校验失败
        if (!valid) return;
        //密码加密 
        let Base64 = require('js-base64').Base64;
        var passWord = Base64.encode(this.editTeacherForm.teacherPassWord);
        let postData = new FormData();
        postData.append("id", this.editTeacherForm.id);
        postData.append("teacherName", this.editTeacherForm.teacherName);
        postData.append("phoneNumber", this.editTeacherForm.phoneNumber);
        postData.append("college", this.editTeacherForm.college);
        postData.append("teacherPassWord", passWord);
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/user/changeTeacher",
          postData
        );
        if (res.status !== 0) {
          this.$message.error("更新用户信息失败！");
        }
        // 隐藏添加用户对话框
        this.editDialogVisibleTeacher = false;
        this.$message.success("更新用户信息成功！");
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>