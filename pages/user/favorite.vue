<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card class="mx-auto">
        <v-list>
          <v-subheader>찜한 상품 목록</v-subheader>
          <template v-for="(listItem, index) in listItems">
            <v-list-item :key="listItem.productCode" @click="goDetail(listItem)">
              <v-list-item-avatar><v-img :src="listItem.productImgs[0]"></v-img></v-list-item-avatar>
              <v-list-item-content><v-list-item-title> {{ listItem.productTitle }} </v-list-item-title></v-list-item-content>
              <v-list-item-action><v-icon color="red">mdi-heart</v-icon></v-list-item-action>
            </v-list-item>
            <v-divider v-if="index + 1 < listItems.length" :key="index"></v-divider>
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
    let { status, data } = await $axios.get('/api/product/favorite-productinfo')
    if(status === 202) return { listItems: null }
    else{
      return { listItems: data }
    }
  },

  data: () => ({
  }),

  methods: {
    goDetail(listItem){
      this.$router.push({ path: `/product/detail/${listItem.productCode}` })
    },
  }
}
</script>
