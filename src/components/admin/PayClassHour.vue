<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教师管理</el-breadcrumb-item>
      <el-breadcrumb-item>课时结费</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="payMoney.money">
            <el-button  slot="append" type="primary" @click="setPayMoney()">设置课时单费</el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <!-- stripe: 斑马条纹
        border：边框-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="teacherName" label="姓名"></el-table-column>
        <el-table-column prop="phoneNumber" label="电话"></el-table-column>
        <el-table-column prop="classHour" label="课时"></el-table-column>
        <el-table-column label="课时费用">
           <template slot-scope="scope">
           {{payMoney.money*scope.row.classHour}}
          </template>
        </el-table-column>
        <el-table-column label="结账">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-bank-card"
              size="mini"
              circle
              @click="showEditDialog(scope.row.phoneNumber)"
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
      title="结算课时费用"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="payMoney"
        ref="editUserFormRef"
        label-width="70px"
      >
        <el-form-item label="姓名" prop="teacherName">
          <el-input v-model="editUserForm.teacherName" readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phoneNumber">
          <el-input v-model="editUserForm.phoneNumber" readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="课时" prop="classHour">
          <el-input v-model="editUserForm.classHour" readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="元/小时" prop="money">
          <el-input v-model="payMoney.money"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="pay">结 算</el-button>
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
      // 修改用户
      editDialogVisible: false,
      editUserForm: {},
      payMoney:{
        money:"200",
      }
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
        "/user/getClassHourList",
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
      postData.append("phoneNumber", phone);
      const { data: res } = await this.$http.post("/user/getTeacher", postData);
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
    pay() {
      // 提交请求前，表单预验证
      this.$refs.editUserFormRef.validate(async (valid) => {
        if (!valid) return;
        let postData = new FormData();
        postData.append("phoneNumber", this.editUserForm.phoneNumber);

        const { data: res } = await this.$http.post(
          "/user/clearClassHour",
          postData
        );
        if (res.status !== 0) {
          this.$message.error("结账失败！");
        }
        // 隐藏添加用户对话框
        this.editDialogVisible = false;
        this.$message.success("结账成功！");
        this.getUserList();
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>