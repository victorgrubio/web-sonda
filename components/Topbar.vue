<template>
    
        <div class="topbar">
            <!-- LOGO -->
            <div class="topbar-left">
                <a href="#" class="logo">
                    <span class="logo-light">
                        <img src="/images/logo-light.png" alt="">
                    </span>
                    <span class="logo-sm">
                        <img src="/images/logo.png" alt="">
                    </span>
                </a>
            </div>

            <nav class="navbar-custom px-0">
                <ul class="navbar-right list-inline float-right mb-0">
                    
                    <li v-if="this.$store.state.sonda.currentProgram" class="list-inline-item">
                        <span class="d-none d-sm-inline-block"> Channel: <strong> {{this.$store.state.sonda.currentProgram.channel}} </strong> </span>
                        <span class="d-none d-sm-inline-block"> Program: <strong> {{this.$store.state.sonda.currentProgram.program}} </strong> </span>
                    </li>

                    <li v-if="this.$store.state.sonda.currentProgramMos" class="list-inline-item">
                        <span class="d-none d-sm-inline-block"> Current Program MOS: <span :class="'text-'+this.$store.state.sonda.currentProgramMosClass+' bold'"> {{this.$store.state.sonda.currentProgramMos}} </span></span>
                    </li>

                    <li class="list-inline-item">
                        <button type="button" v-if="!this.$store.state.sonda.queryData" class="btn btn-sm btn-success waves-effect waves-light" @click="setQueryStatus()"> Start <i class="fas fa-play-circle"></i> </button>
                        <button type="button" v-if="this.$store.state.sonda.queryData" class="btn btn-sm btn-danger waves-effect waves-light" @click="setQueryStatus()"> Stop <i class="fas fa-stop-circle"></i> </button>
                    </li>

                    <li class="dropdown notification-list list-inline-item mx-1">
                        <a class="nav-link dropdown-toggle arrow-none waves-effect px-10" title="Alerts">
                            <i class="fas fa-bell noti-icon"></i>
                            <span v-if="this.$store.state.sonda.journeyNotif" class="badge badge-pill badge-danger noti-icon-badge">{{this.$store.state.sonda.journeyNotif.alerts}}</span>
                        </a>
                    </li>

                    <li class="dropdown notification-list list-inline-item mx-1">
                        <a class="nav-link dropdown-toggle arrow-none waves-effect px-10" title="Warnings">
                            <i class="fas fa-exclamation-triangle noti-icon"></i>
                            <span v-if="this.$store.state.sonda.journeyNotif" class="badge badge-pill badge-danger noti-icon-badge">{{this.$store.state.sonda.journeyNotif.warnings}}</span>
                        </a>
                    </li>
                    
                    <li class="dropdown notification-list list-inline-item">
                        <el-dropdown class="pt-10">
                            <span class="el-dropdown-link" >
                            <span v-if="$auth.user" class="d-none d-sm-inline-block hidden-sm-and-down">{{$auth.user.name}}</span>
                            <i class="fas fa-2x fa-user-circle"></i>  <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                <a class="p-20" @click.prevent="logout">Log Out <i class="fas fa-sign-out-alt"></i> </a>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </li>
                </ul>

                <ul class="list-inline menu-left mb-0">
                    <li class="float-left">
                        <button @click.prevent="toggleSideBar" class="button-menu-mobile open-left waves-effect">
                            <i class="mdi mdi-menu"></i>
                        </button>
                    </li>                    
                </ul>

            </nav>

        </div>
    
</template>
<script>

import axios from 'axios';

export default {
  name: 'topbar', 
  data(){
    return {
      apiMosUrl: ''
    }
  },     
  methods: {
    logout() {
      this.$auth.$storage.removeLocalStorage('username');
      this.$router.push('/login');
    },
    async setQueryStatus(){
        let endpoint = (this.$store.state.sonda.queryData) ?  'probe/stop' : 'probe/launch';
        const res = await axios.post(this.apiMosUrl+endpoint);
        if (res.status === 200) {
            let status = (endpoint === 'probe/launch') ? true : false;
            this.$store.commit('sonda/setQueryDataStatus', status);
        }
    },
    toggleSideBar(){			
        if(document.body.classList.contains('enlarged')){
            document.body.classList.remove('enlarged')
            this.sidebarWidth = window.innerWidth * 0.2;
            this.contentWidth = window.innerWidth * 0.8;
        }else{
            document.body.classList.add('enlarged')
            this.sidebarWidth = 0;
            this.contentWidth = window.innerWidth;
        }			
    },    
  },
  mounted() {
        this.apiMosUrl = (this.$store.state.env.APP_ENV === 'prod') ? window.location.href.split(':')[0]+'://'+window.location.href.split('://')[1].split(':')[0]+':'+this.$store.state.env.API_PORT+'/videoAnalysis/' : this.$store.state.env.API_DEV_URL;
},
}
</script>
<style>
    .el-dropdown{
        cursor: pointer;
    }
    .el-popper{
        margin-top: 0px;
    }
    .el-dropdown-menu{
        top: 10 !important;
    }
    .topbar .topbar-left{
        height: 50px;
    }
    .notification-list .nav-link{
        padding: 0 5px;
    }
    .notification-list .noti-icon {
        font-size: 18px;
    }
    .bold{
        font-weight: bold;
    }
    .text-red{
        color: rgb(255, 99, 132);
    }
    .text-yellow{
        color: rgb(255, 205, 86);
    }
    .text-green{
        color: rgb(75, 192, 192);
    }
    .text-blue{
        color: rgb(54, 162, 235);
    }    
</style>