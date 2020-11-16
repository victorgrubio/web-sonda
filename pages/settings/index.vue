<template>
    <div class="content-page">
        <div class="content">
          <div class="page-title-box">
              <div class="row align-items-center">
                  <div class="col-sm-6">
                      <h4 class="page-title">Settings</h4>
                  </div>
                  <div class="col-sm-6">
                      <ol class="breadcrumb float-right">
                          <li class="breadcrumb-item"><a href="javascript:void(0);">Video MOS</a></li>
                          <li class="breadcrumb-item"><a href="javascript:void(0);">Settings</a></li>
                      </ol>
                  </div>
              </div> <!-- end row -->
          </div>
            <el-row>
              <el-col :span="22" :offset="1" class="pt-5">
                <el-card class="box-card" shadow="hover">
                  <div slot="header" class="clearfix p-5">
                      <span>Video MOS Parameters Settings</span>
                  </div>
                  <el-form class="pr-20">
                    <el-row :gutter="10">
                      <el-col :lg="10" :md="10" :sm="12" :xs="24">
                        <div class="block">
                          <el-form-item label="Source Type">        
                            <el-radio-group v-model="mosSourceType" size="mini">
                              <el-radio-button label="url">
                                URL
                              </el-radio-button>
                              <el-radio-button label="file">
                                FILE
                              </el-radio-button>
                            </el-radio-group>
                          </el-form-item>
                        </div>
                        <div class="block" v-if="mosSourceType == 'url'">
                          <el-form-item label="Video URL">
                            <el-input class="w-250" size="mini" v-model="mosSourceUrl"></el-input>
                            <el-button @click="findMuxPrograms" size="small" type="primary">
                            Find MUX Channels
                            </el-button>                
                          </el-form-item>                        
                        </div>
                        <div class="block" v-if="mosSourceType == 'url'">
                          <el-form-item label="MUX Program Number">
                            <el-input class="w-250" type="number" size="mini" v-model="mosProgramNumber"></el-input>                          
                          </el-form-item>                        
                        </div>                        
                        <div class="block mb-15" v-if="mosSourceType == 'file'">
                          <label class="el-form-item__label">Video File</label>
                          <el-upload
                            class="upload-demo"
                            drag
                            :action="apiMosUrl+'vod/upload'"
                            :headers="{'Keep-Alive': {'timeout': 6000, 'max': 6000}}"
                            :on-success="onFileUploaded"
                            :on-error="onFileUploadError"
                            :before-upload="beforeUpload"
                            :file-list="fileList"
                            multiple>
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text"><em>Drag a video Here or <br>Click to select a file</em></div>
                          </el-upload>
                        </div>                        
                        <div class="block" v-if="mosSourceType == 'url' || mosSourceType == 'file'">
                          <el-form-item label="Analisys Mode" class="">
                            <el-select  class="w-200" v-model="mosAnalysisMode" placeholder="Select Analisys Mode"  size="mini">
                              <el-option v-for="item in mosOptions" :key="item.value" :label="item.label" :value="item.value">
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="Journey Time Start" class="pull-right">
                            <el-time-select
                              placeholder="Select Day Time Start"
                              size="small"
                              v-model="journeyTimeStart"
                              :editable="false"
                              :picker-options="{
                                start: '00:00',
                                step: '01:00',
                                end: '23:00'
                              }">
                            </el-time-select>
                          </el-form-item>
                          <el-form-item label="Journey Duration" class="pull-right">
                            <el-time-select
                              placeholder="Select Journey Duration"
                              size="small"
                              v-model="journeyDuration"
                              :editable="false"
                              :picker-options="{
                                start: '02:00',
                                step: '01:00',
                                end: '24:00'
                              }">
                            </el-time-select>
                          </el-form-item>
                          <el-form-item label="Program Duration" class="pull-right">
                            <el-time-select
                              placeholder="Select Program Duration"
                              size="small"
                              v-model="programDuration"
                              :editable="false"
                              :picker-options="{
                                start: '01:00',
                                step: '01:00',
                                end: '04:00'
                              }">
                            </el-time-select>
                          </el-form-item>
                          <el-form-item label="EPG Channel" class="">
                            <el-select  class="w-200" v-model="epgChannel" @change="onEpgChannelChange" placeholder="Select Channel from our EPG" size="small">
                              <el-option v-for="item in epgChannelList" :key="item" :label="item" :value="item" >
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item label="Channel Name">
                            <el-input class="w-250" size="mini" v-model="mosChannelName"></el-input>                          
                          </el-form-item>       
                          <el-form-item label="Minimum MOS Alert threshold" class="pull-right">
                            <el-input type="number" size="small" v-model="alertMosThreshold" :min="1" :max="5" :step="0.01" step-strictly></el-input>
                          </el-form-item>
                          <el-form-item label="Minimum MOS Warning threshold" class="pull-right">
                            <el-input type="number" size="small" v-model="warningMosThreshold" :min="1" :max="5" :step="0.01" step-strictly></el-input>
                          </el-form-item>
                        </div>
                      </el-col>
                      <el-col :lg="12" :md="12" :sm="12" :xs="24">
                        <label class="el-form-item__label w-200 d-block" v-if="mosSourceType == 'url' || mosSourceType == 'file'">
                          Video MOS Parameters
                        </label>
                        <br><br>
                        <div class="block my-30 mx-15"  v-if="mosSourceType == 'url' || mosSourceType == 'file'">
                          <span class="demonstration">Excellent</span>
                          <el-slider :value="mosExcellent" v-model="mosExcellent" @change="mosExcellentChange" :step="0.1" range :marks="marks" :min="1" :max="5"> </el-slider>
                        </div>
                        <div class="block my-30 mx-15"  v-if="mosSourceType == 'url' || mosSourceType == 'file'">
                          <span class="demonstration">Good</span>
                          <el-slider :value="mosGood" v-model="mosGood" @change="mosGoodChange" :step="0.1" range :marks="marks" :min="1" :max="5"> </el-slider>
                        </div>
                        <div class="block my-30 mx-15"  v-if="mosSourceType == 'url' || mosSourceType == 'file'">
                          <span class="demonstration">Regular</span>
                          <el-slider :value="mosRegular" v-model="mosRegular" @change="mosRegularChange" :step="0.1" range :marks="marks" :min="1" :max="5"> </el-slider>
                        </div>
                        <div class="block my-30 mx-15"  v-if="mosSourceType == 'url' || mosSourceType == 'file'">
                          <span class="demonstration">Poor</span>
                          <el-slider :value="mosPoor" v-model="mosPoor" @change="mosPoorChange" :step="0.1" range :marks="marks" :min="1" :max="5"> </el-slider>
                        </div>   
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col v-if="mosSourceType == 'url' || mosSourceType == 'file'">
                        <div class="formButtons my-20 float-right">
                          <el-button :loading="sendingForm" @click="sendData" size="small" type="primary">
                            Save & Launch <i class="fas fa-rocket"></i>
                          </el-button>
                          <el-button :loading="sendingForm" @click="stopSonda" size="small" type="danger">
                            Stop <i class="fas fa-ban"></i>
                          </el-button>
                        </div>
                      </el-col>
                    </el-row>			            
                  </el-form>
                </el-card>
              </el-col>
            </el-row>  
          <footer />
      </div>
    <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="35%"
        lock-scroll
        :close-on-press-escape="showConfirm"	
        :close-on-click-modal="showConfirm"
        :show-close="showConfirm">
        <span>{{dialogMessage}}</span>
        <span slot="footer" class="dialog-footer">
            <el-button v-if="showConfirm" @click="dialogVisible = false"> No</el-button>
            <el-button v-if="showConfirm" type="primary" @click="stopSonda">Yes</el-button>
        </span>
    </el-dialog>
    <el-dialog
        title="MUX Programs Available"
        :visible.sync="showMuxProgramDialog"
        width="35%"
        lock-scroll
        :close-on-press-escape="true"	
        :close-on-click-modal="!showMuxProgramDialog"
        :show-close="true">
      <div v-if="this.muxPrograms.length > 0">
        <span>Select a channel to load the configuration</span><br/>
        <el-button type="primary" v-for="item in this.muxPrograms" :key="item.id" @click="loadMuxProgram(item)">
          {{item.channel}}
        </el-button>
      </div>
      <div v-if="this.muxPrograms.length === 0">
        <span>Loading data, please wait ...</span>
      </div>
    </el-dialog>    
  </div>
