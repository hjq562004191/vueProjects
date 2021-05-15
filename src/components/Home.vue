<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/xy_logo.png" alt />
        <span> </span>
      </div>
        <span>{{this.userName}} </span>
      <div>
        <el-badge value="new" class="item" :hidden="this.newMessageDisabled" >
           <el-button type="primary" @click="myMessage">消息</el-button>
        </el-badge>
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
     <!-- 消息框 -->
    <el-dialog
      title="我的消息"
      :visible.sync="seeMessageVisible"
      width="50%"
      @close="seeSignClosed"
    >
      <!-- 内容主体 -->
      <el-card>
        <span>{{this.messageStr}} </span>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeMessage">知道了</el-button>
      </span>
    </el-dialog>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="togleCollapse">|||</div>
        <el-menu
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409FFF"
        >
          <!-- :unique-opened="true"->只允许展开一个菜单 -->
          <!-- :collapse-transition="false" -> 关闭动画 -->
          <!-- router -> 导航开启路由模式 -->
          <!-- 一级菜单  -->
          <!-- 个人信息 -->
          <el-submenu index="1">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>用户管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              index="/getUserInfo"
              @click="saveNavState('/getUserInfo')"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>学生信息</span>
              </template>
            </el-menu-item>
            <el-menu-item
              index="/changeUserInfo"
              @click="saveNavState('/changeUserInfo')"
              :disabled="this.unAdminDisabled"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>修改信息</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 人脸管理 -->
          <el-submenu index="2">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i class="el-icon-picture"></i>
              <span>人脸管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/addFace" @click="saveNavState('/addFace')" :disabled="this.unAdminDisabled">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>上传人脸</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 课时管理 -->
          <el-submenu index="3">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i class="el-icon-reading"></i>
              <span>课时管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/seeClassHour" @click="saveNavState('/seeClassHour')" :disabled="this.teacherDisabled">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>查看课时</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/sign" @click="saveNavState('/sign')" :disabled="this.studentDisabled">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>学生签到</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/createSign" @click="saveNavState('/createSign')" :disabled="this.teacherDisabled">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>签到管理</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 班级管理 -->
          <el-submenu index="4">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i class="el-icon-s-comment"></i>
              <span>班级管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="/myClass" @click="saveNavState('/myClass')" :disabled="this.unAdminDisabled">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>我的班级</span>
              </template>
            </el-menu-item>
            <el-menu-item
              index="/joinClass"
              :disabled="this.studentDisabled"
              @click="saveNavState('/joinClass')"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>加入班级</span>
              </template>
            </el-menu-item>
            <el-menu-item
              index="/creatClass"
              @click="saveNavState('/creatClass')"
              :disabled="this.unAdminDisabled"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>创建班级</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 管理员管理 -->
          <el-submenu index="5">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i class="el-icon-bank-card"></i>
              <span>教师管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              index="/author"
              :disabled="this.adminDisabled"
              @click="saveNavState('/author')"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>权限管理</span>
              </template>
            </el-menu-item>
            <el-menu-item
              index="/payClassHour"
              :disabled="this.adminDisabled"
              @click="saveNavState('/payClassHour')"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>课时结费</span>
              </template>
            </el-menu-item>
            <el-menu-item
              index="/passClassHour"
              :disabled="this.adminDisabled"
              @click="saveNavState('/passClassHour')"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>课时审核</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      // 默认不折叠
      isCollapse: false,
      // 被激活导航地址
      activePath: "",
      adminDisabled: true,
      teacherDisabled: true,
      studentDisabled: true,
      unAdminDisabled: false,

      userName: "",
      seeMessageVisible: false,
      newMessageDisabled: true,
      messageStr:"这里空荡荡的，你还没有新消息呢。。。",
    };
  },
  mounted () {
    window.sessionStorage.setItem("id",-1);
    this.getMessage();
        this.timer = window.setInterval(() => {
            setTimeout(() => {
                this.getMessage();
            },5000)
        },8000)
  },
  created() {
    this.activePath = window.sessionStorage.getItem("activePath");
    const type = window.sessionStorage.getItem("type");
    if (type === "3") {
      this.adminDisabled = false;
      this.unAdminDisabled = true;
    }
    if (type === "1") {
      this.studentDisabled = false;
    }
    if (type === "2") {
      this.teacherDisabled = false;
    }
    this.getUserInfo()
  },
  methods: {
    destroyed() {
        window.clearInterval(this.timer)
    },
    async getMessage() {
      const type = window.sessionStorage.getItem("type");
      const id = window.sessionStorage.getItem("id");
      if (type === "1") {
        let postData = new FormData();
        postData.append("stuId", id);
        const { data: res } = await this.$http.post(
          "/message/getStuMessage",
          postData
        );
        if (res.status === 0) {
          this.messageStr = res.message;
          this.newMessageDisabled = false;
          this.destroyed();
        }
      }else if (type === "2") {
        let postData = new FormData();
        postData.append("teacherId", id);
        const { data: res } = await this.$http.post(
          "/message/getTeacherMessage",
          postData
        );
        if (res.status === 0) {
          this.messageStr = res.message;
          this.newMessageDisabled = false;
          this.destroyed();
        }
      }
    },

    async getUserInfo() {
      const phone = window.sessionStorage.getItem("phone");
      const type = window.sessionStorage.getItem("type");
      if (type === "3") {
        let postData = new FormData();
        postData.append("phoneNumber", phone);
        const { data: res } = await this.$http.post("/user/getAdmin", postData);
        if (res.status !== 0) {
          return this.$message.error("查询用户信息失败！");
        }
        window.sessionStorage.setItem("id",res.data.id);
        this.userName = res.data.adminName + " 管理员";
      }
      if (type === "1") {
        let postData = new FormData();
        postData.append("phoneNumber", phone);
        const { data: res } = await this.$http.post(
          "/user/getStudent",
          postData
        );
        if (res.status !== 0) {
          return this.$message.error("查询用户信息失败！");
        }
        window.sessionStorage.setItem("id",res.data.id);
        this.userName = res.data.studentName + " 同学";
      }
      if (type === "2") {
        let postData = new FormData();
        postData.append("phoneNumber", phone);
        const { data: res } = await this.$http.post(
          "/user/getTeacher",
          postData
        );
        if (res.status !== 0) {
          return this.$message.error("查询用户信息失败！");
        }
        window.sessionStorage.setItem("id",res.data.id);
        this.userName = res.data.teacherName + " 老师";
      }
    },
    myMessage(){
      this.seeMessageVisible=true;
    },
    closeMessage(){
      this.seeMessageVisible = false;
      this.newMessageDisabled = true;
    },
    logout() {
      // 清空token
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 菜单的折叠与展开
    togleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存连接的激活地址
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
    },
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.item {
      margin-top: 0px;
      margin-right: 40px;
}
.el-header {
  background-color: RGB(1, 74, 149);
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      height: 40px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;

  .el-menu {
    border: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  // 鼠标放上去变成小手
  cursor: pointer;
}
</style>
