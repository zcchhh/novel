<template>
  <div class="paihang">
    <!-- 导航栏 -->
    <van-nav-bar
      :fixed="true"
      title="排行"
      left-text="返回"
      right-text="书城"
      left-arrow
      @click-left="goBack"
      @click-right="goBookMail"
    ></van-nav-bar>
    <!-- 切换频道部分 -->
    <div class="tab-box">
      <van-tabs v-model="activeName" @change="showGirl">
        <!-- 男频 -->
        <van-tab title="男频" name="a">
          <div class="container-box">
            <div class="left-nav" ref="boyLeftNav">
              <ul>
                <li
                  class="paihang-list-item"
                  v-for="(item, index) in rankCataData.male"
                  :key="index"
                  @click="cPaiList(item._id)"
                  :class="[item._id == tabListID.male ? 'active' : '']"
                >
                  <span class="paihang-list-item-text">{{ item.shortTitle }}</span>
                </li>
              </ul>
            </div>
            <div class="paihang-container" ref="boyCon">
              <div class="paihang-container-ul">
                <div
                  class="paihang-container-list"
                  v-for="(item, index) in rankConData.male"
                  :key="index"
                  @click="goDetail(item._id)"
                >
                  <img :src="item.cover" alt="" />
                  <div class="paihang-detail">
                    <h4>{{ index + 1 }}.{{ item.title }}</h4>
                    <p class="paihang-describe">
                      {{ item.shortIntro }}
                    </p>
                    <p class="sku">
                      <span class="book-author">{{ item.author }}</span>
                      <span class="book-class">{{ item.minorCate }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <!-- 女频 -->
        <van-tab title="女频" name="b">
          <div class="container-box">
            <div class="left-nav">
              <ul>
                <li
                  class="paihang-list-item"
                  v-for="(item, index) in rankCataData.female"
                  :key="index"
                  @click="cPaiList(item._id)"
                  :class="[item._id == tabListID.female ? 'active' : '']"
                >
                  <span class="paihang-list-item-text">{{ item.shortTitle }}</span>
                </li>
              </ul>
            </div>
            <div class="paihang-container" ref="girlCon">
              <div class="paihang-container-ul">
                <div
                  class="paihang-container-list"
                  v-for="(item, index) in rankConData.female"
                  :key="index"
                  @click="goDetail(item._id)"
                >
                  <img :src="item.cover" alt="" />
                  <div class="paihang-detail">
                    <h4>{{ index + 1 }}.{{ item.title }}</h4>
                    <p class="paihang-describe">
                      {{ item.shortIntro }}
                    </p>
                    <p class="sku">
                      <span class="book-author">{{ item.author }}</span>
                      <span class="book-class">{{ item.minorCate }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <!-- 出版 -->
        <van-tab title="出版" name="c">
          <div class="container-box">
            <div class="left-nav" ref="pressLeftNav">
              <ul>
                <li
                  class="paihang-list-item"
                  v-for="(item, index) in rankCataData.epub"
                  :key="index"
                  @click="cPaiList(item._id)"
                  :class="[item._id == tabListID.epub ? 'active' : '']"
                >
                  <span class="paihang-list-item-text">{{ item.shortTitle }}</span>
                </li>
              </ul>
            </div>
            <div class="paihang-container" ref="pressCon">
              <div class="paihang-container-ul">
                <div
                  class="paihang-container-list"
                  v-for="(item, index) in rankConData.epub"
                  :key="index"
                  @click="goDetail(item._id)"
                >
                  <img :src="item.cover" alt="" />
                  <div class="paihang-detail">
                    <h4>{{ index + 1 }}.{{ item.title }}</h4>
                    <p class="paihang-describe">
                      {{ item.shortIntro }}
                    </p>
                    <p class="sku">
                      <span class="book-author">{{ item.author }}</span>
                      <span class="book-class">{{ item.minorCate }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  data() {
    return {
      //默认名字
      activeName: "a",
      // 排名分类
      rankCataData: "",
      //排名详情
      rankConData: {
        male: "",
        female: "",
        epub: "",
      },
      // 排名列表里的ID，对应高亮
      tabListID: {
        male: "",
        female: "",
        epub: "",
      },
    };
  },
  created() {
    this.paiClass();
  },
  methods: {
    //返回上一级
    goBack() {
      this.$router.go(-1);
    },
    goBookMail() {
      this.$router.push({ name: "BookMail" });
    },
    paiClass() {
      this.axios({
        method: "GET",
        url: "/rank-category",
      })
        .then((result) => {
          if (result.status === 200) {
            this.rankCataData = result.data;
            for (let key in this.rankCataData) {
              this.tabListID[key] = this.rankCataData[key][0]._id;
              this.rankDetail(this.rankCataData[key][0]._id, key);
            }
          }
        })
        .catch((err) => {});
    },
    // 切换男频、女频、出版，使列表可以滑动
    showGirl(name) {
      // 使用$nextTick函数将在dom更新完成后调用
      this.$nextTick(() => {
        if (name === "a") {
          if (!this.paihangList) {
            this.paihangList = new BScroll(this.$refs.boyLeftNav, {
              click: true,
            });
          } else {
            this.paihangList.refresh(); //刷新自身,重新计算内部元素的高度
          }
          if (!this.boyConScroll) {
            this.boyConScroll = new BScroll(this.$refs.boyCon, {
              click: true,
            });
          } else {
            this.boyConScroll.refresh();
          }
        }
        if (name === "b") {
          if (!this.girlConScroll) {
            this.girlConScroll = new BScroll(this.$refs.girlCon, {
              click: true,
            });
          } else {
            this.girlConScroll.refresh();
          }
        }
        if (name === "c") {
          if (!this.pressConScroll) {
            this.pressConScroll = new BScroll(this.$refs.pressCon, {
              click: true,
            });
          } else {
            this.pressConScroll.refresh();
          }
        }
      });
    },
    //初始排名的详情
    rankDetail(_id, key) {
      this.axios({
        method: "GET",
        url: "/rank/" + _id,
      })
        .then((result) => {
          if (result.status === 200) {
            for (let i = 0; i < result.data.ranking.books.length; i++) {
              result.data.ranking.books[i].cover =
                "https://statics.zhuishushenqi.com" + result.data.ranking.books[i].cover;
            }
            // 使排行列表 和 排行详情内容可以滑动
            this.showGirl("a");
            this.rankConData[key] = result.data.ranking.books;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 改变榜单列表
    cPaiList(ind) {
      //禁止排行榜列表重点点击
      for (let key in this.tabListID) {
        if (this.tabListID[key] == ind) {
          return;
        }
      }
      this.axios({
        method: "GET",
        url: "/rank/" + ind + "",
      })
        .then((result) => {
          if (result.status === 200) {
            let containerData = result.data.ranking.books;
            for (let i = 0; i < containerData.length; i++) {
              containerData[i].cover =
                "https://statics.zhuishushenqi.com" + containerData[i].cover;
            }
            // 循环排名详情，改变tabListID和rankConData(排名详情的内容)
            for (let key in this.rankConData) {
              if (result.data.ranking.gender == key) {
                this.rankConData[key] = result.data.ranking.books;
                this.tabListID[key] = ind;
                this.showGirl(key);
              }
            }
            // 判断点击的是男频还是女频还是出版，来改变滑动的距离
            if (result.data.ranking.gender === "male") {
              this.showGirl("a");
            } else if (result.data.ranking.gender === "female") {
              this.showGirl("b");
            } else {
              this.showGirl("c");
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //点击进入详情页面
    goDetail(bookId) {
      this.$router.push({ name: "Detail", query: { bookId } });
    },
  },
  beforeDestory() {
    // BScroll不属于Vue，他是一个有副作用的DOM操作，所以当前组件被卸载时请回收该实例
    if (this.paihangList) {
      this.paihangList.destory();
    }
    if (this.boyConScroll) {
      this.boyConScroll.destory();
    }
    if (this.girlConScroll) {
      this.girlConScroll.destory();
    }
    if (this.pressLeftNavList) {
      this.pressConScroll.destory();
    }
  },
};
</script>

<style scoped lang="less">
.paihang {
  /deep/ .van-tabs__wrap {
    border-bottom: 1px solid #ebedf0;
  }
  .container-box {
    display: flex;
    position: fixed;
    top: 90px;
    right: 0;
    bottom: 50px;
    left: 0;

    .left-nav {
      flex: 0 0 100px;
      height: 100%;
      background-color: #fff;
      overflow: hidden;
    }

    .paihang-list-item {
      height: 40px;
      padding: 0 12px;
      color: #333;

      &.active {
        background-color: #f9f9fb;
        color: #b83320;
        font-weight: bold;
        border-left: 2px solid #b83320;
      }
    }
    .paihang-list-item-text {
      display: block;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 14px;
      border-bottom: 1px solid #ebedf0;
    }
    // 排名内容部分
    .paihang-container {
      flex: 1;
      height: 100%;
      overflow: hidden;
    }
    .paihang-container-list {
      padding: 10px 15px 10px 5px;
      height: 85px;

      img {
        width: 60px;
        height: 80px;
        float: left;
        margin-right: 15px;
        border-radius: 2px;
        box-shadow: 0 2px 1px 2px rgba(0, 0, 0, 0.15);
      }
      .paihang-detail {
        float: left;
        width: calc(~"100% - 75px");
      }
      h4 {
        font-size: 14px;
        margin: 5px 0;
      }
      .paihang-describe {
        color: #999;
        // font-size: 10px;
        margin: 5px 0;
        display: -webkit-box; //将对象作为弹性伸缩盒子显示
        -webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式
        -webkit-line-clamp: 2; //设置显示多少行
        overflow: hidden;
      }
      .sku {
        margin: 5px 0;
        position: relative;
      }
      .book-class {
        position: absolute;
        right: 0;
        background: #e7e7e7;
        color: #666;
        border-radius: 8px;
        padding: 2px 5px;
        transform: scale(0.8);
      }
    }
  }
}
</style>
