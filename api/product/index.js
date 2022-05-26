const router = require('express').Router()
const productFunctions = require('./productFunctions')
const productUpload = require('./productMulter')

// 상품 추가
router.post('/add', productUpload.array('files'), (req, res, next) => {
  let productImgs = []
  for(let i of req.files) productImgs.push(i.filename)
  let productAddForm = JSON.parse(req.body.productAddForm)
  const { productTitle, productDescription, productPrice, productCode, productQuantity, productHashTag } = productAddForm
  productFunctions.addProduct(productImgs, productTitle, productDescription, productPrice, productCode, productQuantity, productHashTag, res)
})

// 상품 삭제
router.put('/delete', (req, res, next) => {
  const productCode = req.body.removeCode
  productFunctions.deleteProduct(productCode, res)
})

// 페이지 나누기
router.get('/pagination', (req, res, next) => {
  productFunctions.paginateProduct(req, res)
})

// 세션 유저가 찜한 상품들의 정보 응답
router.get('/favorite-productinfo', (req, res, next) => {
  const userIndex = req.user._id
  productFunctions.favoriteProductInfo(userIndex, res)
})

// 세션 유저가 담아놓은 장바구니 상품들의 정보 응답
router.get('/cart-productinfo', (req, res, next) => {
  const userIndex = req.user._id
  productFunctions.cartProductInfo(userIndex, res)
})

// 상품 검색
router.get('/search', (req, res, next) => {
  if(!req.query.search) res.sendStatus(202)
  else{
    const searchInput = decodeURI(decodeURIComponent(req.query.search)) // `?search=${searchInput}`
    productFunctions.searchProduct(searchInput, res)
  }
})

// 상품 상세 페이지
router.get('/detail/:productCode', (req, res, next) => {
  const productCode = req.params.productCode
  if(req.user){
    const userIndex = req.user._id
    productFunctions.detailProduct(productCode, res, userIndex)
  }
  else{
    productFunctions.detailProduct(productCode, res)
  }
})

// 세션 유저가 구매한 상품들의 정보 응답
router.get('/purchase-productinfo', (req, res, next) => {
  const userIndex = req.user._id
  productFunctions.purchaseProductInfo(userIndex, res)
})

// 추천 상품(Carousel) 등록
router.post('/add-carousel', (req, res, next) => {
  const { productCode } = req.body
  productFunctions.addCarousel(productCode, res)
})

// 추천 상품(Carousel) 삭제
router.put('/delete-carousel', (req, res, next) => {
  const { productCode } = req.body
  productFunctions.deleteCarousel(productCode, res)
})

// 추천 상품(Carousel) 정보 응답
router.get('/carousels', (req, res, next) => {
  productFunctions.getCarousel(res)
})

// 상품 이미지 수정(재등록)
router.put('/image', productUpload.array('files'), (req, res, next) => {
  let productImgs = []
  for(let i of req.files) productImgs.push(i.filename)
  let productAddForm = JSON.parse(req.body.productAddForm)
  const { productCode } = productAddForm
  productFunctions.reviseProductImage(productCode, productImgs, res)
})

// 상품 타이틀 수정
router.put('/title', (req, res, next) => {
  const { productCode, productTitle } = req.body
  productFunctions.reviseProductTitle(productCode, productTitle, res)
})

// 상품 설명 수정
router.put('/description', (req, res, next) => {
  const { productCode, productDescription } = req.body
  productFunctions.reviseProductDescription(productCode, productDescription, res)
})

// 상품 가격 수정
router.put('/price', (req, res, next) => {
  const { productCode, productPrice } = req.body
  productFunctions.reviseProductPrice(productCode, productPrice, res)
})

// 상품 수량 수정
router.put('/quantity', (req, res, next) => {
  const { productCode, productQuantity } = req.body
  productFunctions.reviseProductQuantity(productCode, productQuantity, res)
})

// 상품 해시태그 수정
router.put('/hashtag', (req, res, next) => {
  const { productCode, productHashTag } = req.body
  productFunctions.reviseProductHashTag(productCode, productHashTag, res)
})

module.exports = router
