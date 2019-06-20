<template>
  <div class="navbar">
    <div class="system-name">
      <h1>智能茶壶系统</h1>
      <h4>后台服务平台</h4>
    </div>
    <div class="right-menu">
      <section class="avatar-container">
        <i class="iconfont">&#xe6cd;</i>
        <span class="avatar-name">管理员{{ account }}</span>
      </section>
      <section class="logout" @click="logout">
        <i class="iconfont">&#xe6cc;</i>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import headernav from "@/components/HeaderNav";
// import Hamburger from '@/components/Hamburger'
// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'

export default {
  components: {
    headernav
  },
  computed: {
    ...mapGetters(["account", "avatar", "device"])
  },
  created() {
    
  },
  methods: {
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";;
.navbar {
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  background: $themeColor;
  color: #fff;

  .system-name {
    display: flex;
    align-items: center;
    >h4 {
      margin-left: 10px;
      padding-left: 5px;
      border-left: 1px solid rgba(255, 255, 255, 0.25);
    }
  }

  .right-menu {
    display: flex;
    align-items: center;

    .avatar-container {
      // display: flex;
      // align-items: center;
      margin-right: 20px;
      .svg-container {
        font-size: 30px;
      }

      .avatar-name {
        font-size: 16px;
        margin-left: 10px;
      }

    }

    .logout {
      margin: 0 10px;
      padding-left: 20px;
      border-left: 1px solid rgba(255, 255, 255, 0.25);
      // margin-left: 10px;
    }
    &:focus {
      outline: none;
    }
  }
}
</style>
