const mongoose = require('mongoose')

// 스키마
const ProductSchema = new mongoose.Schema({
  productImgs: { type: Array, required: true, default: '' },
  productTitle: { type: String, required: true, default: '' },
  productDescription: { type: String, required: true, default: '' },
  productPrice: { type: Number, required: true, default: -1 },
  productCode: { type: String, unique: true, required: true, default: '' },
  productQuantity: { type: Number, required: true, default: -1 },
  productHashTag: { type: Array, required: true, default: '' },
  productHeartColor: { type: String, required: true, default: 'white' },
  productCartColor: { type: String, required: true, default: 'white' },
  productCarousel: { type: Boolean, default: false },
})


// 모델 객체 생성
const ProductModel = mongoose.model('Product', ProductSchema)


module.exports = ProductModel