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
            <el-row  v-for="(item1,i1) in scope.row.children" :key="item1.id"
                     :class="[i1 === 0? bdtop : '',bdbottom,vcenter]">
    <!--              一级权限里 占了5个格子-->
              <el-col :span="5" >
              <!--               渲染一级权限   -->
                <el-tag :key="item1.id" closable @close="removeRightById(scope.row,item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
    <!--              二级三级占19个格子 一行-->
              <el-col :span="19">
              <!--                  渲染二级和三级权限-->
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2===0?'':bdtop,vcenter]">
                  <el-col :span="6" >
<!--                    closable可以显示tag的错误 @click 给这个关闭绑定方法-->
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span='18'>
                    <el-tag  type="warning" v-for="(value,i3) in item2.children" :key="value.id"
                             closable @close="removeRightById(scope.row,value.id)">{{value.authName}}</el-tag>
                  </el-col>
                </el-row >
              </el-col>
            </el-row>
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
      roleList: [],
      bdbottom: "bdbottom",
      bdtop: "bdtop",
      vcenter: "vcenter"
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
    },
    removeRightById(roledata,rightId){
      //弹出是否要删除
        this.$confirm('确定要删除用户权限？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          //这里发情删除请求删除某个用户下的某个权限
          const {data: res} = await this.$http.delete(`roles/${roledata.id}/rights/${rightId}`)
          console.log(res)
          if (res.meta.status !== 200){
            return this.$message.error('删除用户权限失败')
          }
          this.$message({
            type: 'success',
            message: '删除成功!',
          }
          );
          //刷新权限列表 这只更新这个data里的内容 就会引发更新效果 roledata只是一行的数据！！！不是所有的 不能传入roleList
          roledata.children = res.data
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
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
.el-tag {
  margin: 7px;
}
//添加边框线 top
.bdtop {
  border-top: 1px solid #eeeeee;
}
//添加边框线 bottom
.bdbottom {
  border-bottom: 1px solid #eeeeee;
}
/*纵向居中*/
.vcenter {
  display: flex;
  align-items: center;
}
</style>