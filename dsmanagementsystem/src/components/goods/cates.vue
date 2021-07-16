<template>
  <div>
    <!--   头部区域 面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片式图区域-->
    <el-card class="box-card">
      <el-row type="flex">
        <el-col :span="6">
          <el-button class="addStore" type="primary" @click="addStore">添加分类</el-button>
        </el-col>
      </el-row>

      <tree-table :columns="columns"
                  :data="goodsList" :expand-type="false" :selection-type='false' :show-row-hover="false"
                  border index-text="#" show-index>
        <template slot="isOk" slot-scope="scope">
          <i v-if="scope.row.cat_deleted===false" class="el-icon-success"></i>
          <i v-else class="el-icon-error"></i>
        </template>
        <!--        排序-->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level===1" size="mini" type="success">二级</el-tag>
          <el-tag v-else size="mini" type="warning">三级</el-tag>
        </template>
        <!--        操作-->
        <template slot="operate" slot-scope="scope">
          <el-button size="mini" type="primary" @click="openEditorDialog(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteEditorCat(scope.row)">删除</el-button>
        </template>

      </tree-table>

      <el-pagination
          :current-page="queryinfo.pagenum"
          :page-size="queryinfo.pagesize"
          :page-sizes="[5,10,15]"
          :total="this.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>
    <!--  添加分类按钮-->
    <el-dialog
        :visible.sync="addStoreDialogVisible"
        title="添加分类"
        width="50%">
      <!--          添加分类的表单-->
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="ruleForm.cat_name" placeholder="请选择分类名称"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!--              options指定数据源-->
          <!--          props指定配置对象 value值 label 显示什么  children下一级显示 v-model必须是数组-->
          <el-cascader
              v-model="selectKeys"
              :options="this.catLists"
              :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children: 'children' }"
              @change="parentsHandleChange" clearable change-on-select></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="closeCate">取 消</el-button>
    <el-button type="primary" @click="addCate('ruleForm')">确 定</el-button>
  </span>
    </el-dialog>

    <!--    编辑分类名称-->
    <el-dialog
        :visible.sync="eidtorDialogVisible"
        title="编辑分类"
        width="50%">
      <!--          添加分类的表单-->
      <el-form ref="ruleForm" :model="ruleEditeForm" :rules="rules" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="ruleEditeForm.cat_name" placeholder="请编辑分类名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="closeCate">取 消</el-button>
    <el-button type="primary" @click="editeCate('ruleForm')">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "cates",
  created() {
    //商品分类数据在组建创建时候 请求后端数据获取
    this.getCategories()
  },
  data() {
    return {
      goodsList: [],
      //获取用户列表的参数对象 pagenum当前的页数 pagesize当前每页显示多少条数据
      queryinfo: {type: 3, pagenum: 1, pagesize: 5},
      total: 0,
      columns: [
        {label: "分类名称", prop: 'cat_name'},
        {label: "是否有效", type: 'template', template: 'isOk'},  //type自定义模版列
        {label: "排序", type: 'template', template: 'order'},
        {label: "操作", type: 'template', template: 'operate'},
      ],
      addStoreDialogVisible: false,
      ruleForm: {
        cat_name: '',
        cat_pid: 0, cat_level: 0
      },
      //编辑分类名称,
      ruleEditeForm: {
        cat_name: ''
      },
      //表单验证
      rules: {
        cat_name: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
      },
      catLists: [],
      selectKeys: [],//选中的数组放数据的地方 必须是数组
      eidtorDialogVisible: false,
      // 获取点击该行 获得该商品的cat_id 用于更新该商品的名称
      idEditCat: "",
    }
  },
  methods: {
    //获取商品分类数据
    async getCategories() {
      const {data: res} = await this.$http.get('categories',
          {
            params: this.queryinfo
          }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }

      this.goodsList = res.data.result
      this.total = res.data.total
      this.$message.success('获取商品列表成功！')
    },
    handleSizeChange(val) {
      this.queryinfo.pagesize = val
      this.getCategories()
    },
    handleCurrentChange(val) {
      this.queryinfo.pagenum = val
      this.getCategories()
    },
    async addStore() {
      this.addStoreDialogVisible = true
      //显示窗口的同时 在把数据请求出来 用于后续展示输入框使用
      //请求商品分类列表
      const {data: res} = await this.$http.get('categories', {params: {type: 2}})
      if (res.meta.status !== 200) {
        return this.$message.error('请求商品分类列表失败！')
      }
      this.catLists = res.data  //将请求的一级二级分类拿到后绑定给 this.catList
    },
    //选择项发生变化就触发
    parentsHandleChange() {
      console.log(this.selectKeys)
      //长度大于0 选中了父级分类
      if (this.selectKeys.length > 0) {
        this.ruleForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.ruleForm.cat_level = this.selectKeys.length
        return
      } else {
        this.ruleForm.cat_pid = 0
        this.ruleForm.cat_level = 0
      }
    },
    //关闭对话框时候 要清空ruleFrom下次进来是空的
    closeCate() {
      //清空表单
      this.$refs.ruleForm.resetFields()
      this.selectKeys = []
      this.ruleForm = {
        cat_name: '',
        cat_pid: 0, cat_level: 0
      }
      this.addStoreDialogVisible = false
    },
    //确定添加分类
    addCate(refName) {
      this.$refs[refName].validate().then(async validate => {
            if (validate) {
              const {data: res} = await this.$http.post(
                  'categories', this.ruleForm
              )
              if (res.meta.status !== 201) {
                return this.$message.error('添加商品分类失败!')

              }
              this.closeCate()
              return this.$message.success("添加商品分类成功！")
            }
          }
      ).catch(error => {
        console.log(error);
        return this.$message(
            {
              message: '添加分类失败，验证分类名称失败了！',
              type: 'error',
              showClose: true
            }
        )
      })
    },
    //编辑商品分类名字插槽
    openEditorDialog(data) {
      // console.log(data,">>>>")
      //拿到id cat_name -> 新修改的值
      this.ruleEditeForm.cat_name = data.cat_name
      this.idEditCat = data.cat_id
      this.eidtorDialogVisible = true
    },
    //将编辑好的新的商品名字更新到后台服务器中
    async editeCate(ruleForm) {
      //  请求后台更新逻辑
      const {data: res} = await this.$http.put(`categories/${this.idEditCat}`,
          {cat_name: this.ruleEditeForm.cat_name})
      if (res.meta.status !== 200) {
        this.idEditCat = ''
        this.ruleEditeForm.cat_name = ''
        return this.$message.error('编辑失败！！！')
      }
      // idEditCat 滞空
      this.idEditCat = ''
      this.ruleEditeForm.cat_name = ''
      await this.getCategories()
      this.eidtorDialogVisible = false
      return this.$message.success('编辑成功！')
    },
    //删除分类
    async deleteEditorCat(data) {
      this.idEditCat = data.cat_id
      const {data: res} = await this.$http.delete(`categories/${this.idEditCat}`)
      if (res.meta.status !== 200) {
        this.idEditCat = ''
        return this.$message.error('删除失败！！！')
      }
      this.idEditCat = ''
      await this.getCategories()
      return this.$message.success('删除成功！')

    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-top: 8px;
  margin-bottom: 8px;
  margin-left: 8px;

  > span {
    font-size: 10px;
  }
}

.box-card {
  margin-top: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-icon-success {
  color: lightgreen;
}

.el-icon-error {
  color: lightcoral;
}

.addStore {
  margin-bottom: 10px;
}

.zk-table {
  margin-top: 10px;
}

.el-cascader {
  width: 100%;
}
</style>