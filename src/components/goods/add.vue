<template>
  <div style="height: 300px">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 文字提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏 -->
      <el-form
        :model="addForm"
        ref="addFormRef"
        :rules="addFormRules"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane
            label="基本信息"
            name="0"
          >
            <el-form-item
              label="商品名称"
              prop="goods_name"
            >
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item
              label="商品价格"
              prop="goods_price"
            >
              <el-input
                v-model="addForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品数量"
              prop="goods_number"
            >
              <el-input
                v-model="addForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品重量"
              prop="goods_weight"
            >
              <el-input
                v-model="addForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品分类"
              prop="goods_cat"
            >
              <!-- 级联选择框 -->
              <el-cascader
                clearable
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="{ expandTrigger: 'hover', ...cateProps }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品参数"
            name="1"
          >
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="cb"
                  v-for="(cb,i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品属性"
            name="2"
          >
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品图片"
            name="3"
          >
            <el-upload
              class="upload-demo"
              action="https://lianghj.top:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button
                size="small"
                type="primary"
              >点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane
            label="商品内容"
            name="4"
          >
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button
              type="primary"
              class="btnAdd"
              @click="add"
            >添加商品</el-button>

          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewViable"
      width="50%"
    >
      <img
        :src="previewPath"
        alt=""
        class="previewImg"
      >
    </el-dialog>

  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'MyAdd',
  components: {},
  props: {},
  data() {
    return {
      // 激活的步骤
      activeIndex: '0',
      // 基本信息表单数据
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        // 商品所属的分类数据
        goods_cat: [],
        // 图片数组
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 基本信息表单验证规则
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请选择商品分类',
            trigger: 'blur'
          }
        ]
      },
      // 级联选择框配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 商品分类列表
      catelist: [],
      // 动态参数
      manyTableData: [],
      // 静态属性
      onlyTableData: [],
      // 图片上传组件的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewViable: false
    }
  },
  computed: {
    // 商品分类id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  watch: {},
  created() {
    this.getCateList()
  },
  mounted() {},
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
    },
    // 选择数据发生变化触发
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 切换标签页之前的钩子
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message({
          message: '请先选择商品分类',
          type: 'error'
        })
        return false
      }
    },
    // tab选中触发
    async tabClicked() {
      // 访问动态参数
      if (this.activeIndex === '1') {
        // eslint-disable-next-line
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) {
          return this.$message({
            message: '获取动态参数失败！',
            type: 'error'
          })
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        // eslint-disable-next-line
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) {
          return this.$message({
            message: '获取静态参数失败！',
            type: 'error'
          })
        }
        this.onlyTableData = res.data
      }
    },
    // 预览图片事件
    handlePreview(file) {
      const baseURL = 'https://lianghj.top:8888/'
      this.previewPath = baseURL + file.response.data.tmp_path
      this.previewViable = true
    },
    // 移除图片事件
    handleRemove(file) {
      const filePath = file.response.data.tem_path
      const index = this.addForm.pics.findIndex(x => x.pis === filePath)
      this.addForm.pics.splice(index, 1)
    },
    // 图片上传成功
    handleSuccess(response) {
      const picInfo = { pic: response.data.tem_path }
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          this.$message({
            message: '请填写必要的表单项！',
            type: 'error'
          })
        }
        // 执行添加操作
        // 在拼接字符串之前深拷贝一下addForm、
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = this.addForm.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // 请求添加商品
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message({
            message: '添加商品失败！',
            type: 'error'
          })
        }
        this.$message({
          message: '添加商品成功！',
          type: 'success'
        })
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style scoped lang="less">
.el-checkbox{
  margin: 0 5px 0 0;
}
.previewImg{
  width: 100%;
}
.btnAdd{
  margin-top: 15px;
}
</style>
