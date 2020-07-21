<template>
  <div class="toast">
    <!--遮罩部分-->
    <template v-if="isShow">
      <div class="mask" v-if="mask"></div>
      <div class="rectanglewrap" v-if="mode=='none'">
        <span class="iconfont" :class="icon"></span>
        {{title}}
      </div>
      <div class="squarewrap" v-else>
        <!--loading部分-->
        <div class="loading" :class="{nomt:!title}" v-if="mode=='loading'">
          <div class="outer"></div>
          <div class="inner"></div>
        </div>
        <!--提示图标部分-->
        <div class="iconfont" :class="icon" v-if="mode=='icon'"></div>
        <!--标题-->
        <div class="title" v-if="title">{{title}}</div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      mode: "loading",
      icon: "info",
      duration: 0,
      mask: false,
      isShow: false
    };
  }
};
</script>
<style scoped src="../asset/css/icon/icon.css"></style>
<style scoped src="../asset/css/toast/toast.css"></style>
