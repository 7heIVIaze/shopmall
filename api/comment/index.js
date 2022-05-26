const router = require('express').Router()
const commentFunctions = require('./commentFunctions')

// 해당 상품의 상품의견 등록
router.post('/add', (req, res, next) => {
  const userId = req.user.userId
  const userAvatar = req.user.userAvatar
  const { productCode, commentDate, commentStr } = req.body
  commentFunctions.addComment(productCode, userAvatar, userId, commentDate, commentStr, res)
})

// 해당 상품의 상품의견 리스트
router.get('/list/:productCode', (req, res, next) => {
  const productCode = req.params.productCode
  commentFunctions.getComment(productCode, res)
})


module.exports = router
