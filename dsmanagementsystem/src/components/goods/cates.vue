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
          <el-button size="mini" type="primary">编辑</el-button>
          <el-button size="mini" type="danger">删除</el-button>
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
    <el-button @click="addStoreDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addStoreDialogVisible = false">确 定</el-button>
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
      //表单验证
      rules: {
        cat_name: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
      },
      catLists: [],
      selectKeys: [] //选中的数组放数据的地方 必须是数组

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
      const {data :res} = await this.$http.get('categories',{params:{type:2}})
      if (res.meta.status !== 200){
        return this.$message.error('请求商品分类列表失败！')
      }
      this.catLists = res.data  //将请求的一级二级分类拿到后绑定给 this.catList
    },
    //选择项发生变化就触发
    parentsHandleChange(){
      console.log(this.selectKeys)
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