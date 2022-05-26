<template>
  <v-layout column justify-center>
    <v-flex xs12 sm8 md6>
      <v-flex>
        <v-carousel show-arrows-on-hover>
          <v-carousel-item v-for="(carouselItem,i) in carouselItems" :key="i" :src="carouselItem.productImgs[0]" :to="{ path: `/product/detail/${carouselItem.productCode}` }" reverse-transition="fade-transition" transition="fade-transition">
            <v-row class="fill-height" align="end" justify="center">
              <div class="white--text">{{carouselItem.productTitle}}</div>
            </v-row>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
      
      <v-flex>
        <v-row>
          <v-col v-for="card in cards" :key="card.productCode" cols="3">
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
      
      <v-flex align-self-center>
        <v-row>
          <v-pagination v-if="cards && cards.length !== 0" v-model="currentPage" :length="totalPage"></v-pagination>
        </v-row>
      </v-flex>
      
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  async asyncData({ store, $axios }){
    // Carousel 상품
    let carouselR = await $axios.get('/api/product/carousels')

    // 상품
    if(store.state.isLogin){
      let r1 = await $axios.get('/api/user/session-userinfo')
      let userFavorites = r1.data.userFavorites
      let userCarts = r1.data.userCarts
      let r2 = await $axios.get('/api/product/pagination')
      let pageProducts = r2.data.pageProducts

      for(let i of pageProducts){
        if(userFavorites || userFavorites.length !== 0) for(let j of userFavorites) if(i.productCode === j) i.productHeartColor = 'red'
        if(userCarts || userCarts.length !== 0) for(let k of userCarts) if(i.productCode === k) i.productCartColor = 'red'
      }

      return { cards: pageProducts, totalPage: r2.data.totalPage, carouselItems: carouselR.data }
    }
    else{
      let { data } = await $axios.get('/api/product/pagination')
      return { cards: data.pageProducts, totalPage: data.totalPage, carouselItems: carouselR.data }
    }
  },

  data: () => ({
    currentPage: 1,
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

  watch: {
    currentPage: async function(currentPage){
      if(this.isLogin){
        let { data } = await this.$axios.get(`/api/product/pagination?page=${currentPage}`)
        let pageProducts = data.pageProducts
        let r1 = await this.$axios.get('/api/user/session-userinfo')
        let userFavorites = r1.data.userFavorites
        let userCarts = r1.data.userCarts

        for(let i of pageProducts){
          if(userFavorites || userFavorites.length !== 0) for(let j of userFavorites) if(i.productCode === j) i.productHeartColor = 'red'
          if(userCarts || userCarts.length !== 0) for(let k of userCarts) if(i.productCode === k) i.productCartColor = 'red'
        }
        
        this.cards = pageProducts
      }
      else{
        let { data } = await this.$axios.get(`/api/product/pagination?page=${currentPage}`)
        this.cards = data.pageProducts
        this.totalPage = data.totalPage
      }
    }
  },
}
</script>
