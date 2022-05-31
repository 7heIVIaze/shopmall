<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card class="mx-auto">
        <v-container>
          <div class="text-center"><v-avatar size="200"><v-img :src="userInfo.userAvatar"></v-img></v-avatar></div>
          <v-list>

            <v-list-item>
              <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
              <v-list-item-content><v-list-item-title>{{ userInfo.userId }}</v-list-item-title></v-list-item-content>
              <v-list-item-action>
                <v-dialog v-model="userAvatarDialog" persistent max-width="600px">
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on"><v-icon>mdi-camera</v-icon></v-btn>
                  </template>
                  <v-container>
                    <v-card>
                      <v-card-title><span class="headline">프로필 사진 변경</span></v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col>
                            <v-file-input v-model="userAvatarInput" accept="image/*" label="프로필 사진 업로드" filled prepend-icon="mdi-camera"></v-file-input>
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-card-actions>
                        <div class="flex-grow-1"></div>
                        <v-btn color="blue darken-1" text @click="userAvatarDialogClose">취소</v-btn>
                        <v-btn color="blue darken-1" text @click="userAvatarSubmit(userAvatarInput)">변경</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-container>
                </v-dialog>
              </v-list-item-action>
            </v-list-item>
            <v-divider />

            <v-list-item>
              <v-list-item-icon><v-icon>mdi-lock</v-icon></v-list-item-icon>
              <v-list-item-content><v-list-item-title>비밀번호</v-list-item-title></v-list-item-content>
              <v-list-item-action>
                <v-dialog v-model="userPwdDialog" persistent max-width="600px">
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on"><v-icon>mdi-pencil</v-icon></v-btn>
                  </template>
                  <v-container>
                    <v-card>
                      <v-card-title><span class="headline">비밀번호 변경</span></v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col>
                            <v-text-field v-model="userPwdInput" label="변경할 비밀번호" outlined></v-text-field>
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-card-actions>
                        <div class="flex-grow-1"></div>
                        <v-btn color="blue darken-1" text @click="userPwdDialogClose">취소</v-btn>
                        <v-btn color="blue darken-1" text @click="userPwdSubmit(userPwdInput)">변경</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-container>
                </v-dialog>
              </v-list-item-action>
            </v-list-item>
            <v-divider />

            <v-list-item>
              <v-list-item-icon><v-icon>mdi-currency-krw</v-icon></v-list-item-icon>
              <v-list-item-content><v-list-item-title>{{ commaUserMoney(userInfo.userMoney) }}</v-list-item-title></v-list-item-content>
              <v-list-item-action>
                <v-dialog v-model="userMoneyDialog" persistent max-width="600px">
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on"><v-icon>mdi-pencil</v-icon></v-btn>
                  </template>
                  <v-container>
                    <v-card>
                      <v-card-title><span class="headline">돈 충전</span></v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col>
                            <v-text-field v-model="userMoneyInput" label="충전할 돈" outlined></v-text-field>
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-card-actions>
                        <div class="flex-grow-1"></div>
                        <v-btn color="blue darken-1" text @click="userMoneyDialogClose">취소</v-btn>
                        <v-btn color="blue darken-1" text @click="userMoneySubmit(userMoneyInput)">충전</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-container>
                </v-dialog>
              </v-list-item-action>
            </v-list-item>
            <v-divider />

            <v-list-item>
              <v-list-item-icon><v-icon>mdi-truck-delivery</v-icon></v-list-item-icon>
              <v-list-item-content><v-list-item-title>배송지 변경</v-list-item-title></v-list-item-content>
              <v-list-item-action>
                <v-dialog v-model="userAddressDialog" persistent max-width="600px">
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on"><v-icon>mdi-pencil</v-icon></v-btn>
                  </template>
                  <v-container>
                    <v-card>
                      <v-card-title><span class="headline">배송지 입력</span></v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col>
                            <v-text-field v-model="userName" label="수령인" outlined></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-text-field v-model="userNumber" label="전화번호(-없이 숫자만)" outlined></v-text-field>
                          </v-col>
                        </v-row>
                        <v-col>
                          <v-row>
                            <v-btn class="w-button3" color = "blue darken-1" text @click="openDaumPostcode">주소 검색</v-btn>
                            <div ref="wrap" style="display:none;border:1px solid;width:500px;height:300px;margin:5px 0;position:relative">
                              <img src="//t1.daumcdn.net/postcode/resource/images/close.png" id="btnFoldWrap" style="cursor:pointer;position:absolute;right:0px;top:-1px;z-index:1" @click="foldDaumPostcode" alt="접기 버튼">
                            </div>
                          </v-row>
                        </v-col>
                        <v-col>
                          <v-row>
                            <v-text-field v-model="zonecode" label="우편번호" outlined disabled></v-text-field>
                          </v-row>
                        </v-col>
                        <v-row>
                          <v-col>
                            <v-text-field v-model="RoadAddress" label="주소" outlined disabled></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-text-field v-model="detailAddress" label="상세주소" outlined></v-text-field>
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-card-actions>
                        <div class="flex-grow-1"></div>
                        <v-btn color="blue darken-1" text @click="userAddressDialogClose">취소</v-btn>
                        <v-btn color="blue darken-1" text @click="userAddressSubmit(userName, userNumber, zonecode, RoadAddress, detailAddress)">입력</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-container>
                </v-dialog>
              </v-list-item-action>
            </v-list-item>
            <v-divider />

            <v-list-item>
              <v-row justify="center">
                <v-dialog v-model="deleteAccountDialog" persistent max-width="600px">
                  <template v-slot:activator="{ on }">
                    <v-btn color="red lighten-2" v-on="on">회원탈퇴</v-btn>
                  </template>
                  <v-card>
                    <v-card-title><span class="headline">회원탈퇴</span></v-card-title>
                    <v-card-text>회원탈퇴 하시겠습니까?</v-card-text>
                    <v-divider />
                    <v-card-actions>
                      <div class="flex-grow-1"></div>
                      <v-btn color="blue darken-1" text @click="deleteAccountDialogClose">취소</v-btn>
                      <v-btn color="blue darken-1" text @click="deleteAccountSubmit">탈퇴</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-row>
            </v-list-item>
            <v-divider />

          </v-list>
        </v-container>
      </v-card>
      <v-fab-transition>
          <v-fab-transition-action>
            <v-dialog v-model="chgAdminDialog" persistent max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn bottom right fab fixed icon v-on="on"><v-icon>mdi-shield-account</v-icon></v-btn>
              </template>
              <v-container>
                <v-card>
                  <v-card-title><span class="headline">관리자 권한</span></v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col>
                        <v-text-field v-model="AdminNumberInput" type="password" label="관리자 인증 번호" outlined></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn color="blue darken-1" text @click="chgAdminDialogClose">취소</v-btn>
                    <v-btn color="blue darken-1" text @click="changeToAdmin(AdminNumberInput)">변경</v-btn>
                  </v-card-actions>
                </v-card>
              </v-container>
            </v-dialog>
          </v-fab-transition-action>
      </v-fab-transition>
    </v-flex>
  </v-layout>
