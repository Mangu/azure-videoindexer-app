<template>
  <div class="page-container">
    <h3>Videos</h3>    
    <ListItems @fetch-video-details="videoId = $event" />
  </div>
</template>  
<script>
  import ListItems from '../components/ListItems';
  
  export default {
    name: 'Home', 
    components: {
      ListItems,
    },
    data() {
      return {
        videoId: null,        
      };
    },
    methods: {
      
    },
  };
</script>  
<style scoped>
</style>