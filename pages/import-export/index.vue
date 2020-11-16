<template>
    <div class="content-page">
        <div class="content">
          <div class="page-title-box">
              <div class="row align-items-center">
                  <div class="col-sm-6">
                      <h4 class="page-title">Import / Export</h4>
                  </div>
                  <div class="col-sm-6">
                      <ol class="breadcrumb float-right">
                          <li class="breadcrumb-item"><a href="javascript:void(0);">Video MOS</a></li>
                          <li class="breadcrumb-item"><a href="javascript:void(0);">Import / Export</a></li>
                      </ol>
                  </div>
              </div> <!-- end row -->
          </div>
            <el-row>
              <el-col :span="10" :offset="1" class="pt-5">
                <el-card class="box-card" shadow="hover">
                  <div slot="header" class="clearfix p-5">
                      <span>Import Database</span>
                  </div>                 
                  
                  <div class="block mx-40 text-center">
                    <el-upload
                      class="upload-demo"
                      drag
                      :action="apiMosUrl+'db/import'"
                      multiple>
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text"><em>Drag a video Here or <br> Click to upload a file <br /> and import to databse</em></div>
                    </el-upload>

                  </div>

                </el-card>
              </el-col>
              <el-col :span="10" :offset="1" class="pt-5">
                <el-card class="box-card" shadow="hover">
                  <div slot="header" class="clearfix p-5">
                      <span>Export Database</span>
                  </div>                 
                  <div class="block mx-40 text-center">
                    <i class="el-icon-download d-block"></i> <br>             
                    <a :href="apiMosUrl+'db/export'" target="_blank" class="btn btn-primary btn-small">Export File</a>
                    <div slot="tip" class="el-upload__tip text-center">Click to Export a Database file</div>
                  </div>
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

export default {
  name: 'import-export',
  head:{
      title: 'Import/Export - Video-MOS',
  },
  components: {
    Footer
  },
  data(){
    return {
      apiMosUrl: ''
    }
  },
  methods: {
    isLogged(){
      if (!this.$auth.$storage.getLocalStorage('username')){
          this.$router.push('/login');
      }
    },
  }, 
  mounted() {

    this.apiMosUrl = (this.$store.state.env.APP_ENV === 'prod') ? window.location.href.split(':')[0]+'://'+window.location.href.split('://')[1].split(':')[0]+':'+this.$store.state.env.API_PORT+'/videoAnalysis/' : this.$store.state.env.API_DEV_URL;

    this.isLogged();
    
  }
}
</script>

<style>
  .el-icon-download, .el-icon-upload2 {
      font-size: 130px;
      display: block;
      color: #c0c4cc;
      margin: 40px 0 16px;
      line-height: 50px;
  }
</style>