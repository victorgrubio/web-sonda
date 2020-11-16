<template>
    <div class="content-page">
      <div class="content">
        <el-row :gutter="10">
          <el-col :lg="12" :md="12" :sm="22" :xs="22">
            <el-form>
              <div class="block">
                  <el-form-item>
                    <el-form-item label="Journey Video URL">
                      <el-input class="w-250" size="mini" v-model="vodVideoUrl" readonly></el-input>
                    </el-form-item>                        
                  </el-form-item>
              </div>
              <el-card class="box-card" shadow="hover">
                  <div slot="header" class="clearfix p-5">
                      <i class="fas fa-film"></i> <span> Program</span>
                  </div>
                  <el-alert
                    v-if="noData"
                    title="No Data"
                    type="error">
                    There's not Programs/Files data in the selected Journey
                  </el-alert>
                  <div class="vod-box">
                    <el-popover
                      v-for="(item, index) in vodProgramsList" :key="index" 
                      placement="bottom-start"
                      width="210"
                      trigger="hover">
                      <el-row class="my-5">
                        <el-col :lg="12" :md="12" :sm="22" :xs="22" class="px-20">
                          <h4 class="text-center w-120">MOS</h4>
                          <div :class="setMosBoxClass(item.mos)+' w-120 text-center mos-value'"> {{formatDecimals(item.mos)}} </div>
                        </el-col>              
                      </el-row>
                      <el-row class="my-5">
                        <table class="table table-borderless">
                          <tr>
                            <th>File / Program:</th>
                            <td>{{item.program_name}}</td>                            
                          </tr>
                          <tr>                            
                            <th>Duration:</th>
                            <td>{{parseDuration(item.duration)}}</td>
                          </tr>
                          <tr>                            
                            <th>Alerts:</th>
                            <td>{{item.alerts.length}}</td>
                          </tr>
                          <tr>                            
                            <th>Warnings:</th>
                            <td>{{item.warnings.length}}</td>
                          </tr>
                        </table>
                      </el-row>
                      <div slot="reference" :class="isActiveItem(item)+' vod-item mx-5'">
                          <table class="table table-borderless table-condensed">
                            <tr>
                              <td class="p-0" colspan="2">
                                <img @click="setSelectedDetails(item)" class="small-signal" src="/images/signal.png">
                              </td>
                            </tr>
                            <tr>
                              <td class="p-0">Program:</td>
                              <td class="p-0">{{item.program_name}}</td>
                            </tr>
                            <tr>
                              <td class="p-0">MOS:</td>
                              <td class="p-0">{{formatDecimals(item.mos)}}</td>
                            </tr>
                          </table>
                      </div>
                    </el-popover>
                  </div>
              </el-card>
            </el-form>
          </el-col>
          <el-col :lg="12" :md="12" :sm="22" :xs="22">
            <el-card class="box-card">
              <h3>Details</h3>
              <el-row :gutter="10">
                <el-col :lg="7" :md="7" :sm="12" :xs="20">
                    <canvas class="mt-20" id="doughnutChart"></canvas> 
                </el-col>                                                
                <el-col :lg="7" :md="7" :sm="12" :xs="20">
                    <h4 class="m-0 text-center">MOS</h4>
                    <div :class="setMosBoxClass(this.$store.state.sonda.vodProgramMos)+' w-100 text-center mos-value'"> {{this.$store.state.sonda.vodProgramMos}} </div>
                </el-col>
                <el-col :lg="7" :md="7" :sm="12" :xs="20">
                    <table class="table table-borderless">
                      <tr>
                        <th style="width:50%">Program Type:</th>
                        <td>{{vodProgramType}}</td>
                      </tr>
                      <tr>
                        <th style="width:50%">Scan  Type:</th>
                        <td>{{vodScanType}}</td>
                      </tr>
                      <tr>
                        <th style="width:50%">Video Codec:</th>
                        <td>{{vodVideoCodec}}</td>
                      </tr>
                      <tr>                        
                        <th style="width:50%">Resolution:</th>
                        <td>{{vodResolution}}</td>
                      </tr>
                      <tr>
                        <th style="width:50%">Pixel Format:</th>
                        <td>{{vodPixelFormat}}</td>
                      </tr>
                      <tr>                        
                        <th style="width:50%">Color Space:</th>
                        <td colspan="3">{{vodColorSpace}}</td>
                      </tr>
                    </table>                    
                </el-col>
              </el-row>              
              <VideoMosHistogram callBy="vod" class="d-block" ref="videoMos" />
              <Alerts class="my-5" />
              <Warnings class="my-5" />
            </el-card>
          </el-col>
        </el-row>
      </div>
      <footer />
    <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="35%"
        :lock-scroll="true"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :show-close="false">
        <span>{{dialogMessage}}</span>
        <el-button type="primary">
          <nuxt-link to="settings">Settings</nuxt-link>
        </el-button>
    </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Chart from 'chart.js';
