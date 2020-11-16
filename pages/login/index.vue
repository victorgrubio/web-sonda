<template>
    <div>
        <div class="card-body">
            <div class="text-center m-t-0 m-b-15">
              <img src="/images/logo-full.png" alt="">
            </div>
            <h5 class="font-18 text-center">Sign in to continue to Video-MOS</h5>

            <form class="form-horizontal m-t-30" v-if="!$store.state.authUser" @submit.prevent="login">
                <p v-if="formError" class="error">
                    {{ formError }}
                </p>

                <div class="form-group">
                    <div class="col-12">
                        <label>Username</label>
                        <input class="form-control" type="text" required="" placeholder="Username" v-model="formUsername">
                    </div>
                </div>

                <div class="form-group">
                    <div class="col-12">
                        <label>Password</label>
                        <input class="form-control" type="password" required="" placeholder="Password" v-model="formPassword">
                    </div>
                </div>

                <div class="form-group text-center m-t-20">
                    <div class="col-12">
                        <button class="btn btn-primary btn-block btn-lg waves-effect waves-light" type="submit">Log In</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'login',
  layout: 'login',
  head:{
    title: 'Login - Video-MOS',
  },  
  data () {
    return {
      formError: null,
      formUsername: '',
      formPassword: ''
    }
  },
  methods: {
    async login() {
      try {
        const res = await axios.post(this.apiMosUrl+'auth/login', {
                            user: this.formUsername, password: this.formPassword
                          });        
        if ('data' in res) {
          if (res.status === 200){
            this.$auth.$storage.setLocalStorage('username', this.formUsername);
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
              if (process.env.isProd){
                  this.$router.push('/login');
              } else {
                  console.log(error)
              }
            }             
          }else {
            this.$toast.show('Invalid Credentials');
          }
        }
      } catch (e) {        
        this.$router.push('/login')
      }
    },
  },
  async mounted(){
    this.apiMosUrl = (this.$store.state.env.APP_ENV === 'prod') ? window.location.href.split(':')[0]+'://'+window.location.href.split('://')[1].split(':')[0]+':'+this.$store.state.env.API_PORT+'/videoAnalysis/' : this.$store.state.env.API_DEV_URL;
  }  
        
}
</script>

<style>
.container {
  padding: 100px;
}
.error {
  color: red;
}
</style>
