<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户信息</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <!-- stripe: 斑马条纹
        border：边框-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="studentName" label="姓名"></el-table-column>
        <el-table-column prop="className" label="班级"></el-table-column>
        <el-table-column prop="studentNum" label="学号"></el-table-column>
        <el-table-column prop="phoneNumber" label="电话"></el-table-column>
        <el-table-column label="修改/删除学生" >
          <template slot-scope="scope" >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              :disabled="disabled"
              @click="showEditDialog(scope.row.phoneNumber)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              :disabled="disabled"
              @click="removeUserById(scope.row.phoneNumber)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        :model="queryInfo"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totle"
      ></el-pagination>
    </el-card>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="editUserForm"
        ref="editUserFormRef"
        :rules="editUserFormRules"
        label-width="70px"
      >
        <el-form-item label="姓名" prop="studentName">
          <el-input v-model="editUserForm.studentName"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="className">
          <el-input v-model="editUserForm.className" disabled></el-input>
        </el-form-item>
        <el-form-item label="学号" prop="studentNum">
          <el-input v-model="editUserForm.studentNum"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phoneNumber">
          <el-input v-model="editUserForm.phoneNumber" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取用户列表查询参数对象
      queryInfo: {
        // 当前页数
        page: 1,
        // 每页显示多少数据
        pagesize: 5,
      },
      userlist: [],
      totle: 0,
      disabled: false,
      // 修改用户
      editDialogVisible: false,
      editUserForm: {},
      // 编辑用户表单验证
      editUserFormRules: {
        studentNum: [
          { min:8,max:8, trigger: "blur" },
        ],
        phoneNumber: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min:11,max:11, trigger: "blur" },
        ],
      },
    
    };
  },
  created() {
    this.getUserList();
    const type = window.sessionStorage.getItem('type')
    if(type === "1"){
      this.disabled = true;
    }
  },
  methods: {
    async getUserList() {
      let postData = new FormData();
      postData.append("page", this.queryInfo.page);
      postData.append("pageSize", this.queryInfo.pagesize);
      const { data: res } = await this.$http.post(
        "/user/getStudentList",
        postData
      );
      if (res.status === -9) {
        window.sessionStorage.clear();
        this.$message.error("登录信息异常！");
        this.$router.push("/login");
      }
      if (res.status === -1) {
        return this.$message.error("获取用户列表失败！");
      }
      this.userlist = res.data;
      this.totle = res.status;
    },
    // 监听 pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听 页码值 改变事件
    handleCurrentChange(newSize) {
      // console.log(newSize)
      this.queryInfo.page = newSize;
      this.getUserList();
    },

    // 编辑用户信息
    async showEditDialog(phone) {
      let postData = new FormData();
      postData.append("phoneNumber",phone)
      const { data: res } = await this.$http.post("/user/getStudent", postData);
      if (res.status !== 0) {
        return this.$message.error("查询用户信息失败！");
      }
      this.editUserForm = res.data;
      this.editDialogVisible = true;
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editUserFormRef.resetFields();
    },
    // 修改用户信息
    editUser() {
      // 提交请求前，表单预验证
      this.$refs.editUserFormRef.validate(async (valid) => {
        // console.log(valid)
        // 表单预校验失败

        let postData = new FormData();
        postData.append("id", this.editUserForm.id);
        postData.append("studentName", this.editUserForm.studentName);
        postData.append("phoneNumber", this.editUserForm.phoneNumber);
        postData.append("className", this.editUserForm.className);
        postData.append("studentNum", this.editUserForm.studentNum);
        postData.append("studentPassWord", this.editUserForm.studentPassWord);
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/user/changeStudent",
          postData
        );
        if (res.status !== 0) {
          this.$message.error("更新用户信息失败！");
        }
        // 隐藏添加用户对话框
        this.editDialogVisible = false;
        this.$message.success("更新用户信息成功！");
        this.getUserList();
      });
    },
    // 删除用户
    async removeUserById(phoneNumber) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 点击确定 返回值为：confirm
      // 点击取消 返回值为： cancel
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      let postData = new FormData();
      postData.append("phoneNumber", phoneNumber);
      const { data: res } = await this.$http.post(
        "/user/deleteStudent",
        postData
      );
      if (res.status !== 0) return this.$message.error("删除用户失败！");
      this.$message.success("删除用户成功！");
      this.getUserList();
    },
  },
};
</script>

<style lang="less" scoped>
</style>