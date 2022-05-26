const mongoose = require('mongoose')
const crypto = require('crypto')

// 스키마
const UserSchema = new mongoose.Schema({
  userAvatar: { type: String, default: 'default.png' },
  userId: { type: String, required: true, unique: true, default: '' },
  hashed_password: { type: String, required: true, default: '' },
  salt: { type: String, required: true },
  userMoney: { type: Number, default: 0 },
  userFavorites: { type: Array, default: '' },
  userCarts: { type: Array, default: '' },
  userBuyHistory: { type:Array, default: '' },
  administrator: { type: Boolean, default: false },
  userName: { type: String, default: ''},
  userNumber: { type: String, default: ''},
  userZonecode: { type: String, default: ''},
  userRoadAddress: { type: String, default: ''},
  userDetailAddress: { type: String, default: ''},
})

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() {
    return this._password
  })

UserSchema.method('encryptPassword', function(plainText, inSalt) {
  if (inSalt) {
    return crypto.createHmac('sha512', inSalt).update(plainText).digest('hex')
  } else {
    return crypto.createHmac('sha512', this.salt).update(plainText).digest('hex')
  }
})

UserSchema.method('makeSalt', function() {
  return Math.round((new Date().valueOf() * Math.random())) + ''
})

UserSchema.method('authenticate', function(plainText, inSalt, hashed_password) {
  if (inSalt) {
    return this.encryptPassword(plainText, inSalt) === hashed_password
  } else {
    return this.encryptPassword(plainText) === this.hashed_password
  }
})

// 모델 객체 생성
const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel