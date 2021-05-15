<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
      <el-breadcrumb-item>创建班级</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="disabled"
        @click="creatClassVisible = true"
      ></el-button>
      <!-- 用户列表区域 -->
      <el-table :data="classlist" border stripe>
        <!-- stripe: 斑马条纹
        border：边框-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="classPOJO.className"
          label="班级"
        ></el-table-column>
        <el-table-column prop="teachers" label="老师"></el-table-column>
        <el-table-column label="开放/删除班级">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              :disabled="disabled"
              @click="showAllowDialog(scope.row.classPOJO.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              :disabled="disabled"
              @click="
                removeClassById(
                  scope.row.classPOJO.id,
                  scope.row.classPOJO.className
                )
              "
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
    <!-- 允许学生进入的对话框 -->
    <el-dialog
      title="开放班级"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="editClassForm"
        ref="editClassFormRef"
        :rules="editClassRules"
        label-width="80px"
      >
        <el-col :span="8">
          <p class="code">{{ this.classCode }}</p>
        </el-col>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editDialogVisible = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>

    <!-- 创建班级的对话框 -->
    <el-dialog
      title="创建班级"
      :visible.sync="creatClassVisible"
      width="50%"
      @close="creatClassClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="creatClassForm"
        ref="creatClassFormRef"
        :rules="editClassRules"
        label-width="80px"
      >
        <el-form-item label="班级名称" prop="className">
          <el-input v-model="creatClassForm.className"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="creatClass">创 建</el-button>
        <el-button @click="creatClassVisible = false">取 消</el-button>
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
      classlist: [],
      totle: 0,
      disabled: false,
      // 允许进入班级
      editDialogVisible: false,
      creatClassVisible: false,
      creatClassForm:{
        className:"",
      },
      editClassForm: {},
      // 编辑用户表单验证
      editClassRules: {
        className: [
          { required: true, message: "请输入班级名称", trigger: "blur" },
          { min: 6, max: 15, trigger: "blur" },
        ],
      },
      classCode: "",
    };
  },
  created() {
    this.getClassList();
    const type = window.sessionStorage.getItem("type");
    if (type === "1") {
      this.disabled = true;
    }
  },
  methods: {
    async getClassList() {
      let postData = new FormData();
      postData.append("page", this.queryInfo.page);
      postData.append("pageSize", this.queryInfo.pagesize);
      const { data: res } = await this.$http.post(
        "/class/getClassAndTeacherList",
        postData
      );
      if (res.status === -9) {
        window.sessionStorage.clear();
        this.$message.error("登录信息异常！");
        this.$router.push("/login");
      }
      if (res.status === -1) {
        return this.$message.error("获取班级列表失败！");
      }
      this.classlist = res.data;
      this.totle = res.status;
    },
    // 监听 pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize;
      this.getClassList();
    },
    // 监听 页码值 改变事件
    handleCurrentChange(newSize) {
      // console.log(newSize)
      this.queryInfo.page = newSize;
      this.getClassList();
    },

    async showAllowDialog(classId) {
      const phone = window.sessionStorage.getItem("phone");
      let postData = new FormData();
      postData.append("classId", classId);
      postData.append("phoneNumber", phone);
      const { data: res } = await this.$http.post(
        "/class/allowJoinClass",
        postData
      );
      if (res.status !== 0) {
        return this.$message.error("开放班级失败！");
      }
      this.$message.success("开放班级成功！");
      this.classCode = res.data;
      this.editDialogVisible = true;
      this.getClassList();
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editClassFormRef.resetFields();
    },
    creatClassClosed() {
      this.$refs.creatClassFormRef.resetFields();
    },
    // 修改用户信息
    editUser() {
      // 提交请求前，表单预验证
      this.$refs.editClassFormRef.validate(async (valid) => {
        // console.log(valid)
        // 表单预校验失败

        let postData = new FormData();
        postData.append("id", this.editClassForm.id);
        postData.append("studentName", this.editClassForm.studentName);
        postData.append("phoneNumber", this.editClassForm.phoneNumber);
        postData.append("className", this.editClassForm.className);
        postData.append("studentNum", this.editClassForm.studentNum);
        postData.append("studentPassWord", this.editClassForm.studentPassWord);
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
    async removeClassById(classId, className) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该班级, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      let postData = new FormData();
      postData.append("id", classId);
      postData.append("className", className);

      const { data: res } = await this.$http.post(
        "/class/deleteClass",
        postData
      );
      if (res.status !== 0) return this.$message.error("删除班级失败！");
      this.$message.success("删除班级成功！");
      this.getClassList();
    },
    async creatClass() {
      const phone = window.sessionStorage.getItem("phone");
      let postData = new FormData();
      postData.append("className", this.creatClassForm.className);
      postData.append("phoneNumber", phone);
      const { data: res } = await this.$http.post("/class/creatClass", postData);
      if (res.status !== 0) {
        return this.$message.error("创建班级失败！");
      }
      this.getClassList();
      this.creatClassVisible = false;
      this.$message.success("创建班级成功！");
    },
  },
};
</script>

<style lang="less" scoped>
.code {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  font-size: 300%;
}
</style>