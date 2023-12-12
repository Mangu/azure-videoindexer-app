<template>
  <div>
    <div v-if="loading" class="loading">Loading</div> 
      <div >
        <div  class="grid-container" v-if="isVideoDetailsNotEmpty">
            <div class="property">
                <span class="property-name">Title: </span>
                <span class="property-value">{{ videoDetails.name }}</span>
            </div>
            <div class="property">
                <span class="property-name">User: </span>
                <span class="property-value">{{ videoDetails.userName }}</span>
            </div>
            <div class="property">
                <span class="property-name">Created: </span>
                <span class="property-value">{{ videoDetails.created }}</span>
            </div>
            <div class="property">
                <span class="property-name">Duration: </span>
                <span class="property-value">{{ videoDetails.duration }}</span>
            </div>
            <div class="property">
                <span class="property-name">Language: </span>
                <span class="property-value">{{ videoDetails.videos[0].language }}</span>
            </div>
            <div class="property">
                <span class="property-name">Keywords: </span>
                <span class="property-value">{{ videoDetails.videos[0].insights.keywords }}</span>
            </div>
            <div class="property">
                <span class="property-name">Brands: </span>
                <span class="property-value">{{ videoDetails.videos[0].insights.brands }}</span>
            </div>
            <div class="property">
                <span class="property-name">People: </span>
                <span class="property-value">{{ videoDetails.videos[0].insights.faces }}</span>
            </div>  
            
            <div class="property">
                <span class="property-name">Timeline: </span>
                <div class="timeline timeline-grid-container">
                  <div class="timeline-item" v-for="(item, index) in videoDetails.videos[0].insights.transcript" :key="index">
                    <span class="timeline-start">{{ item.instances[0].start }}</span>
                    <span class="timeline-end">{{ item.instances[0].end }}</span>
                    <span class="timeline-text">{{ item.text }}</span>
                  </div>
                </div>
              </div> 
              <div class="property">
                <span class="property-name">Summary: </span>
                <div class="summary">
                  <span class="property-value" v-text="summary"></span>
                  
                </div> 
            </div> 
            <div class="buttonrow">
              <button @click="generateSummary(videoDetails.videos[0].insights.transcript)" class="btn btn-primary">Generate Summary</button>
              <button @click="saveSummary" class="btn btn-primary">Save Summary</button> 

            </div> 
          </div>
      </div>
    </div>  
</template>

 
<script>
  import apiService from '../services/apiService';

  export default {
    
    data() {
      return {
        videoDetails: {} ,
        loading: false,        
        summary: '',  
        videoId: this.$route.params.id  
      };
    },
    async created() {    
      this.videoDetails = await this.fetchVideoDetails(this.videoId);
      console.log(this.videoId);
    },
    computed: {
    isVideoDetailsNotEmpty() {
      return this.videoDetails && Object.keys(this.videoDetails).length > 0;
    },
  },
    
    methods: {
      async fetchVideoDetails(id) {
        this.loading = true;
        this.summary = '';
        apiService.getVideoDetails(id)
          .then(details => {
            this.videoDetails = {
              ...details,
              videos: details.videos.map(video => ({
              ...video,
              insights: {
              ...video.insights,
              brands: video.insights.brands ? video.insights.brands.map(brand => brand.name).join(', ') : '',
              keywords: video.insights.keywords ? video.insights.keywords.map(keyword => keyword.text).join(', ') : '',
              faces: video.insights.faces ? video.insights.faces.filter(face => face.confidence > 0).map(face => face.name).join(', ') : '',
            }
          }))
        };
        this.loading = false;
        })
        .catch(error => {
          console.error('Error fetching video details:', error);
          this.loading = false;
        });
      },
      async generateSummary(transcript) {  
        this.summary = await apiService.getOpenAIResponse(transcript);
      }, 
      saveSummary() {
          //TODO: save summary to cloud storage or CosmosDB       
      },    
    },
  };
</script>
<style>

  .property {    
      padding-top: 10px;   
      
  }
  .property-name {
      font-weight: bold;
  }
  .property-value {
    text-overflow: ellipsis;
  }
  .loading {
    animation: blink 1s linear infinite;
  }
  .btn {
    margin-right: 10px; 
    padding: 10px;
  }
  .buttonrow { 
    padding-top: 10px;
  }
  .grid-container {
    grid-template-columns: 1fr;
    margin: 0;
    padding-bottom: 10px;
  }
  .timeline {
    height: 200px;
    overflow-y: auto;
  }
  .summary {  
    overflow-y: auto;
  }
  .timeline-item {
  display: grid;
  grid-template-columns: 100px 100px auto;
  justify-items: start;
  gap: 5px;
}
  .timeline-item span {
    display: block;
    text-align: left;
  }
  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  }  
</style>