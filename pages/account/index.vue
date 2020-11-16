<template>
    <div>
        <footer />
    </div>
</template>

<script>
import nuxtStorage from 'nuxt-storage';

export default {
  name: 'account',
  head:{
      title: 'Account - Video-MOS',
  },
  components: {
    Footer
  },
  methods: {
    isLogged(){
        if (!this.$auth.$storage.getLocalStorage('username')){
            this.$router.push('/login');
        }
    }
  },
  async mounted(){
    this.apiMosUrl = (this.$store.state.env.APP_ENV === 'prod') ? window.location.href.split(':')[0]+'://'+window.location.href.split('://')[1].split(':')[0]+':'+this.$store.state.env.API_PORT+'/videoAnalysis/' : this.$store.state.env.API_DEV_URL;
    this.isLogged()        
  }  
}
</script>