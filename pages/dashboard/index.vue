<template>
  <div class="content-page">
        <div class="content">
            <el-row :gutter="10">
                <el-col :lg="11"  :md="11" :sm="12" :xs="24" >
                    <ContentAnalysis />
                </el-col>
                <el-col :lg="7" :md="7" :sm="12" :xs="24">
                    <EnviromentAnalysis ref="enviromentAnalysis"/>
                </el-col>
                <el-col :lg="5" :md="5" :sm="12" :xs="24">
                    <VideoDetailsInfo  ref="videoDetails"/>
                </el-col>
            </el-row>
            <el-row class="pt-10" :gutter="25">
                <el-col class="fit-chart" :lg="20" :md="20" :sm="12" :xs="24">
                    <VideoMosHistogram callBy="dashboard" class="d-block" ref="videoMos" />
                </el-col>                
                <el-col :lg="3" :md="3" :sm="12" :xs="24">
                    <h4 class="text-center">Instant MOS</h4>
                    <div :class="mosClass+' w-120 text-center mos-value'"> {{instantMos}} </div>
                </el-col>
            </el-row>
            <el-row class="pt-5" :gutter="10">
                <el-col :span="24">
                    <Alerts />
                </el-col>
            </el-row>
            <el-row class="pt-5" :gutter="10">
                <el-col :span="24">
                    <Warnings />
                </el-col>
            </el-row>
        </div>

        <footer />

    <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        lock-scroll
        :close-on-press-escape="showConfirm"	
        :close-on-click-modal="showConfirm"
        :show-close="showConfirm">
        <span>{{dialogMessage}}</span>
        <span slot="footer" class="dialog-footer">
            <el-button v-if="showConfirm" @click="dialogVisible = false"> No</el-button>
            <el-button v-if="showConfirm" type="primary" @click="stopSonda">Yes</el-button>
            <el-button v-if="!showConfirm" type="primary"><nuxt-link to="settings"> Go to Settings</nuxt-link> </el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex'
import Footer from '~/components/Footer.vue';
import ContentAnalysis from '~/components/ContentAnalysis.vue';
import EnviromentAnalysis from '~/components/EnviromentAnalysis.vue';
import VideoDetailsInfo from '~/components/VideoDetailsInfo.vue';
import VideoMosHistogram from '~/components/VideoMosHistogram.vue';
import Alerts from '~/components/Alerts.vue';
import Warnings from '~/components/Warnings.vue';

