
<template>
    <b-button @click="login" >{{ buttonText }}</b-button>
</template>
  
<script>
import { UserAgentApplication } from 'msal';
import store from '../store' 

export default {
  name: 'Login',
  data() {
    return {
        msalInstance: new UserAgentApplication({
            auth: {
                clientId: process.env.VUE_APP_CLIENT_ID, 
                authority: 'https://login.microsoftonline.com/consumers',
                redirectUri: window.location.origin,
            },
            cache: {
                cacheLocation: "localStorage",
                storeAuthStateInCookie: true
            },
            system: {
                navigateFrameWait: 0
            },
            framework: {
                unprotectedResources: ["https://www.microsoft.com/en-us/"],
                protectedResourceMap: new Map([["https://graph.microsoft.com/v1.0/me", ["user.read"]]])
            }
        }),
        loginInProgress: false,
    };
    
  },
  computed: {
    buttonText() {
      return store.getters.isLoggedIn ? 'Logout' : 'Login';
    }
  },
  methods: {
    login() {
        if (this.loginInProgress) {
               
              this.msalInstance.logout();
        }
        this.loginInProgress = true;
        if (!store.getters.isLoggedIn) {
            this.msalInstance.loginPopup().then(() => {        
            store.commit('SET_LOGIN_STATE', true)
        
        }).catch((error) => {
            console.error(error)
        }).finally(() => {
            this.loginInProgress = false;
        })
        } else {      
            this.msalInstance.logout()
            store.commit('SET_LOGIN_STATE', false)
            this.loginInProgress = false;
        }
    }
  }
}
</script>