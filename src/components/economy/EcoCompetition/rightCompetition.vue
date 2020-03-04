<template>
  <div class="rightCompetition">
        <div class="rightfirst">
            <div>
                <span>影像图</span>
            </div>
        </div>
    <div class="rightsecond">
        <header>税收比拼</header>
        <div>
            <ecoecharts id="rightchart1" :option="rightOption1"></ecoecharts>
        </div>
    </div>
    <div class="rightthird">
        <header>第三产品增加值比拼</header>
        <div>
            <ecoecharts id="rightchart2" :option="rightOption2"></ecoecharts>
        </div>
    </div>
    <div class="rightfouth">
        <header>进出口总额比拼</header>
        <div class="fouth_top">
            <ul>
                <li><span>进出口总额</span>&nbsp;1000亿</li>
                <li><span>出口总额:</span>&nbsp;300亿</li>
                <li><span>进口总额:</span>&nbsp;660亿</li>
            </ul>
            <ecoecharts id="rightchart3" :option="rightOption3"></ecoecharts>
        </div>
        <div class="fouth_down">
            <ul>
                <li v-for="(item,key) in formdata" :key="key" :class="`${key ==index?`right_active`:``}`">
                    <span @click.prevent="Toggle(key)">{{item}}</span>
                </li>
            </ul>
        </div>
    </div>
  </div>
</template>

<script>
import ecoecharts from "@/components/common/echarts";
import { rightOption1, rightOption2, rightOption3 } from "./ecoCompetitioncharts";
export default {
    name: "rightCompetition",
    data() {
        return {
            rightOption1:rightOption1,
            rightOption2:rightOption2,
            rightOption3:rightOption3,
            formdata:[],
            index:3
        };
    },
    components: {
        ecoecharts
    },
    props: {
        rightformdata: Array
    },
    created() {},
    mounted() {
        this.formdata=this.rightformdata
    },
    computed: {},
    methods: {
        /**
         * 切换标签
         */
        Toggle(key){
            this.index=key
        }
    }
};
</script>
 <style lang="less">
.rightCompetition {
    height: 100%;
    width: 100%;
    >div{
        width: 100%;
        height: 25%;
        header{
            text-align: left;
            color: rgba(85, 167, 232, 1);
            padding: 0px 0px 0px 30px;
            font-size: 25px;
        }
    }
    .rightfirst{
        padding: 10px 0 10px 0;
        div{
            width: 100%;
            height: 100%;
            background-color: #fff;
            span{
                color: #000;
                font-size: 25px
            }
        }
    }
    .rightsecond{
        // padding: 10px 0 10px 0;
        div{
            width: 100%;
            height: 100%;
        }
    }
    .rightthird{
        // padding: 10px 0 10px 0;
        div{
            width: 100%;
            height: 90%;
        }
    }
    .rightfouth{
        .fouth_top{
            width: 100%;
            height: 60%;
            display: flex;
            ul{
                width: 60%;
                height: 100%;
                padding: 10px 0 0 0;
                li{
                    padding: 10px 0;
                }
            }
            #rightchart3{
                width: 40%;
                height: 100%;
            }
        }
        .fouth_down{
            width: 100%;
            height: 20%;
            ul{
                padding-left: 12%;
                li{
                    float: left;
                    padding: 0px 20px;
                    font-size: 20px;
                    color: rgba(85, 167, 232, 1);
                }
            }
            .right_active{
                color: #fff;
                font-size: 23px;
                border-bottom: 1px solid #fff;
                padding: 0px 9px 5px 9px;
            }
        }
    }
}
</style>