</template>

<script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
<script>
import { mapMutations } from 'vuex'


export default {
  middleware: 'pageGuard',

  async asyncData ({ params, req, $axios, redirect }) {
    let { status } = await $axios.get('/api/user/session-administrator')
    if(status === 200) return redirect('/admin')
    let { data } = await $axios.get('/api/user/session-userinfo')
    return { userInfo: data }
  },

  data: () => ({
      userAvatarInput: null,  // File type
      userAvatarDialog: false,
      userPwdInput: null,
      userPwdDialog: false,
      userName: null,
      userNumber: null,
      zonecode: null,
      RoadAddress: null,
      detailAddress: null,
      userAddressDialog: false,
      userMoneyInput: null,
      userMoneyDialog: false,
      deleteAccountDialog: false,
      AdminNumberInput: null,
      chgAdminDialog: false,
    }
  ),

  methods: {
    async userAvatarSubmit(userAvatarInput){
      if(!userAvatarInput) alert('사진을 첨부해 주세요')
      else{
        let formData = new FormData()
        formData.append('userId', this.userInfo.userId)
        formData.append('userAvatar', userAvatarInput, userAvatarInput.name)

        let { status } = await this.$axios.put('/api/user/change-avatar', formData)
        if(status === 200) { this.userAvatarInput = null; this.userAvatarDialog = false; window.location.reload(true); }
        else { this.userAvatarInput = null; alert('프로필 이미지 변경 실패'); }
      }
    },
    userAvatarDialogClose(){
      this.userAvatarInput = null
      this.userAvatarDialog = false
    },

    async userPwdSubmit(userPwdInput){
      if(!userPwdInput) alert('비밀번호를 입력해 주세요')
      else{
        let { status } = await this.$axios.put('/api/user/change-password', { userIndex: this.userInfo.userIndex, userPwdInput: userPwdInput } )
        if(status === 200) { this.userPwdInput = null; this.userPwdDialog = false; window.location.reload(true); }
        else { this.userPwdInput = null; alert('비밀번호 변경 실패'); }
      }
    },
    userPwdDialogClose(){
      this.userPwdInput = null
      this.userPwdDialog = false
    },

    async userMoneySubmit(userMoneyInput){
      if(!userMoneyInput) alert('충전할 돈을 입력해 주세요')
      else{
        let { status } = await this.$axios.put('/api/user/add-money', { userIndex: this.userInfo.userIndex, userMoneyInput: userMoneyInput} )
        if(status === 200) { this.userMoneyInput = null; this.userMoneyDialog = false; window.location.reload(true); }
        else { this.userMoneyInput = null; alert('돈 충전 실패'); }
      }
    },
    userMoneyDialogClose(){
      this.userMoneyInput = null
      this.userMoneyDialog = false
    },

    commaUserMoney(money){
      money += ''
      money.replace(/,/gi, '')
      return Number(money).toLocaleString()
    },

    openDaumPostcode () {
      const elementWrap = this.$refs.wrap
      // 현재 scroll 위치를 저장해놓는다.
      const currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop)
      new window.daum.Postcode({
        oncomplete: (data) => {
            // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
 
            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            let addr = '' // 주소 변수
 
            // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress
            }
 
            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            // document.getElementById('address').value = addr
            this.RoadAddress = addr
            this.zonecode = data.zonecode
 
            // iframe을 넣은 element를 안보이게 한다.
            // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
            elementWrap.style.display = 'none'
 
            // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
            document.body.scrollTop = currentScroll
        },
        // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
        onresize: function (size) {
            elementWrap.style.height = size.height + 'px'
        },
        width: '100%',
        height: '100%'
      }).embed(elementWrap)
      elementWrap.style.display = 'block'
    },
    foldDaumPostcode () {
      const elementWrap = this.$refs.wrap
      elementWrap.style.display = 'none'
    },

    async userAddressSubmit(userName, userNumber, zonecode, RoadAddress, detailAddress){
      if(!userName) alert('수령인명을 입력해주세요')
      else if(!userNumber) alert('전화번호를 입력해주세요')
      else if(!zonecode) alert('주소를 입력해주세요')
      else if(!detailAddress) alert('상세주소를 입력해주세요')
      else{
        let { status } = await this.$axios.put('/api/user/add-address', { userIndex: this.userInfo.userIndex, userNameInput: userName, userNumberInput: userNumber, userZonecodeInput: zonecode, userRoadAddressInput: RoadAddress, userDetailAddressInput: detailAddress} )
        if(status === 200) { this.userName = null; this.userNumber = null; this.zonecode = null; this.RoadAddress = null; this.detailAddress = null; this.userAddressDialog = false; window.location.reload(true); }
        else { this.userName = null; this.userNumber = null; this.zonecode = null; this.RoadAddress = null; this.detailAddress = null; alert('주소 저장 실패'); }
      }
    },
    userAddressDialogClose() {
      this.userName = null
      this.userNumber = null
      this.zonecode = null
      this.RaodAddress = null
      this.detailAddress =  null
      this.userAddressDialog = false
    },

    ...mapMutations([
      'isLogin_to_False'
    ]),

    async deleteAccountSubmit(){
      let { status } = await this.$axios.delete('/api/user/delete-account')
      if(status === 200){
        this.deleteAccountDialog = false
        this.isLogin_to_False()
        window.location.reload(true)
      }
      else { alert('회원 탈퇴 실패 했습니다'); }
    },
    deleteAccountDialogClose(){
      this.deleteAccountDialog = false
    },

    async changeToAdmin(AdminNumberInput){
      let { status } = await this.$axios.put('/api/user/change-admin', {AdminNumberInput: AdminNumberInput})
      if(status === 200) {
        this.chgAdminDialog = false
        alert('관리자 계정으로 전환되었습니다')
        window.location.reload(true)
      }
      else {
        alert('잘못된 인증 번호입니다.')
      }
    },

    chgAdminDialogClose() {
      this.AdminNumberInput = null
      this.chgAdminDialog = false
    },
  }
}
</script>
