<template>
  <v-layout align-center>

    <v-flex xs12 sm8 md6>
      <v-row>
        <v-col v-for="card in cards" :key="card.productCode" cols="6">
          <v-card hover :to="{ path: `/product/detail/${card.productCode}` }">
            <v-img :src="card.productImgs[0]" class="white--text" height="200px" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"></v-img>
            <v-card-title class="fill-height align-end">{{ card.productTitle }}</v-card-title>
            <v-card-actions>
              <v-container class="title"> <span>{{ card.productPrice }}</span><span class="subtitle-2">{{ ' 원' }}</span></v-container>
              <div class="flex-grow-1"></div>
              <v-btn :color="card.productHeartColor" @click.prevent="heartClicked(card)" icon><v-icon>mdi-heart</v-icon></v-btn>
              <v-btn :color="card.productCartColor" @click.prevent="cartClicked(card)" icon><v-icon>mdi-cart</v-icon></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-flex>
    
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  watchQuery: true,
  async asyncData ({ store, params, query, $axios }) {
    if(store.state.isLogin){
      let r1 = await $axios.get('/api/user/session-userinfo')
      let userFavorites = r1.data.userFavorites
      let userCarts = r1.data.userCarts

      const searchInput = query.search
      const queryString = searchInput ? `?search=${searchInput}` : ''
      let r2 = await $axios.get(`/api/product/search${queryString}`)
      let searchedProducts = r2.data
      let status = r2.status

      if(status === 202) return { cards: [] }  // 검색된 것이 없음
      else{                                    // 검색됨
        for(let i of searchedProducts){
          if(userFavorites || userFavorites.length !== 0) for(let j of userFavorites) if(i.productCode === j) i.productHeartColor = 'red'
          if(userCarts || userCarts.length !== 0) for(let k of userCarts) if(i.productCode === k) i.productCartColor = 'red'
        }
        return { cards: searchedProducts }
      }
    }

    else{
      const searchInput = query.search  // query = {search: val}
      const queryString = searchInput ? `?search=${searchInput}` : ''
      let { status, data } = await $axios.get(`/api/product/search${queryString}`)
      if(status === 202) return { cards: [] }  // 검색된 것이 없음
      else return { cards: data }  // 검색됨
    }
  },

  data: () => ({
  }),

  computed: {
    ...mapGetters([
      'isLogin',
    ]),
  },

  methods: {
    async heartClicked(card){
      if(this.isLogin){
        if(card.productHeartColor === 'white'){
          let { status } = await this.$axios.post('/api/user/add-favorites', { productCode: card.productCode })
          if(status === 200) card.productHeartColor = 'red'
        }
        else{
          let { status } = await this.$axios.put('/api/user/delete-favorites', { productCode: card.productCode })
          if(status === 200) card.productHeartColor = 'white'
        }
      }
      else alert('로그인을 해주세요')
    },
    async cartClicked(card){
      if(this.isLogin){
        if(card.productCartColor === 'white'){
          let { status } = await this.$axios.post('/api/user/add-carts', { productCode: card.productCode })
          if(status === 200) card.productCartColor = 'red'
        }
        else{
          let { status } = await this.$axios.put('/api/user/delete-carts', { productCode: card.productCode })
          if(status === 200) card.productCartColor = 'white'
        }
      }
      else alert('로그인을 해주세요')
    },
  },

}
</script>