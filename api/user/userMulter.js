const multer  = require('multer')
const fs = require('fs')
const AWS = require('aws-sdk')
const multerS3 = require('multer-s3')
require('dotenv').config()

AWS.config.update({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
})
const s3 = new AWS.S3()

const storage = multerS3({
  s3: s3,
  bucket: process.env.S3_BUCKET_NAME,

  key: (req, file, cb) => {
    let userId = req.body.userId
    let ext = file.mimetype.split('/')[1]
    cb(null, `userImages/${userId}.${ext}`)
  },
})

const userUpload = multer({ storage: storage })

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     let userId = req.body.userId
//     let dirPath = 'uploads/userImages/' + userId
    
//     if(fs.existsSync(dirPath)){                                              // 폴더가 존재하면
//       fs.readdirSync(dirPath).forEach(function(fileName, index){             // 디렉토리 속 파일들을 순차순회하면서 하나씩 읽음과 동시에 콜백함수 실행.
//         fs.unlinkSync(`${dirPath}/${fileName}`)
//       })
//     }
//     else fs.mkdirSync(dirPath)                                               // 폴더가 존재하지 않으면 새로운 디렉토리를 만든다.

//     cb(null, dirPath)
//   },
//   filename: function (req, file, cb) {
//     let userId = req.body.userId
//     let ext = file.mimetype.split('/')[1]
//     cb(null, userId + '.' + ext)
//   }
// })

// const userUpload = multer({ storage: storage })

//https://kimdave20.s3.ap-northeast-2.amazonaws.com/productImages/2/2_1654087706493.gif
//https://kimdave.s3.ap-northeast-2.amazonaws.com/productImages/2/2_1654087706493.gif

module.exports = userUpload