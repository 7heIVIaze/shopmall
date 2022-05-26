<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>

        <v-tabs v-model="tab" centered slider-color="white" background-color="transparent" center-active show-arrows>
          <v-tab v-for="tabItem in tabItems" :key="tabItem">
            {{ tabItem }}
          </v-tab>
        </v-tabs>
        
        <v-tabs-items v-model="tab">
          <!-- 상품 추가 -->
          <v-tab-item>
            <v-container>
              <v-card flat>
                <v-container fluid>
                  <v-row>
                    <v-col v-for="(dataURI, index) in imgDataURIs" :key="index" class="d-flex child-flex" cols=4>
                      <v-card flat tile class="d-flex">
                        <v-img :src="dataURI" aspect-ratio="1" class="grey lighten-2"></v-img>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
              <v-card flat>
                <v-file-input v-model="imgFiles" accept="image/*" label="이미지 업로드" multiple filled prepend-icon="mdi-camera"></v-file-input>
                <v-text-field v-model="productAddForm.productTitle" label="상품 제목" outlined clearable :rules="[rules.required]"></v-text-field>
                <v-textarea   v-model="productAddForm.productDescription" label="상품 설명" outlined clearable :rules="[rules.required]"></v-textarea>
                <v-text-field v-model="productAddForm.productPrice" label="상품 가격" outlined clearable :rules="[rules.required]"></v-text-field>
                <v-text-field v-model="productAddForm.productCode" label="상품 번호" outlined clearable :rules="[rules.required]"></v-text-field>
                <v-text-field v-model="productAddForm.productQuantity" label="상품 수량" outlined clearable :rules="[rules.required]"></v-text-field>
                <v-text-field v-model="tagStr" label="상품 해시태그" outlined clearable :rules="[rules.required]">
                  <template v-slot:append><v-tooltip bottom><template v-slot:activator="{ on }"><v-icon v-on="on">mdi-help-circle-outline</v-icon></template>태그들은 띄어쓰기로 구분하세요.</v-tooltip></template>
                </v-text-field>
                <v-btn block @click="addSubmit">추가</v-btn>
              </v-card>
            </v-container>
          </v-tab-item>

          <!-- 상품 삭제 -->
          <v-tab-item>
            <v-container>
              <p></p>
              <v-card flat>
                <v-text-field v-model="productRemoveForm.removeCode" label="상품 번호" outlined clearable></v-text-field>
                <v-btn block @click="removeSubmit">삭제</v-btn>
              </v-card>
            </v-container>
          </v-tab-item>

          <!-- 상품 수정 -->
          <v-tab-item>
            <v-container>
              <p></p>
              <v-card flat>
                <v-text-field v-model="reviseProductCode" label="상품 번호" outlined clearable></v-text-field>
                <v-radio-group v-model="radioGroup" row>
                  <v-radio color="white" label="이미지 재등록" value="radio-image"></v-radio>
                  <v-radio color="white" label="상품 제목 수정" value="radio-title"></v-radio>
                  <v-radio color="white" label="상품 설명 수정" value="radio-description"></v-radio>
                  <v-radio color="white" label="상품 가격 수정" value="radio-price"></v-radio>
                  <v-radio color="white" label="상품 수량 수정" value="radio-quantity"></v-radio>
                  <v-radio color="white" label="상품 해시태그 수정" value="radio-hashtag"></v-radio>
                </v-radio-group>
                <v-file-input v-if="radioGroup==='radio-image'"       v-model="reviseImgFiles"           accept="image/*" label="이미지 업로드" multiple filled prepend-icon="mdi-camera"></v-file-input>
                <v-text-field v-if="radioGroup==='radio-title'"       v-model="reviseProductTitle"       label="상품 제목" outlined clearable></v-text-field>
                <v-textarea   v-if="radioGroup==='radio-description'" v-model="reviseProductDescription" label="상품 설명" outlined clearable></v-textarea>
                <v-text-field v-if="radioGroup==='radio-price'"       v-model="reviseProductPrice"       label="상품 가격" outlined clearable></v-text-field>
                <v-text-field v-if="radioGroup==='radio-quantity'"    v-model="reviseProductQuantity"    label="상품 수량" outlined clearable></v-text-field>
                <v-text-field v-if="radioGroup==='radio-hashtag'"     v-model="reviseProductHashTag"     label="상품 해시태그" outlined clearable><template v-slot:append><v-tooltip bottom><template v-slot:activator="{ on }"><v-icon v-on="on">mdi-help-circle-outline</v-icon></template>태그들은 띄어쓰기로 구분하세요.</v-tooltip></template></v-text-field>
                <v-btn block @click="reviseSubmit">수정</v-btn>
              </v-card>
            </v-container>
          </v-tab-item>

          <!-- Carousel 상품 추가 -->
          <v-tab-item>
            <v-container>
              <p></p>
              <v-card flat>
                <v-text-field v-model="carouselAddCode" label="상품 번호" outlined clearable></v-text-field>
                <v-btn block @click="carouselAddSubmit">추가</v-btn>
              </v-card>
            </v-container>
          </v-tab-item>

          <!-- Carousel 상품 삭제 -->
          <v-tab-item>
            <v-container>
              <p></p>
              <v-card flat>
                <v-text-field v-model="carouselRemoveCode" label="상품 번호" outlined clearable></v-text-field>
                <v-btn block @click="carouselRemoveSubmit">삭제</v-btn>
              </v-card>
            </v-container>
          </v-tab-item>
        </v-tabs-items>

      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  middleware: 'pageGuard',

  async asyncData ({ params, req, $axios, redirect }) {
    let { status } = await $axios.get('/api/user/session-administrator')
    if(status === 202) return redirect('/')
  },

  data: () => ({
    tab: null,
    tabItems: [ '상품 추가', '상품 삭제', '상품 수정', '추천 상품 추가', '추천 상품 삭제' ],
    imgFiles: [],  // File type
    imgDataURIs: [],
    productAddForm: {
      productTitle: '',
      productDescription: '',
      productPrice: '',
      productCode: '',
      productQuantity: '',
      productHashTag: null,
    },
    tagStr: '',
    rules: { required: value => !!value || 'Required.', },
    productRemoveForm: {
      removeCode: '',
    },
    carouselAddCode: '',
    carouselRemoveCode: '',
    radioGroup: null,
    reviseProductCode: '',
    reviseImgFiles: [],
    reviseProductTitle: '',
    reviseProductDescription: '',
    reviseProductPrice: '',
    reviseProductQuantity: '',
    reviseProductHashTag: null,
  }),

  watch: {
    imgFiles: function (val) {
      this.imgDataURIs.splice(0, this.imgDataURIs.length)
      for(let i of val){
        const reader = new FileReader()
        reader.readAsDataURL(i)
        reader.addEventListener('load', () => {
          this.imgDataURIs.push(reader.result)
        })
      }
    },
  },

  methods: {
    requiredCheck () {
      if(this.imgFiles.length === 0 || !this.productAddForm.productTitle || !this.productAddForm.productDescription || !this.productAddForm.productPrice || !this.productAddForm.productCode || !this.productAddForm.productQuantity || !this.tagStr || !this.productAddForm.productTitle.trim() || !this.productAddForm.productDescription.trim() || !this.productAddForm.productPrice.trim() || !this.productAddForm.productCode.trim() || !this.productAddForm.productQuantity.trim() || !this.tagStr.trim()) return false
      else{
        let tagArray = this.tagStr.split(' ')
        this.productAddForm.productHashTag = tagArray.filter(item => item !== (''&&null&&' '))
        return true
      }
    },

    async addSubmit(){
      if(this.requiredCheck()){
        let formData = new FormData()
        formData.append('productAddForm', JSON.stringify(this.productAddForm))
        for(let file of this.imgFiles) formData.append('files', file, file.name)
        
        let { status } = await this.$axios.post('/api/product/add', formData)
        if(status === 200) { alert('상품 등록 성공'); window.location.reload(true); }
        else { alert('상품 등록 실패'); window.location.reload(true); }
      }
      else alert('양식을 완료해주세요')
    },
    
    async removeSubmit(){
      if(!this.productRemoveForm.removeCode || !this.productRemoveForm.removeCode.trim()) alert('양식을 완료해주세요')
      else{
        let { status } = await this.$axios.put('/api/product/delete', this.productRemoveForm)
        if(status === 200) { alert('상품 삭제 성공'); window.location.reload(true); }
        else { alert('상품 삭제 실패'); window.location.reload(true); }
      }
    },

    async reviseSubmit(){
      switch(this.radioGroup){
        case 'radio-image': {
          if(this.reviseImgFiles.length === 0 || !this.reviseProductCode || !this.reviseProductCode.trim()) { alert('양식을 완료해주세요'); break;}
          this.reviseProductCode = this.reviseProductCode.trim()
          let formData = new FormData()
          let productAddForm = { productCode: this.reviseProductCode }
          formData.append('productAddForm', JSON.stringify(productAddForm))
          for(let file of this.reviseImgFiles) formData.append('files', file, file.name)
          let { status } = await this.$axios.put('/api/product/image', formData)
          if(status === 200) { alert('이미지 재등록 성공'); break;}
          else { alert('이미지 재등록 실패'); break; }
          break;
        }
          
        case 'radio-title': {
          if(!this.reviseProductTitle || !this.reviseProductCode || !this.reviseProductTitle.trim() || !this.reviseProductCode.trim()) { alert('양식을 완료해주세요'); break;}
          this.reviseProductCode = this.reviseProductCode.trim()
          this.reviseProductTitle = this.reviseProductTitle.trim()
          let { status } = await this.$axios.put('/api/product/title', {productCode: this.reviseProductCode, productTitle: this.reviseProductTitle})
          if(status === 200) { alert('상품 타이틀 수정 성공'); break;}
          else { alert('상품 타이틀 수정 실패'); break;}
          break;
        }

        case 'radio-description': {
          if(!this.reviseProductCode || !this.reviseProductCode.trim() || !this.reviseProductDescription || !this.reviseProductDescription.trim()) { alert('양식을 완료해주세요'); break;}
          this.reviseProductCode = this.reviseProductCode.trim()
          this.reviseProductDescription = this.reviseProductDescription.trim()
          let { status } = await this.$axios.put('/api/product/description', {productCode: this.reviseProductCode, productDescription: this.reviseProductDescription})
          if(status === 200) { alert('상품 설명 수정 성공'); break;}
          else { alert('상품 설명 수정 실패'); break;}
          break;
        }

        case 'radio-price': {
          if(!this.reviseProductCode || !this.reviseProductCode.trim() || !this.reviseProductPrice || !this.reviseProductPrice.trim()) { alert('양식을 완료해주세요'); break;}
          this.reviseProductCode = this.reviseProductCode.trim()
          this.reviseProductPrice = this.reviseProductPrice.trim()
          let { status } = await this.$axios.put('/api/product/price', {productCode: this.reviseProductCode, productPrice: this.reviseProductPrice})
          if(status === 200) { alert('상품 가격 수정 성공'); break;}
          else { alert('상품 가격 수정 실패'); break;}
          break;
        }

        case 'radio-quantity': {
          if(!this.reviseProductCode || !this.reviseProductCode.trim() || !this.reviseProductQuantity || !this.reviseProductQuantity.trim()) { alert('양식을 완료해주세요'); break;}
          this.reviseProductCode = this.reviseProductCode.trim()
          this.reviseProductQuantity = this.reviseProductQuantity.trim()
          let { status } = await this.$axios.put('/api/product/quantity', {productCode: this.reviseProductCode, productQuantity: this.reviseProductQuantity})
          if(status === 200) { alert('상품 수량 수정 성공'); break;}
          else { alert('상품 수량 수정 실패'); break;}
          break;
        }

        case 'radio-hashtag': {
          if(!this.reviseProductCode || !this.reviseProductCode.trim() || !this.reviseProductHashTag || !this.reviseProductHashTag.trim()) { alert('양식을 완료해주세요'); break;}
          this.reviseProductCode = this.reviseProductCode.trim()
          this.reviseProductHashTag = this.reviseProductHashTag.trim()
          let tagArray = this.reviseProductHashTag.split(' ')
          this.reviseProductHashTag = tagArray.filter(item => item !== (''&&null&&' '))
          let { status } = await this.$axios.put('/api/product/hashtag', {productCode: this.reviseProductCode, productHashTag: this.reviseProductHashTag})
          if(status === 200) { alert('상품 해시태그 수정 성공'); break;}
          else { alert('상품 해시태그 수정 실패'); break;}
          break;
        }
      }
    },

    async carouselAddSubmit(){
      let { status } = await this.$axios.post('/api/product/add-carousel', { productCode: this.carouselAddCode })
      if(status === 200) { alert('추천 상품 등록 성공'); window.location.reload(true); }
      else { alert('코드 재확인 해주세요') }
    },
    async carouselRemoveSubmit(){
      let { status } = await this.$axios.put('/api/product/delete-carousel', { productCode: this.carouselRemoveCode })
      if(status === 200) { alert('추천 상품 삭제 성공'); window.location.reload(true); }
      else { alert('코드 재확인 해주세요') }
    },
  },
}
</script>
