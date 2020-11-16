<template>
    <div class="content-page">
      <div class="content">
          <el-collapse-transition>
            <div :class="[displayCharts ? 'd-none': 'd-block']">
              <el-row>
                <el-col :lg="9" :md="9" :sm="24" :xs="24">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix p-5">
                        <span>Historic Video MOS query</span>
                    </div>
                        <el-form class="p-10">
                          <el-alert v-if="errorDates" title="Wrong Dates" type="error" class="mb-10" show-icon>
                            End Date Can't be lower than Start Date
                          </el-alert>
                          <div class="block">
                            <el-form-item label="Filter">
                              <el-radio-group v-model="filterBy" size="mini" @change="loadJourneyList">
                                <el-radio label="Dates"></el-radio>
                                <el-radio label="Journeys"></el-radio>
                              </el-radio-group>
                            </el-form-item>
                          </div>
                          <div class="block" v-if="filterBy === 'Journeys'">
                            <el-form-item label="Journey">
                              <el-select size="mini" v-model="vodJourneyDatetime" placeholder="Select a Journey" @change="loadProgramList">
                                <el-option
                                  v-for="(journey, idx) in journeyDateList"
                                  :key="idx"
                                  :label="journey.toLocaleString()"
                                  :value="journey.toISOString().split('.')[0]+'Z'">
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </div>
                          <div class="block" v-if="filterBy === 'Journeys'">
                            <el-form-item>
                              <el-form-item label="Program">
                                <el-select size="mini" v-model="vodProgramName" placeholder="Select a Program">
                                  <el-option
                                    v-for="(program, idx) in journeyProgramList"
                                    :key="idx"
                                    :label="program"
                                    :value="program">
                                  </el-option>
                                </el-select>
                              </el-form-item>                        
                            </el-form-item>
                          </div>
                          <div class="block" v-if="filterBy === 'Dates'">
                              <el-form-item label="Start Date">
                                <el-date-picker
                                  size="mini"
                                  v-model="queryStartDate"
                                  type="datetime"
                                  class="w-200"
                                  format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="Start Date"
                                  @change="validateDates()">
                                </el-date-picker>
                              </el-form-item>
                          </div>
                          <div class="block" v-if="filterBy === 'Dates'">
                              <el-form-item label="End Date">
                                <el-date-picker
                                  size="mini"
                                  v-model="queryEndDate"
                                  type="datetime"
                                  class="w-200"
                                  format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="End Date"
                                  @change="validateDates()">
                                </el-date-picker>
                              </el-form-item>
                          </div>
                          <div class="block" v-if="filterBy === 'Dates'">
                              <el-form-item>
                                <el-form-item label="Program">
                                  <el-input size="mini" class="w-200" v-model="vodProgramName"></el-input>
                                </el-form-item>                        
                              </el-form-item>
                          </div>
                          <div class="block">
                              <el-form-item>
                                <el-form-item label="URL">
                                  <el-input size="mini" class="w-200" v-model="vodUrl"></el-input>
                                </el-form-item>                        
                              </el-form-item>
                          </div>
                          <div class="block">
                              <div class="formButtons my-20">
                                  <el-button class="float-right m-5" :loading="sendingForm" @click="downloadFile = !downloadFile" size="mini" type="success">
                                      Download File <i class="fas fa-download"></i>
                                  </el-button>
                                  <el-button class="float-right m-5" :loading="sendingForm" @click="queryData" size="mini" type="primary">
                                      Display Charts <i class="fas fa-chart-area"></i>
                                  </el-button>
                              </div>
                              <el-alert
                                v-if="noData"
                                title="No Data"
                                type="error">
                                There's not historical data in the selected time period
                              </el-alert>
                          </div>
                          <div class="block" v-if="downloadFile">
                            <el-form-item label="File Type">
                              <el-button-group>
                                <el-button size="mini" type="primary" plain @click="downloadHistoricFile('JSON')">JSON</el-button>
                                <el-button size="mini" type="primary" plain @click="downloadHistoricFile('CSV')">CSV</el-button>
                              </el-button-group>
                            </el-form-item>
                          </div>
                        </el-form>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-collapse-transition>
          <el-collapse-transition>
            <div :class="[displayCharts ? 'd-block': 'd-none']">
              <el-row class="pt-5">
                  <el-col :span="4" :offset="20" class="text-right">
                      <button type="button" size="small" class="btn btn-sm btn-success" @click="displayCharts = !displayCharts"> Change Parameters <i class="fas fa-play-circle"></i> </button>
                  </el-col>
              </el-row>
              <el-row :gutter="10">
                  <el-col :lg="5" :md="5" :sm="24" :xs="24">
                    <table class="table table-borderless">
                      <tr v-if="filterBy === 'Dates'">
                        <th style="width:25%">Start Date:</th>
                        <td>{{startDate}}</td>
                        <th style="width:25%">Start Time:</th>
                        <td>{{startTime}}</td>
                      </tr>
                      <tr v-if="filterBy === 'Dates'">
                        <th style="width:25%">End Date:</th>
                        <td>{{endDate}}</td>
                        <th style="width:25%">End Time:</th>
                        <td>{{endTime}}</td>
                      </tr>
                      <tr v-if="filterBy === 'Journeys'">
                        <th style="width:25%">Journey:</th>
                        <td colspan="3">{{formatJourney(vodJourneyDatetime)}}</td>
                      </tr>
                      <tr>
                        <th style="width:25%">Program:</th>
                        <td colspan="3">{{vodProgramName}}</td>
                      </tr>
                      <tr>
                        <th style="width:25%">URL:</th>
                        <td colspan="3">{{vodUrl}}</td>
                      </tr>
                      <tr>
                        <th style="width:25%">Download File:</th>
                        <td colspan="3">
                            <el-button size="mini" type="primary" plain @click="downloadHistoricFile('JSON')">JSON</el-button>
                            <el-button size="mini" type="primary" plain @click="downloadHistoricFile('CSV')">CSV</el-button>
                        </td>
                      </tr>
                    </table>
                  </el-col>
                  <el-col :lg="5" :md="5" :sm="24" :xs="24">
                    <div :class="videoMosClass+' w-100 text-center mos-value mt-10'"> {{videoMos}} </div>
                    <div class="div-centered w-100">
                        <span class="text-left d-block">Alerts: {{alertsNumber}}</span>
                        <span class="text-left d-block">Warnings: {{warnigsNumber}}</span>
                    </div>
                  </el-col>
                  <el-col :lg="5" :md="5" :sm="24" :xs="24">
                      <el-row>
                        <el-col>
                          <canvas class="donutChart" id="doughnutChart"></canvas>
                        </el-col>
                      </el-row>
                      <el-row class="py-10" :gutter="20">
                        <el-col :span="6">
                            <span id="blue" class="leyend px-10 mr-5"></span> Excellent
                        </el-col>
                        <el-col  :span="6">
                            <span id="green" class="leyend px-10 mr-5"></span> Good
                        </el-col>
                        <el-col :span="6">
                            <span id="yellow" class="leyend px-10 mr-5"></span> Regular
                        </el-col>
                        <el-col :span="6">
                            <span id="red" class="leyend px-10 mr-5"></span> Poor
                        </el-col>
                      </el-row>                      
                  </el-col>
                  <el-col :span="8">
                    <table class="table table-borderless">
                      <tr>
                        <th style="width:25%">Video Codec:</th>
                        <td>{{videoCodec}}</td>
                        <th style="width:25%">Average Bitrate:</th>
                        <td>{{averageBitrate}} Kbps.</td>
                      </tr>
                      <tr>
                        <th style="width:25%">Scan Type:</th>
                        <td>{{scanType}}</td>
                        <th style="width:25%">Average Temporal Complexity:</th>
                        <td>{{averageTemporalComplexity}}</td>
                      </tr>
                      <tr>
                        <th style="width:25%">Resolution:</th>
                        <td>{{resolution}}</td>
                        <th style="width:25%">Average Spatial Complexity:</th>
                        <td>{{averageSpatialComplexity}}</td>
                      </tr>
                      <tr>
                        <th style="width:25%">Pixel Format:</th>
                        <td>{{pixelFormat}}</td>
                        <th style="width:25%">Analysis Mode:</th>
                        <td>{{analysisMode}}</td>
                      </tr>
                      <tr>
                        <th style="width:25%">Color Space:</th>
                        <td colspan="3">{{colorSpace}}</td>
                      </tr>
                    </table>
                  </el-col>
              </el-row>
              <el-row class="pt-20" :gutter="25">
                  <el-col :lg="24" :md="24" :sm="24" :xs="24">
                      <VideoMosHistogram callBy="historic" ref="videoMos" />
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
          </el-collapse-transition>
          <footer />
      </div>
    </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import moment from 'moment'
