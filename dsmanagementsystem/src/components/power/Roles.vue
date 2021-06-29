<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card class="box-card">
      <!--      添加角色按钮区域 row col 行列控制-->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!--      角色列表区域-->


    </el-card>
  </div>
</template>

<script>
export default {
  name: "Roles",
  //一个用户有一个角色一个角色有多个权限
  created() {
    //  获取所有角色的列表数据
    this.getRoleList()
  },
  data() {
    return {
      roleList: []
    }
  },
  methods: {
    //  获取所有角色的列表数据
    async getRoleList() {
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message({
          showClose: true,
          message: '获取用户列表失败！',
          type: 'error'
        });
      }
      this.roleList = res.data
      return this.$message({
        showClose: true,
        message: '获取用户列表成功！',
        type: 'success'
      });
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: 10px;
}

.box-card {
  margin-top: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>