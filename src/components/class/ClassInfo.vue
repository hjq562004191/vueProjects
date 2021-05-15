<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
      <el-breadcrumb-item>我的班级</el-breadcrumb-item>
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
      stuForm: {},
    };
  },
  created() {
    const phone = window.sessionStorage.getItem("phone");
    const type = window.sessionStorage.getItem("type");

    if (type === "1") {
      this.getUserList(phone);
    } else if (type === "2") {
      this.getTeacherClass(phone);
    }
  },
  methods: {
    async getUserList(phone) {
      let postData = new FormData();
      postData.append("page", this.queryInfo.page);
      postData.append("pageSize", this.queryInfo.pagesize);
      postData.append("phone", phone);
      const { data: res } = await this.$http.post(
        "/user/getStudentListClass",
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
    async getTeacherClass(phone) {
      let postData = new FormData();
      postData.append("page", this.queryInfo.page);
      postData.append("pageSize", this.queryInfo.pagesize);
      postData.append("phone", phone);
      const { data: res } = await this.$http.post(
        "/user/getTeacherClass",
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
      const phone = window.sessionStorage.getItem("phone");
      const type = window.sessionStorage.getItem("type");
      this.queryInfo.pagesize = newSize;
      if (type === "1") {
        this.getUserList(phone);
      } else if (type === "2") {
        this.getTeacherClass(phone);
      }
    },
    // 监听 页码值 改变事件
    handleCurrentChange(newSize) {
      const phone = window.sessionStorage.getItem("phone");
      const type = window.sessionStorage.getItem("type");
      this.queryInfo.page = newSize;
      if (type === "1") {
        this.getUserList(phone);
      } else if (type === "2") {
        this.getTeacherClass(phone);
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>