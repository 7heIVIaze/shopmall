<template>
  <v-layout column justify-center>
    <v-flex xs12 sm8 md6>

      <v-flex>
        <v-layout row>
          <v-row>

            <v-col>
              <v-carousel show-arrows-on-hover>
                <v-carousel-item v-for="(carouselItem,i) in productDetail.productImgs" :key="i" :src="carouselItem" reverse-transition="fade-transition" transition="fade-transition"></v-carousel-item>
              </v-carousel>
            </v-col>


            <v-col>
              <v-card>
                <v-card-title>{{ productDetail.productTitle }}</v-card-title>
                <v-card-text>
                  <div><span class="title">{{ productDetail.productPrice }}</span><span>원</span><span style="float:right;">남은 수량 {{productDetail.productQuantity}} </span></div>
                  <div class="body-1"><pre>{{ productDetail.productDescription }}</pre> </div>
                </v-card-text>
                <v-text-field v-model="quantity" class="mx-4" label="수량" max="50" min="1" step="1" style="width: 125px" type="number"></v-text-field>
                <v-text-field v-model="waistsize" class="mx-4" label="허리 사이즈" max="50" min="1" step="1" style="width: 125px" type="number"></v-text-field>
                <v-text-field v-model="leglength" class="mx-4" label="바지 기장" max="50" min="1" step="1" style="width: 125px" type="number"></v-text-field>
                <v-card-actions>
                  <v-chip v-for="tag in productDetail.productHashTag" :key="tag" class="ma-2" color="purple" text-color="white">
                    <v-avatar left><v-icon>mdi-music-accidental-sharp</v-icon></v-avatar>
                    {{ tag }}
                  </v-chip>
                </v-card-actions>
                <v-card-actions>
                  <v-spacer />
                  <v-btn :color="productDetail.productHeartColor" @click.prevent="heartClicked()" icon><v-icon>mdi-heart</v-icon></v-btn>
                  <v-btn :color="productDetail.productCartColor" @click.prevent="cartClicked()" icon><v-icon>mdi-cart</v-icon></v-btn>
                  <v-btn @click="buySubmit" rounded>구매하기</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

          </v-row>
        </v-layout>
      </v-flex>


      <v-flex>
        <v-row>
          <v-col>
            <v-card v-if="isLogin">
              <v-container>
                <span><v-text-field v-model="commentStr" label="상품의견" prepend-icon="mdi-comment" append-outer-icon="mdi-send" @click:append-outer="commentSubmit" clearable></v-text-field></span>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card class="mx-auto" v-if="productComment && productComment.length !== 0">
              <v-list three-line>
                <v-subheader>상품의견</v-subheader>
                <v-divider />
                <template v-for="(commentItem, index) in productComment">
                  <v-list-item :key="'A' + index">
                    <v-list-item-avatar><v-img :src="commentItem.commentAvatar"></v-img></v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-subtitle>{{ commentItem.commentUserId }} <span style="float:right;">{{ commentItem.commentDate }}</span></v-list-item-subtitle>
                      <v-list-item-title><pre>{{ commentItem.commentContent }}</pre></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider v-if="index + 1 < productComment.length" :key="index"></v-divider>
                </template>
              </v-list>
            </v-card>
            <v-card class="mx-auto" v-if="!isLogin && (!productComment || productComment.length === 0)">
              <v-container class="text-center">
                로그인 후 상품 의견을 남겨주세요
              </v-container>
            </v-card>
            <v-card class="mx-auto" v-if="isLogin && (!productComment || productComment.length === 0)">
              <v-container class="text-center">
                상품 의견을 남겨주세요
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-flex>


    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  async asyncData({ params, store, $axios }){
    let { data } = await $axios.get(`/api/product/detail/${params.detail}`)
    let comments = await $axios.get(`/api/comment/list/${params.detail}`)  // 댓글이 없을 경우 comments.data = []
    if(comments.data && comments.data.length !== 0) comments.data.productComment = comments.data.reverse()
    return { productDetail: data, productComment: comments.data }
  },

  computed: {
    ...mapGetters([
      'isLogin',
    ]),
  },

  data: () => ({
    quantity: 1,
    waistsize: '',
    leglength: '',
    commentStr: '',
  }),

  methods: {
    async heartClicked(){
      if(this.isLogin){
        if(this.productDetail.productHeartColor === 'white'){
          let { status } = await this.$axios.post('/api/user/add-favorites', { productCode: this.productDetail.productCode })
          if(status === 200) this.productDetail.productHeartColor = 'red'
        }
        else{
          let { status } = await this.$axios.put('/api/user/delete-favorites', { productCode: this.productDetail.productCode })
          if(status === 200) this.productDetail.productHeartColor = 'white'
        }
      }
      else alert('로그인을 해주세요')
    },
    async cartClicked(){
      if(this.isLogin){
        if(this.productDetail.productCartColor === 'white'){
          let { status } = await this.$axios.post('/api/user/add-carts', { productCode: this.productDetail.productCode })
          if(status === 200) this.productDetail.productCartColor = 'red'
        }
        else{
          let { status } = await this.$axios.put('/api/user/delete-carts', { productCode: this.productDetail.productCode })
          if(status === 200) this.productDetail.productCartColor = 'white'
        }
      }
      else alert('로그인을 해주세요')
    },

    async buySubmit(){
      if(this.isLogin){
        let date = new Date()
        let buyDate = await this.dateForm(date)
        let { status } = await this.$axios.post('/api/user/buy', { productCode: `${this.productDetail.productCode}_${this.quantity}_${buyDate}`, productPrice: this.productDetail.productPrice, buyQuantity: this.quantity })
        if(status === 200) {this.quantity = 1; alert('구입 완료'); }
        else if(status === 202) alert('돈이 부족합니다')
        else if(status === 203) alert('재고가 부족합니다')
      }
      else{
        alert('로그인 해주세요')
      }
    },
    async dateForm(date){
      let yyyy = date.getFullYear().toString()
      let mm = (date.getMonth() + 1).toString()
      let dd = date.getDate().toString()
      return yyyy + '.' + (mm[1] ? mm : '0'+mm[0]) + '.' + (dd[1] ? dd : '0'+dd[0])
    },
    async dateWithTime(date){
      let yyyy = date.getFullYear().toString()
      let mm = (date.getMonth() + 1).toString()
      let dd = date.getDate().toString()
      let hours = date.getHours().toString()
      let minutes = date.getMinutes().toString()
      let seconds = date.getSeconds().toString()
      return yyyy + '.' + (mm[1] ? mm : '0'+mm[0]) + '.' + (dd[1] ? dd : '0'+dd[0]) + ` ${hours}:${minutes}:${seconds}`
    },

    async commentSubmit(){
      let commentStrTrimmed = this.commentStr.trim()
      if(!commentStrTrimmed || commentStrTrimmed.length === 0) alert('상품의견을 적어주세요')
      else{
        let date = new Date()
        let commentDate = await this.dateWithTime(date)
        let { status } = await this.$axios.post('/api/comment/add', { productCode: this.productDetail.productCode, commentDate: commentDate, commentStr: this.commentStr })
        if(status === 200) window.location.reload(true)
        else alert('상품의견 등록 실패')
      }
    },
  }

}
</script>