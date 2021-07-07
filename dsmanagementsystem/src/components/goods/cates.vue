<template>
  <div>
  <!--   头部区域 面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <div>
        <el-button type="primary">添加分类</el-button>
      </div>
      <el-table
          highlight-current-row
          :data="goodsList"
          style="width: 100%">
        <el-table-column
            type="index"
            width="50">
        </el-table-column>
        <el-table-column
            prop="cat_name"
            label="分类名称">
        </el-table-column>
        <el-table-column
            prop="cat_deleted"
            label="是否有效" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-check"  v-if="scope.row.cat_deleted === false" size="mini"  circle></el-button>
          </template>
        </el-table-column>
        <el-table-column
            prop="cat_level"
            label="排序">
        </el-table-column>
        <el-table-column
            prop="address"
            label="操作">
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "cates",
  created() {
    //商品分类数据在组建创建时候 请求后端数据获取
    this.getCategories()
  },
  data(){
    return {
      goodsList: [],
      //获取用户列表的参数对象 pagenum当前的页数 pagesize当前每页显示多少条数据
      queryinfo: {query: '', pagenum: 1, pagesize: 5},

    }
  },
  methods:{
    //获取商品分类类别
    async getCategories(){
      const {data :res} = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goodsList = res.data
      console.log(res.data)
      this.$message.success('获取商品列表成功！')
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

</style>