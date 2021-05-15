import Vue from "vue";
import VueRouter from "vue-router";

// 引入组件
// import Login from "../components/Login.vue";
// import Home from "../components/Home.vue";
// import Register from "../components/Register.vue";
// import Phone from "../components/Phone.vue"
// import Welcome from "../components/Welcome.vue"
// import UserInfo from "../components/user/UserInfo.vue"
// import ChangeUserInfo from "../components/user/ChangeUserInfo.vue"
// import AddFace from "../components/face/AddFace.vue"
// import Sign from "../components/sign/Sign.vue"
// import ClassInfo from "../components/class/ClassInfo.vue"
// import JoinClass from "../components/class/JoinClass.vue"
// import CreatClass from "../components/class/CreatClass.vue"
// import PayClassHour from "../components/admin/PayClassHour.vue"
// import Author from "../components/admin/Author.vue"
// import CreateSign from "../components/sign/CreateSign.vue"
// import See from "../components/sign/SeeClassHour.vue"

//路由懒加载
const Login = () => import(/* webpackChunkName: "Login" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "Login" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Login" */ '../components/Welcome.vue')
const GetMessage = () => import(/* webpackChunkName: "Login" */ '../components/message/getMessage.vue')

const Register = () => import(/* webpackChunkName: "Register" */ '../components/Register.vue')
const Phone = () => import(/* webpackChunkName: "Register" */ '../components/Phone.vue')

const UserInfo = () => import(/* webpackChunkName: "User" */ '../components/user/UserInfo.vue')
const ChangeUserInfo = () => import(/* webpackChunkName: "User" */ '../components/user/ChangeUserInfo.vue')

const AddFace = () => import(/* webpackChunkName: "Face" */ '../components/face/AddFace.vue')

const Sign = () => import(/* webpackChunkName: "Sign" */ '../components/sign/Sign.vue')
const CreateSign = () => import(/* webpackChunkName: "Sign" */ '../components/sign/CreateSign.vue')
const See = () => import(/* webpackChunkName: "Sign" */ '../components/sign/SeeClassHour.vue')

const ClassInfo = () => import(/* webpackChunkName: "Class" */ '../components/class/ClassInfo.vue')
const JoinClass = () => import(/* webpackChunkName: "Class" */ '../components/class/JoinClass.vue')
const CreatClass = () => import(/* webpackChunkName: "Class" */ '../components/class/CreatClass.vue')

const PayClassHour = () => import(/* webpackChunkName: "Admin" */ '../components/admin/PayClassHour.vue')
const Author = () => import(/* webpackChunkName: "Admin" */ '../components/admin/Author.vue')
const PassClassHour = () => import(/* webpackChunkName: "Admin" */ '../components/admin/PassClassHour.vue')

// 要告诉 vue 使用 vueRouter
Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/getUserInfo', component: UserInfo },
      { path: '/changeUserInfo', component: ChangeUserInfo },
      { path: '/addFace', component: AddFace },
      { path: '/sign', component:Sign },
      { path: '/myClass', component:ClassInfo },
      { path: '/joinClass', component:JoinClass },
      { path: '/creatClass', component:CreatClass },
      { path: '/payClassHour', component:PayClassHour },
      { path: '/author', component:Author },
      { path: '/createSign', component:CreateSign },
      { path: '/seeClassHour', component:See },
      { path: '/getMessage',component:GetMessage },
      { path: '/passClassHour',component:PassClassHour}
    ]
  },
  
  {
    path: '/register',
    component: Register
  },
  {
    path: '/phone',
    component: Phone
  }
]

var router = new VueRouter({
  routes
})



export default router