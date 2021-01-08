<template>
  <div class="bookcity">
    <van-nav-bar :fixed="true">
      <template #left>慧聪</template>
      <template #title>
        <div class="gender-button">
          <button :class="[isActive ? 'active' : '']" @click="boy">男生</button>
          <button :class="[isActive ? '' : 'active']" @click="girl">女生</button>
        </div>
      </template>
      <template #right>
        <i class="van-icon van-icon-user-circle-o" @click="goMy"></i>
      </template>
    </van-nav-bar>
    <!-- 搜索部分 -->
    <div class="nav">
      <van-search
        v-model="value"
        placeholder="请输入搜索关键词"
        @focus="goSearch"
        shape="round"
      />
    </div>
    <!-- 轮播图部分 -->
    <div class="swipe-box">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#b83320">
        <van-swipe-item v-for="(item, index) in bannerImg" :key="index">
          <img class="auto-img" :src="item.path" alt="" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="grild-box">
      <van-grid>
        <van-grid-item icon="column" @click="goShelf" text="书架" />
        <van-grid-item icon="bar-chart-o" @click="goPaiHang" text="排行" />
        <van-grid-item icon="qr-invalid" text="分类" @click="goClass" />
        <van-grid-item icon="balance-o" text="充值" @click="goLogin" />
      </van-grid>
    </div>
    <!-- 极品神作部分 -->
    <div class="book-city-content">
      <van-tabs v-model="active" scrollspy sticky>
        <van-tab v-for="(item, index) in bookCityData" :key="index" :title="item.title">
          <div class="search-title">
            <h3>{{ item.title }}</h3>
            <div class="more">
              <span>更多 </span>
              <span>
                <van-icon name="arrow" />
              </span>
            </div>
          </div>
          <ul class="rank-list clearfix" v-show="isActive">
            <li
              class="home-card"
              @click="goDetail(item1._id)"
              v-for="item1 in item.bookArr"
              :key="item1._id"
            >
              <div class="thumb">
                <img :src="item1.cover" alt="" />
                <h5>{{ item1.title }}</h5>
              </div>
              <div class="book-detail">
                <h5>{{ item1.title }}</h5>
                <p>
                  {{ item1.shortIntro }}
                </p>
                <div class="span-ap">
                  <span class="span-author"
                    ><van-icon name="manager" />{{ item1.author }} |
                    {{ item1.minorCate }}</span
                  >
                  <span class="span-person">14.1万人气</span>
                </div>
              </div>
            </li>
          </ul>
          <ul class="rank-list clearfix" v-show="!isActive">
            <li
              class="home-card"
              @click="goDetail(item1._id)"
              v-for="item1 in item.bookgirlArr"
              :key="item1._id"
            >
              <div class="thumb">
                <img :src="item1.cover" alt="" />
                <h5>{{ item1.title }}</h5>
              </div>
              <div class="book-detail">
                <h5>{{ item1.title }}</h5>
                <p>
                  {{ item1.shortIntro }}
                </p>
                <div class="span-ap">
                  <span class="span-author"
                    ><van-icon name="manager" />{{ item1.author }} |
                    {{ item1.minorCate }}</span
                  >
                  <span class="span-person">14.1万人气</span>
                </div>
              </div>
            </li>
          </ul>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: true,
      value: "",
      active: 2,
      bannerImg: [
        { path: require("@/assets/images/banner1.jpg") },
        { path: require("@/assets/images/banner2.jpg") },
        { path: require("@/assets/images/banner3.jpg") },
        { path: require("@/assets/images/banner4.jpg") },
        { path: require("@/assets/images/banner5.jpg") },
      ],
      // 推荐的个数
      len: 7,
      bookCityData: [
        { title: "极品神作", bookArr: [], bookgirlArr: [] },
        { title: "人气好书", bookArr: [], bookgirlArr: [] },
        { title: "热门搜索", bookArr: [], bookgirlArr: [] },
        { title: "口碑好评", bookArr: [], bookgirlArr: [] },
        { title: "高能剧情", bookArr: [], bookgirlArr: [] },
        { title: "小众佳作", bookArr: [], bookgirlArr: [] },
        { title: "VIP区", bookArr: [], bookgirlArr: [] },
      ],
    };
  },
  created() {
    this.paiClass();
  },
  methods: {
    goSearch() {
      this.$router.push({ name: "Search" });
    },
    goLogin() {
      this.$router.push({ name: "Login" });
    },
    boy() {
      this.isActive = true;
    },
    girl() {
      this.isActive = false;
    },
    /* 极品神作推荐 */
    //   获取排名分类列表
    paiClass() {
      this.axios({
        method: "GET",
        url: "/rank-category",
      })
        .then((result) => {
          if (result.status === 200) {
            //
            console.log("排名数据=>", result.data);
            for (let i = 0; i < this.len; i++) {
              this.rankDetail(result.data.male[i]._id, i);
              this.rankDetail(result.data.female[i]._id, i);
            }
          }
        })
        .catch((err) => {});
    },

    // 初始化排名的详情
    rankDetail(_id, i) {
      //
      this.axios({
        method: "GET",
        url: "/rank/" + _id,
      })
        .then((result) => {
          if (result.status == 200) {
            console.log("排名详情=>", result.data);
            //
            //
            for (let i = 0; i < result.data.ranking.books.length; i++) {
              result.data.ranking.books[i].cover =
                "https://statics.zhuishushenqi.com" + result.data.ranking.books[i].cover;
            }
            if (result.data.ranking.gender == "male") {
              this.bookCityData[i].bookArr = result.data.ranking.books.slice(0, 5);
            } else if (result.data.ranking.gender == "female") {
              this.bookCityData[i].bookgirlArr = result.data.ranking.books.slice(0, 5);
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 进入详情页面
    goDetail(bookId) {
      this.$router.push({ name: "Detail", query: { bookId } });
    },
    // 进入分类
    goClass() {
      this.$router.push({ name: "ClassChildren" });
    },
    // 进入书架
    goShelf() {
      this.$router.push({ name: "Home" });
    },

    // 进入排行
    goPaiHang() {
      this.$router.push({ name: "Ranking" });
    },
    // 进入我的界面
    goMy() {
      this.$router.push({ name: "My" });
    },
  },
};
</script>

<style lang="less" scoped>
.bookcity {
  /deep/ .van-nav-bar__left {
    font-weight: 900;
    font-size: 40px;
    font-family: 隶书;
    color: #fff;
  }
  .van-icon-user-circle-o {
    font-size: 24px;
    color: #fff;
  }
  .gender-button {
    button {
      outline: none;
      line-height: 26px;
      border: 1px solid #fff;
      background: transparent;
      color: #fff;

      &:first-child {
        border-radius: 26px 0 0 26px;
      }
      &:last-child {
        border-radius: 0 26px 26px 0;
      }
      &.active {
        background: #fff;
        color: #999;
      }
    }
  }

  //   轮播图
  .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 120px;
    text-align: center;
    background-color: #39a9ed;
  }

  /deep/ .van-tabs__wrap {
    border-bottom: 1px solid #ebedf0;
  }

  // 极品神作部分
  .book-city-content {
    .search-title {
      padding: 0 10px;
      h3 {
        display: inline-block;
        font-size: 16px;
      }
      .more {
        // height: 53px;
        line-height: 53px;
        float: right;
        font-size: 12px;
      }
      .van-icon-arrow {
        // vertical-align: middle;
        position: relative;
        top: 2px;
      }
    }

    ul.rank-list {
      padding: 0 10px 30px;
      border-bottom: 10px solid #f5f4f4;

      .home-card:first-child {
        padding: 0 0 15px 15px;
        margin-bottom: 15px;

        .thumb {
          img {
            float: left;
            width: 75px;
            height: 100px;
            margin-right: 15px;
            border-radius: 2px;
            box-shadow: 0 2px 1px 2px rgba(0, 0, 0, 0.15);
          }
          h5 {
            display: none;
          }
        }
      }

      .home-card:nth-child(n + 2) {
        width: 75px;
        float: left;
        margin-left: 12px;

        .book-detail {
          display: none;
        }
        .thumb img {
          width: 75px;
          height: 100px;
          margin-right: 15px;
          border-radius: 2px;
          box-shadow: 0 2px 1px 2px rgba(0, 0, 0, 0.15);
        }
        h5 {
          margin: 0px;
          color: #999;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .book-detail {
        h5 {
          font-size: 14px;
          margin: 5px 0;
        }
        p {
          color: #999;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          font-size: 10px;
          margin: 5px 0;
        }
        .span-ap {
          color: #999;
          margin-top: 8px;
        }
        .span-author {
          margin-left: 10px;
        }
        .span-person {
          float: right;
          transform: scale(0.9);
          padding: 1px 3px;
          background: #f5aaaa;
          color: red;
          border-radius: 10px;
          margin-top: 5px;
        }
      }
    }
  }
  .van-tab__pane {
    border-bottom: 1px solid #ebedf0;
  }
}
</style>
