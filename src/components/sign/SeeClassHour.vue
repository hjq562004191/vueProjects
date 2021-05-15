<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课时管理</el-breadcrumb-item>
      <el-breadcrumb-item>查看课时</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 用户列表区域 -->
      <el-table :data="userForm" border stripe>
        <!-- stripe: 斑马条纹
        border：边框-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="teacherName" label="姓名"></el-table-column>
        <el-table-column prop="phoneNumber" label="电话"></el-table-column>
        <el-table-column prop="classHour" label="课时"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userForm:[],
    };
  },
  created() {
    const id = window.sessionStorage.getItem("id");
    this.getUser(id);
  },
  methods: {
    async getUser(id) {
      let postData = new FormData();
      postData.append("id", id);
      const { data: res } = await this.$http.post(
        "/user/getTeacherById",
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
      this.userForm = res.data;
    },
  },
};
</script>

<style lang="less" scoped>
</style>