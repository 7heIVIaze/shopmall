<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col>
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>로그인</v-toolbar-title>
                <div class="flex-grow-1"></div>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field v-model="loginForm.userId" label="ID" prepend-icon="mdi-account" type="text"></v-text-field>
                  <v-text-field v-model="loginForm.userPwd" label="Password" prepend-icon="mdi-lock" type="password" id="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" text to="/user/signup">회원가입</v-btn>
                <div class="flex-grow-1"></div>
                <v-btn color="primary" @click="loginSubmit">로그인</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  middleware: 'pageGuard',

  data () {
    return {
      loginForm: {
        userId: '',
        userPwd: '',
      },
    }
  },

  methods: {
    ...mapMutations([
      'isLogin_to_True'
    ]),

    async loginSubmit() {
      if(!this.loginForm.userId || !this.loginForm.userPwd) alert('양식을 완료해주세요')
      else{
        let { status } = await this.$axios.post('/api/user/login', this.loginForm)
        if(status === 200) { this.isLogin_to_True(); this.$router.replace({ path: '/' }); }
        else alert('로그인 실패 아이디 또는 비밀번호를 확인하세요')
      }
    },
  },
}
</script>
