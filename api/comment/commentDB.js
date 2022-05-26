const mongoose = require('mongoose')

// 스키마
const CommentSchema = new mongoose.Schema({
  commentProductCode: { type: String, required: true, default: '' },
  commentAvatar: { type: String, required: true, default: '' },
  commentUserId: { type: String, required: true, default: '' },
  commentDate: { type: String, required: true, default: '' },
  commentContent: { type: String, required: true, default: '' },
})


// 모델 객체 생성
const CommentModel = mongoose.model('Comment', CommentSchema)


module.exports = CommentModel
