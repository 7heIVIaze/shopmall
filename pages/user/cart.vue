<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card class="mx-auto">
        <v-list>
          <v-subheader>장바구니 목록</v-subheader>
          <template v-for="(listItem, index) in listItems">
            <v-list-item :key="listItem.productCode" @click="goDetail(listItem)">
              <v-list-item-avatar><v-img :src="listItem.productImgs[0]"></v-img></v-list-item-avatar>
              <v-list-item-content><v-list-item-title> {{ listItem.productTitle }} </v-list-item-title></v-list-item-content>
              <v-list-item-action>{{ commaUserMoney(listItem.productPrice) }}{{String.fromCodePoint(0x20A9)}}</v-list-item-action>
            </v-list-item>
            <v-divider v-if="index + 1 < listItems.length" :key="index"></v-divider>
          </template>
        </v-list>
        <v-divider v-if="listItems" />
        <v-card-actions v-if="listItems">
          <div class="flex-grow-1"></div>
          합계: {{ commaUserMoney(sum) }}
        </v-card-actions>
      </v-card>
      <p></p>
      <v-layout justify-center align-center v-if="listItems">
        <v-btn @click="allBuy">모두 구입하기</v-btn>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  middleware: 'pageGuard',

  async asyncData ({ params, req, $axios }) {
    let { status, data } = await $axios.get('/api/product/cart-productinfo')
    if(status === 202) return { listItems: null }
    else{
      let sum = 0
      for(let i of data) sum += i.productPrice
      return { listItems: data, sum: sum }
    }
  },

  data: () => ({
  }),

  methods: {
    goDetail(listItem){
      this.$router.push({ path: `/product/detail/${listItem.productCode}` })
    },
    commaUserMoney(money){
      money += ''
      money.replace(/,/gi, '')
      return Number(money).toLocaleString()
    },
    async allBuy(){
      let date = new Date()
      let buyDate = await this.dateForm(date)
      let productCodeList = []
      for(let i of this.listItems) productCodeList.push(`${i.productCode}_1_${buyDate}`)
      let { status } = await this.$axios.post('/api/user/allbuy', { productCodeList: productCodeList, sum: this.sum })
      if(status===200) { alert('모두 구입 완료'); window.location.reload(true); }
      else if(status===202) alert('돈이 부족합니다')
      else if(status===203) alert('재고가 부족한 제품이 있습니다')
    },
    async dateForm(date){
      let yyyy = date.getFullYear().toString()
      let mm = (date.getMonth() + 1).toString()
      let dd = date.getDate().toString()
      return yyyy + '.' + (mm[1] ? mm : '0'+mm[0]) + '.' + (dd[1] ? dd : '0'+dd[0])
    },
  }
}
</script>
