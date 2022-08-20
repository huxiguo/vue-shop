<template>
  <div style="height:200px">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- card body -->
      <el-table
        :data="rightsList"
        border
        stripe
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="权限名称"
          prop="authName"
        ></el-table-column>
        <el-table-column
          label="路径"
          prop="path"
        ></el-table-column>
        <el-table-column
          label="权限等级"
          prop="level"
        >
          <template slot-scope="{row}">
            <el-tag v-if="row.level==='0'">一级</el-tag>
            <el-tag
              type="success"
              v-else-if="row.level==='1'"
            >二级</el-tag>
            <el-tag
              type="warning"
              v-else
            >三级</el-tag>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

  </div>
</template>

<script>
export default {
  name: 'MyRights',
  components: {},
  props: {},
  data() {
    return {
      // 权限列表
      rightsList: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getRightsList()
  },
  mounted() {},
  methods: {
    // 获取权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取权限列表失败',
          type: 'error'
        })
      }
      this.rightsList = res.data
    }
  }
}
</script>

<style scoped lang="less">
</style>
