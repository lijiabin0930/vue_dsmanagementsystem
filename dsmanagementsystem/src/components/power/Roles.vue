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
                <el-tag  closable @close="removeRightById(scope.row,item1.id)">
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
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  <!--    分配权限 需要单独建立一个dialog setRightDialogVisible控制对话框的显示与隐藏-->
    <el-dialog
        title="提示"
        :visible.sync="setRightDialogVisible"
        width="50%" @close="setDefKeysNull">
    <!--       树形解构 展示目前已经有的权限-->
      <el-tree
          :data="rightTreeList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          ref="treeData">
      </el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setChown">确 定</el-button>
  </span>
    </el-dialog>





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
      vcenter: "vcenter",
      setRightDialogVisible: false,
      //用于显示按照要求格式的Tree形解构{id:xxx,children:[id:xx,children:[]],id:xxx}
      rightTreeList:[],
      //树形控件属性绑定
      treeProps: {
        //这两个属性是固定的 children代表树状解构的遍历的key label表示需要显示的内容 对应的是数据的key
        children: 'children',
        label: 'authName',
      },
      //已经被存在的权限的id的列表 就是用来给tree勾选对勾用的 目前你有哪个权限 就把你的三级权限的id 放进去
      defKeys: [],
      //这里放的是 用户勾选的内容的ID id是tree里边绑定的node-key 的值 拿到所有的就可以调用函数来给后端加入新的了
      keysIdList: [],
      roleId: '' //获取用户ID 方便其他方法使用 公共变量

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
      },
    async showSetRightDialog(roledata){
      //展示前获取所有权限列表数据 并负值
      const {data :res} = await this.$http.get("rights/tree")
      if (res.meta.status !== 200){
        this.$message.error("获取权限列表失败！！！")
      }
      this.rightTreeList = res.data
      // this.defKeys = []
      this.getThirdChownID(roledata,this.defKeys)
      this.roleId = roledata.id
      this.setRightDialogVisible = true
    },
    //通过递归获取角色所有三级权限的id
    getThirdChownID(node,arr){
      if (!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item =>{
        this.getThirdChownID(item,arr)
      })
    },
    setDefKeysNull(){
      this.defKeys = []
    },
    async setChown(){
      //三级tree 分别是 104 商品管理 -> 商品列表 -> 添加商品
      let value = this.$refs["treeData"].getCheckedKeys() // 添加商品id
      let value1 = this.$refs["treeData"].getHalfCheckedKeys() // 商品管理 -> 商品列表 id
      this.keysIdList = [...value , ...value1] //列表解构
      let keysIdStr = this.keysIdList.join(',')
      //点击确定 开始请求后端角色授权的接口
      const {data :res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:keysIdStr})
      if (res.meta.status !== 200){
        return this.$message.error('用户授权失败！')
      }
      //关闭窗口
      this.setRightDialogVisible = false
      //刷新列表
      await  this.getRoleList()
      return  this.$message.success('用户授权成功！')
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