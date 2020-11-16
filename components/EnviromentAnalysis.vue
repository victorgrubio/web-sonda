<template>
    <div>
        <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix p-5">
                <i class="fas fa-history"></i> <span>Historical Analysis</span>
            </div>
            <div class="text item">
                <el-row :gutter="5">
                    <el-col :span="12">
                        <el-card class="box-card green-ligth" shadow="never">
                            <div slot="header" class="clearfix p-3">
                                <i class="far fa-calendar-alt"></i> <span>Previous Program</span>
                            </div>
                            <canvas class="small-chart" id="previousProgramChart"></canvas>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card class="box-card turquoise-ligth" shadow="never">
                            <div slot="header" class="clearfix p-3">
                                <i class="far fa-calendar-alt"></i> <span>Previous Journey</span>
                            </div>
                            <canvas class="small-chart" id="previousJourneyChart"></canvas>
                        </el-card>
                    </el-col>
                </el-row>
                <el-row :gutter="5">                        
                    <el-col :span="12">
                        <el-card class="box-card purple" shadow="never">
                            <div slot="header" class="clearfix p-3">
                                <i class="far fa-calendar-alt"></i> <span>Previous Program MOS</span>
                            </div>
                            <div :class="previousProgramMosClass+' w-120 text-center mos-value my-15'"> {{previousProgramMos}} </div>
                            <div class="div-centered w-100">
                                <span class="text-left d-block">Alerts: {{previousProgramAlerts}}</span>
                                <span class="text-left d-block">Warnings: {{previousProgramWarnings}}</span>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card class="box-card turquoise-dark" shadow="never">
                            <div slot="header" class="clearfix p-3">
                                <i class="far fa-calendar-alt"></i> <span>Previous Journey MOS</span>
                            </div>
                            <div :class="previousJourneyMosClass+' w-120 text-center mos-value my-15'"> {{previousJourneyMos}} </div>
                            <div class="div-centered w-100">
                                <span class="text-left d-block">Alerts: {{previousJourneyAlerts}}</span>
                                <span class="text-left d-block">Warnings: {{previousJourneyWarnings}}</span>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </el-card>
    </div>
</template>