import axios from 'axios'
import moment from 'moment'
import Footer from '~/components/Footer.vue'

import VideoMosHistogram from '~/components/VideoMosHistogram.vue';
import Alerts from '~/components/HistoricAlerts.vue';
import Warnings from '~/components/HistoricWarnings.vue';
import cfg from '~/static/config.js'

export default {
  name: 'vod',
  head:{
      title: 'VOD - Video-MOS',
  },
  components: {
    VideoMosHistogram,
    Alerts,
    Warnings,    
    Footer
  },
  data(){
    return {
         apiMosUrl: '',
         vodVideoUrl: '',
         vodProgramState: true,
         vodMosClass: 'gray',
         vodProgramType: '-',
         vodScanType: '-',         
         vodProgramMos: '-',
         vodProgramAlerts: '-',
         vodProgramWarnings: '-',
         vodDuration: '-',
         vodProgramName: '-',
         vodVideoCodec: '-',
         vodResolution: '-',
         vodPixelFormat: '-',
         vodColorSpace: '-',         
         vodProgramsList: [],
         displayCharts: false,
         noData: false,
         selectedItem: {},
         instantVideoMos: '-',
         dialogVisible: false,
         dialogTitle: '',
         dialogMessage: '',
         sendingForm: false,
         donutCharts: '',
         donutChartsData: [],
         doughnutOptions: {
            responsive: true,
            legend: {
              display: false
            },
            title: {
              display: false
            },
            animation: {
              animateScale: true,
              animateRotate: true
            }
          },
          chartLabels: ['No data'],          
          vodChartData: {
              datasets: [{
                  data: [1],
                  backgroundColor: ['rgb(188, 188, 188)']
              }]
          }
    }
  },
  methods: {
    isLogged(){
      if (!this.$auth.$storage.getLocalStorage('username')){
          this.$router.push('/login');
      }
    },    
    formatDecimals(value){
      return parseFloat(value).toFixed(2)
    },
    createChart(chartId, chartData, chartTitle) {
        var canvas = document.getElementById(chartId);
        var context = canvas.getContext('2d');
        this.doughnutOptions.title.text = chartTitle;
        chartData.labels = this.chartLabels;
        chartData.datasets.backgroundColor = this.chartBackgroundColor;
        this.donutCharts = new Chart(context, {
            type: 'doughnut',
            data: chartData,
            options: this.doughnutOptions
        });
    },
    setMosBoxClass(mos){
        if (this.$store.state.sonda.mosConfigValues){
          let cfg = this.$store.state.sonda.mosConfigValues
          if (mos >= cfg.excellent) {
              return 'blue'
          } else if (mos < cfg.excellent && mos >= cfg.good) {
              return 'green'
          } else if (mos < cfg.good && mos >= cfg.regular) {
              return 'yellow'
          } else if (mos < cfg.regular) {
              return 'red'
          }
        } else {
          return 'gray';
        }
    },
    xAxisLabel(timestamp){
          return timestamp.split(" ")[1];
    },
    updateChartData(chartData){
        if ('mos_poor' in chartData) {
            this.donutCharts.data.datasets[0].data = [parseFloat(chartData.mos_poor).toFixed(2), parseFloat(chartData.mos_regular).toFixed(2), parseFloat(chartData.mos_good).toFixed(2), parseFloat(chartData.mos_excellent).toFixed(2)];
            this.donutCharts.data.labels = ['Poor', 'Regular', 'Good', 'Excellent'];
            this.donutCharts.data.datasets[0].backgroundColor = ['rgb(255, 99, 132)', 'rgb(255, 205, 86)','rgb(75, 192, 192)','rgb(54, 162, 235)'];
        } else if('no_data' in chartData) {
            this.donutCharts.data.datasets[0].data = [1]
            this.donutCharts.data.labels = ['No data']
            this.donutCharts.data.datasets[0].backgroundColor = ['rgb(20, 20, 20)']
        } else {
            this.donutCharts.data.datasets[0].data = [1]
            this.donutCharts.data.labels = ['Void']
            this.donutCharts.data.datasets[0].backgroundColor = ['rgb(188, 188, 188)']
        }
        this.donutCharts.update()
    },    
    setSelectedDetails(item){
      this.selectedItem = item;
      this.vodVideoCodec = this.selectedItem.video_settings.codec;
      this.vodResolution = this.selectedItem.video_settings.resolution;
      this.vodPixelFormat = this.selectedItem.video_settings.pix_format;
      this.vodColorSpace = this.selectedItem.video_settings.color_space;
      this.vodProgramType = this.selectedItem.content_type;
      this.vodScanType = this.selectedItem.video_settings.scan_type;
      this.updateChartData(this.selectedItem.mos_percentages);
      this.$refs.videoMos.resetChartData();
      this.$refs.videoMos.setHistogramData(this.selectedItem.data);
      this.$store.commit('sonda/setVodProgramMos', this.selectedItem.data[this.selectedItem.data.length - 1].mos);
      this.$store.commit('sonda/setHistoricAlerts', this.selectedItem.alerts)
      this.$store.commit('sonda/setHistoricWarnings', this.selectedItem.warnings)
    },
    isActiveItem(item){
      return (this.selectedItem._id == item._id) ? 'active' : '';
    },
    async getJourneyPrograms(){
      try {
            const res = await axios.get(this.apiMosUrl+'journeys/current/program-list');
            if ('data' in res && typeof data !== null) {
                if(res.data.length === 0) {
                  this.noData = true
                }else{
                  this.vodProgramsList = res.data;
                }
            } else {
                this.dialogVisible = true;                                               
                this.dialogTitle = 'Error';
                this.dialogMessage = 'There is no journey being processed by VideoMOS. Please start processing to see the results here.';
            }
        } catch (error) {
            this.dialogVisible = true;                                               
            this.dialogTitle = 'Error';
            this.dialogMessage = 'There is no journey being processed by VideoMOS. Please start processing to see the results here.';
        }
    },
    async getConfigParameters(){
        try {
            const res = await axios.get(this.apiMosUrl+'probe/config');
            if ('data' in res && typeof data !== null) {
                this.$store.commit('sonda/setMosConfigValues', {excellent: res.data.mos_excellent, good: res.data.mos_good, regular: res.data.mos_regular});
                this.vodVideoUrl = res.data.url;
                console.log(this.vodVideoUrl)
            } else {
                this.dialogVisible = true;                                               
                this.dialogTitle = 'Error';
                this.dialogMessage = 'We are so sorry, but have been an Internal Error, please try to refresh this page';
                this.showConfirm = false;
            }
        } catch (error) {
            this.dialogVisible = true;                                               
            this.dialogTitle = 'Error';
            this.dialogMessage = 'We are so sorry, but have been an Internal Error, please try to refresh this page';
            this.showConfirm = false;
        }
    },
    parseDuration(duration){
      // Convert duration minutes to HH h and MM mins
      let hours = ~~(duration/60);
      let mins = duration - (60*hours);
      if (hours > 0){
        return `${hours.toString().padStart(2, '0')} h ${mins.toString().padStart(2, '0')} mins`
      }
      return `${mins.toString().padStart(2, '0')} mins`
    },
  },
  async mounted() {

    this.apiMosUrl = (this.$store.state.env.APP_ENV === 'prod') ? window.location.href.split(':')[0]+'://'+window.location.href.split('://')[1].split(':')[0]+':'+this.$store.state.env.API_PORT+'/videoAnalysis/' : this.$store.state.env.API_DEV_URL;
    this.isLogged();
    if (this.$store.state.sonda.mosConfigValues === null) {
        this.getConfigParameters();
    }
    this.$store.commit('sonda/setHistoricAlerts', {})
    this.$store.commit('sonda/setHistoricWarnings', {});    
    this.createChart('doughnutChart', this.vodChartData, 'Journey');
    this.getJourneyPrograms();
  }  
}
</script>

<style scoped>
    .small-signal{
        width: 101%;
        height: auto;
    }
    .vod-box{
        min-height: 620px;
        overflow-x: auto;
        overflow-y: auto;
    }
    .active,
    .vod-item:hover{
      border: 2px solid #000000a1;
      -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.4);
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.4);
    }
    .vod-item{
        width: 18%;
        display: inline-block;
        cursor: pointer;
    }
    .vod-item p{
        font-size: 11px;
        line-height: 0.5;
    }
    .el-popover__title{
        text-transform: capitalize;
    }
    .el-popover .el-popper{
      min-width: 350px !important;
    }
    .el-popover span{
        text-align: left;
        font-size: 11px;
        line-height: 1;
        display: block;
    }
    .el-card__body > span{
      padding: 5px;
      margin: 5px;
    }
    .el-dialog .el-button{
      margin-top: 3em
      algin
    }
</style>