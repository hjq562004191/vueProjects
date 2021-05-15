<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教师管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <!-- stripe: 斑马条纹
        border：边框-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="teacherName" label="姓名"></el-table-column>
        <el-table-column prop="phoneNumber" label="电话"></el-table-column>
        <el-table-column label="权限">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.authorLock"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
              @change="setLock(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="删除">
          <template slot-scope="scope">
          <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="removeUserById(scope.row.id)"
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
      payMoney: {
        money: "200",
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      let postData = new FormData();
      postData.append("page", this.queryInfo.page);
      postData.append("pageSize", this.queryInfo.pagesize);
      const { data: res } = await this.$http.post(
        "/user/getTeacherList",
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
    async setLock(user) {
      let postData = new FormData();
      postData.append("phoneNumber", user.phoneNumber);
      postData.append("authorLock", user.authorLock);
      const { data: res } = await this.$http.post(
        "/user/changeAuthor",
        postData
      );
      if (res.status === -1) {
        return this.$message.error("设置权限失败！");
      }
      if (user.authorLock === "1") {
        this.$message.success("教师账号权限已激活！");
      } else {
        this.$message.error("教师账号权限已取消！");
      }

      this.userlist = res.data;
      this.totle = res.status;
      this.getUserList();
    },
    // 删除用户
    async removeUserById(id) {
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
      postData.append("id", id);
      const { data: res } = await this.$http.post(
        "/user/deleteTeacherById",
        postData
      );
      if (res.status !== 0) return this.$message.error("删除教师失败！");
      this.$message.success("删除教师成功！");
      this.getUserList();
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
  },
};
</script>

<style lang="less" scoped>
</style>