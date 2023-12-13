<template>
  <div>  
    <div fluid class="no-padding">      
      <div class="card-container">
        <div class="card mb-4 shadow-sm item-class"
            v-for="video in paginatedVideos"
            :key="video.id"
            @click="navigateToVideoDetails(video.id)"
            :class="{ 'highlighted': selected === video.id }">
            <img :src="getThumbnailUrl(video)" >
            <div class="card-body">
              <p class="card-text">{{ video.name }}</p>
            </div>
          </div>
      </div>
      <div v-if="pageCount > 1" class="pagination">
        <button v-for="page in pageCount" 
                :key="page" 
                @click="currentPage = page" 
                :class="{ 'active': currentPage === page }">{{ page }}</button>
      </div>
    </div>
  </div>
</template>

<script>   
  import apiService from '../services/apiService';
  export default {
    data() {
        return {
          videos: [],
          accessToken: '',
          selected: null,
          currentPage: 1,
          itemsPerPage: 20,
          searchQuery: this.$route.query.q || ''
        };
    },
    
    async created() {
        try {
          this.accessToken = await apiService.getAccessToken();  
          this.videos = await apiService.fetchVideos(this.searchQuery);
        } catch (error) {
          console.error('Error in created hook', error);
        }
    },
    mounted() {
    // Add resize event listener when component is mounted
      window.addEventListener('resize', this.calculateItemsPerPage);
      this.calculateItemsPerPage();
    },
    beforeDestroy() {
      // Remove resize event listener when component is destroyed
      window.removeEventListener('resize', this.calculateItemsPerPage);
    },   
    methods: {
      navigateToVideoDetails(id) {
        this.$router.push({ name: 'Details', params: { id } });
      },
      calculateItemsPerPage() {
      // Get the size of a single item
      const itemElement = this.$el.querySelector('.item-class');
      if (itemElement) {
        const itemHeight = itemElement.offsetHeight;
        const itemWidth = itemElement.offsetWidth;

        // Get the size of the navbar and footer
        const navbarHeight = 75; // Replace with actual navbar height
        const footerHeight = 75; // Replace with actual footer height

        // Calculate the available height and width
        const availableHeight = window.innerHeight - navbarHeight - footerHeight;
        const availableWidth = window.innerWidth;

        // Calculate the number of items that can fit vertically and horizontally
        const itemsVertical = Math.floor(availableHeight / itemHeight);
        const itemsHorizontal = Math.floor(availableWidth / itemWidth);

        // Calculate itemsPerPage based on the number of items that can fit vertically and horizontally
        const newItemsPerPage = itemsVertical * itemsHorizontal;

        // Only update itemsPerPage if its value has changed
        if (this.itemsPerPage !== newItemsPerPage) {
          this.itemsPerPage = newItemsPerPage;
        }
      }
    },
      getThumbnailUrl(video) {
        return `${process.env.VUE_APP_API_ENDPOINT}/${process.env.VUE_APP_LOCATION}/Accounts/${process.env.VUE_APP_ACCOUNT_ID}/Videos/${video.id}/Thumbnails/${video.thumbnailId}?accessToken=${this.accessToken}`;
      },
      selectCard(id) {
        this.selected = id;
      },    
    },
    computed: {
      paginatedVideos() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.videos.slice(start, end);
      },
      pageCount() {
        return Math.ceil(this.videos.length / this.itemsPerPage);
      }
    },
  };
</script>
<style scoped>
  .highlighted {
    background-color: rgb(222, 222, 222); /* Change this to the color you want */
  }
  img {
    width: 100%;
    height: auto;
  }
  .card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  column-gap: 10px;
  row-gap: 0px;
}
  .card {   
    margin: 0;
    padding: 0;   
  }
  .card-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 10px
  }
  .pagination .active {
    background-color: #007bff;
    color: white;
  }
  .pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
</style>