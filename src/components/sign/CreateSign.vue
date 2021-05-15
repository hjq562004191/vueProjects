<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课时管理</el-breadcrumb-item>
      <el-breadcrumb-item>签到管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="disabled"
        @click="creatSignVisible = true"
      ></el-button>
      <!-- 用户列表区域 -->
      <el-table :data="signlist" border stripe>
        <!-- stripe: 斑马条纹
        border：边框-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="signTitle" label="主题"></el-table-column>
        <el-table-column prop="className" label="班级"></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          :formatter="timestampToTime"
        ></el-table-column>
        <el-table-column prop="endTime" label="持续时间(分钟)"></el-table-column>
        <el-table-column label="查看签到情况">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              @click="seeSignStudent(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              :disabled="judge(scope.row.islock)"
              @click="removeSignById(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
       <el-table-column label="教师签退">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              :disabled="judge(scope.row.teacherSign)"
              @click="showEditDialog(scope.row.id)"
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
    <!-- 签退对话框 -->
    <el-dialog
      class="camera_outer"
      title="教师签退"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <video
        id="videoCamera"
        :width="videoWidth"
        :height="videoHeight"
        autoplay
      ></video>
      <canvas
        style="display: none"
        id="canvasCamera"
        :width="videoWidth"
        :height="videoHeight"
      ></canvas>
      <div class="img_bg_camera">
        <img :src="imgSrc" alt="" class="tx_img" />
      </div>
      <div class="btns">
        <el-button type="primary" @click="getCompetence()"
          >打开摄像头</el-button
        >
        <el-button type="info" @click="stopNavigator()">关闭</el-button>
        <el-button type="primary" @click="setImage()">拍照</el-button>
        <el-button type="primary" :disabled="imageDisabled" @click="postImage()"
          >签退</el-button
        >
      </div>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
    <!-- 创建签到的对话框 -->
    <el-dialog
      title="创建签到"
      :visible.sync="creatSignVisible"
      width="50%"
      @close="creatSignClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="createSignForm"
        ref="creatSignFormRef"
        :rules="editSignRules"
        label-width="80px"
      >
        <el-form-item label="签到主题" prop="signTitle">
          <el-input v-model="createSignForm.signTitle"></el-input>
        </el-form-item>
        <el-form-item label="班级名称" prop="className">
          <el-select v-model="createSignForm.className" placeholder="请选择">
            <el-option
              v-for="item in classPOJO"
              :key="item.classId"
              :label="item.className"
              :value="item.className"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程时长" prop="classHour">
          <el-select v-model="createSignForm.classHour" placeholder="请选择">
            <el-option label="1小时" value="1"></el-option>
            <el-option label="2小时" value="2"></el-option>
            <el-option label="3小时" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="持续时间" prop="endTime">
           <el-select v-model="createSignForm.endTime" placeholder="请选择">
            <el-option label="5分钟" value="5"></el-option>
            <el-option label="10分钟" value="10"></el-option>
            <el-option label="30分钟" value="30"></el-option>
            <el-option label="1小时" value="60"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createSign">创 建</el-button>
        <el-button @click="creatSignVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 签到情况的对话框 -->
    <el-dialog
      title="签到情况"
      :visible.sync="seeSignVisible"
      width="50%"
      @close="seeSignClosed()"
    >
      <!-- 内容主体 -->
      <el-table :data="seeSignList" border stripe>
        <!-- stripe: 斑马条纹
        border：边框-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="sign" label="签到"></el-table-column>
        
        <el-table-column label="改为已签到">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              :disabled="judgeSign(scope.row.sign)"
              @click="signStudent(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="seeSignVisible = false">关 闭</el-button>
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
      signId:"",
      videoWidth: 300,
      videoHeight: 300,
      imgSrc: "",
      thisCancas: null,
      thisContext: null,
      thisVideo: null,
      imageDisabled: true,
      totle: 0,
      signlist: [],
      classPOJO: [],
      disabled: true,
      editDialogVisible: false,
      seeSignVisible: false,
      creatSignVisible: false,

      createSignForm: {
        className: "",
        signTitle: "",
        endTime: "",
        classHour: "",
      },

      seeSignList: [],
      
      editSignRules: {
        signTitle: [
          { required: true, message: "请输入内容", trigger: "blur" },
          { min: 1, max: 15, trigger: "blur" },
        ],
        classHour: [{ required: true, message: "请输入课时", trigger: "blur" }],
        className: [
          { required: true, message: "请输入班级名称", trigger: "blur" },
          { min: 1, max: 15, trigger: "blur" },
        ],
      },

    };
  },
  created() {
    this.getClassList();
    this.getsignlist();
    const type = window.sessionStorage.getItem("type");
    if (type === "2") {
      this.disabled = false;
    }
  },mounted() {
    this.getCompetence();
  },
  methods: {
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
      if (res.status === -1) {
        return this.$message.error("查询班级信息失败！");
      }
      this.classPOJO = res.data;
    },
    //展示签退框
    async showEditDialog(id) {
      this.signId = id;
      this.editDialogVisible = true;
    },
    //校验签退人脸
    async postImage() {
      const confirmResult = await this.$confirm(
        "签退时长如果小于半小时不会累加课时, 是否继续?",
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
      var _this = this;
      const phone = window.sessionStorage.getItem("phone");
      const id = window.sessionStorage.getItem("id");
      let postData = new FormData();
      postData.append("phone", phone);
      postData.append("image", _this.imgSrc);
      postData.append("hourId",this.signId);
      postData.append("userId",id);
      _this.imageDisabled = true;
      this.thisVideo.srcObject.getTracks()[0].stop();
      let res = await _this.$http.post("/face/teacherSearchFace", postData);
      if (res.data.status === 1){
        this.editDialogVisible = false;
        this.getsignlist();
        return this.$message.error("课时时长较短，不进行累计");
      } 
      if (res.data.status === 2){
        this.editDialogVisible = false;
        this.getsignlist();
        return this.$message.success("签退成功");
      } 
      if (res.data.status !== 0){
        this.editDialogVisible = false;
        this.getsignlist();
        return this.$message.error("签退失败");
      } 
      _this.$message.success("签退成功");
      this.editDialogVisible = false;
      this.getsignlist();
    },
    //  绘制图片（拍照功能）
    setImage() {
      var _this = this;
      // 点击，canvas画图
      _this.thisContext.drawImage(
        _this.thisVideo,
        0,
        0,
        _this.videoWidth,
        _this.videoHeight
      );
      // 获取图片base64链接
      var image = this.thisCancas.toDataURL("image/png");
      _this.imgSrc = image;
      _this.imageDisabled = false;
    },
    // 调用权限（打开摄像头功能）
    getCompetence() {
      var _this = this;
      this.thisCancas = document.getElementById("canvasCamera");
      this.thisContext = this.thisCancas.getContext("2d");
      this.thisVideo = document.getElementById("videoCamera");
      // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
      // 使用getUserMedia，因为它会覆盖现有的属性。
      // 这里，如果缺少getUserMedia属性，就添加它。
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // 首先获取现存的getUserMedia(如果存在)
          var getUserMedia =
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.getUserMedia;
          // 有些浏览器不支持，会返回错误信息
          // 保持接口一致
          if (!getUserMedia) {
            return Promise.reject(
              new Error("getUserMedia is not implemented in this browser")
            );
          }
          // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }
      var constraints = {
        audio: false,
        video: {
          width: this.videoWidth,
          height: this.videoHeight,
          transform: "scaleX(-1)",
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
          // 旧的浏览器可能没有srcObject
          if ("srcObject" in _this.thisVideo) {
            _this.thisVideo.srcObject = stream;
          } else {
            // 避免在新的浏览器中使用它，因为它正在被弃用。
            _this.thisVideo.src = window.URL.createObjectURL(stream);
          }
          _this.thisVideo.onloadedmetadata = function (e) {
            _this.thisVideo.play();
          };
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 关闭摄像头
    stopNavigator() {
      this.editDialogVisible = false;
      this.thisVideo.srcObject.getTracks()[0].stop();
    },
    judge(islock){
      if (islock === "1") {
        return true;
      }else{
        return false;
      }
    },
    judgeSign(sign){
      if (sign === "已签到") {
        return true;
      }else{
        return false;
      }
    },
    async getsignlist() {
      const phone = window.sessionStorage.getItem("phone");

      let postData = new FormData();
      postData.append("phoneNumber", phone);
      postData.append("page", this.queryInfo.page);
      postData.append("pageSize", this.queryInfo.pagesize);
      const { data: res } = await this.$http.post(
        "/hour/getTeacherClassHourList",
        postData
      );
      if (res.status === -9) {
        window.sessionStorage.clear();
        this.$message.error("登录信息异常！");
        this.$router.push("/login");
      }
      if (res.status === -1) {
        return this.$message.error("获取签到列表失败！");
      }
      this.signlist = res.data;
      this.totle = res.status;
    },
    async seeSignStudent(id) {
      window.sessionStorage.setItem("hourId",id);
      let postData = new FormData();
      postData.append("hourId", id);
      const { data: res } = await this.$http.post(
        "/hour/getStudentSign",
        postData
      );
      if (res.status !== 0) {
        return this.$message.error("查看详情失败！");
      }
      this.seeSignList = res.data;
      this.seeSignVisible = true;
    },
    creatSignClosed() {
      this.$refs.creatSignFormRef.resetFields();
    },
    seeSignClosed() {
      this.$refs.seeSignFormRef.resetFields();
    },
    // 删除用户
    async removeSignById(id) {
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
      postData.append("id", id);
      const { data: res } = await this.$http.post(
        "/hour/deleteSign",
        postData
      );
      if (res.status !== 0) return this.$message.error("删除失败！");
      this.$message.success("删除成功！");
      this.getsignlist();
    },
    async signStudent(id){
      const hourId = window.sessionStorage.getItem("hourId");
      let postData = new FormData();
      postData.append("signId", hourId);
      postData.append("userId", id);
      const { data: res } = await this.$http.post(
        "/hour/signStudent",
        postData
      );
      if (res.status !== 0) {
        return this.$message.error("修改签到失败！");
      }
      this.$message.success("修改签到成功！");
      this.getagainsignlist();
    },
    async getagainsignlist(){
      const id = window.sessionStorage.getItem("hourId");
      let postData = new FormData();
      postData.append("hourId", id);
      const { data: res } = await this.$http.post(
        "/hour/getStudentSign",
        postData
      );
      if (res.status !== 0) {
        return this.$message.error("查看详情失败！");
      }
      this.seeSignList = res.data;
    },
    async createSign() {
      const id = window.sessionStorage.getItem("id");
      let postData = new FormData();
      postData.append("className", this.createSignForm.className);
      postData.append("teacherId", id);
      postData.append("classHour", this.createSignForm.classHour);
      postData.append("signTitle", this.createSignForm.signTitle);
      postData.append("endTime", this.createSignForm.endTime);
      const { data: res } = await this.$http.post(
        "/hour/createHourSign",
        postData
      );
      if (res.status !== 0) {
        return this.$message.error("创建签到失败！");
      }
      this.creatSignVisible = false;
      this.$message.success("创建签到成功！");
      this.getsignlist();
    },
    timestampToTime(row) {
      var date = new Date(row.createTime * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
      this.getsignlist();
    },
    // 监听 页码值 改变事件
    handleCurrentChange(newSize) {
      // console.log(newSize)
      this.queryInfo.page = newSize;
      this.getsignlist();
    },
  },
};
</script>

<style lang="less" scoped>
.camera_outer {
  .img_bg_camera {
    position: absolute;
    right: 20px;
    top: 85px;
    img {
      width: 300px;
      height: 300px;
    }
  }
  .btns {
    display: flex;
    justify-content: center;
  }
}
</style>