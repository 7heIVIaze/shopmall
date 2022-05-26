<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card class="mx-auto">
        <v-list>
          <v-subheader>구매 내역</v-subheader>
          <template v-for="(listItem, index) in listItems">
            <v-list-item :key="index" @click="goDetail(listItem.productCode)">
              <v-list-item-avatar><v-img :src="listItem.productImgs[0]"></v-img></v-list-item-avatar>
              <v-list-item-content><v-list-item-title> {{ listItem.productTitle }} </v-list-item-title></v-list-item-content>
              <v-list-item-action>{{ buyQuantityShow(listItem.productCode) }}</v-list-item-action>
              <v-list-item-action>{{ buyDateShow(listItem.productCode) }}</v-list-item-action>
            </v-list-item>
            <v-divider v-if="index + 1 < listItems.length" :key="'A'+index"></v-divider>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  middleware: 'pageGuard',

  async asyncData ({ params, req, $axios }) {
    let { status, data } = await $axios.get('/api/product/purchase-productinfo')
    if(status === 202) return { listItems: null }
    else{
      return { listItems: data.reverse() }
    }
  },
  
  data: () => ({
  }),

  methods: {
    goDetail(code){
      let productCode = code.substring(0, code.indexOf('_'))
      this.$router.push({ path: `/product/detail/${productCode}` });
    },
    buyDateShow(productCode){
      let date = productCode.substring(productCode.lastIndexOf('_')+1)
      return date
    },
    buyQuantityShow(productCode){
      let strQuantity = `${productCode.substring(productCode.indexOf('_')+1, productCode.lastIndexOf('_'))}개`
      return strQuantity
    }
  }
}
</script>