<template>
  <!-- 书籍目录 -->
  <div class="cList">
    <van-nav-bar
      :fixed="true"
      :title="bookTitle"
      left-text="返回"
      left-arrow
      @click-left="goBack"
      @click-right="fan"
    >
      <template #right>
        <van-icon name="descending" size="24" />
      </template>
    </van-nav-bar>
    <!-- 列表部分 -->
    <ul class="listPro" v-show="sHide">
      <li
        v-for="(item, index) in bookListData"
        :key="index"
        @click="bookContainer(item.link, index)"
      >
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bookTitle: "",
      bookListData: "",
      sHide: "true",
    };
  },
  created() {
    this.startList();
  },
  methods: {
    //返回上一级
    goBack() {
      this.$router.go(-1);
    },
    fan() {
      this.bookListData.reverse();
    },
    startList() {
      let shuYuanId = this.$route.query.shuYuanId;
      this.bookTitle = this.$route.query.bookName;
      this.axios({
        method: "GET",
        url: "/book-chapters/" + shuYuanId,
      })
        .then((result) => {
          this.bookListData = result.data.chapters;
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //进入页面观看
    bookContainer(link, index) {
      let shuYuanId = this.$route.query.shuYuanId;
      this.$router.push({ name: "Reader", query: { link, shuYuanId, index } });
    },
  },
};
</script>

<style lang="less" scoped>
.listPro {
  li {
    padding: 15px;
    font-size: 16px;
    color: #333;
    border-bottom: 1px solid #f5f5f5;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.van-icon-descending {
  color: #fff;
}
</style>
