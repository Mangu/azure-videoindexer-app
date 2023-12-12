import axios from 'axios';

export default {
  getSettings() {
    const useSettings = JSON.parse(localStorage.getItem("useSettings"));
    if(!useSettings) {
      const clientId = process.env.VUE_APP_CLIENT_ID;
      const apiEndpoint = process.env.VUE_APP_API_ENDPOINT;
      const accountId = process.env.VUE_APP_ACCOUNT_ID;
      const location = process.env.VUE_APP_LOCATION;
      const subscriptionKey = process.env.VUE_APP_SUBSCRIPTION_KEY;
      const openAIKey = process.env.VUE_APP_AZURE_OPEN_AI_KEY;
      const openAIEndpoint = process.env.VUE_APP_AOAI_ENDPOINT;
    
      return {
        clientId,
        apiEndpoint,
        accountId,
        location,
        subscriptionKey,
        openAIKey,
        openAIEndpoint
      }
    }else{
      const clientId = localStorage.getItem('adClientId');
      const apiEndpoint = localStorage.getItem('viApiEndpoint');
      const accountId = localStorage.getItem('viAccountId');
      const location = localStorage.getItem('viLocation');
      const subscriptionKey = localStorage.getItem('viSubscriptionKey');
      const openAIEndpoint = localStorage.getItem('oaiEndpoint');
      const openAIKey = localStorage.getItem('oaiKey');

      return {
        clientId,
        apiEndpoint,
        accountId,
        location,
        subscriptionKey,
        openAIKey,
        openAIEndpoint
      } 
    }  
  },  

  async getAccessToken() {
    try {
        const response = await axios.get(`${process.env.VUE_APP_API_ENDPOINT}/auth/${process.env.VUE_APP_LOCATION}/Accounts/${process.env.VUE_APP_ACCOUNT_ID}/AccessToken`, {
            headers: {
                'Ocp-Apim-Subscription-Key': `${process.env.VUE_APP_SUBSCRIPTION_KEY}`
            }
        });
        const data = response.data;
        return data.replace(/"/g, ''); // Remove quotes around token
    } catch (error) {
        console.error('Failed to fetch access token:', error);
    }
  },

  async fetchVideos(searchQuery) {
    let url = `${process.env.VUE_APP_API_ENDPOINT}/${process.env.VUE_APP_LOCATION}/Accounts/${process.env.VUE_APP_ACCOUNT_ID}/Videos`;
    
    if (searchQuery) {
        url += `/search?query=${searchQuery}`;
    }

    try {
        const accessToken = await this.getAccessToken();
        
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = response.data.results;        
        return data;
    } catch (error) {
        console.error('Failed to fetch videos:', error);
    }
  },

  async getVideoDetails(videoId) {
    try {       
        const accessToken = await this.getAccessToken();
        const response = await axios.get(`${process.env.VUE_APP_API_ENDPOINT}/${process.env.VUE_APP_LOCATION}/Accounts/${process.env.VUE_APP_ACCOUNT_ID}/Videos/${videoId}/Index`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = response.data;  
        console.log(data);      
        return data;
    } catch (error) {
        console.error('Failed to fetch video details:', error);
    }
  },

  async getOpenAIResponse(transcript) {
      const userPrompt = transcript.map(line => line.text).join(' ');
      const systemPrompt = 'Follow these instructions: - Check with attention which kind of sport this is and the location - write a brief description of the transcript - Add anything else you find interesting based on the content only';

      const openAiResponse = await axios.post(process.env.VUE_APP_AOAI_ENDPOINT, {
        messages: [
          {
              role: 'system',
              content: systemPrompt
          },
          {
              role: 'user',
              content: userPrompt
          }
        ],
      }, 
      {
          headers: {
              'api-key': `${process.env.VUE_APP_AZURE_OPEN_AI_KEY}`,
              'Content-Type': 'application/json'
          }
      });
      const openAiData = openAiResponse.data;
      return openAiData.choices[0].message.content;
  }
};