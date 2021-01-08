<template>
  <div class="detail">
    <van-nav-bar
      :fixed="true"
      title="书籍详情"
      right-text="书城"
      left-text="返回"
      left-arrow
      @click-left="goBack"
      @click-right="goBookMail"
    ></van-nav-bar>
    <!-- 小说详情部分 -->
    <div class="book-detail clearfix">
      <img :src="bookDetail.cover" alt="" />
      <div class="book-detail-word">
        <h3>{{ bookDetail.title }}</h3>
        <div class="detail-ac">
          <span class="book-author">{{ bookDetail.author }}</span>
          <span class="book-copyright">{{ bookDetail.copyright }}</span>
        </div>
        <div class="tw">
          <span class="book-type">{{ bookDetail.minorCate }}</span>
          <span class="book-wordCount">{{ bookDetail.wordCount }}</span>
        </div>
      </div>
    </div>
    <!-- 读者数据部分 -->
    <ul class="reader-data">
      <li class="score">
        <p>
          <span class="star-score">{{ readerData.score }}</span>
          <van-rate
            v-model="value"
            :size="12"
            color="#ffd21e"
            void-icon="star"
            void-color="#eee"
            :gutter="0"
          />
        </p>
        <p class="score-count">{{ readerData.tip }}</p>
      </li>
      <li>
        <p>{{ bookDetail.retentionRatio }}%</p>
        <p>读者留存</p>
      </li>
      <li>
        <p>{{ bookDetail.latelyFollower }}</p>
        <p>7日人气</p>
      </li>
      <li>
        <p>{{ bookDetail.totalFollower }}</p>
        <p>累计人气</p>
      </li>
    </ul>
    <!-- 书本简介部分 -->
    <div class="describe-box">
      <h3>简介</h3>
      <span class="span-classify" v-for="(item, index) in bookDetail.tags" :key="index">{{
        item
      }}</span>
      <p :class="[isActive ? 'active' : '']">
        {{ bookDetail.longIntro }}
        <span class="arrow-down">
          <van-icon name="arrow-down" @click="jian()" />
        </span>
      </p>
    </div>
    <!-- 目录部分 -->
    <div class="detail-catalog" @click="goList()">
      <span class="catalogue">目录</span>
      <span>1天前更新</span>
      <span
        >{{ bookDetail.lastChapter }}
        <van-icon name="arrow" />
      </span>
    </div>
    <!-- 热门短评和热门书评 -->
    <div class="hot-short">
      <h5 class="hot-title">热门短评</h5>
      <ul class="hot-content"></ul>
      <div class="all-ping">查看全部短评</div>
    </div>
    <div class="hot-book">
      <h5 class="hot-title">热门书评</h5>
      <ul class="hot-content"></ul>
      <div class="all-ping">全部书评</div>
    </div>
    <!-- 加入购物车，开始阅读 -->
    <van-tabbar v-model="active">
      <van-tabbar-item name="zhui" @click="addBookshelf">
        <span class="add">+</span>加入书架
      </van-tabbar-item>
      <van-tabbar-item name="kai" class="startRead" @click="startRead()"
        >开始阅读</van-tabbar-item
      >

      <van-tabbar-item name="xia"> <span class="jian">↓</span>下载 </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 5,
      // 读者数据
      readerData: "",
      // 书籍详情
      bookDetail: "",
      //可控制简介的显示和隐藏
      isActive: false,
      // 默认选中kai

      active: "kai",
      // 当前书籍的ID
      shuYuanId: "",
    };
  },
  created() {
    this.startDetail();
    this.bookStart();
  },
  methods: {
    //返回上一级
    goBack() {
      this.$router.go(-1);
    },
    goBookMail() {
      this.$router.push({ name: "BookMail" });
    },
    //改变isActive的值
    jian() {
      this.isActive = !this.isActive;
    },
    //详情
    startDetail() {
      let _id = this.$route.query.bookId;
      this.axios({
        method: "GET",
        url: "/book-info/" + _id,
      })
        .then((result) => {
          if (result.status === 200) {
            console.log("详情=>", result.data);
            //评分保留一位小数
            result.data.rating.score = result.data.rating.score.toFixed(1);
            this.readerData = result.data.rating;
            result.data.cover = "https://statics.zhuishushenqi.com" + result.data.cover;
            //7日人气大于4位数，则改为以万为单位
            result.data.latelyFollower = result.data.latelyFollower.toString();
            let latelylen = result.data.latelyFollower.length;
            if (latelylen > 4) {
              result.data.latelyFollower =
                result.data.latelyFollower.slice(0, latelylen - 4) +
                "." +
                result.data.latelyFollower.substr(latelylen - 4, 1) +
                "万";
            }
            // 总人气大于4位数则改为以万为单位
            result.data.totalFollower = result.data.totalFollower.toString();
            let totalLen = result.data.totalFollower.length;
            if (totalLen > 4) {
              result.data.totalFollower =
                result.data.totalFollower.slice(0, totalLen - 4) +
                "." +
                result.data.totalFollower.substr(totalLen - 4, 1) +
                "万";
            }
            //多少字数
            result.data.wordCount = result.data.wordCount.toString();
            let wordLen = result.data.wordCount.length;
            if (wordLen > 4) {
              result.data.wordCount = result.data.wordCount.slice(0, wordLen - 4) + "万";
            }
            this.bookDetail = result.data;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 书籍源
    bookStart() {
      let _id = this.$route.query.bookId;
      this.$toast.loading({
        // 提示信息
        message: "加载中...",
        // 禁止点击背景
        forbidClick: true,
        // 延迟时间
        duration: 0,
        // 加载类型
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/book-sources",
        params: {
          view: "summary",
          book: _id,
        },
      })
        .then((result) => {
          this.$toast.clear();
          this.shuYuanId = result.data[0]._id;
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //进入章节列表页面
    goList() {
      let shuYuanId = this.shuYuanId;
      this.$router.push({
        name: "CatalogList",
        query: { shuYuanId, bookName: this.bookDetail.title },
      });
    },
    // 加入书架
    addBookshelf() {
      let {
        cover,
        title,
        author,
        majorCate,
        longIntro,
        wordCount,
        retentionRatio,
      } = this.bookDetail;
      // 章节
      let chapterIndex = 0;
      // 书页
      let pageNum = 0;
      if (localStorage.getItem("read_chapter_" + this.shuYuanId)) {
        chapterIndex = localStorage.getItem("read_chapter_" + this.shuYuanId);
      }
      let obj = {
        shuYuanId: this.shuYuanId,
        chapterIndex,
        pageNum,
        cover,
        title,
        author,
        majorCate,
        longIntro,
        wordCount,
        retentionRatio,
      };
      // 设置一个空数组
      let objBookself = [];
      if (localStorage.getItem("weibooks")) {
        objBookself = JSON.parse(localStorage.getItem("weibooks"));
      }
      //防止重复添加
      for (let i = 0; i < objBookself.length; i++) {
        if (objBookself[i].shuYuanId == obj.shuYuanId) {
          this.$toast("该书已在书架");
          return;
        }
      }
      objBookself.push(obj);
      localStorage.setItem("weibooks", JSON.stringify(objBookself));
      this.$toast("加入书架成功");
    },
    // 开始阅读
    startRead() {
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        //防止穿透
        forbidClick: true,
        //显示时间, 如果时间为0，则不会自动关闭
        duration: 0,
        loadingType: "spinner",
      });
      let title = this.bookDetail.title;
      if (!localStorage.getItem("read_chapter_" + this.shuYuanId)) {
        localStorage.setItem("read_chapter_" + this.shuYuanId, 0);
      }
      let index = localStorage.getItem("read_chapter_" + this.shuYuanId);
      //获取书籍列表
      this.axios({
        method: "GET",
        url: "/book-chapters/" + this.shuYuanId,
      })
        .then((result) => {
          this.$toast.clear();
          let shuYuanId = this.shuYuanId;
          let link = result.data.chapters[index].link;
          this.$router.push({
            name: "Reader",
            query: { link, shuYuanId, index, title },
          });
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
  },
};
</script>

<style scoped lang="less">
.detail {
  position: absolute;
  top: 46px;
  right: 0;
  left: 0;
  background-color: #fff;
  z-index: 2;
  padding-bottom: 50px;

  .book-detail {
    padding: 20px 15px;
    background-color: #333;

    img {
      width: 70px;
      float: left;
      margin-right: 20px;
    }
    .book-detail-word {
      float: left;
      width: calc(~"100% - 90px");
    }
    h3 {
      font-size: 18px;
      margin: 5px 0;
      color: #fff;
    }
    .book-author,
    .book-type {
      color: gold;
      font-size: 16px;

      &:after {
        content: "|";
        display: inline-block;
        margin: 0 20px;
        color: #ccc;
      }
    }
    .book-copyright,
    .book-wordCount {
      color: #ccc;
      font-size: 16px;
    }
  }
  //   读者的数据
  .reader-data {
    padding: 15px;
    display: flex;
    background-color: #fff;
    border-bottom: 10px solid #f5f4f4;

    li:nth-child(n + 2) {
      flex: 1;
      text-align: center;
      color: #666;
    }
    li {
      font-size: 14px;
      p {
        margin: 5px 0;
        width: 100%;
      }
    }
    .score {
      // padding: 0 4px;
      position: relative;
    }
    .star-score {
      position: absolute;
      font-size: 18px;
      font-weight: 200;
    }
    .van-rate {
      position: relative;
      left: 30px;
      top: 4px;
    }
    .score-count {
      font-size: 12px;
      height: 16px;
      overflow: hidden;
    }
  }

  // 简介部分
  .describe-box {
    padding: 0 15px;
    background-color: #fff;
    h3 {
      font-size: 16px;
      margin: 20px 0 10px;
    }
    .span-classify {
      font-size: 12px;
      color: #999;
      background: #f1f1f1;
      padding: 2px 5px;
      border-radius: 10px;
      margin: 0px 3px;
    }
    p {
      line-height: 0.66667rem;
      padding-right: 17px;
      position: relative;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      color: #666;
      font-size: 14px;
    }
    .active {
      display: block;
    }
    .arrow-down {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
  //   目录部分
  .detail-catalog {
    border-top: 1px solid #f0f0f0;
    border-bottom: 10px solid #f5f4f4;
    padding: 15px 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;

    .catalogue {
      font-size: 16px;
    }

    span {
      display: inline-block;
      width: 70px;
      padding-left: 15px;
      color: #666;
      line-height: 20px;

      &:nth-child(2) {
        font-size: 12px;
        text-align: left;
        color: red;
      }

      &:last-child {
        color: #999;
        font-size: 12px;
        flex: 1;
        padding: 0 15px 0 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        position: relative;
      }
      .van-icon-arrow {
        position: absolute;
        right: 5px;
        top: 4px;
      }
    }
  }

  // 热门书评
  .hot-short .title,
  .hot-book .title {
    padding: 0 0 15px 15px;
    margin-bottom: 15px;
    font-size: 16px;
    border-bottom: 1px solid #f1f1f1;
  }

  .hot-short .all-ping,
  .hot-book .all-ping {
    color: red;
    text-align: center;
    padding: 10px 0;
    border-top: 1px solid #f1f1f1;
    border-bottom: 10px solid #f5f4f4;
  }

  // 追加，开始，下载
  .add {
    font-size: 32px;
    vertical-align: middle;
  }
  .jian {
    font-size: 20px;
  }
  .van-tabbar-item {
    color: red;
    font-size: 16px;
  }
  .startRead {
    width: 100%;
    height: 100%;
    color: #fff;
    background: #b83320;
    font-size: 18px;
  }
}
</style>
