<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- card body -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteCate(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
        :pager-count="7">
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatdialogVisble"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类表单 -->
      <el-form
        :model="addCateform"
        ref="addCateformRef"
        :rules="addCateformRules"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            clearable
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              ...cascaderProps,
              checkStrictly: true
            }"
            @change="parentCateChanged"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addCatdialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 认</el-button>
      </span>
    </el-dialog>
    <!--编辑对话框  -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisble"
      width="50%"
    >
      <el-form
        :model="editForm"
        ref="editFormRef"
        :rules="editFormRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editCateDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MyCate',
  props: {},
  data() {
    return {
      // 查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类数据列表
      catelist: [],
      // 总数据条数
      total: 0,
      // tree-table 列的属性
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示定义为模板列
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          // 表示定义为模板列
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          // 表示定义为模板列
          type: 'template',
          template: 'opt'
        }
      ],
      // 添加分类对话框显示隐藏
      addCatdialogVisble: false,
      // 添加对话框表单数据
      addCateform: {
        // 父级分类ID
        cat_pid: 0,
        // 分类名称
        cat_name: '',
        // 分类等级 默认一级分类
        cat_level: 0
      },
      // 添加分类验证规则
      addCateformRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', triger: 'blur' }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 级联选择器配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类数组
      selectedKeys: [],
      // 修改分类对话框显示隐藏
      editCateDialogVisble: false,
      // 修改对话框的数据
      editForm: {},
      // 编辑表单验证规则
      editFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', triger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getCateList()
  },
  mounted() {},
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取商品列表失败！',
          type: 'error'
        })
      }
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 监听分页pagesize改变
    sizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum 改变
    currentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getCateList()
    },
    // 打开添加分类对话框
    showAddCateDialog() {
      // 获取父级分类数据
      this.getParentCateList()
      this.addCatdialogVisble = true
    },
    // 获取父级分类数据
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取父级分类失败',
          type: 'error'
        })
      }
      this.parentCateList = res.data
    },
    // 级联选择器发生变化触发
    parentCateChanged() {
      if (this.selectedKeys.length > 0) {
        this.addCateform.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateform.cat_level = this.selectedKeys.length
        return 0
      } else {
        this.addCateform.cat_pid = 0
        this.addCateform.cat_level = 0
      }
    },
    // 点击添加对话框确认添加按钮
    addCate() {
      this.$refs.addCateformRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateform
        )
        if (res.meta.status !== 201) {
          return this.$message({
            message: '添加分类失败',
            type: 'error'
          })
        }
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.getCateList()
        this.addCatdialogVisble = false
      })
    },
    // 监听添加对话框关闭事件
    addCateDialogClosed() {
      this.$refs.addCateformRef.resetFields()
      this.selectedKeys = []
      this.addCateform.cat_pid = 0
      this.addCateform.cat_level = 0
    },
    // 显示编辑对话框
    async showEditDialog(row) {
      const { data: res } = await this.$http.get('categories/' + row.cat_id)
      this.editForm = res.data
      this.editCateDialogVisble = true
    },
    // 监听编辑对话框确认按钮点击事件
    async editCate() {
      const { data: res } = await this.$http.put(
        'categories/' + this.editForm.cat_id,
        { cat_name: this.editForm.cat_name }
      )
      if (res.meta.status !== 200) {
        return this.$message({
          message: '修改分类失败！',
          type: 'error'
        })
      }
      this.$message({
        message: '修改分类成功！',
        type: 'success'
      })
      this.getCateList()
      this.editCateDialogVisble = false
    },
    // 删除分类
    async deleteCate(row) {
      const confirnResult = await this.$confirm(
        '该操作将会永久删除，是否继续？',
        '删除分类',
        {
          confirmButtonText: '确 认',
          cancelButtonText: '取 消',
          type: 'info'
        }
      ).catch((err) => err)
      if (confirnResult === 'cancel') {
        return this.$message({
          message: '已取消删除',
          type: 'error'
        })
      }
      const { data: res } = await this.$http.delete('categories/' + row.cat_id)
      if (res.meta.status !== 200) {
        return this.$message({
          message: '删除用户失败!',
          type: 'error'
        })
      }
      this.$message({
        message: '删除成功！',
        type: 'success'
      })
      this.getCateList()
    }
  }
}
</script>

<style scoped lang="less">
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
