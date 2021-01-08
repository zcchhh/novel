<template>
  <div class="home">
    <van-nav-bar
      :fixed="true"
      title="我的书架"
      right-text="书城"
      left-text="返回"
      left-arrow
      @click-left="goBack"
      @click-right="goMail"
    ></van-nav-bar>
    <ul class="fav-books">
      <li
        class="book-card-item"
        @click="clickBookCard(item)"
        v-for="item in bookSelft"
        :key="item._id"
      >
        <img :src="item.cover" alt="" class="book-card-img" />
        <div class="book-detail">
          <h5>{{ item.title }}</h5>
          <span class="book-auto">{{ item.author }} | </span>
          <span class="book-class">{{ item.majorCate }}</span>
          <p>{{ item.longIntro }}</p>
          <span class="book-num">{{ item.wordCount }} | </span>
          <span class="book-old">
            <span class="keep">{{ item.retentionRatio }}%</span>
            留存率
          </span>
        </div>
        <span class="delete" @click.stop="removeBooks(item.shuYuanId)">
          <van-icon name="delete" />
        </span>
      </li>
      <li @click="goMail">
        <span class="book-add"></span>
        <div class="book-detail book-add-title">添加你喜欢的小说</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      bookSelft: "",
    };
  },
  created() {
    this.startData();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goMail() {
      this.$router.push({ name: "BookMail" });
    },
    startData() {
      //找不到
      if (!localStorage.getItem("weibooks")) {
        return;
      }
      this.bookSelft = JSON.parse(localStorage.getItem("weibooks")).reverse();
    },
    //开始阅读
    clickBookCard(item) {
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        //防止穿透
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      let title = item.title;
      this.axios({
        method: "GET",
        url: "/book-chapters/" + item.shuYuanId,
      })
        .then((result) => {
          this.$toast.clear();
          let chapterIndex = item.chapterIndex;
          let link = result.data.chapters[chapterIndex].link;
          this.$router.push({
            name: "Reader",
            query: {
              link,
              shuYuanId: item.shuYuanId,
              index: chapterIndex,
              title,
            },
          });
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 删除一个书
    removeBooks(shuId) {
      let localBooks = JSON.parse(localStorage.getItem("weibooks"));
      for (let i = 0; i < localBooks.length; i++) {
        if (localBooks[i].shuYuanId == shuId) {
          localBooks.splice(i, 1);
          window.localStorage.setItem("weibooks", JSON.stringify(localBooks));
          this.startData();
          return;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  background-color: #f5f2ed;
  .fav-books {
    li {
      height: 98px;
      padding: 15px 0 15px 15px;
      border-bottom: 1px solid #e7e7e7;
      background-color: #f5f2ed;
      position: relative;
      .book-card-img {
        width: 70px;
        float: left;
        margin-right: 15px;
        box-shadow: 0 2px 1px 2px rgba(0, 0, 0, 0.15);
        border-radius: 2px;
      }
      .book-detail {
        float: left;
        height: 98px;
        width: calc(~"100% - 85px");
      }
      span {
        color: #999;
      }
      .keep {
        color: red;
      }
      .book-add-title {
        line-height: 100px;
        font-size: 16px;
      }
      h5 {
        font-size: 14px;
        margin: 5px 0;
      }
      p {
        color: #999;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 10px;
        margin: 5px 0;
      }
      .book-add {
        float: left;
        width: 70px;
        height: 100px;
        background-color: #e7e7e7;
        margin-right: 15px;
        position: relative;
        &::before {
          position: absolute;
          content: "";
          display: block;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 2px;
          background-color: #999;
        }
        &::after {
          position: absolute;
          content: "";
          display: block;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 2px;
          height: 30px;
          background-color: #999;
        }
      }
      .delete {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 20px;
      }
    }
  }
}
</style>
