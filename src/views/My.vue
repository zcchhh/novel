<template>
  <div class="my">
    <van-nav-bar
      :fixed="true"
      title="我的"
      right-text="书城"
      left-text="返回"
      left-arrow
      @click-left="goBack"
      @click-right="goMail"
    >
    </van-nav-bar>
    <div class="divider">
      <van-divider
        :style="{ colcor: '#b83320', borderColor: '#b83320', padding: '0 16px' }"
      >
        第三方账号快捷登录
      </van-divider>
    </div>
    <div class="register">
      <img :src="item.path" v-for="(item, index) in imgData" :key="index" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgData: [
        { path: require("@/assets/images/wx.png") },
        { path: require("@/assets/images/qq.png") },
        { path: require("@/assets/images/wb.png") },
      ],
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goMail() {
      this.$router.push({
        name: "BookMail",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.divider {
  margin-top: 180px;
}
.register {
  text-align: center;
  img {
    margin: 15px;
  }
}
</style>
