<template>
  <div style="height:200px">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- card body -->
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button
            type="primary"
            @click="addDialogVisible=true"
          >添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table
        :data="roleList"
        border
        stripe
      >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="{row}">
            <el-row
              v-for="(item1,i1) in row.children"
              :key="item1.id"
              :class="['bdbottom',i1===0?'bdtop':'','vcenter']"
              class="rowpad"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(row,item1.id)"
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级三级权限 -->
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="[i2===0?'':'bdtop','vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      closable
                      @close="removeRightById(row,item3.id)"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>

              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色弹框 -->
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
        label-width="80px"
      >
        <el-form-item
          label="角色名"
          prop="roleName"
        >
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
        >
          <el-input v-model="addForm.roleDesc"></el-input>
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
        label-width="80px"
      >
        <el-form-item
          label="角色名"
          prop="roleName"
        >
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
        >
          <el-input v-model="editForm.roleDesc"></el-input>
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
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="30%"
      @close="allotDialogClosed"
    >
      <!-- 树型控件 -->
      <el-tree
        ref="treeRef"
        :data="rightsList"
        :props="treeProps"
        :default-checked-keys="defKeys"
        node-key="id"
        show-checkbox
        default-expand-all
      ></el-tree>
      <span slot="footer">
        <el-button @click=" setRightDialogVisible= false">取 消</el-button>
        <el-button
          type="primary"
          @click="allotRights"
        >确 认</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'MyRoles',
  components: {},
  props: {},
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      // 添加角色对话框显示隐藏
      addDialogVisible: false,
      // 修改用户信息对话框显示隐藏
      editDialogVisible: false,
      // 分配权限dialog显示隐藏
      setRightDialogVisible: false,
      // 添加角色表单数据
      addForm: {
        // 角色名称
        roleName: '',
        // 角色描述
        roleDesc: ''
      },
      // 添加角色表单验证规则
      addFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '角色名长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述内容',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 15,
            message: '角色描述内容长度在 5 到 15 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 查询到的用户信息
      editForm: {},
      // 修改表单的验证规则
      editFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '角色名长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述内容',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 15,
            message: '角色描述内容长度在 5 到 15 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 所有权限列表
      rightsList: [],
      // 树形控件属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的权限列表Id
      defKeys: [],
      // 当前分配权限的角色ID
      roleId: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    // 获取角色列表数据
    this.getRolesList()
  },
  mounted() {},
  methods: {
    // 获取所有角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取角色列表失败！',
          type: 'error'
        })
      }
      this.roleList = res.data
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
        const { data: res } = await this.$http.post('roles', this.addForm)
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
        this.getRolesList()
      })
    },
    // 监听添加用户框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 展示修改用户信息对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
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
        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
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
        this.getRolesList()
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
      const confirnResult = await this.$confirm('此操作将永久删除该角色，是否继续？', '提示', {
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
      const { data: res } = await this.$http.delete('roles/' + id)
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
      this.getRolesList()
    },
    // 根据ID删除权限
    async removeRightById(roles, rightsId) {
      // 弹框提示是否删除
      const confirmResult = await this.$confirm('该操作将永久删除权限是否继续？', '删除权限', {
        confirmButtonText: '确 定',
        cancelButtonText: '取 消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message({
          message: '取消删除',
          type: 'info'
        })
      }
      // eslint-disable-next-line
      const { data: res } = await this.$http.delete(`roles/${roles.id}/rights/${rightsId}`)
      if (res.meta.status !== 200) {
        return this.$message({
          message: '删除权限失败！',
          type: 'error'
        })
      }
      this.$message({
        message: '删除权限成功！',
        type: 'success'
      })
      roles.children = res.data
    },
    // 分配权限的dialog
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message({
          message: '获取权限列表失败',
          type: 'error'
        })
      }
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 获取当前角色列表的所有三级权限，保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 如果结点不包含children则是三级结点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框关闭事件
    allotDialogClosed() {
      this.defKeys = []
    },
    // 监听分配权限对话框的确认点击事件
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const ridsStr = keys.join(',')
      // eslint-disable-next-line
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: ridsStr })
      if (res.meta.status !== 200) {
        return this.$message({
          message: '分配权限失败！',
          type: 'error'
        })
      }
      this.$message({
        message: '分配权限成功！',
        type: 'success'
      })
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style scoped lang="less">
.rowpad{
  padding: 20px 50px;
}
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
