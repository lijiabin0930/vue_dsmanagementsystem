<template>
  <div>
  <!--    面包屑-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

  <!--    卡片视图-->
    <el-card class="box-card">
      <!--      权限列表 data绑定需要遍历的数据值-->
      <el-table
          :data="rightList"
          border
          style="width: 100%" stripe >
  <!--        prop 负责自动遍历对应列表中每一个对象对key的值-->
        <el-table-column
            type="index"
            width="50">
        </el-table-column>
        <el-table-column
            prop="authName"
            label="权限名称">
        </el-table-column>
        <el-table-column
            prop="path"
            label="路径">
        </el-table-column>
        <el-table-column
            prop="level"
            label="等级"
            width="180" align="center">
        <!--          加上标签特效-->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'" >一级</el-tag>
            <el-tag v-else-if="scope.row.level==='1'" type="success" >二级</el-tag>
            <el-tag v-else type="danger" >三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Rights",
  created() {
    // 发起数据请求
    this.getRightList()
  },
  data(){
    return {
      //所有的权限列表
      rightList: []
    }
  },
  methods:{
    async getRightList(){
      //获取所有权限列表
      const {data :res} = await this.$http.get('rights/list')
      if (res.meta.status !== 200){
        return this.$message.error('获取权限列表失败！！！')
      }
      this.rightList = res.data
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