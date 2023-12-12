<template>
    <div class="page-container">
      <h3>Details</h3>
      <VideoDetails :video-id="videoId"></VideoDetails>      
    </div>
  </template>  
  <script>
    import VideoDetails from '../components/VideoDetails';
    export default {
      name: 'Details',
      components: {
        VideoDetails
        },
      data() {
        return {
            videoId: this.$route.query.id  
        };
      },
      methods: {
        
      },
    };
  </script>  
  <style scoped>
  </style>