export default {
  name: 'dashboard',
  head:{
    title: 'Dashboard - Video-MOS'
  },
  components: {
    Footer,
    ContentAnalysis,
    EnviromentAnalysis,
    VideoDetailsInfo,
    VideoMosHistogram,
    Alerts,
    Warnings
  },
  data(){
    return {
        apiMosUrl: '',
        iddleWaitTime: 500,
        dashboardData: {},
        mosClass: 'gray',
        previousTimestamp: null,
        previousProgram: null,
        currentProgram: null,
        instantMos: '-',
        dialogVisible: false,
        showConfirm: false,
        dialogTitle: '',
        dialogMessage: '',
        videoMos: {labels:[], values:[]}
    }
  },   
  computed: {
      ...mapState('auth', ['loggedIn', 'user']),      
  },
  methods: {
    isLogged(){
        if (!this.$auth.$storage.getLocalStorage('username')){
            this.$router.push('/login');
        }
    },
    setVideoMosClass(){
        let cfg = this.$store.state.sonda.mosConfigValues;
        if (this.instantMos >= cfg.excellent) {
            this.mosClass = 'blue'
        } else if (this.instantMos < cfg.excellent && this.instantMos >= cfg.good) {
            this.mosClass = 'green'
        } else if (this.instantMos < cfg.good && this.instantMos >= cfg.regular) {
            this.mosClass = 'yellow'
        } else if (this.instantMos < cfg.regular) {
            this.mosClass = 'red'
        }
    },
    async stopSonda(){
        const res = await axios.post(this.apiMosUrl+'probe/stop');
        if (res.status === 200) {
            this.$store.commit('sonda/setQueryDataStatus', false);
        }
    },
    async getConfigParameters(){
        try {
            const res = await axios.get(this.apiMosUrl+'probe/config');
            if ('data' in res && typeof data !== null) {
                this.$store.commit('sonda/setMosConfigValues', {excellent: res.data.mos_excellent, good: res.data.mos_good, regular: res.data.mos_regular});
            } else {
                this.dialogVisible = true;                                               
                this.dialogTitle = 'Error';
                this.dialogMessage = 'We are so sorry, but have been an Internal Error, please check Settings';
                this.showConfirm = false;
            }
        } catch (error) {
            this.dialogVisible = true;                                               
            this.dialogTitle = 'Error';
            this.dialogMessage = 'We are so sorry, but have been an Internal Error, please check Settings';
            this.showConfirm = false;
        }
    },
    wait() {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < this.iddleWaitTime);
    },    
    async getSondaCurrentStatus(){
        try {
            let resStatus;
            do{
                resStatus = await axios.get(this.apiMosUrl+'probe/status');
                if ('data' in resStatus && resStatus.data.STATUS === 'running'){
                    this.$store.commit('sonda/setQueryDataStatus', true);
                    this.dialogVisible = false  ;
                } else if ('data' in resStatus && resStatus.data.STATUS === 'stopped'){
                    const resStop = await axios.post(this.apiMosUrl+'probe/stop');
                    if (resStop.status === 200) {
                        this.$store.commit('sonda/setQueryDataStatus', false);
                        this.dialogVisible = true;
                        this.dialogTitle = 'Error';
                        this.dialogMessage = 'The Video quality probe is Stopped';
                        this.showConfirm = false;
                    }
                } else if ('data' in resStatus && resStatus.data.STATUS === 'error'){
                    this.dialogVisible = true;
                    this.dialogTitle = 'Error';
                    this.dialogMessage = (this.$store.state.sonda.queryData) ? 'We are so sorry, but have been an Internal Error, Do you want to Stop the video quality probe?' : 'We are so sorry, but have been an Internal Error, please check Settings';
                    this.showConfirm = this.$store.state.sonda.queryData || false;
                } else if ('data' in resStatus && resStatus.data.STATUS === 'idle'){
                    this.wait()
                }                
            }while(resStatus.data.STATUS === 'idle');

        } catch (error) {
            this.dialogVisible = true;                                               
            this.dialogTitle = 'Error';
            this.dialogMessage = 'We are so sorry, but have been an Internal Error, please check Settings';
            this.showConfirm = false;
        }        
    },
    async getVideoMosData(){
        if (this.$store.state.sonda.queryData) {  
            try {
                let res = await axios.get(this.apiMosUrl+'documents/last')
                if (res.status === 200) {
                    this.getSondaCurrentStatus();
                    this.dashboardData = res.data;
                    if (this.dashboardData !== null) {
                        if (typeof this.previousTimestamp === null || this.previousTimestamp !== this.dashboardData.timestamp){
                            if (this.previousProgram !== this.dashboardData.videoSRC.program_name){
                                this.$store.commit('sonda/setCurrentProgram', {channel: this.dashboardData.videoSRC.service_name, program: this.dashboardData.videoSRC.program_name});
                                this.$store.commit('sonda/addDashboarAlerts', {type:'currentProgram', alerts: {}})
                                this.$store.commit('sonda/addDashboarWarnings', {type:'currentProgram', warnings: {}})
                                this.$refs.videoMos.getCurrentProgramData(false);
                            }
                            this.videoMos.values.push(parseFloat(this.dashboardData.mosAnalysis.mos));
                            this.instantMos = parseFloat(this.dashboardData.mosAnalysis.mos).toFixed(2);
                            this.setVideoMosClass();
                            let timestamp = this.$refs.videoMos.getVideoTimestamp(this.dashboardData)
                            this.$refs.videoMos.addData(
                                this.$refs.videoMos.xAxisLabel(timestamp),
                                this.dashboardData.videoSettings.pts,
                                this.dashboardData.mosAnalysis.mos
                            );
                            this.$refs.videoMos.chart.render();
                            this.$refs.videoDetails.setDetailsData(this.dashboardData.videoSettings, this.dashboardData.audioSettings.codec);
                            const resFrame = await axios.get(this.apiMosUrl+'updateFrame');
                            this.previousTimestamp = this.dashboardData.timestamp;
                            this.previousProgram = this.dashboardData.videoSRC.program_name;
                        } else {
                            this.getSondaCurrentStatus();
                        }
                    }
                }
                res.status = 0; // avoid using previous response on next iteration until new one has arrived
            } catch (error) {
                console.log(error);
            }
        }
    },
  },
  timers: {
    getVideoMosData: { time: 1000, autostart: true, repeat: true, immediate: true }
  },
  async mounted() {

    this.apiMosUrl = (this.$store.state.env.APP_ENV === 'prod') ? window.location.href.split(':')[0]+'://'+window.location.href.split('://')[1].split(':')[0]+':'+this.$store.state.env.API_PORT+'/videoAnalysis/' : this.$store.state.env.API_DEV_URL;

    this.isLogged()

    if (this.$store.state.sonda.mosConfigValues === null) {
        this.getConfigParameters();
    }

    this.getSondaCurrentStatus();

    this.$store.commit('sonda/setQueryCurrentProgramData', true);

  }
}
</script>

<style>
    .el-card__header{
        padding: 3px 0px;
        background-color: #409eff;
        font-size: 11px;
        color: #ffff;
        font-weight: bold;
    }
    .el-card{
        border: none;
    }
    .el-card__body{
        padding: 5px;
    }
    .green-ligth > .el-card__header{
        background-color: #8bc34a;
    }
    .purple > .el-card__header{
        background-color: #673ab7;
    }
    .turquoise-ligth > .el-card__header{
        background-color: #8ddfea;
    }
    .turquoise-dark > .el-card__header{
        background-color: #007d8d;
    }
    .dark{
        background-color: rgb(20, 20, 20);        
    }
    .gray{
        background-color: rgb(200, 200, 200);
    }
    .red{
        background-color: rgb(255, 99, 132);
    }
    .yellow{
        background-color: rgb(255, 205, 86);
    }
    .green{
        background-color: rgb(75, 192, 192);
    }
    .blue{
        background-color: rgb(54, 162, 235);
    }
    .histogram-btns{
        float: right;
        display: block;
    }
    
    canvas, .div-centered{
        display: block;
        margin-left: auto;
        margin-right: auto;
    }
    .mos-value{
        margin-left: auto;
        margin-right: auto;
        font-size: 45px;
        color: #ffffff;
    }
    .fit-chart{
        width: 85%;
    }
    .el-button--primary > span > a{
        color: #ffffff;
    }
</style>
