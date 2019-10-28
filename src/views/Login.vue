<template>
  <div class="login">
    <NaativHeader alt/>
    <v-card class="pa-2 login-card">
      <v-card-text class="centered white">
        <v-form ref="loginForm" @submit.prevent="login">
          <v-alert v-if="error" type="error" :value="error">{{error.message || error}}</v-alert>
          <v-alert type="error" :value="true" v-if="!$browser.supported">
            {{ $browser.invalidMessage }}
          </v-alert>
          <v-alert type="error" :value="true" v-if="!hasLocalStorage">
            Cookies are required to complete login. Please enable cookies in your browser settings
          </v-alert>
          <div>
            <v-text-field data-cy="Email Login Page" name="login" label="Email" v-model="username" :rules="rules.required" :disabled="!hasLocalStorage"/>
            <v-text-field
              data-cy="Password Login Page"
              name="password"
              label="Password"
              v-model="password"
              :rules="rules.required"
              type="password"
              :disabled="!hasLocalStorage"
            />
            <div>
              <v-btn
                data-cy="Login Page Login"
                color="#00d3e6"
                depressed
                round
                large
                class="text-capitalize white--text font-weight-black"
                type="submit"
                :loading="loading"
                :disabled="!hasLocalStorage"
              >Login</v-btn>
            </div>
            <small>Dont have an account? Click
              <router-link to="/register">here</router-link>to register.
            </small>
            <br>
            <small>Forgot your password? Click
              <router-link to="/account/reset">here</router-link>to reset your password.
            </small>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import NaativHeader from '@/components/Header.vue'
import { rules } from '@/utils/Validation'
import { Actions } from '@/store'
const tenantId = ~~process.env.VUE_APP_TENANT_ID

export default {
  name: 'Home',
  components: {
    NaativHeader
  },
  data() {
    return {
      disabled: false,
      error: null,
      hasLocalStorage: false,
      loading: false,
      password: '',
      rules,
      username: ''
    }
  },
  methods: {
    checkLocalStorage() {
      try {
        this.hasLocalStorage = !!window.localStorage
      } catch (error) {
        console.error({ error })
        this.hasLocalStorage = false
      }
    },
    async login() {
      this.loading = true
      this.error = null
      if (this.$refs.loginForm.validate()) {
        try {
          const { success } = await this.$store.dispatch(Actions.LOGIN, {
            username: this.username,
            password: this.password,
            tenantId
          })
          if (success) {
            this.$router.push('/lounge/dashboard')
          } else {
            this.error = 'Invalid Username/Password'
          }
        } catch (e) {
          this.loading = false
          this.error = e
        }
      }
      this.loading = false
    }
  },
  mounted() {
    this.checkLocalStorage()
  }
}
</script>
<style lang="stylus" scoped>
.login-card {
  background-color: transparent;
  position: absolute;
  padding 0!important
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 500px;
  box-shadow 14px 14px 10px -1px rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 1px 3px 0 rgba(0,0,0,0.12)
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    height: 130px;
    width: 228px;
    background-image: url('../assets/images/blue-grid.png');
    top: -50px;
    left: -60px;
    animation: bluemotion 12s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    z-index: -1;
    height: 130px;
    width: 228px;
    background-image: url('../assets/images/yellow-grid.png');
    bottom: -60px;
    right: -70px;
    animation: greenmotion 12s ease-in-out infinite;
  }

  .white {
    background-color: #ffffff;
  }
}

@keyframes bluemotion {
  0% {
    top: -50px;
  }

  50% {
    top: -70px;
  }

  100% {
    top: -50px;
  }
}

@keyframes greenmotion {
  0% {
    bottom: -60px;
  }

  50% {
    bottom: -80px;
  }

  100% {
    bottom: -60px;
  }
}
</style>
