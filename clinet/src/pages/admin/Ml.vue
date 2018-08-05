<template>
  <div class="Orders">
    <header class="clear">
  		<span>ML</span>
  	</header>
  	<!-- <Tag :tagList="tags" @indexChange="changeTag"/> -->
  	<div class="content">
  		<table class="ordersTable">
	        <thead>
	        	<tr><th>id</th><th>data</th><th>rate</th><th>iterations</th><th>periods</th><th>formula</th></tr>
	        </thead>
	        <tbody>
	            <tr v-for="(item,index) in mlList" :key="'order'+item.id">
	            	<td>{{item.id}}</td>
	            	<td style="
   max-height: 60px;overflow: hidden;display: block;
">{{item.data}}</td>
	            	<td>{{item.rate}}</td>
	            	<td>{{item.iterations}}</td>
	            	<td>{{item.periods}}</td>
	            	<td style="
    word-break: break-all;
">{{item.formula}}</td>
	                <!-- <td><button class="normal" @click="editOrder(item.id)">编辑</button><button class="delete" @click="deleteOrder(item.id)">删除</button></td> -->
	            </tr>
	        </tbody>
	    </table>
  	</div>
  </div>
</template>

<script>
import { getMlData /* deleteOrder */ } from "../../api/ml";
// import Tag from "../../components/Tag";
export default {
  name: "Ml",
  components: {
    // Tag
  },
  computed: {},
  data() {
    return {
      //   tags: ["全部", "未付款", "未发货", "已发货", "已到货"],
      mlList: []
    };
  },
  methods: {
    changeTag(index) {
      const res = getMlData();
      res
        .then(ml => {
          debugger;
          console.log(ml);
          this.mlList = ml.result;
        })
        .catch(e => {
          console.log(e);
        });
    },
    editOrder(id) {
      this.$router.push("/backstage/orders/" + id);
    },
    deleteOrder(id) {
      const res = deleteOrder(id);
      res
        .then(() => {
          console.log("删除成功");
          this.mlList.map((item, index) => {
            if (item.id === id) {
              this.mlList.splice(index, 1);
            }
          });
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.changeTag(0);
  }
};
</script>

<style scoped lang="less">
@import "../../assets/css/var.less";
.Orders {
  header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    span {
      float: left;
    }
  }
  .content {
    width: 100%;
    background-color: white;
    position: relative;
    top: -3px;
    padding: 5px;
    .ordersTable {
      width: 100%;
      th {
        text-align: center;
      }
      tbody {
        tr {
          td {
            max-width: 100px;
            min-width: 30px;
            text-align: center;
            button {
              display: block;
              overflow: hidden;
              margin-bottom: 5px;
            }
          }
        }
      }
    }
  }
}
</style>