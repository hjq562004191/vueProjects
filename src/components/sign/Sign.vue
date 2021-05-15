<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课时管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生签到</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 用户列表区域 -->
      <el-table :data="hourlist" border stripe>
        <!-- stripe: 斑马条纹
        border：边框-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="signTitle" label="主题"></el-table-column>
        <el-table-column prop="className" label="班级"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="timestampToTime"></el-table-column>
        <el-table-column prop="endTime" label="持续时间(分钟)"></el-table-column>
        <el-table-column label="签到">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-thumb"
              size="mini"
              circle
              :disabled="stuDisabled"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      class="camera_outer"
      title="课程签到"
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
        <el-button type="primary" :disabled="disabled" @click="postImage()"
          >签到</el-button
        >
      </div>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
  </div>
</template>
  <script>
export default {
  data() {
    return {
      signId:"",
      stuDisabled: true,
      videoWidth: 300,
      videoHeight: 300,
      imgSrc: "",
      thisCancas: null,
      thisContext: null,
      thisVideo: null,
      hourlist: [],
      totle: 0,
      disabled: false,
      // 修改用户
      editDialogVisible: false,
      editUserForm: {},
      // 编辑用户表单验证
      editUserFormRules: {
        studentNum: [{ min: 8, max: 8, trigger: "blur" }],
        phoneNumber: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 11, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    const type = window.sessionStorage.getItem("type");
    if (type === "1") {
      this.stuDisabled = false;
    }
    this.getClassHourList();
  },
  mounted() {
    this.getCompetence();
  },
  methods: {
    async getClassHourList() {
      const phone = window.sessionStorage.getItem("phone");
      let postData = new FormData();
      postData.append("phoneNumber", phone);
      const { data: res } = await this.$http.post(
        "/hour/getClassHourList",
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
    // 编辑用户信息
    async showEditDialog(id) {
      this.signId = id;
      this.editDialogVisible = true;
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
      _this.disabled = false;
    },
    // 关闭摄像头
    stopNavigator() {
      this.editDialogVisible = false;
      this.thisVideo.srcObject.getTracks()[0].stop();
    },
    async postImage() {
      var _this = this;
      const phone = window.sessionStorage.getItem("phone");
      const id = window.sessionStorage.getItem("id");
      let postData = new FormData();
      postData.append("phone", phone);
      postData.append("image", _this.imgSrc);
      postData.append("signId",this.signId);
      postData.append("userId",id);
      _this.disabled = true;
      let res = await _this.$http.post("/face/searchFace", postData);
      if (res.data.status !== 0) return this.$message.error("签到失败");
      _this.stuDisabled = true;
      _this.$message.success("签到成功");
    },
    timestampToTime(row) {
      var date = new Date(row.createTime*1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
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