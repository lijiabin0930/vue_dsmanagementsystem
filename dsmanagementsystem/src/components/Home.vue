<template>
    <!--    lay-out布局容器-->
    <el-container class="home_container">
    <!--      头部区域-->
      <el-header height="50px">
        <!--        flex 水平布局-->
        <div>
          <img class="img" src="../assets/img/后台.svg" alt="" height="25px" width="50px">
          <span>电商后台管理系统</span>
        </div>
        <div>
          <el-button type="info" @click="logout">登录</el-button>
          <el-button type="info" @click="logout">退出</el-button>
        </div>
      </el-header>
      <el-container>
    <!--        侧边栏-->
        <el-aside width="200px">
    <!--          侧边栏菜单区-->
          <el-menu
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
      <!--            一级菜单-->
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
              <el-submenu index="1-1">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
              </el-submenu>
            </el-submenu>
          </el-menu>
        </el-aside>





    <!--        主页面-->
        <el-main>Main</el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  name: "Home",
  methods:{
    //退出登录
    logout(){
      //1）清空token
      window.sessionStorage.clear()
      //2）页面跳转至登录页面
      this.$router.push('/login')
    },
  }
}
</script>

<style lang="less" scoped>
  .home_container {
    height: 100%;
  }
  //layout布局标签中 标签名字就是类名字
  .el-header {
    background-color: #535C65;
    display: flex;
    //左右贴边对齐
    justify-content: space-between;
    padding-left: 0;
    padding-right: 10px;
    //字体居中
    align-items: center;
    color: #f7f7f7;
    font-size: 20px;
    > div{
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }
  .el-aside {
    background-color: #535C65;
  }
  .el-main {
    background-color: #F9F9FA;
    padding: 0;
  }
</style>