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

// 상품 이미지 저장
const storage = multerS3({
  s3: s3,
  bucket: process.env.S3_BUCKET_NAME,
  key: (req, file, cb) => {
    let productAddForm = JSON.parse(req.body.productAddForm)
    let productCode = productAddForm.productCode
    let ext = file.mimetype.split('/')[1]
    cb(null, `productImages/${productCode}/${productCode}_${Date.now()}.${ext}`)
  },
})

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     let productAddForm = JSON.parse(req.body.productAddForm)
//     let productCode = productAddForm.productCode
//     !fs.existsSync('uploads/productImages/' + productCode) && fs.mkdirSync('uploads/productImages/' + productCode)
//     if(fs.existsSync('uploads/productImages/' + productCode)){
//       fs.readdirSync('uploads/productImages/' + productCode).forEach(function(fileName, index){ fs.unlinkSync(`uploads/productImages/${productCode}/${fileName}`) })
//     }
//     cb(null, 'uploads/productImages/' + productCode)
//   },
//   filename: function (req, file, cb) {
//     let productAddForm = JSON.parse(req.body.productAddForm)
//     let productCode = productAddForm.productCode
//     let ext = file.mimetype.split('/')[1]
//     cb(null, productCode + '_' + Date.now() + '.' + ext)
//   }
// })

const productUpload = multer({ storage: storage })

module.exports = productUpload