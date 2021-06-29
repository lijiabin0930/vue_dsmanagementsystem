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
      <el-table
          :data="roleList" border stripe>
        <!--        扩展列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
<!--            栅格系统的分配思路是： row是一行 一行里 共有24个span 16+8=24-->
            <el-row>
    <!--              一级权限里 占了5个格子-->
              <el-col :span="5">
              <!--               渲染一级权限   -->
                <el-button>lallalala</el-button>
              </el-col>

    <!--              二级三级占19个格子 一行-->
              <el-col :span="19">
              <!--                  渲染二级和三级权限-->
                <el-button>lallalala</el-button>
                <el-button>lallalala</el-button>
              </el-col>
            </el-row>
            <pre>
              {{scope.row}}
            </pre>
          </template>
        </el-table-column>
        <!--        索引列-->
        <el-table-column type="index">
        </el-table-column>
        <el-table-column
            prop="roleName"
            label="角色名称" align="center">
        </el-table-column>
        <el-table-column
            prop="roleDesc"
            label="角色描述" align="center">
        </el-table-column>
        <el-table-column
            label="操作" align="center" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>

      </el-table>
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