<template>
    <div class="page-container">
        <h3>Settings</h3>
        <form @submit.prevent="saveSettings" class="form-container">
            <div class="form-group">
                <label>Logs Prompt</label>
                <textarea v-model="oaiLogsPrompt" class="form-control long-input tall-textarea"></textarea>
            </div>  
            <div class="form-group">
                <label>Summary Prompt</label>
                <textarea v-model="oaiSummaryPrompt" class="form-control long-input tall-textarea"></textarea>
            </div> 
            <div class="form-group">
                <label>Model Temperature ({{ modelTemp }})</label>
                <input type="range" v-model.number="modelTemp" min="0" max="2" step=".1" class="form-control long-input">
            </div>
            <div class="form-group">
                <label>Top P ({{ modelTopP }})</label>
                <input type="range" v-model.number="modelTopP" min="0" max="1" step=".1" class="form-control long-input">
            </div> 
            <div class="form-group">
                <label>AD Client Id</label>
                <input v-model="adClientId" class="form-control long-input" placeholder="Client ID">
            </div>
            <div class="form-group">
                <label>Video Indexer API Endpoint</label>
                <input v-model="viApiEndpoint" class="form-control long-input" placeholder="API Endpoint">            
            </div>
            <div class="form-group">
                <label>Video Indexer Location:</label>
                <input v-model="viLocation" class="form-control long-input" placeholder="Location">            
            </div>
            <div class="form-group">
                <label>Video Indexer Account Id</label>
                <input v-model="viAccountId" class="form-control long-input" placeholder="Account ID">
            </div>
            <div class="form-group">
                <label>Video Indexer Subscription Key:</label>
                <input v-model="viSubscriptionKey" class="form-control long-input" placeholder="Ocp Apim Subscription Key">            
            </div>
            <div class="form-group">
                <label>OpenAI API Endpoint:</label>
                <input v-model="oaiEndpoint" class="form-control long-input" placeholder="OpenAI API">            
            </div>
            <div class="form-group">                
                <input v-model="oaiKey" class="form-control long-input" placeholder="OpenAI Key">
            </div>
            <div class="form-group">
                <label>Max Shots (Default: 10)</label>
                <input v-model="maxShots" type="number" min="0" class="form-control long-input" placeholder="Max Shots">            
            </div>            
            <div class="form-group">
                <label>Use settings values</label>
                <input type="checkbox" v-model="useSettings" class="form-control checkbox-left" >
            </div> 
            <div class="form-group full-width">          
                <button type="submit" class="btn btn-primary">Save</button> 
            </div>
        </form>
    </div>    
</template>
<style scoped>
    .container {
    display: flex;
    flex-direction: column;
    }
    @media (min-width: 600px) {
    .container {
        flex-direction: row;
    }
    }

    .tall-textarea {
        height: 200px;  
    }
    .form-container {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
    }
    .form-group {
        
        box-sizing: border-box; 
        width: 100%;
    }
    .tall-textarea {
        flex-basis: 100%;
    }

    .checkbox-left {
        display: block;
        width: auto;
        transform: scale(3);
        margin-left: 15px;
    }
</style>

<script>
    import DOMPurify from 'dompurify';

    export default {
        data() {
            return {
                adClientId: '',
                viApiEndpoint: '',
                viLocation: '',
                viAccountId: '',
                viSubscriptionKey: '',
                oaiEndpoint: '',
                oaiKey: '',
                oaiLogsPrompt: '',
                oaiSummaryPrompt: '',   
                modelTemp: 0.5,
                modelTopP: 0.5,
                maxShots: '',
                checkboxValue: false,     
            };
        },
        watch: {
            adClientId(newVal) {
                this.adClientId = DOMPurify.sanitize(newVal);
            },
            viApiEndpoint(newVal) {
                this.viApiEndpoint = DOMPurify.sanitize(newVal);
            },
            viLocation(newVal) {
                this.viLocation = DOMPurify.sanitize(newVal);
            },
            viAccountId(newVal) {
                this.viAccountId = DOMPurify.sanitize(newVal);
            },
            viSubscriptionKey(newVal) {
                this.viSubscriptionKey = DOMPurify.sanitize(newVal);
            },
            oaiEndpoint(newVal) {
                this.oaiEndpoint = DOMPurify.sanitize(newVal);
            },
            oaiKey(newVal) {
                this.oaiKey = DOMPurify.sanitize(newVal);
            },
            oaiLogsPrompt(newVal) {
                this.oaiLogsPrompt = DOMPurify.sanitize(newVal);
            },
            oaiSummaryPrompt(newVal) {
                this.oaiSummaryPrompt = DOMPurify.sanitize(newVal);
            },
            maxShots(newVal) {
                this.maxShots = DOMPurify.sanitize(newVal);
            },
        },  
        created() {
            this.adClientId = localStorage.getItem('adClientId') || '';
            this.viApiEndpoint = localStorage.getItem('viApiEndpoint') || '';
            this.viLocation = localStorage.getItem('viLocation') || '';
            this.viAccountId = localStorage.getItem('viAccountId') || '';
            this.viSubscriptionKey = localStorage.getItem('viSubscriptionKey') || '';
            this.oaiEndpoint = localStorage.getItem('oaiEndpoint') || '';
            this.oaiKey = localStorage.getItem('oaiKey') || '';
            this.oaiLogsPrompt = localStorage.getItem('oaiLogsPrompt') || '';
            this.oaiSummaryPrompt = localStorage.getItem('oaiSummaryPrompt') || '';
            this.modelTemp = localStorage.getItem('modelTemp') || 0.5;
            this.useSettings = localStorage.getItem('useSettings') || false;
            this.modelTopP = localStorage.getItem('modelTopP') || 0.5;
            this.maxShots = localStorage.getItem('maxShots') || '';
        },
        methods: {
            saveSettings() {
                localStorage.setItem('adClientId', this.adClientId);  
                localStorage.setItem('viApiEndpoint', this.viApiEndpoint);  
                localStorage.setItem('viLocation', this.viLocation);
                localStorage.setItem('viAccountId', this.viAccountId);
                localStorage.setItem('viSubscriptionKey', this.viSubscriptionKey);
                localStorage.setItem('oaiEndpoint', this.oaiEndpoint);
                localStorage.setItem('oaiKey', this.oaiKey);  
                localStorage.setItem('oaiLogsPrompt', this.oaiLogsPrompt); 
                localStorage.setItem('oaiSummaryPrompt', this.oaiSummaryPrompt);
                localStorage.setItem('modelTopP', this.modelTopP); 
                localStorage.setItem('modelTemp', this.modelTemp); 
                localStorage.setItem('maxShots', this.maxShots);
                localStorage.setItem('useSettings', this.useSettings);                 
            },
        },
    };
</script>