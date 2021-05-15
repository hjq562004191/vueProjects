<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教师管理</el-breadcrumb-item>
      <el-breadcrumb-item>课时审核</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 用户列表区域 -->
      <el-table :data="hourlist" border stripe>
        <!-- stripe: 斑马条纹
        border：边框-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="title" label="签到标题"></el-table-column>
        <el-table-column prop="creatTime" label="创建时间" :formatter="timestampToTime"></el-table-column>
        <el-table-column prop="signTime" label="签到时间" :formatter="timestampToTime2"></el-table-column>
        <el-table-column prop="realHour" label="课时"></el-table-column>
        <el-table-column label="审核课时">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.switch"
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
              :disabled="judge(scope.row.switch)"
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
        :page-sizes="[5, 10, 15, 20]"
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
        pagesize: 10,
      },
      hourlist: [],
      totle: 0,
    };
  },
  created() {
    this.getHourlist();
  },
  methods: {
    async getHourlist() {
      let postData = new FormData();
      postData.append("page", this.queryInfo.page);
      postData.append("pageSize", this.queryInfo.pagesize);
      const { data: res } = await this.$http.post(
        "/hour/getAllClassHourList",
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
      this.hourlist = res.data;
      this.totle = res.status;
    },
    async setLock(hour) {
      let postData = new FormData();
      postData.append("hourId", hour.id);
      postData.append("Switch", hour.switch);
      const { data: res } = await this.$http.post(
        "/hour/changeHourSwitch",
        postData
      );
      if (res.status === -9) {
        window.sessionStorage.clear();
        this.$message.error("登录信息异常！");
        this.$router.push("/login");
      }
      if (res.status === -1) {
        return this.$message.error("设置权限失败！");
      }
      if (hour.switch === "1") {
        this.$message.success("教师课时审核通过！");
      } else {
        this.$message.error("教师课时审核不通过！");
      }
      this.getHourlist();
    },
    judge(str){
        if (str === "1") {
            return true
        }else{
            return false
        }
    },
    // 删除用户
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该信息, 是否继续?",
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
        "/hour/deleteHourById",
        postData
      );
      if (res.status === -9) {
        window.sessionStorage.clear();
        this.$message.error("登录信息异常！");
        this.$router.push("/login");
      }
      if (res.status !== 0) return this.$message.error("删除失败！");
      this.$message.success("删除成功！");
      this.getHourlist();
    },
    timestampToTime(row) {
      var date = new Date(row.creatTime * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = (date.getDate() + 1 < 10
          ? "0" + (date.getDate() + 1)
          : date.getDate() + 1) + " ";
      var h = (date.getHours() + 1 < 10
          ? "0" + (date.getHours() + 1)
          : date.getHours() + 1) + ":";
      var m = (date.getMinutes() + 1 < 10
          ? "0" + (date.getMinutes() + 1)
          : date.getMinutes() + 1) + ":";
      var s = (date.getSeconds() + 1 < 10
          ? "0" + (date.getSeconds() + 1)
          : date.getSeconds() + 1);
      return Y + M + D + h + m + s;
    },
    timestampToTime2(row) {
      var date = new Date(row.signTime * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = (date.getDate() + 1 < 10
          ? "0" + (date.getDate() + 1)
          : date.getDate() + 1) + " ";
      var h = (date.getHours() + 1 < 10
          ? "0" + (date.getHours() + 1)
          : date.getHours() + 1) + ":";
      var m = (date.getMinutes() + 1 < 10
          ? "0" + (date.getMinutes() + 1)
          : date.getMinutes() + 1) + ":";
      var s = (date.getSeconds() + 1 < 10
          ? "0" + (date.getSeconds() + 1)
          : date.getSeconds() + 1);
      return Y + M + D + h + m + s;
    },
    // 监听 pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize;
      this.getHourlist();
    },
    // 监听 页码值 改变事件
    handleCurrentChange(newSize) {
      // console.log(newSize)
      this.queryInfo.page = newSize;
      this.getHourlist();
    },
  },
};
</script>

<style lang="less" scoped>
</style>