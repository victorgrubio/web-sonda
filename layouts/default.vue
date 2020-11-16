<template>
  <div id="wrapper">
    <topbar />
    <sidebar />
    <nuxt />
  </div>
</template>


<script>
import Topbar from '~/components/Topbar.vue'
import Sidebar from '~/components/Sidebar.vue'

export default {
  components: {
    Topbar,
    Sidebar
  },     
  mounted() {
    if(!document.body.classList.contains('enlarged')){
      document.body.classList.add('enlarged')      
    }
  },
}
</script>