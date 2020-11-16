<template>
    <div>
        
    </div>
</template>

<script>

import axios from 'axios';

export default {
    name: 'index',
    data(){
        return {
            apiMosUrl: ''
        }
    },
    methods: {
        async isLogged(){
            if (!this.$auth.$storage.getLocalStorage('username')){
                this.$router.push('/login');
            } else {
                try {
                    const res = await axios.get(this.apiMosUrl+'probe/status');
                    if ('data' in res) {
                        if(res.data.STATUS === 'stopped'){
                            this.$router.push('/settings');                        
                        }else{
                            this.$store.commit('sonda/setQueryDataStatus', true);
                            this.$router.push('/dashboard');
                        }
                    }
                } catch (error) {
                    if (process.env.isProd)
                        this.$router.push('/login');
                    else
                        console.log(error)
                }
            }
        }
    },
    async mounted(){
        this.apiMosUrl = (this.$store.state.env.APP_ENV === 'prod') ? window.location.href.split(':')[0]+'://'+window.location.href.split('://')[1].split(':')[0]+':'+this.$store.state.env.API_PORT+'/videoAnalysis/' : this.$store.state.env.process.env.API_DEV_URL;
        this.isLogged()        
    }
}
</script>