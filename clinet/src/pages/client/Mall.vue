<template>
  <div class="Mall">
    <header>
      <div class="container clear">
        <span class="title" @click="navTo('/mall')">MoreMall 一站式选购平台</span>
        <NoticeList :notices="notices"/>
        <div class="right" v-if="clientToken">
          <span class="name">欢迎您，{{clientName}}</span>
          <span @click="navTo('/mall/personal')">个人中心</span>
          <span @click="logout">退出登录</span>
        </div>
        <div class="right" v-else>
          <span @click="navTo('/login')">登录</span>
          <span @click="navTo('/login')">注册</span>
        </div>
      </div>
    </header>
<Ml v-bind:formula-data1='[
        {
          degree: 3,
          coef: -0.8
        },
        {
          degree: 2,
          coef: -0.2
        },
        {
          degree: 1,
          coef: 0.9
        },
        {
          coef: 0.5
        }
      ]' v-bind:points1='100' v-bind:iterations1='75'/>
   
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import NoticeList from "../../components/NoticeList";
import { getClientSize, backToTop } from "../../util/util";
import Ml from "./Ml";

export default {
  name: "Mall",
  computed: {
    ...mapState(["clientToken", "clientName"])
  },
  components: {
    NoticeList,
    Ml
  },
  data() {
    return {
      notices: [
        "今日疯抢：牛皮防水男靴仅229元！直减2...",
        "【福利】领1000元APP新人礼"
      ],
      clientHeight: getClientSize().height,
      shouldShowBT: false
    };
  },

  methods: {
    ...mapMutations({
      clientLogout: "CLIENT_LOGOUT"
    }),
    navTo(route) {
      this.$router.push(route);
    },
    logout() {
      this.clientLogout();
      this.$router.go(0);
    },
    backToTop() {
      backToTop();
    },
    watchScrollTop() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 150) {
        this.shouldShowBT = true;
      } else {
        this.shouldShowBT = false;
      }
    }
  },

  mounted() {
    document.addEventListener("scroll", this.watchScrollTop, false);
  },

  beforeDestroyed() {
    document.removeEventListener("scroll", this.watchScrollTop, false);
  }
};
</script>