</template>

<script>
'use strict'

import axios from 'axios'
import Footer from '~/components/Footer.vue'
import cfg from '~/static/config.js'

export default {
  name: 'settings',
  head:{
      title: 'Settings - Video-MOS',
  },
  components: {
    Footer
  },
  data(){
    return {
        apiMosUrl: '',
        sendingForm: false,
        dispUploadErrorAlert: false,
        dirty: false,
        dialogVisible: false,
        showConfirm: false,
        showMuxProgramDialog: false,
        dialogTitle: '',
        dialogMessage: '',
        epgChannel: 'None',
        epgChannelList: [],
        mosProgramNumber: '',  
        mosSourceType: 'url',
        mosSourceListFiles: [],
        mosSourceUrl: '',
        mosChannelName: '',
        mosSamples: '',
        mosAnalysisMode: '',
        mosPoor:  [1, 2],
        mosRegular:  [2, 3],
        mosGood:  [3, 4],
        mosExcellent:  [4, 5],
        marks: {
          1: '1',
          2: '2',
          3: '3',
          4: '4',
          5: '5'
        },
        journeyTimeStart: '00:00',
        journeyDuration: '24:00',
        programDuration: '01:00',
        channelName: '',
        alertMosThreshold: '2.00',
        warningMosThreshold: '3.00',       
        mosOptions: [],
        fileList: [],
        customStringmosSourcefiles: {
							upload: '<h1>Upload it!</h1>',
							drag: '<i class="el-icon-upload"></i><br /> <h6> Drag a video Here or <br>Click to select a file </h6>',
							fileSize: 'file size is greater than max size allowed',
							fileType: 'Format not allowed',
							change: 'Change Picture',
							remove: 'Remove Picture',
        },
        file: undefined,
        muxPrograms: []
    }
  },
	methods: {
    isLogged(){
      if (!this.$auth.$storage.getLocalStorage('username')){
        this.$router.push('/login');
      }
    },    
    mosExcellentChange(){        

      if (this.mosExcellent[0] < this.mosGood[0] && this.mosExcellent[0] > this.mosRegular[1]){        
  
        this.mosGood = [this.mosExcellent[0], this.mosExcellent[0]]

      } else if (this.mosExcellent[0] < this.mosGood[0] && this.mosExcellent[0] > this.mosRegular[0]){        
        
        this.mosGood = [this.mosExcellent[0], this.mosExcellent[0]]
        this.mosRegular = [this.mosRegular[0], this.mosExcellent[0]]

      } else if (this.mosExcellent[0] < this.mosRegular[0] && this.mosExcellent[0] > this.mosPoor[1]){        

        this.mosGood = [this.mosExcellent[0], this.mosExcellent[0]]
        this.mosRegular = [this.mosRegular[0], this.mosExcellent[0]]

      } else if (this.mosExcellent[0] < this.mosRegular[0]){        

        this.mosGood = [this.mosExcellent[0], this.mosExcellent[0]]
        this.mosRegular = [this.mosExcellent[0], this.mosExcellent[0]]
        this.mosPoor = [this.mosPoor[0], this.mosExcellent[0]]

      } else {

        this.mosGood = [this.mosGood[0], this.mosExcellent[0]]

      }

      this.mosExcellent = [this.mosExcellent[0], 5]

    },
    mosGoodChange(){

      if (this.mosGood[0] < this.mosRegular[0]) {
        this.mosRegular = [this.mosGood[0], this.mosGood[0]]
        this.mosPoor = [0, this.mosGood[0]]
      } else {        
        this.mosExcellent = [this.mosGood[1], this.mosExcellent[1]]
        this.mosRegular = [this.mosRegular[0], this.mosGood[0]]
      }      

    },
    mosRegularChange(){

      if (this.mosRegular[1] > this.mosGood[1]) {

        this.mosGood = [this.mosRegular[1], this.mosRegular[1]]
        this.mosExcellent = [this.mosRegular[1], 5]

      } else {

        this.mosGood = [this.mosRegular[1], this.mosGood[1]]
        this.mosPoor = [this.mosPoor[0], this.mosRegular[0]]

      }
    },
    mosPoorChange(){

      if (this.mosPoor[1] > this.mosRegular[1] && this.mosPoor[1] < this.mosGood[1]) {
         this.mosRegular = [this.mosPoor[1], this.mosPoor[1]]
         this.mosGood = [this.mosPoor[1], this.mosGood[1]]
      } else if (this.mosPoor[1] > this.mosRegular[1]) {
         this.mosGood = [this.mosPoor[1], this.mosPoor[1]]
         this.mosRegular = [this.mosPoor[1], this.mosPoor[1]]
         this.mosExcellent = [this.mosPoor[1], 5]
      } else {
         this.mosRegular = [this.mosPoor[1], this.mosRegular[1]]
      }

      this.mosPoor = [0, this.mosPoor[1]]
    },
    async stopSonda(){
        const res = await axios.post(this.apiMosUrl+'probe/stop');
        if (res.status === 200) {
          this.$toast.show(res.data.message);
        }
    },
    async sendData(){

        this.sendingForm = true;
        try {
            let config = {
              url: this.mosSourceUrl,
              program_number: parseInt(this.mosProgramNumber), 
              mode: this.mosAnalysisMode,
              journey_start_time: this.hoursToMin(this.journeyTimeStart),
              journey_duration: this.hoursToMin(this.journeyDuration),
              program_duration: this.hoursToMin(this.programDuration),
              epg_channel_name: this.epgChannel,
              channel_name: this.mosChannelName,
              alert_mos_threshold: parseFloat(this.alertMosThreshold).toFixed(2),
              warning_mos_threshold: parseFloat(this.warningMosThreshold).toFixed(2),
              mos_excellent: this.mosExcellent[0],
              mos_good: this.mosGood[0],
              mos_regular: this.mosRegular[0],
              samples: this.mosSamples
            }
            const resp = await axios.put(this.apiMosUrl+'probe/config', config);
            this.sendingForm = false;
            if (resp.status === 200) {
              this.$store.commit('sonda/setMosConfigValues', {excellent: this.mosExcellent[0], good: this.mosGood[0], regular: this.mosRegular[0]});
              const res = await axios.post(this.apiMosUrl+'probe/launch')  
              if (res.status === 200) {
                this.$store.commit('sonda/setQueryDataStatus', true);
                this.$router.push('/dashboard')
              } else {
                this.$toast.show(res.data.message);
              }
            } else {
                this.$toast.show(resp.data.message);
            }
        } catch (error) {
          console.log(error);
        }
    },
		onFileUploaded (resp, file, fileList) {
        this.mosSourceUrl = resp.video_path;
    },
    onFileUploadError(err, file, fileList){
        this.$message.error('Oops, Have been an error trying to upload the video file.');
    },
    beforeUpload(file){
      this.mosSourceUrl = file.name;
      this.file = file;
    },
    httpRequest(){
      axios.post(this.apiMosUrl+'tasks/new/upload-file', {
        headers: {
          "Content-type": "multipart/form-data",
        },
        data: {
          "file": this.file
        },
        timeout: 600
      })
    },
    httpRequest2(){
      const hugeStream = new FileReader()
      const formData = new FormData()
      formData.append('file', hugeStream.readAsBinaryString(this.file))
      return axios({
          method: 'post',
          url: this.apiMosUrl+'tasks/new/upload-file',
          data: formData
      })
    },

    leftPad(number) {    
        return ((number < 10 && number >= 0) ? '0' : '') + number;  
    },
    
    minutesToHour(min) {  
      return this.leftPad(Math.floor(Math.abs(min) / 60))+':'+this.leftPad(Math.abs(min) % 60);        
    },
    
    hoursToMin(hour){
      let time = (hour !== null) ?  hour.split(':') : '00:00';
      return (time[0] * 60) + (time[1]*1);
    },

    async getModes(){
        // Get modes from API
        const res_modes = await axios.get(this.apiMosUrl+'probe/modes');
        if ('data' in res_modes && typeof data !== null) {
            this.mosOptions = []
            for (const [key, value] of Object.entries(res_modes.data.probe_modes)) {
                this.mosOptions.push({"value": value, "label": key});
            }
        }
    },

    async getConfigParameters(){
      try {  
        const res = await axios.get(this.apiMosUrl+'probe/config');
        if ('data' in res && typeof data !== null) {
          this.mosSourceUrl = res.data.url;
          this.mosAnalysisMode = res.data.mode;
          this.journeyTimeStart = this.minutesToHour(res.data.journey_start_time);
          this.journeyDuration = this.minutesToHour(res.data.journey_duration);
          this.programDuration = this.minutesToHour(res.data.program_duration);
          this.mosChannelName = res.data.channel_name;
          this.epgChannel = res.data.epg_channel_name;
          this.alertMosThreshold = parseFloat(res.data.alert_mos_threshold).toFixed(2);
          this.warningMosThreshold = parseFloat(res.data.warning_mos_threshold).toFixed(2);
          this.mosPoor = [1, res.data.mos_regular];
          this.mosRegular = [res.data.mos_regular, res.data.mos_good];
          this.mosGood = [res.data.mos_good, res.data.mos_excellent];
          this.mosExcellent = [res.data.mos_excellent, 5];
          this.mosSamples = 900000;
          this.$store.commit('sonda/setMosConfigValues', {excellent: res.data.mos_excellent, good: res.data.mos_good, regular: res.data.mos_regular});
          if ('program_number' in res.data){
            this.mosProgramNumber = res.data.program_number;
          } else {
            this.mosProgramNumber = '';
          }
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

    async loadEpgChannelsInterval(){
      this.loadEpgChannels()
      setInterval(this.loadEpgChannels, 5000);
    },

    async loadEpgChannels(){
      try{
        // Check update only if list has a None or an empty (start value)
        if ( this.epgChannelList.length === 0 || this.equalArrays(this.epgChannelList, ['None']) ){
          const res = await axios.get(this.apiMosUrl+'probe/epg/channels');
          if ( 'data' in res ){
            // When channels are retrieved show a toast
            if ( res.data.length > 0 ){
              this.$toast.show("Obtained all EPG channels. Now you can select one", {duration: 4000})
            }
            this.epgChannelList = ['None'].concat(res.data);
          }
        }else{
          return
        }
      } catch (error) {
        console.log(error.message)
      }
    },

    equalArrays(array1, array2){
      // Checks if two arrays are equal
      var is_same = (array1.length == array2.length) && array1.every(function(element, index) {
        return element === array2[index];
      });
      return is_same;
    },


    onEpgChannelChange(){
      // If Channel name does not contain the epg channel
      // channel name = epg channel
      if (!this.mosChannelName.includes(this.epgChannel)){
        this.mosChannelName = this.epgChannel;
      }
    },

    async findMuxPrograms(){
      // Finds the mux programs from input url
      try{
        this.showMuxProgramDialog = true;
        this.muxPrograms = [];
        const res = await axios.get(this.apiMosUrl+'config/mux-programs', {
          params: {
            url: this.mosSourceUrl
          }
        });
        if ( 'data' in res ){
          // When channels are retrieved show log
          this.muxPrograms = res.data;
        }
      } catch (error) {
        console.log(error.message)
      }
    },

    loadMuxProgram(muxProgram){
      // Set all parameters from select Mux program
      this.mosProgramNumber = muxProgram.program_id
      this.mosChannelName = muxProgram.channel
      this.loadEpgChannelFromMux(muxProgram.channel)
      this.showMuxProgramDialog = false
    },

    loadEpgChannelFromMux(muxChannel){
      // Load epgChannel from Mux find configuration
      // Remove spaces for both channels for detecting the EPG
      muxChannel = muxChannel.replace(/ /g, '')
      if (this.epgChannelList.length > 0){
        for (let epgChannel of this.epgChannelList){
          // Either way we can se 
          if (this.checkMuxChannelEpg(muxChannel, epgChannel)){
            this.epgChannel = epgChannel
            console.log("Setting channel to "+ epgChannel)
          }
        }
      }
    },
    checkMuxChannelEpg(muxChannel, epgChannel){
      epgChannel = epgChannel.replace(/ /g, '');
      return muxChannel.includes(epgChannel) || epgChannel.includes(muxChannel)
    }
  },

  // When all methods defined and page is mounteds
  async mounted(){
    this.apiMosUrl = (this.$store.state.env.APP_ENV === 'prod') ? window.location.href.split(':')[0]+'://'+window.location.href.split('://')[1].split(':')[0]+':'+this.$store.state.env.API_PORT+'/videoAnalysis/' : this.$store.state.env.API_DEV_URL;
    this.isLogged();
    this.getModes();
    this.getConfigParameters();
    this.loadEpgChannelsInterval();
    // If no channels on epg shows this alerts
    if(this.epgChannelList.length === 0){
      this.$toast.show("Obtaining EPG channels. If you want EPG synchronized programs, please wait", {duration: 4000})
    }

    
  }
}
</script>

<style>
  .el-slider__marks-text {
    font-size: 10px;
  }  
  .el-form-item__content{
    display: inline-block;
  }
  .el-form-item{
    margin-bottom: 10px;
  }
  .el-form-item__label {
    width: 160px;
    text-align: left;  
  }
  .el-slider__button-wrapper{
    z-index: 100;
  }
</style>