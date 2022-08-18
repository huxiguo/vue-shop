<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addDialogVisible=true"
          >添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table
        :data="userlist"
        border
        stripe
      >
        <el-table-column
          type="index"
          label="#"
        >
        </el-table-column>

        <el-table-column
          prop="username"
          label="姓名"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
        ></el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
        ></el-table-column>
        <el-table-column
          prop="mg_state"
          label="状态"
        >
          <template slot-scope="{row}">
            <el-switch
              v-model="row.mg_state"
              @change="userStateChanged(row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(row.id)"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              content="分配角色"
              placement="top"
              effect="dark"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[1,2,5,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
        :pager-count="7">
      </el-pagination>

    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="手机"
          prop="mobile"
        >
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addUser"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        ref="editFormRef"
        :rules="editFormRules"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input
            v-model="editForm.username"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="手机"
          prop="mobile"
        >
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click=" editDialogVisible= false">取 消</el-button>
        <el-button
          type="primary"
          @click="editUserInfo"
        >确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'MyUser',
  components: {},
  props: {},
  data() {
    // 自定义校验邮箱
    const checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 自定义验证手机号
    const checkPhone = (rule, value, cb) => {
      // 验证手机的正则
      const regPhone = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regPhone.test(value)) {
        // 合法手机号
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户请求列表的参数
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 添加用户对话框显示隐藏
      addDialogVisible: false,
      // 修改用户信息对话框显示隐藏
      editDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单验证规则
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '密码长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkPhone,
            trigger: ['blur', 'change']
          }
        ]
      },
      // 查询到的用户信息
      editForm: {},
      // 修改表单的验证规则
      editFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: checkPhone,
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getUserList()
  },
  mounted() {},
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userlist = res.data.users
      this.total = res.data.total
      this.$message.success(res.meta.msg)
    },
    // 监听pageSize改变
    sizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 页码值切换
    currentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听开关状态改变
    async userStateChanged(userinfo) {
      // eslint-disable-next-line
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message({
          message: '更新用户状态失败！',
          type: 'error'
        })
      }
      this.$message({
        message: '更新用户状态成功！',
        type: 'success'
      })
    },
    // 监听添加用户框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 监听添加用户框确定按钮点击事件
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message({
            message: '请填写正确的表单',
            type: 'error'
          })
        }
        // 发起网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message({
            message: '添加用户失败',
            type: 'error'
          })
        }
        this.$message({
          message: '添加用户成功！',
          type: 'success'
        })
        // 隐藏对话框
        this.addDialogVisible = false
        // 刷新列表
        this.getUserList()
      })
    },
    // 展示修改用户信息对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message({
          message: '查询用户信息失败！',
          type: 'error'
        })
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户信息对话框关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改提交用户信息
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return 0
        // 发起请求
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message({
            message: '修改用户信息失败',
            type: 'error'
          })
        }
        // 成功
        // 关闭弹框
        this.editDialogVisible = false
        // 刷新数据
        this.getUserList()
        // 提示成功
        this.$message({
          message: '更新用户信息成功',
          type: 'success'
        })
      })
    },
    // 根据ID删除用户
    async removeUserById(id) {
      // 弹框询问是否删除
      const confirnResult = await this.$confirm('此操作将永久删除该用户，是否继续？', '提示', {
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
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message({
          message: '删除用户失败！',
          type: 'error'
        })
      }
      this.$message({
        message: '删除用户成功',
        type: 'success'
      })
      this.getUserList()
    }
  }
}
</script>

<style scoped lang="less">

</style>
