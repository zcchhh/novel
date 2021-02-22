<template>
  <div class="relevant">
    <van-nav-bar
      :fixed="true"
      :title="title"
      right-text="书城"
      left-text="返回"
      left-arrow
      @click-left="goBack"
      @click-right="goBookMail"
    ></van-nav-bar>
    <ul class="fav-books">
      <li
        class="book-card-item"
        @click="goDetail(item)"
        v-for="(item, index) in serchCon"
        :key="index"
      >
        <img class="book-card-img" :src="item.cover" alt="" />
        <div class="book-detail">
          <h5>{{ item.title }}</h5>
          <span class="book-auto">{{ item.author }} | </span>
          <span class="book-class">{{ item.cat }}</span>
          <p>{{ item.shortIntro }}</p>
          <span class="book-num">248万字 | </span>
          <span class="book-old">
            <span class="keep">{{ item.retentionRatio }}%</span>
            留存率
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      type: "",
      serchCon: [],
    };
  },
  created() {
    this.type = this.$route.query.title;
    this.title = "和'" + this.$route.query.title + "'相关书籍";
    this.searchCon();
  },
  methods: {
    //返回上一级
    goBack() {
      this.$router.go(-1);
    },
    goBookMail() {
      this.$router.push({ name: "BookMail" });
    },
    searchCon() {
      this.axios({
        method: "GET",
        url: "/search",
        params: {
          keyword: this.type,
        },
      })
        .then((result) => {
          console.log("搜索相关内容=>", result.data);
          let containerData = result.data.books;
          for (let i = 0; i < containerData.length; i++) {
            let start = containerData[i].cover.indexOf("http");
            containerData[i].cover =
              "https://statics.zhuishushenqi.com" + containerData[i].cover;
          }
          let length = result.data.books.length > 10 ? 10 : result.data.books.length;
          this.serchCon = [];
          for (let i = 0; i < length; i++) {
            this.serchCon.push(result.data.books[i]);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 进入详情页面
    goDetail(item) {
      let bookId = item._id;
      this.$router.push({ name: "Detail", query: { bookId } });
    },
  },
};
</script>

<style scoped lang="less">
van-ellipsis {
  font-size: 14px;
}
.fav-books {
  li {
    height: 98px;
    padding: 15px 0 15px 15px;
    border-bottom: 1px solid #e7e7e7;
    background-color: #f5f2ed;
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
        position: relative;
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
  }
}
</style>
