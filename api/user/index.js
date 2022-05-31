const router = require('express').Router()
const userFunctions = require('./userFunctions')
const passport = require('passport')
const userUpload = require('./userMulter')

// 회원가입
router.get('/dupcheck', (req, res, next) => {
  const userId = req.query.userId
  userFunctions.userIdDuplicationCheck(userId, res)
})

router.post('/signup', (req, res, next) => {
  const { userId, userPwd } = req.body
  userFunctions.addUser_DB(userId, userPwd, res)
})

// 로그인
router.post('/login',passport.authenticate('local', {
  successRedirect: '/api/user/login/success',
  failureRedirect: '/api/user/login/fail'
}))

router.get('/login/success', (req, res, next) => {
  console.log(req.session)
  res.sendStatus(200)
})

router.get('/login/fail', (req, res, next) => {
  res.sendStatus(204)
})

// 로그아웃
router.put('/logout', (req, res, next) => {
  req.logout()  // 세션 삭제. 이후 req.user는 null이 된다.
  req.session.save((err) => {
    if(err) throw err
  })
  res.sendStatus(200)
})

// 세션 체크
router.get('/session-check', (req, res, next) => {
  console.log('/session-check: ', req.user)
  if(req.user) res.sendStatus(200)  // 로그인되어 있을 경우.
  else res.sendStatus(202)
})

// 유저 세션 정보
router.get('/session-userinfo', async (req, res, next) => {
  if(req.user){
    let userInfo = {
      userIndex: req.user._id,
      userAvatar: await userFunctions.getUserAvatarDataURI(req.user.userAvatar),
      userId: req.user.userId,
      userMoney: req.user.userMoney,
      userFavorites: req.user.userFavorites,
      userCarts: req.user.userCarts,
    }
    res.status(200).json(userInfo)  // 세션이 존재하면, 해당 세션의 유저 정보를 보내줌.
  }
  else res.sendStatus(202)  // 세션이 존재하지 않음. 비로그인 상태.
})

// 관리자 세션 체크
router.get('/session-administrator', async(req, res, next) => {
  console.log('/session-administrator: ', req.user)
  if(req.user.administrator) res.sendStatus(200)
  else res.sendStatus(202)
})

// 마이페이지 프로필 이미지 변경
router.put('/change-avatar', userUpload.single('userAvatar'), (req, res, next) => {
  let userAvatarImgName = req.file.filename
  const userIndex = req.user._id
  userFunctions.changeUserAvatarImg(userIndex, userAvatarImgName, res)
})

// 마이페이지 비밀번호 변경
router.put('/change-password', (req, res, next) => {
  const { userIndex, userPwdInput } = req.body
  userFunctions.changeUserPwd(userIndex, userPwdInput, res)
})

// 마이페이지 돈 충전
router.put('/add-money', (req, res, next) => {
  const { userIndex, userMoneyInput } = req.body
  userFunctions.addUserMoney(userIndex, userMoneyInput, res)
})

// 마이페이지 주소 추가
router.put('/add-address', (req, res, next) => {
  const { userIndex, userNameInput, userNumberInput, userZonecodeInput, userRoadAddressInput, userDetailAddressInput } = req.body
  userFunctions.addUserAddress(userIndex, userZonecodeInput, userRoadAddressInput, userDetailAddressInput, userNameInput, userNumberInput, res)
})

// 마이페이지 회원탈퇴
router.delete('/delete-account', (req, res, next) => {
  const userIndex = req.user._id
  let userAvatarImgName = req.user.userAvatar
  userAvatarImgName += ''
  let userAvatarimgNameWithoutExt = userAvatarImgName.substring(0, userAvatarImgName.lastIndexOf('.'))
  userFunctions.deleteAccount(userIndex, userAvatarimgNameWithoutExt, req, res)
})

// 찜하기 추가
router.post('/add-favorites', (req, res, next) => {
  const userIndex = req.user._id
  const { productCode } = req.body
  userFunctions.addFavorites(userIndex, productCode, res)
})

// 찜하기 삭제
router.put('/delete-favorites', (req, res, next) => {
  const userIndex = req.user._id
  const { productCode } = req.body
  userFunctions.deleteFavorites(userIndex, productCode, res)
})

// 장바구니 추가
router.post('/add-carts', (req, res, next) => {
  const userIndex = req.user._id
  const { productCode } = req.body
  userFunctions.addCarts(userIndex, productCode, res)
})

// 장바구니 삭제
router.put('/delete-carts', (req, res, next) => {
  const userIndex = req.user._id
  const { productCode } = req.body
  userFunctions.deleteCarts(userIndex, productCode, res)
})

// 물건 구입
router.post('/buy', (req, res, next) => {
  const userIndex = req.user._id
  const { productCode, productPrice, buyQuantity } = req.body  // productCode는 "코드번호_구매 개수_buyDate"로 구성되어 있다.
  userFunctions.buyProduct(userIndex, productCode, productPrice, buyQuantity, res)
})

// 장바구니에 담긴 물건 모두 구입
router.post('/allbuy', (req, res, next) => {
  const userIndex = req.user._id
  const { productCodeList, sum } = req.body
  userFunctions.buyAllProduct(userIndex, productCodeList, sum, res)
})

// 관리자 계정으로 전환
router.put('/change-admin', (req, res, next) => {
  const userIndex = req.user._id
  const { AdminNumberInput } = req.body
  userFunctions.changeToAdmin(userIndex, AdminNumberInput, res)
})

module.exports = router
