<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col>
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>회원가입</v-toolbar-title>
                <div class="flex-grow-1"></div>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field v-model="signupForm.userId" :readonly="readOnly" label="ID" prepend-icon="mdi-account" type="text">
                    <template v-slot:append-outer>
                      <v-btn :disabled="dupCheck" @click="userIdDupCheck(signupForm.userId)">{{dubCheckTitle}}</v-btn>
                    </template>
                  </v-text-field>
                  <v-text-field v-model="signupForm.userPwd" label="Password" prepend-icon="mdi-lock" type="password" id="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="primary" @click="signupSubmit">확인</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  middleware: 'pageGuard',

  data () {
    return {
      signupForm: {
        userId: '',
        userPwd: '',
      },
      dupCheck: false,
      dubCheckTitle: '중복체크',
      readOnly: false,
    }
  },

  methods: {
    async userIdDupCheck(userId) {
      if(!userId) alert('아이디를 입력해주세요')
      else{
        let { status } = await this.$axios.get(`/api/user/dupcheck?userId=${userId}`)
        if(status === 200){ this.dubCheckTitle = '확인완료'; this.readOnly = true; this.dupCheck = true; }
        else alert('다른 아이디를 입력해주세요')
      }
    },

    async signupSubmit() {
      if(!this.dupCheck || !this.signupForm.userId || !this.signupForm.userPwd) alert('양식을 완료해주세요')
      else{
        let { status } = await this.$axios.post('/api/user/signup', this.signupForm)
        if(status === 200) { alert('회원가입 성공'); this.$router.replace({ path: '/user/login' }); }
        else alert('회원가입 실패')
      }
    },
  },
}
</script>
