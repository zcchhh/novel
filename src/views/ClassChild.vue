<template>
  <div class="schild">
    <van-nav-bar
      :fixed="true"
      title="子类"
      right-text="书城"
      left-text="返回"
      left-arrow
      @click-left="goBack"
      @click-right="goMail"
    ></van-nav-bar>
    <!-- //书本部分 -->
    <div class="paihang-container">
      <div class="paihang-container-ul">
        <div
          class="paihang-container-list"
          v-for="(item, index) in childConData"
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
</template>

<script>
export default {
  data() {
    return {
      childConData: [],
    };
  },
  created() {
    this.getSclass();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goMail() {
      this.$router.push({ name: "BookMail" });
    },
    //点击进入详情页面
    goDetail(bookId) {
      this.$router.push({ name: "Detail", query: { bookId } });
    },
    getSclass() {
      let gender = this.$route.query.sexs;
      let name = this.$route.query.item;

      this.axios({
        method: "GET",
        url:
          "/category-info?gender=" +
          gender +
          "&type=hot&major=" +
          name +
          "&minor=&start=0&limit=20",
        // url: "/category-info",
        // params: {
        //   gender,
        //   type: "hot",
        //   major: name,
        //   minor: "",
        //   start: 0,
        //   limit: 15,
        // },
      }).then((result) => {
        // console.log("子分类=>", result.data);
        if (result.status === 200) {
          console.log("子分类=>", result.data);
          let containerData = result.data.books;
          for (let i = 0; i < containerData.length; i++) {
            containerData[i].cover =
              "https://statics.zhuishushenqi.com" + containerData[i].cover;
          }
          this.childConData = containerData;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
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
</style>
