<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
      <el-breadcrumb-item>加入班级</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 修改学生用户的对话框 -->
    <el-dialog
      title="加入班级"
      :visible.sync="editDialogVisibleStu"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="classCodeForm"
        ref="editUserFormRef"
        :rules="StuFormRules"
        label-width="70px"
      >
        <el-form-item label="班级码" prop="classCode">
          <el-input v-model="classCodeForm.classCode"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="className">
          <el-select v-model="StuForm.className" placeholder="请选择">
            <el-option
              v-for="item in classPOJO"
              :key="item.classId"
              :label="item.className"
              :value="item.className"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisibleStu = false">取 消</el-button>
        <el-button type="primary" @click="joinClass">确 定</el-button>
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
      StuForm: {},
      classCodeForm: {
        classCode: "",
      },
      classPOJO: [],
      // 编辑用户表单验证
      StuFormRules: {
        classCode: [
          { required: true, message: "请输入班级码", trigger: "blur" },
          { min: 4, max: 4, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    const phone = window.sessionStorage.getItem("phone");
    const type = window.sessionStorage.getItem("type");
    this.getClassList();
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
      if (res.status !== 0) {
        return this.$message.error("查询用户信息失败！");
      }
      this.StuForm = res.data;
      this.editDialogVisibleStu = true;
    },

    // 获取班级列表
    async getClassList() {
      let postData = new FormData();
      const { data: res } = await this.$http.post(
        "/class/getClassList",
        postData
      );
      if (res.status === -9) {
        window.sessionStorage.clear();
        this.$message.error("登录信息异常！");
        this.$router.push("/login");
      }
      if (res.status !== 0) {
        return this.$message.error("查询用户信息失败！");
      }
      this.classPOJO = res.data;
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editUserFormRef.resetFields();
    },
    // 修改用户信息
    async joinClass() {
      let postData = new FormData();
      postData.append("id", this.StuForm.id);
      postData.append("classCode", this.classCodeForm.classCode);
      const { data: res } = await this.$http.post("/class/joinClass", postData);
      if (res.status !== 0) {
        this.$message.error("加入班级失败！");
      } else {
        this.$message.success("加入班级成功！");
      }
      // 隐藏添加用户对话框
      this.editDialogVisibleStu = false;
    },
  },
};
</script>

<style lang="less" scoped>
</style>