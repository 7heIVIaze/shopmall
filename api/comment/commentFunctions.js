const CommentModel = require('./commentDB')
const ProductModel = require('../product/productDB')

const fs = require('fs')

const commentFunctions = {}

// 해당 상품의 상품의견 등록
commentFunctions.addComment = async function(productCode, userAvatar, userId, commentDate, commentStr, commentRating, res){
  let comment = new CommentModel({
    commentProductCode: productCode,
    commentAvatar: userAvatar,
    commentUserId: userId,
    commentDate: commentDate,
    commentContent: commentStr,
    commentRating: commentRating
  })
  let cnt = 0
  let productRating = 0
  let product = await ProductModel.findOne({productCode: productCode}).select('productRating').catch(e => console.log('addComment product findOne error'))
  product.count(function(err, count) {
    if(err) console.log(err)
    else cnt = count
  })
  if(cnt > 1) productRating = (product.productRating * (cnt - 1) + commentRating)/cnt
  else productRating += commentRating
  console.log(productRating)
  await ProductModel.findOneAndUpdate({productCode: productCode}, {productRating: productRating}, {new: true}, function(err, result){  // 원래 findOneAndUpdate의 result는 수정되기 전의 상태(doc)이다. 하지만, 옵션에 { new: true }를 넣으면 수정 이후의 다큐먼트를 반환한다.
    if(err) console.log('addproudctRating function error')
    else if(!result) console.log('cannot found')
  })

  await comment.save(function(err) {
    if(err) console.log('addComment function error')
    else res.sendStatus(200)
  })
}

// 해당 상품의 상품의견 리스트
commentFunctions.getComment = async function(productCode, res){
  let sum = 0
  await CommentModel.find({commentProductCode: productCode}, async function(err, docs){
    if(err) console.log('getComment function error')
    else if(!docs) res.send(null)
    else{
      for(let i of docs) {
         i.commentAvatar = await getUserAvatarDataURI(i.commentAvatar)
         sum += 1
      }
      res.send(docs)
    }
  })
}

// 해당 상품의 상품의견 갯수
commentFunctions.getTotal = async function(productCode, res){
  var query = await CommentModel.find({commentProductCode: productCode})
  query.count(function(err, count) {
    if(err) {
      console.log(err)
      res.send(null)
    }
    else res.send(count)
  })
}

// 유저 프로필 이미지 DataURI 생성
async function getUserAvatarDataURI(userAvatarImgName){
  userAvatarImgName += ''
  let imgNameWithoutExt = userAvatarImgName.substring(0, userAvatarImgName.lastIndexOf('.'))

  let dirPath = 'uploads/userImages/' + imgNameWithoutExt
  let mimetypeStr = userAvatarImgName.substring(userAvatarImgName.lastIndexOf('.'),)
  if(fs.existsSync(dirPath)){  // 파일이나 폴더가 존재하는지 파악
    let base64Data = fs.readFileSync(`${dirPath}/${userAvatarImgName}`, 'base64')     //파일 자체를 base64로 읽어들인다.
    let userAvatarDataURI = `data:image/${mimetypeStr};base64,${base64Data}`
    return userAvatarDataURI
  }
}

module.exports = commentFunctions
