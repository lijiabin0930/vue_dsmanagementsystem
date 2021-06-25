<template>
  <div class="login_container">
      <div class="login_box">
        <div class="avatar_box">
          <img src="../assets/logo.png">
        </div>
        <!--        表单区域-->
        <div>
          <el-form label-width="0px" class="login_form" ref="LoginFormRef" :model="LoginForm" :rules="loginFormRules">
            <el-form-item prop="username">
              <el-input placeholder="请输入用户名" prefix-icon="iconfont icon-user" v-model="LoginForm.username" ></el-input>
            </el-form-item>
            <el-form-item prop="password" >
              <el-input placeholder="请输入密码" prefix-icon="iconfont icon-3702mima" v-model="LoginForm.password" show-password></el-input>
            </el-form-item>
            <el-form-item class="buttons" >
              <el-button type="primary" @click="login('LoginFormRef')">登录</el-button>
              <el-button type="info" @click="resetForm('LoginFormRef')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  methods:{
    //重置表单
    resetForm(formName) {
      // console.log(this)  //父组建获取子组建的方法
      // console.log(formName);
      this.$refs[formName].resetFields()
      // this.$refs[formName].resetFields();
    },
    //判断是否登录合法
    login(formName){
      //写法1
      this.$refs[formName].validate()
          .then(async validate=> {
            // console.log(validate,">>>>>>>>")
            // const result =await this.$http.post('login',this.LoginForm);
            //对象解构 起别名 snsyc awit 是用来配合axios异步请求并解构promise对象的
            const {data:result}=await this.$http.post('login',this.LoginForm);
            console.log(result)
            const meta = result.meta
            if (meta.status !=200) {
              return this.$message(
                  {
                    message: '登录失败！',
                    type: 'error',
                    showClose:true
                  })
            }
            else {
              //登录成功后需要配置
              //1）获取token
              const token = result.data.token
              //2)保存token 至sessionStroage中方便其他接口获取内容
              window.sessionStorage.setItem("token",token)
              //3)页面跳转
              await this.$router.push('/home')
              return this.$message(
                  {
                    message: '登录成功！',
                    type: 'success',
                    showClose:true
                  }
              )
            }
              }
            )
          .catch(error=> {
        // console.log(error);
            return this.$message(
                {
                  message: '登录成功！',
                  type: 'success',
                  showClose:true
                }
            )
      })
      //写法2
     // this.$refs[formName].validate(async valid=> {
     //   if (valid){
     //     // 请求的地址 和 发送的数据
     //     //解构重命名{data: res }
     //     const {data: res } =await this.$http.post('login',this.LoginForm);
     //     console.log(res);
     //     if (res.meta.status != 200){
     //       alert("登录失败")
     //     }else {
     //       return console.log("登录成功")
     //     }
     //   }else {
     //      return
     //   }
     // })
    }
  }
  ,
  data(){
    return {
      //这是登陆表单的登陆绑定对象
      LoginForm: {
        username: 'admin',
        password:'123456',
      },
      //这是表单的验证规则对象
      loginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        //验证密码是否合法
        password:[ { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2c3e50;
    height: 100%;
  }
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #e9e9e9;
    border-radius: 3px;
    //移动位置
    position: absolute;
    left: 50%;
    top: 50%;
    //盒子移动左右 按照自身的尺寸 +左-右移动 +上-下移动
    transform: translate(-50%,-50%);

    .avatar_box {
      height: 130px;
      width:  130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      background-color: #fff;

      //盒子移动左右 按照自身的尺寸 +左-右移动 +上-下移动
      transform: translate(-50%,-50%);
      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
      }
    }
  }
  //按钮右对齐
  .buttons {
    //自适应大小
    display: flex;
    //靠右对齐
    justify-content: end;
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>