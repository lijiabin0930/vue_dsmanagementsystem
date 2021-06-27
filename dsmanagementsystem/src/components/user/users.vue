<template>
  <div>
    <!--    卡片面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    卡片区域-->
    <el-card>
      <div class="navLoader">
      <!--      span 一行总共24span-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input v-model="queryinfo.query" clearable placeholder="请输入内容" @clear="getUserList">
          <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"><el-button type="primary" @click="changeAddDialogVisible">添加用户</el-button></el-col>
      </el-row>
      </div>
    <!--     用户列表区域 显示table内容-->
      <el-table
          :data="this.userlist"
          border stripe
          style="width: 100%">
    <!--        自定义索引列-->
        <el-table-column
            :index="indexMethod"
            label="id"
            type="index">
        </el-table-column>
        <el-table-column
            label="姓名"
            prop="username"
            width="180">
        </el-table-column>
        <el-table-column
            label="邮箱"
            prop="email">
        </el-table-column>
        <el-table-column
            label="电话"
            prop="mobile">
        </el-table-column>
        <el-table-column
            label="角色"
            prop="role_name">
        </el-table-column>
        <el-table-column
            label="状态">
      <!--          作用域插槽-->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="valueChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
<!--          slot-scope="scope" 可以接收从子组建传出来的结果 通过scope.row.xx可以拿到数据结果 row是当时子组建内部:row绑定的-->
          <template slot-scope="scope">
            <el-tooltip  :enterable="false" content="修改用户" effect="dark" placement="top-start">
              <!--            修改按钮-->
              <el-button icon="el-icon-edit" size="mini" type="primary"></el-button>
            </el-tooltip>
            <el-tooltip  :enterable="false" content="删除用户" effect="dark" placement="top-start">
            <!--            删除按钮-->
            <el-button icon="el-icon-delete" size="mini" type="danger"></el-button>
            </el-tooltip>
            <el-tooltip  :enterable="false" content="分配角色" effect="dark" placement="top-start">
          <!--            分配角色按钮-->
            <el-button icon="el-icon-setting" size="mini" type="warning"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--      分页区域-->
      <el-pagination
          :current-page="queryinfo.pagenum"
          :page-size="queryinfo.pagesize"
          :page-sizes="[1,2,5,10]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>

    //额外的对话框 点击后弹出的
    <el-dialog
        :visible.sync="addDialogVisible"
        title="添加用户"
        width="50%">
    <!--      内容主体区-->
      <el-form ref="addFormRef"  :model="addForm" :rules="addFormRules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"  placeholder="请输入用户名" ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"  placeholder="请输入密码" ></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"  placeholder="请输入邮箱" ></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"  placeholder="请输入手机号" ></el-input>
        </el-form-item>

      </el-form>
    <!--      底部区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "users",
    created() {
      //创建组建前发起网络请求
     this.getUserList()
    },
    data(){
      // data: {total: 4, pagenum: 1, users: Array(2)}
      // meta: {msg: "获取管理员列表成功", status: 200}
      return {
        //获取用户列表的参数对象 pagenum当前的页数 pagesize当前每页显示多少条数据
        queryinfo: {query: '', pagenum: 1, pagesize: 2} ,
        userlist : [],
        total: 0 ,
        addDialogVisible: false, //控制对话框的显示与隐藏,
        //添加用户的内容
        addForm:{
          username: "",
          password: "",
          email: "",
          mobile: ""
        } ,
        //添加增加用户的验证规则
        addFormRules: {
          username : [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
          ]

        }
      }
    },
     methods: {
      async getUserList(){
        const {data :res} = await this.$http.get('users',{params:this.queryinfo})
        this.print(res)
        if (res.meta.status !== 200) {
          return this.$message.error("获取用户列表失败！！")
        }
        this.userlist = res.data.users
        this.total = res.data.total
      },
       //给用户表格增加自定义的索引项 *2 就会所有*2
       indexMethod(index){
        return index
       },
       //监听 pagesize改变事件
       handleSizeChange(val){
         console.log(`每页 ${val} 条`);
         this.queryinfo.pagesize = val
         //重新获取数据
         this.getUserList()
       } ,
       //监听页码值改变的函数
       handleCurrentChange(val){
         console.log(`当前页: ${val}`);
         this.queryinfo.pagenum = val
         this.getUserList()
       },
       //角色状态开关改变后 拿到结果
       async valueChange(userinfo){
         const id = userinfo.id
         const state = userinfo.mg_state  //知识点 动态换入参数需要 使用`${}来实现引用`
         const {data :res }= await this.$http.put(`users/${id}/state/${state}`)
         this.print(res)
         //如果更改成功
         if (res.meta.status !== 200){
           userinfo.mg_state = !userinfo.mg_state
           return this.$message.error("更新用户状态失败")
         }
         //刷新页面一次
         return this.$message.success("更新用户状态成功！")
       },
       changeAddDialogVisible(){
        this.addDialogVisible = true
       },
    }
}
</script>

<style lang="less" scoped>
  .el-card {
    font-size: 13px;
  }
  .navLoader {
    margin-bottom: 15px;
  }
  .el-breadcrumb {
    margin-top: 8px;
    margin-bottom: 8px;
    margin-left: 8px;
    > span {
      font-size: 10px;
    }
  }
</style>