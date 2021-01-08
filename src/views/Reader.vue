<template>
  <div class="reader" :style="{ background: userSet.background }">
    <!-- 整个大页面 -->
    <div class="textCon" @click="setRead($event)" :style="{ color: userSet.color }">
      <!-- 提示遮罩层 -->
      <div class="bootPage" @click="removeNewUser" v-if="isNewUser === 0">
        <div class="b-item bootPage-left">
          <div class="center">
            <span>点击左侧翻页</span>
          </div>
        </div>
        <div class="b-item bootPage-center">
          <div class="center">
            <span>点击中间，菜单</span>
          </div>
        </div>
        <div class="b-item bootPage-right">
          <div class="center">
            <span>点击右侧翻页</span>
          </div>
        </div>
      </div>
      <!-- 小说内容页面 -->
      <div class="read-box">
        <div class="read-content">
          <section class="read-section" :style="styleObject">
            <div
              class="read-inner"
              :style="{ fontSize: userSet.fontSize + 'px' }"
              ref="bookInner"
            >
              <h3>{{ title }}</h3>
              <p v-for="(item, index) in novelData" :key="index">{{ item }}。</p>
            </div>
          </section>
        </div>
        <p class="read-page">{{ pageNum }}/{{ pageAllNum }}</p>
      </div>
    </div>
    <!-- 上一章，下一章 点击的遮罩层 点击当前的遮罩层，隐藏该遮罩层 -->
    <div class="control-box" v-show="isMenu" @click="yinCang">
      <!-- 遮罩层头部 -->
      <div class="header">
        <div class="left" @click="goBack">
          <i class="van-icon van-icon-arrow-left" style="font-size: 22px"></i>
          <span>{{ xiaoShuoMing }}</span>
        </div>
        <div class="right">
          <i class="van-icon van-icon-friends" @click="goMy"></i>
          <i class="van-icon van-icon-wap-home" @click="goHome"></i>
          <i class="van-icon van-icon-column"></i>
          <i class="van-icon van-icon-weapp-nav" @click="goMail"></i>
        </div>
      </div>
      <!-- 遮罩层底部 -->
      <div class="footer">
        <div class="footer-box1">
          <div class="footer-box1-item">
            <span @click.stop="fontSet('reduce')">Aa-</span>
          </div>

          <div class="footer-box1-item">
            <span @click.stop="fontSet('add')">Aa+</span>
          </div>
        </div>
        <!-- 改变阅读模式 -->
        <div class="footer-eye">
          <span
            v-for="(item, index) in pattern"
            :key="index"
            @click="selectColor(item)"
            >{{ item.item }}</span
          >
        </div>
        <div class="footer-catalog">
          <span @click="huanZhang('prev')">上一页</span>
          <span>目录</span>
          <span @click="huanZhang('next')">下一页</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      xiaoShuoMing: "",
      active: "kai",
      title: "",
      novelData: "",
      zhangList: "",
      //书源ID
      shuYuanId: "",
      index: 0,
      //判断是否为新用户
      isNewUser: 0,
      // 阅读模式设置
      pattern: [
        {
          item: "默认",
          color: "#5c5d58",
          background: "#eee6dd",
        },
        {
          item: "夜间",
          color: "#888",
          background: "#000",
        },
        {
          item: "护眼",
          color: "#5c5d58",
          background: "#c8e8c8",
        },
      ],

      //用户设置
      userSet: {
        fontSize: 18,
        fontColor: "#5c5d58",
        background: "#eee6dd",
        readePattern: 0,
      },
      //页数
      pageAllNum: 1,
      pageNum: 1,
      styleObject: "",
      //菜单页的显示隐藏
      isMenu: false,
    };
  },
  created() {
    //判断是否为新用户
    this.getNewUser();
    this.startNovel();
    this.startList();
    this.getUserLocalStorage();
  },
  updated() {
    this.setPaging();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    //进入书城
    goMail() {
      this.$router.push({ name: "BookMail" });
    },
    // 进入我的界面
    goMy() {
      this.$router.push({ name: "My" });
    },
    //进入书架
    goHome() {
      this.$router.push({ name: "Home" });
    },
    // goCata() {},
    /* 获取是否为新用户，新用户的则需要引导页 */
    getNewUser() {
      let localShelf = JSON.parse(window.localStorage.getItem("isNewUser"))
        ? JSON.parse(window.localStorage.getItem("isNewUser"))
        : {};
      if (localShelf.isNewUser) {
        this.isNewUser = localShelf.isNewUser;
      } else {
        this.isNewUser = 0;
      }
    },
    // 取消新用户
    removeNewUser() {
      let localShelf = {
        isNewUser: 1,
      };
      this.isNewUser = 1;
      window.localStorage.setItem("isNewUser", JSON.stringify(localShelf));
    },
    // 获取用户设置
    getUserLocalStorage() {
      let localShelf = JSON.parse(window.localStorage.getItem("userSet"))
        ? JSON.parse(window.localStorage.getItem("userSet"))
        : "";
      if (localShelf == "") {
        return;
      }
      this.userSet.fontSize = localShelf.fontSize;
      this.userSet.background = localShelf.background;
      this.userSet.fontColor = localShelf.color;
      this.userSet.readePattern = localShelf.readePattern;
      this.userSet.pagingPattern = localShelf.pagingPattern;
      let novelBg = JSON.parse(window.localStorage.getItem("novelBg"));
      if (novelBg) {
        this.selectColor(novelBg);
      }
    },
    // 设置用户字体
    setUserLocalStorage() {
      let localShelf = {};
      localShelf = {
        fontSize: this.userSet.fontSize,
        background: this.userSet.background,
        color: this.userSet.fontColor,
        readePattern: this.userSet.readePattern,
        pagingPattern: this.userSet.pagingPattern,
      };
      window.localStorage.setItem("userSet", JSON.stringify(localShelf));
    },
    // 获取bookinner的值
    setPaging() {
      this.$nextTick(function () {
        let scrollW = this.$refs.bookInner.scrollWidth;
        let clientW = this.$refs.bookInner.clientWidth;
        // 获取总页数
        this.pageAllNum = Math.floor(scrollW / clientW);
      });
    },
    // 字体大小设置
    fontSet(str) {
      if (str === "reduce") {
        if (this.userSet.fontSize <= 12) {
          return;
        } else {
          this.userSet.fontSize -= 0.8;
        }
      }
      if (str === "add") {
        if (this.userSet.fontSize >= 24) {
          return;
        } else {
          this.userSet.fontSize += 0.8;
        }
      }
      this.setUserLocalStorage();
    },
    // 左右滑动
    setRead(e) {
      let clWidth = document.documentElement.clientWidth || document.body.clientWidth;
      let currentX = e.pageX;
      //设置偏移量
      let offsetX = clWidth / 3;
      if (currentX < offsetX) {
        //用户点击左侧三分之一
        this.pageNum--;
        if (this.pageNum <= 0) {
          //调用上一章函数
          this.huanZhang("prev");
          //调用上一章的bookInner值来计算他的宽度
          this.setPaging();
          this.pageNum = 1;
          this.styleObject = {
            transform: "translateX(" + (this.pageNum - 1) * -100 + "vw" + ")",
            transitionDuration: "0s",
          };
        } else {
          this.styleObject = {
            transform: "translateX(" + (this.pageNum - 1) * -100 + "vw" + ")",
            transitionDuration: "0.5s",
          };
        }
      } else if (offsetX <= currentX && currentX <= offsetX * 2) {
        //点击中间的时候
        this.isMenu = true;
      } else if (currentX > offsetX * 2 && currentX <= clWidth) {
        //用户点击右侧的三分之一
        this.pageNum++;
        if (this.pageNum > this.pageAllNum) {
          // 调用下一章函数
          this.huanZhang("next");
          this.pageNum = 1;
          this.styleObject = {
            transform: "translateX(" + (this.pageNum - 1) * -100 + "vw" + ")",
            transitionDuration: "0s",
          };
        } else {
          this.styleObject = {
            transform: "translateX(" + (this.pageNum - 1) * -100 + "vw" + ")",
            transitionDuration: "0.5s",
          };
          this.recordPageNum();
        }
      }
    },
    // 开始读小说
    startNovel() {
      let novelName = this.$route.query.title;
      this.xiaoShuoMing = novelName;
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.index = Number(this.$route.query.index);
      let link = this.$route.query.link;
      this.axios({
        method: "GET",
        url: "/chapters/" + encodeURIComponent(link),
      })
        .then((result) => {
          if (result.status === 200) {
            this.$toast.clear();
            console.log("小说的内容=>", result.data);
            // 小说内容根据句号分割
            this.novelData = result.data.chapter.cpContent.split("。");
            //头部标题部分
            this.title = result.data.chapter.title;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 小说章节
    startList() {
      this.shuYuanId = this.$route.query.shuYuanId;
      this.axios({
        method: "GET",
        url: "/book-chapters/" + this.shuYuanId,
      })
        .then((result) => {
          console.log("小说章节=>", result.data.chapters);
          this.zhangList = result.data.chapters;
          this.lookNovel(this.index);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //换页
    huanZhang(huo) {
      document.documentElement.scrollTop = 0;
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      if (huo == "prev") {
        this.index--;
      } else {
        this.index++;
      }
      if (this.index < 0) {
        this.index = 0;
        this.$toast("已经是第一章了");
        return;
      }
      let link = this.zhangList[this.index].link;
      localStorage.setItem("read_chapter_" + this.shuYuanId, this.index);
      this.axios({
        method: "GET",
        url: "/chapters/" + encodeURIComponent(link),
      })
        .then((result) => {
          this.$toast.clear();
          this.novelData = result.data.chapter.cpContent.split("。");
          //头部标题部分
          this.title = result.data.chapter.title;
          this.lookNovel(this.index);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //记录看到第几章小说
    lookNovel(index) {
      //设置该书读到第几章
      localStorage.setItem("read_chapter_" + this.shuYuanId, index);
      //判断该书是否存在于该收藏夹
      if (!localStorage.getItem("weibooks")) {
        return;
      } else {
        let bookCardData = JSON.parse(localStorage.getItem("weibooks"));
        //循环书架
        for (let i = 0; i < bookCardData.length; i++) {
          //如果书架存在该书，就让当前书提示到收藏顶部
          if (bookCardData[i].shuYuanId == this.shuYuanId) {
            let jiechu = bookCardData.splice(i, 1);
            jiechu[0].chapterIndex = index;
            jiechu[0].pageNum = 1;
            bookCardData.push(jiechu[0]);
            localStorage.setItem("weibooks", JSON.stringify(bookCardData));
          }
        }
      }
    },
    // 记录自己看到第几页小说
    recordPageNum() {
      if (!localStorage.getItem("weibooks")) {
        return;
      } else {
        let bookCardData = JSON.parse(localStorage.getItem("weibooks"));
        //循环书架
        for (let i = 0; i < bookCardData.length; i++) {
          //如果书架存在该书
          if (bookCardData[i].shuYuanId == this.shuYuanId) {
            let jieChu = bookCardData.splice(i, 1);
            jieChu[0].pageNum = this.pageNum;
            bookCardData.push(jieChu[0]);
            localStorage.setItem("weibooks", JSON.stringify(bookCardData));
          }
        }
      }
    },
    //获取页数
    yinCang() {
      this.isMenu = false;
    },
    //选择颜色
    selectColor(item) {
      localStorage.setItem("novelBg", JSON.stringify(item));
      this.userSet.background = item.background;
      this.userSet.color = item.color;
    },
  },
};
</script>

<style lang="less" scoped>
.reader {
  position: absolute;
  top: 0px;
  // right: 0;
  left: 0;
  background: rgb(248, 238, 235);
  z-index: 4;
  // padding: 0 0 50px 6px;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  // text-indent: 2em;

  .textCon {
    background-color: red;
    font-size: 16px;
    letter-spacing: 0.2em;
    // color: #333;

    // 提示如何翻页，遮罩层把页面分为3个部分
    .bootPage {
      position: fixed;
      background: rgba(50, 52, 52, 0.8);
      z-index: 1000;
      top: 0;
      bottom: 0;
      width: 100%;
      display: flex;
      .b-item {
        flex: 1;
        .center {
          padding: 10px;
          line-height: 100vh;
          width: 100%;
          font-size: 12px;
          color: #d0d0d0;
          box-sizing: border-box;
          text-align: center;
        }
      }
      .bootPage-center {
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
      }
    }

    // 小说内容页面
    .read-box {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      .read-content {
        position: absolute;
        padding: 0 10px;
        text-align: justify; //文本对齐
        top: 40px;
        bottom: 20px;

        .read-section {
          height: 100%;
        }
        .read-inner {
          text-indent: 2em;
          height: 100%;
          columns: 355px 1;
          column-gap: 20px;
        }
        h3 {
          margin: 0;
        }
      }
      .read-page {
        position: fixed;
        left: 0px;
        bottom: 0;
        margin: 5px;
        font-size: 12px;
        color: #888;
      }
    }

    // text-indent: 2em;
    .texts {
      columns: 100vw 1;
      padding-left: 6px;
      column-gap: 6px;
      padding-top: 12px;
      padding-bottom: 12px;
      height: 100vh;
      box-sizing: border-box;
    }

    p {
      word-wrap: break-word;
    }
  }

  /* 下一章目录上一章 控制层 */
  .control-box {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    color: #ddd;

    .header {
      height: 50px;
      background: #444545;
      display: flex;
      line-height: 50px;
    }
    .left {
      flex: 1;
      span {
        font-size: 18px;
        margin-left: 10px;
      }
      .van-icon-arrow-left {
        position: relative;
        top: 4px;
        left: 5px;
      }
    }
    .right {
      flex: 1;

      .van-icon {
        flex: 1;
        font-size: 25px;
        vertical-align: middle;
        margin: 10px;
      }
    }

    .footer {
      position: fixed;
      height: 150px;
      width: 100%;
      background: #444545;
      bottom: 0;
      font-size: 20px;

      .footer-box1 {
        height: 50px;
        display: flex;

        .footer-box1-item {
          width: 50%;
          text-align: center;
          line-height: 50px;
        }
        span {
          padding: 5px 10px;
          border: 1px solid #ccc;
          border-radius: 10px;
        }
      }

      .footer-eye,
      .footer-catalog {
        height: 50px;
        display: flex;

        span {
          flex: 1;
          text-align: center;
          vertical-align: middle;
          line-height: 50px;
        }
      }
    }
  }
  /* .van-tabbar-item {
    border-top: 1px solid #ccc;
    color: #333;
    font-size: 14px;
  }
  .van-tabbar-item:nth-child(n + 2) {
    border-left: 1px solid #ccc;
  } */
}
</style>
