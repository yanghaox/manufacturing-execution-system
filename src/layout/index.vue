<template>
  <!-- <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div> -->
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <div :class="{'fixed-header':fixedHeader}">
      <navbar />
    </div>
    <div class="fixed-body">
      <sidebar class="sidebar-container" />
      <div class="main-container">
        <tags-view v-if="needTagsView" class="fixed-tags-view" />
        <app-main />
      </div>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { Navbar, Sidebar, AppMain, TagsView, Settings } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    RightPanel,
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    Settings
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
    console.log(this.$store.state.settings.showSettings)
    this.checkBrowser()
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    // 检测浏览器
    checkBrowser() {
      const userAgent = window.navigator.userAgent
      const IE = userAgent.includes('Trident')
      const isIE = window.ActiveXObject || 'ActiveXObject' in window
      if (IE || isIE) {
        this.$notify({
          title: '提示',
          dangerouslyUseHTMLString: true,
          duration: 0,
          message:
            '为了更好的体验，建议您使用<a style="color: #248FFF" href="https://www.google.cn/chrome/" target="_blank">谷歌浏览器</a>、<a style="color: #248FFF" href="http://www.firefox.com.cn/" target="_blank">火狐浏览器</a>、<a style="color: #248FFF" href="https://www.microsoft.com/zh-cn/edge" target="_blank">Microsoft Edge 浏览器</a>，或者使用极速模式的<a style="color: #248FFF" href="https://browser.360.cn/ee/" target="_blank">360极速浏览器</a>、<a style="color: #248FFF" href="http://browser.360.cn/" target="_blank">360浏览器</a>，<a style="color: #248FFF" href="http://se.360.cn/v6/help/help5.html" target="_blank">极速模式设置教程</a>'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

// .app-wrapper {
//   @include clearfix;
//   position: relative;
//   height: 100%;
//   width: 100%;
//   &.mobile.openSidebar{
//     position: fixed;
//     top: 0;
//   }
// }
// .drawer-bg {
//   background: #000;
//   opacity: 0.3;
//   width: 100%;
//   top: 0;
//   height: 100%;
//   position: absolute;
//   z-index: 999;
// }

// .fixed-header {
//   position: fixed;
//   top: 0;
//   right: 0;
//   z-index: 9;
//   // width: calc(100% - #{$sideBarWidth});
//   width: 100%;
//   transition: width 0.28s;
// }

// .hideSidebar .fixed-header {
//   width: calc(100% - 54px)
// }

// .mobile .fixed-header {
//   width: 100%;
// }

.app-wrapper {
  width: 100%;
  height: 100%;

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: 100%;
    transition: width 0.28s;
  }

  .fixed-body {
    padding-top: 90px;
    width: 100%;

    .fixed-tags-view {
      position: fixed;
      top: 56px;
      z-index: 9;
    }
  }
}
</style>