import Footer from '~/components/Footer.vue'

import VideoMosHistogram from '~/components/VideoMosHistogram.vue';
import Alerts from '~/components/HistoricAlerts.vue';
import Warnings from '~/components/HistoricWarnings.vue';
import cfg from '~/static/config.js'

export default {
  name: 'historic',
  head:{
      title: 'Historic - Video-MOS',
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
         displayCharts: false,
         noData: false,
         alertsNumber: '-',
         warnigsNumber: '-',
         videoCodec: '-',
         resolution: '-',
         averageBitrate: '-',
         averageTemporalComplexity: '-',
         averageSpatialComplexity: '-',
         analysisMode: '-',
         scanType: '-',
         pixelFormat: '-',
         colorSpace: '-',
         videoMos: '-',
         videoMosClass: 'gray',
         instantVideoMosClass: 'gray',
         instantVideoMos: '-',
         downloadFile: false,
         fileType: '',
         journeyDateList: [],
         journeyProgramList: [],
         historicData: {},
         pickerOptions: {
           shortcuts: [{
              text: 'Today',
              onClick(picker) {
                picker.$emit('pick', moment().format('YYYY-MM-DDTHH:mm:ssZ'));
              }
            }, {
              text: 'Yesterday',
              onClick(picker) {
                picker.$emit('pick', moment().subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ssZ'));
              }
            }, {
              text: 'A week ago',
              onClick(picker) {
                picker.$emit('pick', moment().subtract(7, 'days').format('YYYY-MM-DDTHH:mm:ssZ'));
              }
            }]
         },
         queryStartDate: new Date(),
         queryEndDate: new Date(),
         vodProgramName: '',
         vodUrl: '',
         vodJourneyDatetime: '',
         filterBy: 'Dates',
         sendingForm: false,
         errorDates: false,
         doughnutChart: '',
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
         chartLabels: ['Poor', 'Regular', 'Good', 'Excellent'],
         chartBackgroundColor: ['rgb(255, 99, 132)', 'rgb(255, 205, 86)','rgb(75, 192, 192)','rgb(54, 162, 235)']         
    }
  },   
  computed: {
      ...mapState('auth', ['loggedIn', 'user']),
      startDate(){
        return moment(this.queryStartDate).format('DD/MM/YYYY')
      },
      startTime(){
        return moment(this.queryStartDate).format('HH:mm:ss')
      },
      endDate(){
        return moment(this.queryEndDate).format('DD/MM/YYYY')
      },
      endTime(){
        return moment(this.queryEndDate).format('HH:mm:ss')
      },
  },  
	methods: {
    isLogged(){
      if (!this.$auth.$storage.getLocalStorage('username')){
          this.$router.push('/login');
      }
    },
    async loadJourneyList(){
      if (this.filterBy === 'Journeys'){
        const res = await axios.get(this.apiMosUrl+'journeys/date-list');
        if ('data' in res){
          this.journeyDateList = this.formatJourneyDateList(res.data.journey_date_list);
        }
      }
    },    
    async loadProgramList(){
      const res = await axios.get(this.apiMosUrl+'journeys/'+this.vodJourneyDatetime+'/program-name-list');
      if ('data' in res){
        this.journeyProgramList = res.data;
      }
    },
		validateDates(){
      this.errorDates = (this.queryEndDate < this.queryStartDate ) || false;
    },
    createChart(chartId) {
        window.myDoughnut = new Chart(document.getElementById(chartId).getContext('2d'), {
            type: 'doughnut',
            data: {
              datasets: [{
                data: this.donutChartsData,
                backgroundColor: this.chartBackgroundColor,
              }],
              labels: this.chartLabels
            },
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
    formatDecimals(num){
      return parseFloat(num).toFixed(2);
    },
    async queryData(){
      this.sendingForm = true;
      this.noData = false;
      try {
        let params;
        this.$refs.videoMos.chartData = [];
        if (this.filterBy === 'Dates'){
          params = {init_datetime: moment(this.queryStartDate).format(),
                    end_datetime: moment(this.queryEndDate).format(),
                    program_name: this.vodProgramName,
                    url: this.vodUrl}
        } else {
          params = {journey_datetime: this.vodJourneyDatetime,
                    program_name: this.vodProgramName,
                    url: this.vodUrl}
        }        
        const resp = await axios.post(this.apiMosUrl+'search/data', params)   
        this.sendingForm = false;
        if ('data' in resp) {
            if ('mos' in resp.data) {
              this.historicData = resp.data;
              this.alertsNumber = resp.data.alert_number;
              this.warnigsNumber = resp.data.warning_number;
              this.videoCodec = resp.data.video_codec;
              this.resolution = resp.data.resolution
              this.videoMos = this.formatDecimals(resp.data.mos);
              this.videoMosClass = this.setMosBoxClass(this.videoMos);
              this.averageBitrate = this.formatDecimals(resp.data.bitrate);
              this.averageTemporalComplexity = this.formatDecimals(resp.data.temp_inf_avg);
              this.averageSpatialComplexity = this.formatDecimals(resp.data.spat_inf_avg);
              this.analysisMode = resp.data.analysis_mode;
              this.scanType = resp.data.scan_type;
              this.pixelFormat = resp.data.pixel_format;
              this.colorSpace = resp.data.color_space;
              this.$store.commit('sonda/setHistoricAlerts', resp.data.alerts);
              this.$store.commit('sonda/setHistoricWarnings', resp.data.warnings);
              this.donutChartsData = [resp.data.mos_percentages.mos_poor, resp.data.mos_percentages.mos_regular, resp.data.mos_percentages.mos_good, resp.data.mos_percentages.mos_excellent];
              this.createChart('doughnutChart');
              this.$refs.videoMos.chart.render();
              this.$refs.videoMos.resetChartData();
              this.$refs.videoMos.chartData = resp.data.graph_data;
              for (const val of resp.data.graph_data){
                this.$refs.videoMos.addData(
                  this.$refs.videoMos.xAxisLabel(val.timestamp),
                  val.pts,
                  val.mos
                );
              }
              this.$refs.videoMos.chart.render();
              this.$store.commit('sonda/setVodProgramMos', this.formatDecimals(resp.data.graph_data[resp.data.graph_data.length - 1].mos));
              this.displayCharts = true;
            } else {
              this.noData = true;
              this.displayCharts = false;
            }
        }
      } catch (error) {
        console.log(error);
      }
    },
    async downloadHistoricFile(fileType){
      this.sendingForm = true;
      try {        

        let params;
        if (this.filterBy === 'Dates'){
          params = {init_datetime: moment(this.queryStartDate).format(),
                    end_datetime: moment(this.queryEndDate).format(),
                    program_name: this.vodProgramName,
                    url: this.vodUrl}
        } else {
          params = {journey_datetime: this.vodJourneyDatetime,
                    program_name: this.vodProgramName,
                    url: this.vodUrl}
        }
        params.type = fileType;
        const resp =  await axios.post(this.apiMosUrl+'search/url', params)
        this.sendingForm = false;
        if (resp.data){
          window.open(this.apiMosUrl+resp.data.url, '_blank')        
        } else {
          this.noData = true;
        }
      } catch (error) {
        console.log(error);        
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
    formatJourneyDateList(journeyDateList){
      var array1 = journeyDateList;
      var result = [];
      for(var i = 0; i < array1.length; i++) {
        result.push(new Date(array1[i]));
      }
      return result;
    },
    formatJourney(journeyDateString){
      var journeyDate = new Date(journeyDateString);
      return journeyDate.toLocaleString();
    }
  },
  async mounted() {
    this.apiMosUrl = (this.$store.state.env.APP_ENV === 'prod') ? window.location.href.split(':')[0]+'://'+window.location.href.split('://')[1].split(':')[0]+':'+this.$store.state.env.API_PORT+'/videoAnalysis/' : this.$store.state.env.API_DEV_URL;
    this.isLogged();        
    if (this.$store.state.sonda.mosConfigValues === null) {
        this.getConfigParameters();
    }
    this.loadJourneyList();
    this.$store.commit('sonda/setHistoricAlerts', {})
    this.$store.commit('sonda/setHistoricWarnings', {});
  }  
}
</script>

<style>
  .leyend{
      width: 10px;
      height: 10px;
  }
  .donutChart{
    max-width: 230px !important;
    max-height: 230px !important;
  }
  #gray, .gray{
      background-color: rgb(200, 200, 200);
  }  
  #red, .red{
      background-color: rgb(255, 99, 132);
  }
  #yellow, .yellow{
      background-color: rgb(255, 205, 86);
  }
  #green, .green{
      background-color: rgb(75, 192, 192);
  }
  #blue, .blue{
      background-color: rgb(54, 162, 235);
  }
  .mos-value{
      margin-left: auto;
      margin-right: auto;
      font-size: 45px;
      color: #ffffff;
  }  
  .table td, .table th {
      padding: 3px 5px;
  }
  .table th {
    font-weight: bold;
  }
  .content-page .content{
    font-size: 12px;
  }
  .el-input--prefix .el-input__inner{
    padding-right: 20px;
  }
</style>
