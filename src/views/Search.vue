<template>
  <div class="search">
    <van-nav-bar
      :fixed="true"
      title="搜索"
      right-text="书城"
      left-text="返回"
      left-arrow
      @click-left="goBack"
      @click-right="goMail"
    ></van-nav-bar>

    <!-- 小说搜索部分 -->
    <div class="nav">
      <div class="nav-back">
        <van-icon name="arrow-left" size="26" color="#ccc" />
      </div>
      <div class="nav-s">
        <van-search
          v-model="value"
          placeholder="请输入小说名"
          shape="round"
          autofocus="true"
          @input="confirmSearch()"
        />
      </div>
      <div class="nav-cli" @click="confirmSearch">确定</div>
    </div>
    <!-- 搜索热词部分 -->
    <div class="content">
      <div class="hot">
        <div class="hot-head clearfix">
          <div class="hot-title fl">搜索热词</div>
          <div class="hot-more fr" @click="randomArr">
            <span>换一批</span>
            <span>
              <van-icon name="replay" />
            </span>
          </div>
        </div>
        <ul class="hot-label clearfix">
          <li v-for="(item, index) in hotwords" @click="sHot(item.word)" :key="index">
            {{ item.word }}
          </li>
        </ul>
      </div>
    </div>
    <!-- 删除搜索历史部分 -->
    <div class="history-box">
      <div class="history-head clearfix">
        <div class="history-title fl">搜索历史</div>
        <div class="history-right fr clearfix" @click="clearAllhistory">
          <div class="fl history-text">删除历史</div>
          <div class="fr history-icon">
            <van-icon name="delete" />
          </div>
        </div>
      </div>
      <ul class="hot-label clearfix">
        <li v-for="(item, index) in searchHistory" @click="sHistory(item)" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>
    <!-- 小说列表部分 -->
    <ul class="search-list" v-show="iShow">
      <li v-for="(item, index) in searchListData" :key="index" @click="cList(item)">
        <van-icon name="orders-o" />
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import "@/assets/less/search.less";

export default {
  data() {
    return {
      value: "",
      allSearchData: "",
      hotwords: "",
      // 搜索热词的数量
      length: 8,
      searchListData: [],
      iShow: false,
      //搜索历史
      searchHistory: [],
    };
  },

  created() {
    this.searchWord();
    this.getSearchHistory();
  },

  methods: {
    // 返回上一级
    goBack() {
      this.$router.go(-1);
    },
    goMail() {
      this.$router.push({ name: "BookMail" });
    },
    /* 搜索热词 */
    searchWord() {
      //
      this.axios({
        method: "GET",
        url: "/search-hotwords",
      })
        .then((result) => {
          //
          let arrWord = [];
          this.allSearchData = result.data.searchHotWords;
          for (var i = 0; i < this.length; i++) {
            arrWord.push(this.allSearchData[i]);
          }
          this.hotwords = arrWord;
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    /* 换一批 */
    randomArr() {
      this.allSearchData.sort(function () {
        return Math.random() - 0.5;
      });
      let arrWord = [];
      for (var i = 0; i < this.length; i++) {
        arrWord.push(this.allSearchData[i]);
      }
      this.hotwords = arrWord;
    },

    /* 搜索内容 */
    confirmSearch() {
      if (this.value == "") {
        this.iShow = false;
        return;
      }
      this.axios({
        method: "GET",
        url: "/search",
        params: {
          keyword: this.value,
        },
      })
        .then((result) => {
          this.iShow = true;

          let length = result.data.books.length > 10 ? 10 : result.data.books.length;
          this.searchListData = [];
          for (let i = 0; i < length; i++) {
            this.searchListData.push(result.data.books[i]);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 点击列表渲染数据
    cList(item) {
      this.$router.push({ name: "Relevant", query: { title: item.title } });
    },

    sHot(hotWord) {
      this.value = hotWord;
      this.confirmSearch();
    },
    // 获取搜索历史
    getSearchHistory() {
      if (localStorage.getItem("searchHistory")) {
        this.searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
      }
    },
    //缓存搜素历史
    setSearcHistory(text) {
      for (let key in this.searchHistory) {
        if (this.searchHistory[key] == text) {
          this.searchHistory.splice(key, 1);
        }
      }
      this.searchHistory.unshift(text);
      localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));
    },
    //点击搜素历史跳转到搜索
    sHistory(historyWord) {
      this.value = historyWord;
      this.confirmSearch();
      this.setSearcHistory(historyWord);
      this.getSearchHistory();
    },
    //清空搜索历史
    clearAllhistory() {
      this.searchHistory = [];
      localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));
    },
  },
  watch: {
    value: function (n) {
      this.setSearcHistory(n);
      this.getSearchHistory();
    },
  },

  components: {},
};
</script>

<style lang="less" scoped>
.search {
  // 搜索热词部分
  .content {
    .hot-head {
      color: #555;
      .hot-title {
        font-size: 20px;
      }
    }
    .hot-more {
      .van-icon-replay {
        position: relative;
        top: 2px;
        transform: rotate(90deg);
      }
    }
  }
  // 小说列表部分
  .search-list {
    position: absolute;
    top: 100px;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    background: #fff;
    z-index: 2;

    li {
      border-bottom: 1px solid #f3f3f3;
      line-height: 50px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      font-size: 16px;
    }
    .van-icon-orders-o {
      font-size: 20px;
      top: 4px;
    }
  }
}
</style>
