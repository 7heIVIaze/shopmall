<template>
  <v-app dark>

    <v-app-bar app fixed>
      
      <v-btn to="/"><v-toolbar-title>딱맞아쇼핑몰</v-toolbar-title></v-btn>
      <v-spacer />
      <v-row style="max-width: 650px">
        <v-text-field v-model="searchInput" @keyup.enter="onSearchEnter(searchInput)" flat solo-inverted hide-details prepend-inner-icon="mdi-magnify" label="검색할 태그를 입력해주세요" class="hidden-sm-and-down" clearable>
        </v-text-field>
      </v-row>
      <v-spacer />
      <v-spacer />
      <v-btn v-if="isLogin" to="/user/favorite" class="ma-2" text icon><v-icon>mdi-heart</v-icon></v-btn>
      <v-btn v-if="isLogin" to="/user/cart" class="ma-2" text icon><v-icon>mdi-cart</v-icon></v-btn>
      <v-btn v-if="isLogin" to="/user/purchase/list" class="ma-2" text icon><v-icon>mdi-clipboard-text</v-icon></v-btn>
      <v-btn v-if="!isLogin" to="/user/login">로그인</v-btn>
      <v-btn v-if="isLogin" @click="logoutSubmit">로그아웃</v-btn>
      <v-btn v-if="isLogin" to="/user/mypage" class="ma-2" text icon><v-icon>mdi-account</v-icon></v-btn>
    </v-app-bar>
    
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  
  computed: {
    ...mapGetters([
      'isLogin',
    ])
  },

  data () {
    return {
      searchInput: '',
    }
  },

  methods: {
    ...mapMutations([
      'isLogin_to_False'
    ]),

    async logoutSubmit() {
      let { status } = await this.$axios.put('/api/user/logout')
      if(status === 200) { this.isLogin_to_False(); window.location.reload(true); }
      else alert('로그아웃 실패')
    },

    async onSearchEnter(searchInput){
      searchInput += ''
      let searchInputTrimmed = searchInput.trim()
      if(searchInputTrimmed){
        this.searchInput = ''
        let urlEncoded = encodeURI(encodeURIComponent(searchInputTrimmed))
        this.$router.push({ path: '/product/search', query: { search: urlEncoded } })
      }
    },
    
  }
}
</script>
