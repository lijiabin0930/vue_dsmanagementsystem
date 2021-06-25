<template>
  <el-button type="info" @click="logout">退出</el-button>
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

</style>