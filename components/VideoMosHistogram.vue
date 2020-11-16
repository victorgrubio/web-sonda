<template>
    <div>
        <div v-if="isLoading" class="loader float-right mx-5"></div>
        <el-button-group class="histogram-btns mb-15" v-if="callBy == 'dashboard'">
            <el-button type="primary" :disabled="noPts" @click="refreshHistogramValues('frames')" :plain="displayHistogramBy === 'seconds'" size="mini">Frames</el-button>
            <el-button type="primary" @click="refreshHistogramValues('seconds')" :plain="displayHistogramBy === 'frames'" size="mini">Seconds</el-button>
        </el-button-group>
        <el-button-group class="histogram-btns mb-15" v-if="callBy == 'historic' || callBy == 'vod'">
            <el-button type="primary" :disabled="!chartData" @click="setDisplayBy('frames')" :plain="displayHistogramBy === 'seconds'" size="mini">Frames</el-button>
            <el-button type="primary" :disabled="!chartData" @click="setDisplayBy('seconds')" :plain="displayHistogramBy === 'frames'" size="mini">Seconds</el-button>
        </el-button-group>
        <br><br>
        <div id="chartContainer"></div>
    </div>
</template>

<script>
  import Chart from 'chart.js';
  import axios from 'axios';
  import utils from '~/libs/utils'

  export default {
    props: ['data', 'callBy', 'chartWidth'],
    data() {
        return {
            apiMosUrl: '',
            myChart: '',
            chart: '',
            index: 1,
            histogramWidth: this.chartWidth,
            displayHistogramBy: 'seconds',
            dataPoints: [],
            chartData: null,
            isLoading: false,
            noPts: false,
        }
    },
    methods: {
        refreshHistogramValues(dispBy){
            this.displayHistogramBy = dispBy;
            this.getCurrentProgramData();
        },
        async getCurrentProgramData(loading=true){
            this.isLoading = loading;  
            const res = await axios.get(this.apiMosUrl+'programs/current/data')
            if (res.status === 200) {
                if (res.data.length > 0) {
                    this.resetChartData();
                    this.chartData = res.data;
                    this.populateHistogramData(false);
                }
                this.$store.commit('sonda/setQueryCurrentProgramData', false);
            }
            this.isLoading = false;
        },
        setHistogramData(chartData){
            this.chartData = chartData;
            this.populateHistogramData();
        },
        setDisplayBy(dispBy){
            this.displayHistogramBy = dispBy;
            this.resetChartData();
            this.populateHistogramData();
        },
        resetChartData(){
            this.chart.options.data[0].dataPoints = [];
            this.chart.chartData = null;
        },
        populateHistogramData(){
            console.time('populateHistogramData');
            for (var i = 0, len = this.chartData.length; i < len; i++) {
                let val = this.chartData[i];
                let timestamp = this.getVideoTimestamp(val);
                this.addData(this.xAxisLabel(timestamp), val.pts, val.mos);
            }   
            this.chart.render();                  
            console.timeEnd('populateHistogramData');
        },
        getVideoTimestamp(dashboardData){
            let timestamp = dashboardData.timestamp;
            try { // vod videos
                if (dashboardData.videoSettings.hasOwnProperty("video_second")){
                    timestamp = dashboardData.videoSettings.video_second; 
                }
            } catch (error){
                console.log(error.message)
            } finally {
                return timestamp;
            }
        },
        xAxisLabel(timestamp){
            if (timestamp.length > 6){
                return timestamp.split(" ")[1];
            }
            else {
                return this.formatVideoSecond(timestamp);
            }
        },
        formatVideoSecond(timestamp){
            return utils.formatVideoSecond(timestamp)
        },
        addData(timestamp, pts, mosVal) {
            this.noPts = pts < 0 || false;            
            let label = (this.displayHistogramBy === 'seconds') ? timestamp: pts;
            this.chart.options.data[0].dataPoints.push({x: this.index, y: parseFloat(mosVal), label: label});
            this.index++;
        },
        getChartWidth(){
            try{
                if (this.callBy === 'dashboard' ) return window.innerWidth * 0.81;
                if (this.callBy === 'historic') return  window.innerWidth * 0.95;
                else return window.innerWidth * 0.44;
            } catch (e) {
                console.log(e.message)
            }
        }
    },
    mounted() {
        this.apiMosUrl = (this.$store.state.env.APP_ENV === 'prod') ? window.location.href.split(':')[0]+'://'+window.location.href.split('://')[1].split(':')[0]+':'+this.$store.state.env.API_PORT+'/videoAnalysis/' : this.$store.state.env.API_DEV_URL;
        let chartWidth = this.getChartWidth();        
        const vm = this;
        this.chart = new CanvasJS.Chart("chartContainer", {
            theme: "light2",
            animationEnabled: true,
            zoomEnabled: true,
            width: chartWidth,
            height: 260,
			axisX: {
                labelFontSize: 10,
				labelAngle: -45
            }, 
            axisY: {
                minimum: 1,
                maximum: 5
            },      
            data: [{
                type: "area",
                color: '#e54a4a',
                lineThickness: 2,
                mouseover: function(e){ 
                    vm.$store.commit('sonda/setVodProgramMos', e.dataPoint.y);
                },
                dataPoints: []
            }]
        });
        this.chart.render();
    }
  }
</script>

<style scoped>
    canvas .canvasjs-chart-canvas{
        height:150px !important;
        min-width: 300px !important;
    }
    #chartContainer{
        height: 280px;
    }
</style>