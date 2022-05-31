const CommentModel = require('./commentDB')
const fs = require('fs')

const commentFunctions = {}

// 해당 상품의 상품의견 등록
commentFunctions.addComment = async function(productCode, userAvatar, userId, commentDate, commentStr, res){
  let comment = new CommentModel({
    commentProductCode: productCode,
    commentAvatar: userAvatar,
    commentUserId: userId,
    commentDate: commentDate,
    commentContent: commentStr
  })

  await comment.save(function(err) {
    if(err) console.log('addComment function error')
    else res.sendStatus(200)
  })
}

// 해당 상품의 상품의견 리스트
commentFunctions.getComment = async function(productCode, res){
  await CommentModel.find({commentProductCode: productCode}, async function(err, docs){
    if(err) console.log('getComment function error')
    else if(!docs) res.send(null)
    else{
      for(let i of docs) i.commentAvatar = await getUserAvatarDataURI(i.commentAvatar)
      res.send(docs)
    }
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
