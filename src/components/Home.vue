<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img
          src="@/assets/heima.png"
          alt=""
        />
        <span>电商后台管理系统</span>
      </div>
      <el-button
        type="info"
        @click="logout"
      >退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div
          class="toggle-nutton"
          @click="toggleCollapse"
        >|||</div>
        <!-- 菜单栏 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409bff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id+''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本区域 -->
              <span>{{item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="saveNavState('/'+subitem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本区域 -->
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'MyHome',
  components: {},
  props: {},
  data() {
    return {
      // 菜单数据
      menulist: [],
      // 图标
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 选中的菜单项
      activePath: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  mounted() {},
  methods: {
    logout() {
      // 退出登录
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有请求
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    // 切换菜单折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  height: 100%;
}
.el-header {
  background-color: #3d3741;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right:none ;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-nutton{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color:#fff;
  text-align: center;
  letter-spacing: 0.3em;
  cursor: pointer;
}
</style>
