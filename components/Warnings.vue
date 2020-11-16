<template>
    <div>
        <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix p-5">
                <i class="fas fa-exclamation-triangle noti-icon"></i><span>Warnings</span>
            </div>
            <div class="warnings-box">
                <el-popover
                    v-for="(warning, index) in this.$store.state.sonda.dashboardDisplays.warnings" :key="index" 
                    placement="top-start"
                    :title="(warning.category === 'mos') ? warning.category.toUpperCase() : warning.category"
                    width="300"
                    trigger="hover">
                    <el-row>
                        <el-col :span="12">
                            <img class="small-signal py-20" :src="warning.url">                            
                        </el-col>                        
                        <el-col :span="12">
                            <span class="d-block">{{formatDate(warning.start_datetime.$date)}}</span>
                            <span class="d-block">{{formatTime(warning)}}</span>                            
                            <span class="d-block">Program Name: {{warning.program_name}}</span>
                            <span class="d-block">{{warning.description}}</span>
                            <span class="d-block">Duration: {{warning.duration}}</span>
                            <span class="d-block">Confidence: {{warning.confidence}}</span>
                            <span class="d-block">MOS: {{warning.mos}}</span>
                        </el-col>
                    </el-row>
                    <div slot="reference" class="warning-item mx-5">
                        <img class="small-signal" :src="warning.url">
                        <p class="m-0">{{(warning.category === 'mos') ? warning.category.toUpperCase() : warning.category}}</p>
                        <p class="m-0">{{formatTime(warning)}}</p>
                    </div>
                </el-popover>
            </div>
        </el-card>
    </div>
</template>
<script>

import utils from '~/libs/utils'

export default {
  name: 'warning',
  methods: {
      formatDate(value) {
        return utils.formatDate(value)
      },
      formatTime(alert) {
        return utils.formatTime(alert)
      }
  }
}
</script>
<style scoped>
    .small-signal{
        width: 90px;
        height: auto;
    }
    .warnings-box{
        height: 105px;
        overflow-x: auto;
        overflow-y: hidden;        
        white-space: nowrap;
    }    
    .warning-item{
        width: 90px;
        display: inline-block;
    }
    .warning-item p{
        text-align: center;
        font-size: 11px;
        line-height: 1;
    }
    .el-popover__title{
        text-transform: capitalize;
    }
    .el-popover span{
        text-align: left;
        font-size: 11px;
        line-height: 1;
        display: block;
    }    
</style>