const multer  = require('multer')
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let productAddForm = JSON.parse(req.body.productAddForm)
    let productCode = productAddForm.productCode
    !fs.existsSync('uploads/productImages/' + productCode) && fs.mkdirSync('uploads/productImages/' + productCode)
    if(fs.existsSync('uploads/productImages/' + productCode)){
      fs.readdirSync('uploads/productImages/' + productCode).forEach(function(fileName, index){ fs.unlinkSync(`uploads/productImages/${productCode}/${fileName}`) })
    }
    cb(null, 'uploads/productImages/' + productCode)
  },
  filename: function (req, file, cb) {
    let productAddForm = JSON.parse(req.body.productAddForm)
    let productCode = productAddForm.productCode
    let ext = file.mimetype.split('/')[1]
    cb(null, productCode + '_' + Date.now() + '.' + ext)
  }
})

const productUpload = multer({ storage: storage })

module.exports = productUpload