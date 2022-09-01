<template>
  <div style="height:200px">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- card body -->
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许修改三级分类的参数！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 级联选择框 -->
          <el-cascader
            clearable
            v-model="selectdCateKeys"
            :options="catelist"
            :props="{ expandTrigger: 'hover',...cateProps }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 页签 -->
      <el-tabs
        v-model="activeName"
        @tab-click="handleTabClick"
      >
        <el-tab-pane
          label="动态参数"
          name="many"
        >
          <!-- 添加动态参数面板 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogViable= true"
          >添加参数</el-button>
          <el-table
            :data="manyTableData"
            border
            stripe
          >
            <el-table-column type="expand">
              <template slot-scope="{row}">
                <el-tag
                  closable
                  v-for="(item,i) in row.attr_vals"
                  :key="i"
                  @close="handleClosed(i,row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="#"
            ></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
        <el-tab-pane
          label="静态属性"
          name="only"
        >
          <!-- 添加静态属性面板 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogViable= true"
          >添加属性</el-button>
          <el-table
            :data="onlyTableData"
            border
            stripe
          >
            <el-table-column type="expand">
              <template slot-scope="{row}">
                <el-tag
                  closable
                  v-for="(item,i) in row.attr_vals"
                  :key="i"
                  @close="handleClosed(i,row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="#"
            ></el-table-column>
            <el-table-column
              label="属性名称名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogViable"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        ref="addFormRef"
        :rules="addFormRules"
        label-width="100px"
      >
        <el-form-item
          :label="titleText"
          prop="attr_name"
        >
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click=" addDialogViable= false">取 消</el-button>
        <el-button
          type="primary"
          @click="addParams"
        >确 认</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogViable"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        ref="editFormRef"
        :rules="editFormRules"
        label-width="100px"
      >
        <el-form-item
          :label="titleText"
          prop="attr_name"
        >
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click=" editDialogViable= false">取 消</el-button>
        <el-button
          type="primary"
          @click="editParams"
        >确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MyParams',
  data() {
    return {
      // 商品分类列表
      catelist: [],
      // 级联选择框配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框的双向绑定数据
      selectdCateKeys: [],
      // 被激活页签的名称
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 添加对话框显示隐藏
      addDialogViable: false,
      // 添加参数表单数据
      addForm: {},
      // 验证规则
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      },
      // 修改对话框显示隐藏
      editDialogViable: false,
      // 修改表单数据
      editForm: {},
      // 验证规则
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取分类列表失败！',
          type: 'error'
        })
      }
      this.catelist = res.data
      this.$message({
        message: '获取分类列表成功！',
        type: 'success'
      })
    },
    // 级联选择框选中值变化
    handleChange() {
      this.getParamsData()
    },
    // tab点击事件
    handleTabClick() {
      this.getParamsData()
    },
    // 请求参数列表
    async getParamsData() {
      // 选中的非三级分类
      if (this.selectdCateKeys.length !== 3) {
        this.selectdCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return this.$message({
          message: '请选择三级分类',
          type: 'error'
        })
      }
      // eslint-disable-next-line
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取参数列表失败！',
          type: 'error'
        })
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 监听对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 提交添加参数事件
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return 0
        }
        // eslint-disable-next-line
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 201) {
          return this.$message({
            message: '添加参数失败！',
            type: 'error'
          })
        }
        this.$message({
          message: '添加参数成功！',
          type: 'success'
        })
        this.addDialogViable = false
        this.getParamsData()
      })
    },
    // 编辑对话框
    async showEditDialog(attrId) {
      // eslint-disable-next-line
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取参数信息失败',
          type: 'error'
        })
      }
      this.editForm = res.data
      this.editDialogViable = true
    },
    // 修改对话框关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 提交修改参数信息
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return 0
        }
        // eslint-disable-next-line
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) {
          return this.$message({
            message: '修改参数失败！',
            type: 'error'
          })
        }
        this.$message({
          message: '修改参数成功！',
          type: 'success'
        })
        this.editDialogViable = false
        this.getParamsData()
      })
    },
    // 根据ID删除参数
    async removeParams(attrId) {
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
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
      if (res.meta.status !== 200) {
        return this.$message({
          message: '删除参数失败！',
          type: 'error'
        })
      }
      this.$message({
        message: '删除参数成功',
        type: 'success'
      })
      this.getParamsData()
    },
    // 文本框失去焦点或者enter触发
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return 0
      }
      // 根新数据
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发起请求保存操作
      // eslint-disable-next-line
      this.saveAttrVals(row)
    },
    // 显示文本框
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInputRef.$refs.input.focus()
      })
    },
    // 删除参数项
    handleClosed(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
    // 保存数据
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') })
      if (res.meta.status !== 200) {
        return this.$message({
          message: '修改参数失败！',
          type: 'error'
        })
      }
      this.$message({
        message: '修改参数成功！',
        type: 'success'
      })
    }
  },
  computed: {
    // 按钮需要被禁用返回true 否则false
    isBtnDisabled() {
      if (this.selectdCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类ID
    cateId() {
      if (this.selectdCateKeys.length === 3) {
        return this.selectdCateKeys[2]
      }
      return null
    },
    // 动态标题
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style scoped lang="less">
.cat_opt{
  margin: 15px 0;
}
.el-tag{
  margin: 10px;
}
.input-new-tag{
  width: 120px;
}
</style>
