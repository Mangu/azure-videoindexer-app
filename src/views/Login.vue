<template>
    <div>
        <button @click="login">Login</button>
    </div>
</template>

<script>
import * as Msal from 'msal';

export default {
    name: 'Login',
    data() {
        return {
            msal: new Msal.UserAgentApplication({
                auth: {
                    clientId: 'your-application-id',
                    redirectUri: window.location.origin
                },
                cache: {
                    cacheLocation: 'localStorage',
                    storeAuthStateInCookie: true
                }
            })
        };
    },
    methods: {
        async login() {
            try {
                await this.msal.loginPopup({
                    scopes: ['user.read']
                });
                const user = this.msal.getAccount();
                console.log(user);
            } catch (error) {
                console.error(error);
            }
        }
    }
};
</script>