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
          <el-input placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"><el-button type="primary">添加用户</el-button></el-col>
      </el-row>
      </div>
    <!--     用户列表区域 显示table内容-->
      <el-table
          :data="this.userlist"
          border stripe
          style="width: 100%">
    <!--        自定义索引列-->
        <el-table-column
            label="id"
            type="index"
            :index="indexMethod">
        </el-table-column>
        <el-table-column
            prop="username"
            label="姓名"
            width="180">
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱">
        </el-table-column>
        <el-table-column
            prop="mobile"
            label="电话">
        </el-table-column>
        <el-table-column
            prop="role_name"
            label="角色">
        </el-table-column>
        <el-table-column
            label="状态">
      <!--          作用域插槽-->
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.mg_state" disabled>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
<!--          slot-scope="scope" 可以接收从子组建传出来的结果 通过scope.row.xx可以拿到数据结果 row是当时子组建内部:row绑定的-->
          <template slot-scope="scope">
            <el-tooltip  effect="dark" content="修改用户" placement="top-start" :enterable="false">
              <!--            修改按钮-->
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip  effect="dark" content="删除用户" placement="top-start" :enterable="false">
            <!--            删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip  effect="dark" content="分配角色" placement="top-start" :enterable="false">
          <!--            分配角色按钮-->
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryinfo.pagenum"
          :page-sizes="[1,2,5,10]"
          :page-size="queryinfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
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
       }
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