<template>
  <div class="ecoForm_container">
    <div class="container_left">
      <div class="box">
        <div>
          <header>
            GDP增速
            <span class="stateTipHeaderBar"></span>
          </header>
          <ecoecharts id="gdpzs" :option="gdpzsOption"></ecoecharts>
        </div>
        <div>
          <header>
            三次产业增速
            <span class="stateTipHeaderBar"></span>
          </header>
          <ecoecharts id="sccy" :option="sccyOption"></ecoecharts>
        </div>
      </div>
      <div class="box">
        <div>
          <header>
            规上工业增速
            <span class="stateTipHeaderBar"></span>
          </header>
          <ecoecharts id="gsgy" :option="gsgyOption"></ecoecharts>
        </div>
        <div>
          <header style="font-size: 16px;">
            限上消费品零售额增速
            <span class="stateTipHeaderBar" style="width: 70px;"></span>
          </header>
          <ecoecharts id="xsxfp" :option="xsxfpOption"></ecoecharts>
        </div>
      </div>
      <div class="box">
        <div>
          <header>
            规上营利性服务业增速
            <span class="stateTipHeaderBar" style="width: 70px;"></span>
          </header>
          <ecoecharts id="gsylfwy" :option="gsylfwyOption"></ecoecharts>
        </div>
        <div>
          <header style="font-size: 15px;">
            财政总收入、一般公共预算增速
            <span class="stateTipHeaderBar" style="width: 30px;"></span>
          </header>
          <ecoecharts id="czzsr" :option="czzsrOption"></ecoecharts>
        </div>
      </div>
    </div>
    <div class="container_middle">
      <div class="map1">
        <div style="width: 100%; height: 93%;">
          <div class="map_outer">
            <div class="middle_chart" id="ecoEchart"></div>
          </div>
          <div class="street_list">
            <table>
              <thead>
                <tr>
                  <th>街道</th>
                  <th v-if="zetitle">总额</th>
                  <th v-if="zstitle">增速</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in filterData" :key="index">
                  <td>{{ item.name }}</td>
                  <td>{{ item.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="indexs">
          <ul>
            <li
              v-for="(item, index) in lists"
              :key="index"
              :class="`${listActiveIndex == index ? 'ecoFormActive':''} ${fromCanvass ? `smartFont`:``}`"
              @click="selectI(index)"
            >{{ item }}</li>
          </ul>
        </div>
      </div>
      <div class="chats">
        <div>
          <header>
            人均GDP(元)
            <span class="stateTipHeaderBar"></span>
          </header>
          <ecoecharts id="rjgdp" :option="rjgdpOption"></ecoecharts>
        </div>
        <div>
          <header style="font-size: 15px;">
            全员劳动生产率(万元/人)
            <span class="stateTipHeaderBar" style="width: 50px;"></span>
          </header>
          <ecoecharts id="qyld" :option="qyldOption"></ecoecharts>
        </div>
        <div>
          <header>
            税收收入占比
            <span class="stateTipHeaderBar"></span>
          </header>
          <ecoecharts id="sssr" :option="sssrOption"></ecoecharts>
        </div>
      </div>
    </div>
    <div class="container_right">
      <div class="box">
        <div>
          <header style="font-size: 16px;">
            人民币存款、贷款余额增速
            <span class="stateTipHeaderBar" style="width: 50px;"></span>
          </header>
          <ecoecharts id="ckdk" :option="ckdkOption"></ecoecharts>
        </div>
        <div>
          <header>
            工业用电量增速
            <span class="stateTipHeaderBar"></span>
          </header>
          <ecoecharts id="gyydl" :option="gyydlOption"></ecoecharts>
        </div>
      </div>
      <div class="box">
        <div>
          <header>
            商品房销售面积增速
            <span class="stateTipHeaderBar" style="width: 70px;"></span>
          </header>
          <ecoecharts id="spfmj" :option="spfmjOption"></ecoecharts>
        </div>
        <div>
          <header>
            出口总额(亿元)
            <span class="stateTipHeaderBar"></span>
          </header>
          <ecoecharts id="ckze" :option="ckzeOption"></ecoecharts>
        </div>
      </div>
      <div class="box">
        <div>
          <header>
            城乡居民收入增速
            <span class="stateTipHeaderBar" style="width: 70px;"></span>
          </header>
          <ecoecharts id="cxjmsr" :option="cxjmsrOption"></ecoecharts>
        </div>
        <div>
          <header>
            4+2投资结构增速
            <span class="stateTipHeaderBar" style="width: 70px;"></span>
          </header>
          <ecoecharts id="tzjg" :option="tzjgOption"></ecoecharts>
        </div>
      </div>
    </div>
    <!-- Modal frame -->
    <ecoFormModal :class="`animated ${shallEcoModal?`bounceIn`:`no_show`}`" />
  </div>
</template>

<script>
import {
  gdpzsOption,
  sccyOption,
  gsgyOption,
  sssrOption,
  czzsrOption,
  ckdkOption,
  qyldOption,
  cxjmsrOption,
  spfmjOption,
  rjgdpOption,
  ckzeOption,
  xsxfpOption,
  tzjgOption,
  gsylfwyOption,
  gyydlOption
} from "./ecoFormData";
import ecoFormModal from "./ecoFormModal";
import ecoecharts from "@/components/common/echarts";
import echarts from "echarts";
import geoJson from "@/components/common/lcEcharts/lcData";
import iSeries from "@/components/common/lcEcharts/lcEcharts.js";
import jjzbApi from "@/api/beans/u_jjzb";

import streetecoApi from "@/api/beans/u_streeteco";
const { indexSeries, landSeries, geoMap } = iSeries;
export default {
  name: "ecofrom",
  data() {
    return {
      gdpzsOption,
      sccyOption,
      gsgyOption,
      sssrOption,
      czzsrOption,
      ckdkOption,
      qyldOption,
      cxjmsrOption,
      spfmjOption,
      rjgdpOption,
      ckzeOption,
      xsxfpOption,
      tzjgOption,
      gsylfwyOption,
      gyydlOption,
      geoJson,
      indexSeries,
      chart: null,
      shallEcoModal: false,
      lists: [
        "规上工业增加值增速",
        "限上批零住餐销售(营业)总额",
        "限上消费品零售总额"
      ],
      listActiveIndex: 0,
      geoMap: geoMap,
      streetData: {},
      streetecoData: [{}, {}, {}],
      filterData: null,
      zstitle: true,
      zetitle: false,
      tzXAxis: null
    };
  },
  components: {
    ecoFormModal,
    ecoecharts
  },
  props: {
    // 嵌入canvass模块左侧栏置顶,在这个页面用于调整字体大小
    fromCanvass: Boolean
  },
  created() {
    this.getJJZB();
    this.getStreeteco();
  },
  mounted() {
    this.initChart();
    this.initInterval();
  },
  computed: {},
  watch: {
    listActiveIndex(newVal, val) {
      const that = this;

      const list = Object.entries(that.streetData).map(item => {
        return { name: item[0], value: item[1] };
      });

      that.filterData = list
        .map(item => {
          if (item.value == null) {
            item.value = -Infinity;
          }
          return item;
        })
        .sort((a, b) => {
          return b.value - a.value;
        })
        .map(item => {
          if (item.value == -Infinity) {
            item.value = "-";
          }
          return item;
        });
    }
  },
  methods: {
    initInterval() {
      setInterval(() => {
        const index = (this.listActiveIndex + 1) % 3;
        this.listActiveIndex = index;
        this.selectI(index);
      }, 8000);
    },
    getStreeteco() {
      const that = this;
      streetecoApi.ds().then(({ data }) => {
        const month = data[0].month;
        data
          .filter(item => item.month == month)
          .map(item => {
            that.streetecoData[0][item.name.replace("街道", "")] =
              item.gsgy == "" ? null : Number(item.gsgy);
            that.streetecoData[1][item.name.replace("街道", "")] =
              item.xsplzc == "" ? null : Number(item.xsplzc);
            that.streetecoData[2][item.name.replace("街道", "")] =
              item.xsxfp == "" ? null : Number(item.xsxfp);
          });

        let minValue = Object.entries(that.streetecoData[0])
          .filter(item => item[1] != null)
          .reduce((a, b) => (b[1] > a[1] ? b : a))[1];

        let maxValue = Object.entries(that.streetecoData[0])
          .filter(item => item[1] != null)
          .reduce((a, b) => (b[1] > a[1] ? a : b))[1];

        that.chart.setOption({
          visualMap: {
            min: minValue,
            max: maxValue
          },
          series: [
            {
              data: that.geoMap.map(item => {
                const name = item.name.replace("街道", "");
                const indexValue =
                  name != undefined ? that.streetecoData[0][name] : null;

                return {
                  name,
                  value: [...item.value, indexValue]
                };
              })
            }
          ]
        });

        let list = Object.entries(that.streetecoData[0]).map(item => {
          return { name: item[0], value: item[1] };
        });

        that.filterData = list
          .map(item => {
            if (item.value == null) {
              item.value = -Infinity;
            }
            return item;
          })
          .sort((a, b) => {
            return b.value - a.value;
          })
          .map(item => {
            if (item.value == -Infinity) {
              item.value = "-";
            }
            return item;
          });
      });
    },
    getJJZB() {
      const that = this;
      jjzbApi.ds().then(({ data }) => {
        const rjgdpApi = data.filter(item => {
          return item.zblb == "人均GDP（元）";
        });

        that.rjgdpOption.xAxis.data = that.convertData(rjgdpApi)[0];
        that.rjgdpOption.series[0].data = that.convertData(rjgdpApi)[1];

        const qyldApi = data.filter(item => {
          return item.zblb == "全员劳动生产率（万元）";
        });

        that.qyldOption.xAxis.data = that.convertData(qyldApi)[0];
        that.qyldOption.series[0].data = that.convertData(qyldApi)[1];

        const sssrApi = data.filter(item => {
          return item.zblb == "税收收入占一般公共预算收入比重（%）";
        });

        that.sssrOption.xAxis.data = that.convertData(sssrApi)[0];
        that.sssrOption.series[0].data = that.convertData(sssrApi)[1];

        const ckyeApi = data.filter(item => {
          return item.zblb == "金融机构人民币存款余额增速";
        });

        const dkyeApi = data.filter(item => {
          return item.zblb == "金融机构人民币贷款余额增速";
        });

        that.ckdkOption.xAxis.data = that.convertData(ckyeApi)[0];
        that.ckdkOption.series[0].data = that.convertData(ckyeApi)[1];
        that.ckdkOption.series[1].data = that.convertData(dkyeApi)[1];

        const czzsrApi = data.filter(item => {
          return item.zblb == "财政总收入增速";
        });

        const yssrApi = data.filter(item => {
          return item.zblb == "一般公共预算收入增速";
        });

        const yszcApi = data.filter(item => {
          return item.zblb == "一般公共预算支出增速";
        });

        that.czzsrOption.xAxis.data = that.convertData(czzsrApi)[0];
        that.czzsrOption.series[0].data = that.convertData(czzsrApi)[1];
        that.czzsrOption.series[1].data = that.convertData(yssrApi)[1];
        that.czzsrOption.series[2].data = that.convertData(yszcApi)[1];

        const gsgyApi = data.filter(item => {
          return item.zblb == "规上工业增速";
        });

        that.gsgyOption.xAxis.data = that.convertData(gsgyApi)[0];
        that.gsgyOption.series[0].data = that.convertData(gsgyApi)[1];

        const cy1Api = data.filter(item => {
          return item.zblb == "第一产业增速";
        });

        const cy2Api = data.filter(item => {
          return item.zblb == "第二产业增速";
        });

        const cy3Api = data.filter(item => {
          return item.zblb == "第三产业增速";
        });

        that.sccyOption.xAxis.data = that.convertData(cy1Api)[0];
        that.sccyOption.series[0].data = that.convertData(cy1Api)[1];
        that.sccyOption.series[1].data = that.convertData(cy2Api)[1];
        that.sccyOption.series[2].data = that.convertData(cy3Api)[1];

        const czjmApi = data.filter(item => {
          return item.zblb == "城镇常住居民人均可支配收入增速";
        });

        const ncjmApi = data.filter(item => {
          return item.zblb == "农村常住居民人均可支配收入增速";
        });

        that.cxjmsrOption.xAxis.data = that.convertData(czjmApi)[0];
        that.cxjmsrOption.series[0].data = that.convertData(czjmApi)[1];
        that.cxjmsrOption.series[1].data = that.convertData(ncjmApi)[1];

        const ylfwyApi = data.filter(item => {
          return item.zblb == "营利性服务业增速";
        });

        that.gsylfwyOption.xAxis.data = that.convertData(ylfwyApi)[0];
        that.gsylfwyOption.series[0].data = that.convertData(ylfwyApi)[1];

        const gdpzsApi = data.filter(item => {
          return item.zblb == "GDP增速";
        });

        that.gdpzsOption.xAxis.data = that.convertData(gdpzsApi)[0];
        that.gdpzsOption.series[0].data = that.convertData(gdpzsApi)[1];

        const ckzeApi = data.filter(item => {
          return item.zblb == "出口总额（亿元）";
        });

        const ckzsApi = data.filter(item => {
          return item.zblb == "出口总额增速";
        });

        that.ckzeOption.xAxis.data = that.convertData(ckzeApi)[0];
        that.ckzeOption.series[0].data = that.convertData(ckzeApi)[1];
        that.ckzeOption.series[1].data = that.convertData(ckzsApi)[1];

        const gyydlApi = data.filter(item => {
          return item.zblb == "工业用电量增速";
        });

        that.gyydlOption.xAxis.data = that.convertData(gyydlApi)[0];
        that.gyydlOption.series[0].data = that.convertData(gyydlApi)[1];

        const spfmjApi = data.filter(item => {
          return item.zblb == "商品房销售面积增速";
        });

        that.spfmjOption.xAxis.data = that.convertData(spfmjApi)[0].slice(3, 6);
        that.spfmjOption.series[0].data = that
          .convertData(spfmjApi)[1]
          .slice(3, 6);

        const xsxfpApi = data.filter(item => {
          return item.zblb == "限上消费品零售额增速";
        });

        that.xsxfpOption.xAxis.data = that.convertData(xsxfpApi)[0];
        that.xsxfpOption.series[0].data = that.convertData(xsxfpApi)[1];

        const mjxmApi = data.filter(item => {
          return item.zblb == "民间项目投资增速";
        });
        const gxjsApi = data.filter(item => {
          return item.zblb == "高新技术产业投资增速";
        });
        const gyApi = data.filter(item => {
          return item.zblb == "工业投资增速";
        });
        const fwyApi = data.filter(item => {
          return item.zblb == "服务业投资增速";
        });
        const sthjApi = data.filter(item => {
          return item.zblb == "生态环境和公共设施投资增速";
        });
        const jtApi = data.filter(item => {
          return item.zblb == "交通投资增速";
        });

        that.tzXAxis = [
          [...mjxmApi],
          [...gxjsApi],
          [...gyApi],
          [...fwyApi],
          [...sthjApi],
          [...jtApi]
        ].reduce((a, b) => {
          if (a.length && b.length) {
            return b.length > a.length ? b : a;
          }
        });

        that.tzjgOption.xAxis.data = that.convertData(that.tzXAxis)[0];
        that.tzjgOption.series[0].data = that.getTZJG(mjxmApi);
        that.tzjgOption.series[1].data = that.getTZJG(gxjsApi);
        that.tzjgOption.series[2].data = that.getTZJG(gyApi);
        that.tzjgOption.series[3].data = that.getTZJG(fwyApi);
        that.tzjgOption.series[4].data = that.getTZJG(sthjApi);
        that.tzjgOption.series[5].data = that.getTZJG(jtApi);
      });
    },
    convertData(api) {
      const data = api.length > 6 ? api.slice(api.length - 6, api.length) : api;
      const seasonMap = {
        1: "\n一季度",
        2: "\n上半年",
        3: "\n前三季度",
        4: "\n全年"
      };

      let res = [[], []];
      data.map(item => {
        res[0].push(item.year + seasonMap[item.season]);
        res[1].push(Number(item.zbz).toFixed(1));
      });

      return res;
    },
    // 投资结构
    getTZJG(data) {
      let copy = [];

      this.tzXAxis.map((item, index) => {
        data.map(_item => {
          if (item.year == _item.year && item.season == _item.season) {
            copy.push(_item.zbz);
          }
        });
        if (index + 1 != copy.length) {
          copy.push(null);
        }
      });
      return copy.length > 6 ? copy.slice(copy.length - 6, copy.length) : copy;
    },
    initChart() {
      let that = this;
      that.chart = echarts.init(document.getElementById("ecoEchart"));
      // 把配置和数据放这里
      that.chart.hideLoading();
      // 注册地图
      echarts.registerMap("LC", that.geoJson);
      that.chart.setOption({
        // 悬停
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            return params.name;
          }
        },
        visualMap: {
          type: "continuous",
          orient: "horizontal",
          bottom: 30,
          left: 10,
          min: -10,
          max: 20,
          text: ["高", "低"],
          itemHeight: 150,
          inRange: {
            color: ["#6FCF6A", "#f3a444", "#892a2f"]
          },
          seriesIndex: 0,
          textStyle: {
            color: "#FFF"
          }
        },
        geo: [
          {
            map: "LC",
            roam: false,
            zoom: 1.2,
            zlevel: 2,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              // 普通样式
              normal: {
                areaColor: "#DCDCDC",
                borderColor: "#71b2d4",
                borderWidth: 5
              }
            },
            silent: true
          },
          {
            map: "LC",
            roam: false,
            zoom: 1.2,
            center: [120.593, 28.071],
            zlevel: 1,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              // 普通样式
              normal: {
                areaColor: "#327bbf",
                borderWidth: 0
              }
            },
            silent: true
          }
        ],
        series: indexSeries
      });

      that.chart.on("click", function(e) {
        //that.shallEcoModal = true;
        that.$parent.FormJump();
        //console.log(e.componentSubType); //此处写点击事件内容
      });
      //根据窗口的大小变动图表
      window.onresize = function() {
        that.chart.resize();
      };
    },
    selectI(i) {
      let that = this;
      let exp;
      this.listActiveIndex = i;

      exp = that.streetecoData[i];

      let minValue = Object.entries(exp)
        .filter(item => item[1] != null)
        .reduce((a, b) => (b[1] > a[1] ? b : a))[1];

      let maxValue = Object.entries(exp)
        .filter(item => item[1] != null)
        .reduce((a, b) => (b[1] > a[1] ? a : b))[1];

      if (i == 0) {
        that.zetitle = false;
        that.zstitle = true;
      } else {
        that.zetitle = true;
        that.zstitle = false;
      }

      this.streetData = exp;

      that.chart.setOption({
        visualMap: {
          min: minValue,
          max: maxValue
        },
        series: [
          {
            data: that.geoMap.map(item => {
              const name = item.name.replace("街道", "");
              const indexValue = name != undefined ? exp[name] : null;

              return {
                name,
                value: [...item.value, indexValue]
              };
            })
          }
        ]
      });
    }
  }
};
</script>
 <style scoped lang="less">
@import url("./ecoForm.less");
</style>