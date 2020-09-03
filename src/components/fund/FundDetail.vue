<template>
  <div class="container">
    <div class="fund-search">
      <input type="text" v-model="fundId" />
    </div>
    <div class="fund-info">
      <div class="fund-name">{{fundName}}</div>
      <div class="fund-code">{{fundId}}</div>
      <div class="fund-chart">
        <img :src="`${fundEstimatedValueChart}`" />
      </div>
    </div>
    <div class="fund-detail">
      <div class="holding-stock">
        <div class="holding-stock-title">股票名称</div>
        <div class="holding-stock-title">股票代码</div>
        <div class="holding-stock-title">净值比例</div>
        <div class="holding-stock-title">K</div>
      </div>
      <div class="holding-stock" v-for="holdingStock in holdingStocks" :key="holdingStock.code">
        <div class="holding-stock-item">🦊{{holdingStock.name}}</div>
        <div class="holding-stock-item">
          <a :href="`${getStockURL(holdingStock.code)}`" target="_blank">👉</a>
          {{holdingStock.code}}
        </div>
        <div class="holding-stock-item">{{holdingStock.ratio}} %🧲</div>
        <div class="holding-stock-item">
          <div class="k-charts">
            <div class="kdj-chart">
              <img
                :src="`http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid=${holdingStock.code.length == 6 ? (holdingStock.code[0]=='6' ? 1 : 0) : 116}.${holdingStock.code}&UnitWidth=-6&imageType=KXL&EF=EXTENDED_BOLL&Formula=KDJ&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&_=${Math.random()}`"
              />
            </div>
            <div class="cci-chart">
              <img
                :src="`http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid=${holdingStock.code.length == 6 ? (holdingStock.code[0]=='6' ? 1 : 0) : 116}.${holdingStock.code}&UnitWidth=-6&imageType=KXL&EF=EXTENDED_BOLL&Formula=CCI&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&_=${Math.random()}`"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FundDetail",
  data() {
    return {
      fundId: this.$route.params.fundId,
      fundName: "基金名称",
      fundEstimatedValueChart: "",
      holdingStocks: [],
    };
  },
  methods: {
    getFundNameByFundId(fundId) {
      this.$axios({
        method: "get",
        url: "http://qt.gtimg.cn/q=jj" + fundId + "&" + new Date().getTime(),
      })
        .then((response) => {
          this.fundName = response.data.split("~")[1];
        })
        .catch((error) => {
          console.log(error);
          this.fundName = "";
        });
    },

    getHoldingStocks(fundId) {
      this.$axios({
        method: "get",
        url:
          "http://web.ifzq.gtimg.cn/fund/newfund/fundInvesting/getInvesting?app=web&symbol=jj" +
          fundId +
          "&_callback=&_=" +
          new Date().getTime(),
      })
        .then((response) => {
          this.holdingStocks = response.data.data.data.zhongcang;
        })
        .catch((error) => {
          console.log(error);
          this.holdingStocks = [];
        });
    },

    queryByFundId() {
      this.$router.push({
        name: "FundDetail",
        params: {
          fundId: this.fundId,
        },
      });
    },

    getStockURL(stockCode) {
      if (stockCode.length == 5) {
        return "http://quote.eastmoney.com/hk/" + stockCode + ".html";
      } else if (stockCode.length == 6) {
        if (stockCode[0] == "0" || stockCode[0] == "3") {
          return "http://quote.eastmoney.com/sz" + stockCode + ".html";
        } else {
          return "http://quote.eastmoney.com/sh" + stockCode + ".html";
        }
      }
    },

    init() {
      this.fundId = this.$route.params.fundId;
      this.getFundNameByFundId(this.fundId);
      this.getHoldingStocks(this.fundId);
      this.fundEstimatedValueChart = `http://j4.dfcfw.com/charts/pic6/${
        this.fundId
      }.png?v=${Math.random()}`;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
  watch: {
    $route() {
      this.init();
    },
    fundId(val) {
      if (val.length == 6) {
        this.queryByFundId();
      }
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}

input {
  outline-style: none;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 14px 14px;
  text-align: center;
}

.fund-info {
  margin: auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.fund-name {
  font-size: 2em;
  margin: 0.5em;
}
.fund-code {
  font-size: 1.5em;
  margin: 0.5em;
}

.fund-detail {
  display: table;
  margin: auto;
}
.holding-stock {
  display: table-row;
  text-align: center;
}
.holding-stock-title {
  display: table-cell;
  min-width: 5em;
  text-align: center;
  font-weight: bold;
  font-size: larger;
  border: 1px solid #f4f4f4;
}
.holding-stock-item {
  display: table-cell;
  min-width: 5em;
  border: 1px solid #f4f4f4;
  text-align: center;
  vertical-align: middle;
}
.kdj-chart {
  display: block;
}
.cci-chart {
  display: block;
  position: relative;
  top: -285px;
  z-index: -1;
  height: 85px;
}
</style>
