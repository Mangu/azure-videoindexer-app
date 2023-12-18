<template>
  <div>
    <div v-if="loading" class="loading">Loading</div> 
      <div>
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
            <button @click="generateLogs(videoDetails.videos[0].insights.shots)" class="btn btn-success">Generate</button> 
            <div class="property">
              <button @click="showSummary = !showSummary" class="btn btn-success">{{ showSummary ? 'Hide Summary' : 'Show Summary' }}</button>
              <div class="summary" v-if="showSummary">
                <span class="property-value" v-text="summary"></span>               
              </div> 
            </div>
            <div class="property">
            <button @click="showLogs = !showLogs" class="btn btn-success">{{ showLogs ? 'Hide Logs' : 'Show Logs' }}</button>
            <div class="timeline timeline-grid-container" v-if="showLogs">
              <div class="timeline-item" v-for="(item) in logs" >
                <span class="timeline-start">{{ item.start }}</span>
                <span class="timeline-end">{{ item.end }}</span>
                <span class="timeline-text">{{ item.description }}</span>
              </div>
            </div>  
            <div class="property">
              <button @click="showTimeline = !showTimeline" class="btn btn-success">{{ showTimeline ? 'Hide Timeline' : 'Show Timeline' }}</button>
              <div class="timeline timeline-grid-container" v-if="showTimeline">
                <div class="timeline-item" v-for="(item, index) in videoDetails.videos[0].insights.transcript" :key="index">
                  <span class="timeline-start">{{ item.instances[0].start }}</span>
                  <span class="timeline-end">{{ item.instances[0].end }}</span>
                  <span class="timeline-text">{{ item.text }}</span>
                </div>
              </div>
            </div> 
            <div class="buttonrow">
              <!--<button @click="generateSummary()" class="btn btn-primary">Generate Summary</button>-->
              
              <!--<button @click="saveSummary" class="btn btn-primary">Save Summary</button>-->
            </div> 
          </div>
      </div>
    </div>  </div>
</template> 
<script>
  import apiService from '../services/apiService';

  export default {
    
    data() {
      return {
        videoDetails: {} ,
        accessToken: '',
        loading: false,        
        summary: '',  
        logs:[] ,
        showTimeline: false,
        showLogs: true,
        showSummary: true,
        videoId: this.$route.params.id,
        maxShots: 10
      };
    },
    async created() {    
      this.videoDetails = await this.fetchVideoDetails(this.videoId);
      this.accessToken = await apiService.getAccessToken(); 
      this.maxShots = localStorage.getItem('maxShots') || 10; 
      
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

      async generateSummary() {
        let transcript = this.videoDetails.videos[0].insights.transcript;
        if(!transcript)
        {
          transcript = [];
        }
        let combinedArray = [transcript, ...this.logs];  
        this.summary = await apiService.generateSummary(combinedArray);
        console.log("Done generating summary.");
      }, 

      async generateLogs() {
        
        if (this.videoDetails.videos && this.videoDetails.videos[0] && this.videoDetails.videos[0].insights && this.videoDetails.videos[0].insights.shots) {
          this.logs = []; 
          for await (let log of apiService.generateLogs(this.videoDetails.videos[0].insights.shots, this.videoDetails.id, this.accessToken, this.maxShots)) {
          try {
            let cleanedText = log.text.replace(/```json\n|\n```/g, ''); 
            let parsedText = JSON.parse(cleanedText);
            log.description = parsedText.description;            
            this.logs.push(log);      
          } catch (error) {
            log.description = '';
            console.error("Unable to parse log.text as JSON: ", error);
          }           
          await this.$nextTick(); 
        }
        console.log("Done generating shots.");
        this.generateSummary();
        } else {
          console.error("Unable to generate shots. Video details not available.");
        }
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
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    display: flex;
    
  }
  .loading {
    animation: blink 1s linear infinite;
  }
  .btn {
    margin-right: 10px; 
    padding: 10px;
    width: 200px;
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
    /*height: 200px; */
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