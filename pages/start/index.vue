<template>
    <div class="content-page">
        <div class="content">
          <div class="page-title-box">
              <div class="row align-items-center">
                  <div class="col-sm-6">
                      <h4 class="page-title">Start</h4>
                  </div>
                  <div class="col-sm-6">
                      <ol class="breadcrumb float-right">
                          <li class="breadcrumb-item"><a href="#">Video MOS</a></li>
                          <li class="breadcrumb-item"><a href="#">Start</a></li>
                      </ol>
                  </div>
              </div> <!-- end row -->
          </div>
            <el-row>
              <el-col :span="12" :offset="1" class="pt-5">
                <el-card class="box-card" shadow="hover">
                  <div slot="header" class="clearfix p-5">
                      <span>Video MOS Parameters</span>
                  </div>

                  <el-form class="px-20">
                        
                    <div class="block">
                        <el-form-item label="Source Type">        
                        <el-radio-group v-model="mosSourceType" size="mini" @change="setDirty()">
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
                          <el-input class="w-250" size="mini" v-model="mosSourceUrl" @change="setDirty()"></el-input>
                        </el-form-item>                        
                    </div>                        

                    <div class="block mb-15" v-if="mosSourceType == 'file'">
                        <label class="el-form-item__label">Video File</label>
                        <el-upload
                          class="upload-demo"
                          drag
                          :action="apiUrl+'/uploadVideo'"
                          :on-success="onFileUploaded"
                          :file-list="fileList"
                          multiple>
                          <i class="el-icon-upload"></i>
                          <div class="el-upload__text"><em>Drag a video Here or <br>Click to select a file</em></div>
                        </el-upload>
                    </div>                        

                    <div class="block" v-if="mosSourceType == 'url' || mosSourceType == 'file'">
                        <el-form-item label="Analisys Mode" class="">
                          <el-select  class="w-200" v-model="mosAnalysisMode" placeholder="Select Analisys Mode"  size="mini" @change="setDirty()">
                              <el-option v-for="item in mosOptions" :key="item.value" :label="item.label" :value="item.value">
                              </el-option>
                          </el-select>
                        </el-form-item>
                    </div>

                    <div class="block" v-if="mosSourceType == 'url' || mosSourceType == 'file'">
                        <div class="formButtons my-20 float-right">
                            <el-button :loading="sendingForm" @click="sendData" type="primary" :disabled="!dirty">
                                Launch <i class="fas fa-rocket ml-2" aria-hidden="true"></i>
                            </el-button>
                        </div>
                    </div>

                  </el-form>
                  
                </el-card>
              </el-col>
            </el-row>
            
            <footer />
      </div>
    </div>
</template>

<script>
import Footer from '~/components/Footer.vue'
import cfg from '~/static/config.js'
import axios from 'axios'
import { getData, setData } from 'nuxt-storage/session-storage';

export default {
  name: 'settings',
  head:{
      title: 'Start - Video-MOS',
  },
  components: {
    Footer
  },
  data(){
    return {
        apiMosUrl: '',
        sendingForm: false,
        dirty: false,
        mosSourceType: 'url',
        mosSourceListFiles: [],
        mosSourceUrl: '',
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
        mosDayTimeStart: '',
        mosOptions: [
          {value: 'fast', label: 'fast'},
          {value: 'intermediate', label: 'intermediate'},
          {value: 'custom_mode', label: 'custom_mode'}
        ],        
        fileList: [],
        customStringmosSourcefiles: {
							upload: '<h1>Upload it!</h1>',
							drag: '<i class="el-icon-upload"></i><br /> <h6> Drag a video Here or <br>Click to select a file </h6>',
							fileSize: 'file size is greater than max size allowed',
							fileType: 'Format not allowed',
							change: 'Change Picture',
							remove: 'Remove Picture',
				},        
    }
  },   
	methods: {
    isLogged(){
      if (!getData('username')){
          this.$router.push('/login');
      }
    },
		setDirty(){
			if(!this.dirty)
			   this.dirty = true;
		},
    async sendData(){
        this.sendingForm = true;
        try {
            let config = {
              INPUT: (this.mosSourceType === 'url') ? this.mosSourceUrl : this.mosSourceListFiles,
              JOURNEY_START_TIME: this.mosDayTimeStart,
              MODE: this.mosAnalysisMode,
              MOS_EXCELENT: this.mosExcellent[0],
              MOS_GOOD: this.mosGood[0],
              MOS_REGULAR: this.mosRegular[0]
            }
          const resp = await axios.put(this.apiMosUrl+'probe/config', config);
          this.sendingForm = false;
          if (resp.data.code === 200) {
            this.$router.push('/dashboard')
          } else {
            this.$toast.show(resp.data.message);
          }
          
        } catch (error) {
          console.log(error);
        }

    },
		onFileUploaded (resp, file, fileList) {
        this.mosSourceListFiles.push(resp.filename)        
    },
    async getConfigParameters(){
      try {
        const res = await axios.get(this.apiMosUrl+'probe/config');
        if ('data' in res) {
          this.mosSourceUrl = res.data.INPUT;
          this.mosAnalysisMode = res.data.MODE;
          this.mosPoor = [1, res.data.MOS_REGULAR];
          this.mosRegular = [res.data.MOS_REGULAR, res.data.MOS_GOOD];
          this.mosGood = [res.data.MOS_GOOD, res.data.MOS_EXCELLENT];
          this.mosExcellent = [res.data.MOS_EXCELLENT, 5];
          this.mosDayTimeStart = res.data.JOURNEY_START_TIME;
        }
      } catch (error) {
        console.log(error);
      }      
    }
  },
  async created(){

    this.apiMosUrl = (this.$store.state.env.APP_ENV === 'prod') ? window.location.href.split(':')[0]+'://'+window.location.href.split('://')[1].split(':')[0]+':'+this.$store.state.env.API_PORT+'/videoAnalysis/' : this.$store.state.env.API_DEV_URL;
    
    this.isLogged();

    this.getConfigParameters();
    
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
    width: 110px;
    text-align: left;  
  }
</style>