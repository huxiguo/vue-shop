<template>
  <div style="height:200px">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="goAddpage"
          >添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table 表格 -->
      <el-table
        :data="goodslist"
        border
        stripe
      >
        <el-table-column
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
        ></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="95px"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="70px"
        ></el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          width="140px"
        ><template slot-scope="{row}">{{row.add_time | dateFormat}}</template></el-table-column>
        <el-table-column
          label="操作"
          width="130px"
        >
          <template slot-scope="{row}">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeById(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 40, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'MyList',
  components: {},
  props: {},
  data() {
    return {
      // 查询参数
      queryInfo: {
        // 查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10
      },
      // 商品列表
      goodslist: [],
      // 总页数
      total: 0
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getGoodsList()
  },
  mounted() {},
  methods: {
    // 获取商品列表数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取商品列表失败！',
          type: 'error'
        })
      }
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    // 监听每页数据长度变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听页码值变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 根据ID删除商品
    async removeById(row) {
      const confirnResult = await this.$confirm('此操作将永久删除该参数，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirnResult === 'cancel') {
        return this.$message({
          message: '已取消删除',
          type: 'info'
        })
      }
      // eslint-disable-next-line
      const { data: res } = await this.$http.delete('goods/' + row.goods_id)
      if (res.meta.status !== 200) {
        return this.$message({
          message: '删除商品失败！',
          type: 'error'
        })
      }
      this.$message({
        message: '删除商品成功',
        type: 'success'
      })
      this.getGoodsList()
    },
    // 跳转添加商品页面
    goAddpage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style scoped lang="less"></style>
