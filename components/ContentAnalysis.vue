<template>
    <div>
        <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix p-5">
                <i class="fas fa-film"></i> <span> Content Analysis</span>
            </div>
            <el-row :gutter="15">
                <el-col :lg="7" :md="7" :sm="10" :xs="24">
                    <el-row>
                       <el-col>
                            <img class="signal" alt="Current Frame Image" :src="frameImageSrc">
                        </el-col> 
                    </el-row>
                    <el-row>
                       <el-col>
                            <div :class="currentMosClass+' w-100 text-center mos-value mt-10'"> {{currentProgramMos}} </div>
                            <div class="div-centered w-100">
                                <span class="text-left d-block">Alerts: {{currentProgramAlerts}}</span>
                                <span class="text-left d-block">Warnings: {{currentProgramWarnings}}</span>
                            </div>
                        </el-col> 
                    </el-row>                            
                </el-col>
                <el-col :lg="7" :md="7" :sm="12" :xs="24" :offset="1">
                    <span class="text-center d-block">Current Program</span>
                    <canvas class="small-chart" id="currentProgramChart"></canvas>
                </el-col>
                <el-col :lg="4" :md="4" :sm="12" :xs="24" :offset="1">
                    <el-row>
                       <el-col>
                            <span class="text-center d-block">Journey</span>                    
                            <canvas class="small-chart" id="journeyChart"></canvas>
                        </el-col> 
                    </el-row>
                    <el-row>
                       <el-col>                    
                            <span class="text-center d-block">Journey MOS</span>
                            <div :class="journeyMosClass+' w-100 text-center mos-value mt-10'"> {{journeyMos}} </div>
                            <div class="div-centered w-100">
                                <span class="text-left d-block">Alerts: {{(typeof this.$store.state.sonda.journeyNotif.alerts !== null) ? this.$store.state.sonda.journeyNotif.alerts : '-'}} </span>
                                <span class="text-left d-block">Warnings: {{(typeof this.$store.state.sonda.journeyNotif.warnings !== null) ? this.$store.state.sonda.journeyNotif.warnings : '-'}} </span>
                            </div>                    
                        </el-col> 
                    </el-row>                            
                </el-col>
            </el-row>
            <el-row class="p-10" :gutter="20">
                <el-col :span="5">
                    <span class="leyend red px-10 mr-5"></span> Poor
                </el-col>
                <el-col :span="5">
                    <span class="leyend yellow px-10 mr-5"></span> Regular
                </el-col>
                <el-col  :span="5">
                    <span class="leyend green px-10 mr-5"></span> Good
                </el-col>
                <el-col :span="5">
                    <span class="leyend blue px-10 mr-5"></span> Excellent
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>

  import Chart from 'chart.js';
  import moment from 'moment';
  import axios from 'axios';

  export default {
    data() {
        return {
            apiMosUrl: '',
            currentMosClass: 'gray',            
            journeyMosClass: 'gray',            
            serviceName: '',
            serviceProvider: '',
            donutsCharts: [],
            currentProgramChart: '',
            frameImageSrc: '/images/signal.png',
            currentProgramMos: '-',
            journeyMos: '-',
            currentProgramAlerts: '-',
            currentProgramWarnings: '-',
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
            currentProgramChartData: {
                datasets: [{
                    data: [1],
                    backgroundColor: ['rgb(188, 188, 188)']
                }]
            },
            journeyChartData: {
                datasets: [{
                    data: [1],
                    backgroundColor: ['rgb(188, 188, 188)']
                }]
            },
        }
    },
    methods: {
        createChart(chartId, chartData, chartTitle) {

            var canvas = document.getElementById(chartId);
            var context = canvas.getContext('2d');

            this.doughnutOptions.title.text = chartTitle;
            chartData.labels = this.chartLabels;
            chartData.datasets.backgroundColor = this.chartBackgroundColor;
            this.donutsCharts[chartId] = new Chart(context, {
                type: 'doughnut',
                data: chartData,
                options: this.doughnutOptions
            });
        },
        frameImage(){
            if (this.$store.state.sonda.queryData) {
                let domain = (this.$store.state.env.APP_ENV === 'prod') ? '' : 'http://c21support.cires21.com:3000';
                this.frameImageSrc = domain + '/image/frame/cframe1.jpg?'+ new Date().getTime();
            }
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
        async updateAlerts(program){

            let endpoint = ''
            switch(program){
                case 'current':
                    endpoint = 'programs/current/alert-number'
                break;
                case 'journey':
                    endpoint = 'journeys/current/alert-number';
                break;
            }

            const res = await axios.get(this.apiMosUrl+endpoint)
            if (res.status === 200) {
                switch(program){
                    case 'current':
                        this.currentProgramAlerts = res.data.alert_number;
                        this.currentProgramWarnings = res.data.warning_number;
                    break;
                    case 'journey':
                        this.$store.commit('sonda/setJourneyNotif', res.data);                    
                    break;
                }
            }
        },
        async updateAlertsList(program){

            if (this.$store.state.sonda.queryData) {
                let endpoint = ''
                switch(program){
                    case 'current':
                        endpoint = 'programs/current/alert-list'
                    break;
                    case 'journey':
                        endpoint = 'journeys/current/alert-list';
                    break;
                }

                const res = await axios.get(this.apiMosUrl+endpoint)
                if (res.status === 200) {
                    switch(program){
                        case 'current':
                            if (res.data.alerts.length > 0)
                                this.$store.commit('sonda/addDashboarAlerts', {type:'currentProgram', alerts: res.data.alerts});
                            if (res.data.warnings.length > 0)
                                this.$store.commit('sonda/addDashboarWarnings', {type: 'currentProgram', warnings: res.data.warnings});
                        break;
                        case 'journey':
                            if (res.data.alerts.length > 0)
                                this.$store.commit('sonda/addDashboarAlerts', {type: 'currentJourney', alerts: res.data.alerts});
                            if (res.data.warnings.length > 0)
                                this.$store.commit('sonda/addDashboarWarnings', {type: 'currentJourney', warnings: res.data.warnings});                            
                        break;
                    }                    
                }
            }
        },
        async updateProgramMOS(program){

            let endpoint = ''
            switch(program){
                case 'current':
                    endpoint = 'programs/current/mos'
                break;
                case 'journey':
                    endpoint = 'journeys/current/mos';
                break;
            }
            
            const res = await axios.get(this.apiMosUrl+endpoint)
            if (res.status === 200) {
                if (program == 'current') {
                    this.currentProgramMos = parseFloat(res.data.mos).toFixed(2);
                    this.currentMosClass = this.setMosBoxClass(this.currentProgramMos);
                    this.$store.commit('sonda/setCurrentProgramMos', {value: this.currentProgramMos, class: this.currentMosClass});
                } else if (program == 'journey') {
                    this.journeyMos = parseFloat(res.data.mos).toFixed(2);
                    this.journeyMosClass = this.setMosBoxClass(this.journeyMos);
                }
            }
        },
        async updateCurrentProgramChartData(){

            if (this.$store.state.sonda.queryData) {
                var vm = this
                axios.get(this.apiMosUrl+'programs/current/mos-percentages')
                        .then(resp => {                            
                            if ('data' in resp) {
                                vm.updateChartData('currentProgramChart', resp.data)
                                vm.updateProgramMOS('current');
                                vm.updateAlerts('current');                                
                            }
                        })
                        .catch((error) => {
                            vm.updateChartData('currentProgramChart', {no_data: 0})
                            vm.currentProgramMos = 'none';
                            vm.currentMosClass = 'dark';
                            if (error.response) {
                                console.log(error.config);
                            } else if (error.request) {
                                console.log(error.request);
                            } else {
                                console.log('Error', error.message);
                            }
                        });
            }
        },
        async updateDoughnutChartData(chartId){

            if (this.$store.state.sonda.queryData) {
                var vm = this
                axios.get(this.apiMosUrl+'journeys/current/mos-percentages')
                    .then(resp => {
                        if ('data' in resp){
                            vm.updateChartData('journeyChart', resp.data)
                            vm.updateProgramMOS('journey');
                            vm.updateAlerts('journey');                            
                        }
                    })
                    .catch(function (error) {
                            vm.updateChartData(chartId, {no_data: 0})
                            vm.journeyMos = 'none';
                            vm.journeyMosClass = 'dark';
                            if (error.response) {
                                console.log(error.config);
                            } else if (error.request) {
                                console.log(error.request);
                            } else {
                                console.log('Error', error.message);
                            }
                        });
                this.timers.updateJourneyInfo.time = 10000;
            }
        },
        updateJourneyInfo(){
            this.updateDoughnutChartData('journeyChart');
            this.updateAlertsList('current');
            // this.updateAlertsList('journey');
        }
    },
    timers: {
        updateCurrentProgramChartData: { time: 1000, autostart: true, repeat: true, immediate: true },
        frameImage: { time: 1000, autostart: true, repeat: true, immediate: true },
        updateJourneyInfo: { time: 1000, autostart: true, repeat: true, immediate: true }
    },    
    mounted() {

        this.apiMosUrl = (this.$store.state.env.APP_ENV === 'prod') ? window.location.href.split(':')[0]+'://'+window.location.href.split('://')[1].split(':')[0]+':'+this.$store.state.env.API_PORT+'/videoAnalysis/' : this.$store.state.env.API_DEV_URL;

        this.createChart('currentProgramChart', this.currentProgramChartData, 'Current Program');
        this.createChart('journeyChart', this.journeyChartData, 'Journey');
    }
  }
</script>

<style scoped>
    .signal{
        width: 180px;
        height: 100px;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
    p{
        text-align: center;
    }
    .leyend{
        width: 10px;
        height: 10px;
    }   
    .small-chart{
        max-width: 140px !important;
        max-height: 140px !important;
    }
    .big-chart{
        max-width: 350px;
        max-height: 350px;
    }
</style>