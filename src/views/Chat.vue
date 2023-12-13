<template>
  <div class="page-container">
    <h3>Chat</h3>
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="form-group chat-bubble">
        <p>{{ message }}</p>
        <span class="sender">user</span>
      </div>
    </div>    
    <div class="form-group">
        <input v-model="userInput" class="form-control long-input" placeholder="How can I help you today?">
    </div>
    <div class="button-container">
      <button @click="sendMessage" class="btn btn-primary">Go</button>
      <button @click="clearMessage" class="btn btn-primary">Clear</button>
    </div>
  </div>
</template>  

<script>
  export default {
    name: 'Chat',
    data() {
      return {
        userInput: '',
        messages: [],
      };
    },
    methods: {
      sendMessage() {
        this.messages.unshift(this.userInput);
        this.userInput = '';        
      },
      clearMessage() {
        this.messages = [];
        this.userInput = '';        
      },
    },
  };
</script>  

<style scoped>
  .button-container {
    display: flex;
    justify-content: space-between;
  }
  .page-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 90vh; /* This will make the container take up the full viewport height */
  }
  .messages {
    flex: 1;
    overflow-y: auto; /* This will add a scrollbar if the messages overflow the div */
  }
  .chat-bubble {
  background-color: #f0f0f0;
  border-radius: 20px;
  padding: 10px;
  margin: 10px 0;
  position: relative;
}
.sender {
  font-size: 0.8em;
  color: #888;
  position: absolute;
  bottom: 5px;
  right: 10px;
  font-weight: bold;
}
</style>