<script>
  import Chart from 'chart.js';
  import moment from 'moment';
  import axios from 'axios';
  import cfg from '~/static/config.js'  

  export default {
    props: ['data'],
    data() {
        return {
            apiUrl: cfg.apiUrl,
            apiMosUrl: '',
            queryData: false,
            previousProgramMos: '-',
            previousProgramAlerts: '-',
            previousProgramWarnings: '-',
            previousJourneyMos: '-',
            previousJourneyAlerts: '-',
            previousJourneyWarnings: '-',
            previousProgramMosClass: 'gray',
            previousJourneyMosClass: 'gray',            
            donutsCharts: [],
            frames: {Analized: 0, Poor: 0, Regular: 0, Good: 0, Excellent: 0},
            doughnutOptions: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                },
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    animateScale: true,
                    animateRotate: true
                },
                elements: {
                    center: {
                        text: ''
                    }
                }                
            },
            chartLabels: ['No data'],
            previousProgramChartData: {
                datasets: [{
                    data: [1],
                    backgroundColor: ['rgb(188, 188, 188)']
                }]
            },
            previousJourneyChartData: {
                datasets: [{
                    data: [1],
                    backgroundColor: ['rgb(188, 188, 188)']
                }]
            }
        }
    },
    methods: {
        createChart(chartId, chartData) {
            chartData.labels = this.chartLabels;
            chartData.datasets.backgroundColor = this.chartBackgroundColor;
            this.donutsCharts[chartId] = new Chart(document.getElementById(chartId), {
                type: 'doughnut',
                data: chartData,
                options: this.doughnutOptions
            });
        },
        updateChartData(chartId, chartData){

            if ('mos_poor' in chartData) {
                this.donutsCharts[chartId].data.datasets[0].data = [parseFloat(chartData.mos_poor).toFixed(2), parseFloat(chartData.mos_regular).toFixed(2), parseFloat(chartData.mos_good).toFixed(2), parseFloat(chartData.mos_excellent).toFixed(2)];
                this.donutsCharts[chartId].data.labels = ['Poor', 'Regular', 'Good', 'Excellent'];
                this.donutsCharts[chartId].data.datasets[0].backgroundColor = ['rgb(255, 99, 132)', 'rgb(255, 205, 86)','rgb(75, 192, 192)','rgb(54, 162, 235)'];
            } else if('no_data' in chartData) {
                this.donutsCharts[chartId].data.datasets[0].data = [1]
                this.donutsCharts[chartId].data.labels = ['No data']
                this.donutsCharts[chartId].data.datasets[0].backgroundColor = ['rgb(20, 20, 20)']
            } else {
                this.donutsCharts[chartId].data.datasets[0].data = [1]
                this.donutsCharts[chartId].data.labels = ['Void']
                this.donutsCharts[chartId].data.datasets[0].backgroundColor = ['rgb(188, 188, 188)']
            }
            this.donutsCharts[chartId].update()

        },
        async updateAlertsList(program){

            if (this.$store.state.sonda.queryData) {
                let endpoint = ''
                switch(program){
                    case 'previousProgram':
                        endpoint = 'programs/previous/alert-list'
                    break;
                    case 'previousJourney':
                        endpoint = 'journeys/previous/alert-list';
                    break;
                }

                const res = await axios.get(this.apiMosUrl+endpoint)
                if (res.status === 200) {                    
                    switch(program){
                        case 'previousProgram':
                            if (res.data.alerts.length > 0) 
                                this.$store.commit('sonda/addDashboarAlerts', {type: 'previousProgram', alerts: res.data.alerts});
                            if (res.data.warnings.length > 0) 
                                this.$store.commit('sonda/addDashboarWarnings', {type: 'previousProgram', warnings: res.data.warnings});
                        break;
                        case 'previousJourney':
                            if (res.data.alerts.length > 0) 
                                this.$store.commit('sonda/addDashboarAlerts', {type: 'previousJourney', alerts: res.data.alerts});
                            if (res.data.warnings.length > 0) 
                                this.$store.commit('sonda/addDashboarWarnings', {type: 'previousJourney', warnings: res.data.warnings});                            
                        break;
                    }
                }
            }
        },        
        async updateAlerts(which){
            
            let endpoint
            switch(which){
                case 'previousProgram':
                    endpoint = 'programs/previous/alert-number'
                break;
                case 'previousJourney':
                    endpoint = 'journeys/previous/alert-number';
                break;
            }

            const res = await axios.get(this.apiMosUrl+endpoint)
            if (res.status === 200) {
                switch(which){
                    case 'previousProgram':
                        this.previousProgramAlerts = res.data.alert_number;
                        this.previousProgramWarnings = res.data.warning_number;
                    break;
                    case 'previousJourney':
                        this.previousJourneyAlerts = res.data.alert_number;
                        this.previousJourneyWarnings = res.data.warning_number;
                    break;
                }
            }
        },        
        setMosBoxClass(mos){
            let cfg = this.$store.state.sonda.mosConfigValues;
            if (mos >= cfg.excellent) {
                return 'blue'
            } else if (mos < cfg.excellent && mos >= cfg.good) {
                return 'green'
            } else if (mos < cfg.good && mos >= cfg.regular) {
                return 'yellow'
            } else if (mos < cfg.regular) {
                return 'red'
            }
        },        
        async updateProgramMOS(which){
            let endpoint = ''
            switch(which){
                case 'previousProgram':
                    endpoint = 'programs/previous/mos'
                break;
                case 'previousJourney':
                    endpoint = 'journeys/previous/mos';
                break;
            }

            const res = await axios.get(this.apiMosUrl+endpoint)
            
            if (res.status === 200) {

                switch(which){
                    case 'previousProgram':
                        this.previousProgramMos = parseFloat(res.data.mos).toFixed(2);
                        this.previousProgramMosClass = this.setMosBoxClass(this.previousProgramMos);
                    break;
                    case 'previousJourney':
                        this.previousJourneyMos = parseFloat(res.data.mos).toFixed(2);
                        this.previousJourneyMosClass = this.setMosBoxClass(this.previousJourneyMos);
                    break;
                }

            }
        },        
        async updateDoughnutChartData(chartId){

            if (this.$store.state.sonda.queryData) {
                var vm = this
                switch(chartId){
                    case 'previousProgram':
                        axios.get(this.apiMosUrl+'programs/previous/mos-percentages')
                            .then(resp => {                            
                                if ('data' in resp && Object.keys(resp.data).length !== 0) {
                                    vm.updateChartData('previousProgramChart', resp.data)
                                    vm.updateProgramMOS('previousProgram');
                                    vm.updateAlerts('previousProgram');
                                } else {
                                    vm.updateChartData('previousProgramChart', {no_data: 0})
                                    vm.previousProgramMos = 'none';
                                    vm.previousProgramMosClass = 'dark';
                                }
                            })
                            .catch((error) => {
                                vm.updateChartData('previousProgramChart', {no_data: 0})
                                vm.previousProgramMos = 'none';
                                vm.previousProgramMosClass = 'dark';
                                if (error.response) {
                                    console.log(error.config);
                                } else if (error.request) {
                                    console.log(error.request);
                                } else {
                                    console.log('Error', error.message);
                                }
                            });
                    break;
                    case 'previousJourney':
                        axios.get(this.apiMosUrl+'journeys/previous/mos-percentages')
                            .then(resp => {                            
                                if ('data' in resp && Object.keys(resp.data).length !== 0){
                                    vm.updateChartData('previousJourneyChart', resp.data)
                                    vm.updateProgramMOS('previousJourney');
                                    vm.updateAlerts('previousJourney');
                                } else {
                                    // Empty data received
                                    vm.updateChartData('previousJourneyChart', {no_data: 0})
                                    vm.previousJourneyMos = 'none';
                                    vm.previousJourneyMosClass = 'dark';
                                }
                            })
                            .catch((error) => {
                                vm.updateChartData('previousJourneyChart', {no_data: 0})
                                vm.previousJourneyMos = 'none';
                                vm.previousJourneyMosClass = 'dark';
                                if (error.response) {
                                    console.log(error.config);
                                } else if (error.request) {
                                    console.log(error.request);
                                } else {
                                    console.log('Error', error.message);
                                }
                            });                        
                    break;
                }
                this.timers.updatePreviousInfo.time = 60000;
            }            
        },
        updatePreviousInfo(){
            this.updateDoughnutChartData('previousProgram');
            this.updateDoughnutChartData('previousJourney');
            // this.updateAlertsList('previousProgram');
            // this.updateAlertsList('previousJourney');
        }
    },
    timers: {
        updatePreviousInfo: { time: 1000, autostart: true, repeat: true, immediate: true }
    },        
    mounted() {

        this.apiMosUrl = (this.$store.state.env.APP_ENV === 'prod') ? window.location.href.split(':')[0]+'://'+window.location.href.split('://')[1].split(':')[0]+':'+this.$store.state.env.API_PORT+'/videoAnalysis/' : this.$store.state.env.API_DEV_URL;

        this.createChart('previousProgramChart', this.previousProgramChartData);
        this.createChart('previousJourneyChart', this.previousJourneyChartData);

    }
  }
</script>

<style scoped>
    .small-chart{
        max-width: 210px !important;
        max-height: 210px !important;
    }
</style>