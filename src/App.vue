<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark"  class="navbar-3d" style="z-index: 1;">
      <b-navbar-brand href="#">Video Indexer Playground</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>          
          <b-nav-item to="/Home">Home</b-nav-item>
          <b-nav-item to="/About">About</b-nav-item>
          <b-nav-item to="/Chat">Chat</b-nav-item>
          <b-nav-item to="/settings">Settings</b-nav-item>
        </b-navbar-nav>         
         <b-navbar-nav class="ml-auto"> 
          <b-form-input class="mr-2" v-model="searchQuery" placeholder="Search"></b-form-input>
          <b-button variant="primary" @click="search">Search</b-button>   
          
          
        

        </b-navbar-nav>       
      </b-collapse>
    </b-navbar> 
    <b-container fluid class="page-container">
      <router-view :key="$route.fullPath"></router-view>
    </b-container>
  </div>
</template>
<script>
export default {
  name: 'App',
  components: {
    
  },
  data() {
    return {
      searchQuery: ''
      
    };
  },
  methods: {
    search() {
      this.$router.push({ path: '/Home', query: { q: this.searchQuery } });
    }
  },
  created() {
    this.$router.push('/home');
  }
};
</script>
<style >  
  .navbar-3d {
    z-index: 1;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .router-link-exact-active {
    color: white !important;
  }
  .page-container {
    margin-top: 20px;
    padding-left: 0;
    margin-left: 0;   
  }
</style>