<template>
    <div>
        <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix p-5">
                <i class="fas fa-bell noti-icon"></i> <span>Alerts</span>
            </div>
            <div class="alerts-box">
                <el-popover
                    v-for="(alert, index) in this.$store.state.sonda.dashboardDisplays.alerts" :key="index" 
                    placement="top-start"
                    :title="(alert.category === 'mos') ? alert.category.toUpperCase() : alert.category"
                    width="300"
                    trigger="hover">
                    <el-row>
                        <el-col :span="12">
                            <img class="small-signal py-20" :src="alert.url">                            
                        </el-col>                        
                        <el-col :span="12">                    
                            <span class="d-block">{{formatDate(alert.start_datetime.$date)}}</span>
                            <span class="d-block">{{formatTime(alert)}}</span>
                            <span class="d-block">Program Name: {{alert.program_name}}</span>
                            <span class="d-block">{{alert.description}}</span>                            
                            <span class="d-block">Duration: {{alert.duration}}</span>
                            <span class="d-block">Confidence: {{alert.confidence}}</span>
                            <span class="d-block">MOS: {{alert.mos}}</span>
                        </el-col>
                    </el-row>                            
                    <div slot="reference" class="alert-item mx-10">
                        <img class="small-signal" :src="alert.url">
                        <p class="m-0">{{(alert.category === 'mos') ? alert.category.toUpperCase() : alert.category}}</p>
                        <p class="m-0">{{formatTime(alert)}}</p>
                    </div>
                </el-popover>
            </div>
        </el-card>
    </div>
</template>
<script>

import moment from 'moment';
import utils from '~/libs/utils';

export default {
  name: 'alerts',
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
    .alerts-box{
        height: 105px;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
    }
    .alert-item{
        width: 90px;
        display: inline-block;
    }
    .alert-item p{
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