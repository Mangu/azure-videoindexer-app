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
  async *generateLogs(shots, videoId, accessToken, maxIterations) {
    let count = 0;
    for (let shot of shots) {
      for (let keyFrame of shot.keyFrames) {
        if (keyFrame && keyFrame.instances && keyFrame.instances.length > 0) {
          let instance = keyFrame.instances[0];
          let text = instance.thumbnailId ? await this.generateDescription(videoId, instance.thumbnailId, accessToken) : '';
          yield {
            start: instance.start,
            end: instance.end,
            text: text
          };
          count++;
          if (count >= maxIterations) {
            return;
          }
        }
      }
    }
  },
  
  async generateDescription( videoId,thumbnailId, accessToken) {

    const image = `${process.env.VUE_APP_API_ENDPOINT}/${process.env.VUE_APP_LOCATION}/Accounts/${process.env.VUE_APP_ACCOUNT_ID}/Videos/${videoId}/Thumbnails/${thumbnailId}?accessToken=${accessToken}`;
    const systemPrompt = localStorage.getItem('oaiLogsPrompt') || 'You are a video analyzer. This image is a scene for a sport event. Provide the following: What is the sport? Is the event location indoors or outdoors? Title of the scene, A short description of the scene as if you were a sports reporter. And always and only return back JSON with the following field: tittle, description, sport, location'; 
  
    const prompt = {
      "role": "user",
      "content": [
        {"type": "text", "text": systemPrompt},
        {
          "type": "image_url",
          "image_url": {"url": image,},
        },
      ],
    }; 
    let response; 
    try {
       response = await axios.post(process.env.VUE_APP_AOAI_ENDPOINT, {
        model: "gpt-4-vision-preview",
        messages: [prompt],
        max_tokens: 300,
      }, 
      {
        headers: {
          'api-key': `${process.env.VUE_APP_AZURE_OPEN_AI_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 500000 
      });
    } catch (error) {      
      console.error(error);
    }
    //console.log(response.data.choices[0]);
    return response.data.choices[0].message.content;
  },

  async generateSummary(transcript) {
    const userPrompt = transcript.map(line => line.text).join(' ');
    const modelTemp = parseFloat(localStorage.getItem('oaiTemp')) || 0.7;
    const systemPrompt = localStorage.getItem('oaiSummaryPrompt') || 'Follow these instructions: - Check with attention which kind of sport this is and the location - write a brief description of the transcript - Add anything else you find interesting based on the content only'; 
  
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
      temperature: modelTemp,
      max_tokens: 3000,
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