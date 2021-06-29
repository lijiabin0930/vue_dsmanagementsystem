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
          <el-col :span="4">
            <el-button type="primary" @click="changeAddDialogVisible">添加用户</el-button>
          </el-col>
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
          <!--          slot-scope="scope" 可以接收从子组建传出来的结果 通过scope.row.xx可以拿到数据结果 row是当时子组建内部:row绑定的-->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="valueChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <!--          slot-scope="scope" 可以接收从子组建传出来的结果 通过scope.row.xx可以拿到数据结果 row是当时子组建内部:row绑定的-->
          <template slot-scope="scope">
            <!--            提示框-->
            <el-tooltip :enterable="false" content="修改用户" effect="dark" placement="top-start">
              <!--            修改按钮-->
              <el-button icon="el-icon-edit" size="mini" type="primary" @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" content="删除用户" effect="dark" placement="top-start">
              <!--            删除按钮-->
              <el-button icon="el-icon-delete" size="mini" type="danger" @click="deleteUserByID(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" content="分配角色" effect="dark" placement="top-start">
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

    <el-dialog
        :visible.sync="addDialogVisible"
        title="添加用户"
        width="50%" @close="resetForm('addFormRef')">
      <!--      内容主体区-->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" placeholder="请输入密码" show-password type="password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <!--      底部区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="adduser('addFormRef')">确 定</el-button>
  </span>
    </el-dialog>

    <!--    编辑用户信息的对话框-->
    <el-dialog
        :visible.sync="editeDialogVisible"
        title="编辑用户"
        width="50%" @click="resetEditForm('editUserRef')">
      <!--      这里放内容  -->
      <el-form ref="editUserRef" :model="editForm" :rules="editUserRules" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editeDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateUser('editUserRef')">确 定</el-button>
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
  data() {
    // data: {total: 4, pagenum: 1, users: Array(2)}
    // meta: {msg: "获取管理员列表成功", status: 200}

    //自定义校验规则的编写方法
    //验证邮箱的
    var checkEmail = (rule, value, callback) => {
      const regmail = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
      if (regmail.test(value)) {
        //合规就调用callback 进行下一步
        return callback()
      }
      //不合规
      return callback(new Error("请输入合法的邮箱！"))
    }
    //验证手机号
    var checkMobile = (rule, value, callback) => {
      // console.log(value)
      const regMobile = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      return callback(new Error("请输入正确的手机号！！"))
    }

    return {
      //获取用户列表的参数对象 pagenum当前的页数 pagesize当前每页显示多少条数据
      queryinfo: {query: '', pagenum: 1, pagesize: 5},
      userlist: [],
      total: 0,
      addDialogVisible: false, //控制对话框的显示与隐藏,
      editeDialogVisible: false,//控制对话框的显示与隐藏,
      //添加用户的内容
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //查询到到用户对象
      editForm: {}
      ,
      //添加增加用户的验证规则
      addFormRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {validator: checkMobile, trigger: 'blur'}
        ]
      },
      //验证编辑用户的规则
      editUserRules: {
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {validator: checkMobile, trigger: 'blur'}
        ]

      }
    }
  },
  methods: {
    async getUserList() {
      const {data: res} = await this.$http.get('users', {params: this.queryinfo})
      this.print(res)
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败！！")
      }
      this.userlist = res.data.users
      this.total = res.data.total
    },
    //给用户表格增加自定义的索引项 *2 就会所有*2
    indexMethod(index) {
      return index
    },
    //监听 pagesize改变事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryinfo.pagesize = val
      //重新获取数据
      this.getUserList()
    },
    //监听页码值改变的函数
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryinfo.pagenum = val
      this.getUserList()
    },
    //角色状态开关改变后 拿到结果
    async valueChange(userinfo) {
      const id = userinfo.id
      const state = userinfo.mg_state  //知识点 动态换入参数需要 使用`${}来实现引用`
      const {data: res} = await this.$http.put(`users/${id}/state/${state}`)
      this.print(res)
      //如果更改成功
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error("更新用户状态失败")
      }
      //刷新页面一次
      return this.$message.success("更新用户状态成功！")
    },
    changeAddDialogVisible() {
      this.addDialogVisible = true
    },
    //重置表单
    resetForm(formName) {
      //添加用户对话框关闭 表单自动清空 表单重置
      this.$refs[formName].resetFields();
    },
    //重置编辑用户表单
    resetEditForm(formName) {
      //编辑用户对话框关闭 表单自动清空 表单重置
      this.$refs[formName].resetFields();
    },
    //填写完成后 做最后的统一验证 async在这个要执行的promise返回的函数前找一个函数标上就行了 或者单独在methods里定义async
    adduser(Ref) {
      this.$refs[Ref].validate(async isvalidatable => {
        // console.log(isvalidatable); //ture
        if (!isvalidatable) {
          return this.$message.error('表单校验失败！请查证后再次注册')
        }
        //这边确认没有问题后就可以发起真正的http请求了
        const {data: res} = await this.$http({
          url: 'users', method: 'POST', data: this.addForm
        })
        if (res.meta.status == 201) {
          this.$message.success(`注册用户:${this.addForm.username}成功`)
          this.addDialogVisible = false //关闭对话框
          //刷新表达
          await this.getUserList()
          return
        }
        return this.$message.error('注册失败：失败原因-' + res.meta.msg)
      })
    },
    // 显示修改对话框
    async showEditDialog(userinfo) {
      //显示对话框 同时 还需要把用户的数据加载到页面上 才可以
      const id = userinfo.id
      //调用接口 获取id对应信息
      const {data: res} = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败!')
      }
      this.editForm = res.data
      //显示对话框
      this.editeDialogVisible = true
    },
    //修改用户信息 并提交
    updateUser(ref) {
      this.$refs[ref].validate(async isvalidatable => {
        //校验不通过
        if (!isvalidatable) {
          return this.$message.error('更新用户失败！')
        }
        //通过发起数据请求
        const {data: res} = await this.$http.put(`users/${this.editForm.id}`,
            {
              id: this.editForm.id,
              email: this.editForm.email,
              mobile: this.editForm.mobile
            })
        if (res.meta.status !== 200) {
          return this.$message.error(`更新用户数据失败：失败原因-${res.meta.msg}`)
        }
        //打印更新成功
        this.$message.success('用户更新成功！！')
        //关闭窗口
        this.editeDialogVisible = false
        //更新列表
        await this.getUserList()
      })
    },
    // 删除用户
     deleteUserByID(userInfo){
      const  id  = userInfo.id
       //删除需要弹窗确认
      this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        //这里写删除用户的逻辑
        const {data :res} = await this.$http.delete(`users/${id}`,{id:id})
        if(res.meta.status !== 200){
          this.$message.error(`删除用户失败：失败原因${res.meta.msg}`)
          return
        }
        await this.getUserList()
        console.log(res)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
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