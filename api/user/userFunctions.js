const UserModel = require('./userDB')
const fs = require('fs')
const ProductModel = require('../product/productDB')

const userFunctions = {}

// 유저 아이디 이미 존재하는지 체크(중복체크)
userFunctions.userIdDuplicationCheck = async function(userId, res){
  userId += ''
  let userIdTrimmed = userId.trim()
  if(!userIdTrimmed) res.sendStatus(203)
  else{
    await UserModel.findOne({ userId: userIdTrimmed }, function(err, doc){
      if(err) console.log('userIdDuplicationCheck function error')
      else if(!doc) res.sendStatus(200)  // 등록된 아이디 없음. 아이디 쓸 수 있음.
      else if(doc) res.sendStatus(202)  // 유저 아이디 이미 존재.
    })
  }
}

// 회원가입
userFunctions.addUser_DB = async function(userId, userPwd, res){
  userPwd += ''
  let userPwdTrimmed = userPwd.trim()
  if(!userPwdTrimmed) res.sendStatus(203)
  else{
    let user = new UserModel({
      userAvatar: 'default.png',
      userId: userId,
      password: userPwdTrimmed,
      userMoney: 0,
      userFavorites: [],
      userCarts: [],
      userBuyHistory: [],
      administrator: false,
      userName: '',
      userNumber: '',
      userZonecode: '',
      userRoadAddress: '',
      userDetailAddress: '',
    })
    await user.save(function(err, created){
      if(err) console.log('addUser_DB function error')
      else res.sendStatus(200)  // 회원가입 성공
    })
  }
}

// 유저 프로필 이미지 DataURI 생성
userFunctions.getUserAvatarDataURI = async function(userAvatarImgName){
  userAvatarImgName += ''
  let imgNameWithoutExt = userAvatarImgName.substring(0, userAvatarImgName.lastIndexOf('.'))

  let dirPath = 'uploads/userImages/' + imgNameWithoutExt
  let mimetypeStr = userAvatarImgName.substring(userAvatarImgName.lastIndexOf('.'),)
  let userAvatarDataURI = ''
  if(fs.existsSync(dirPath)){  // 파일이나 폴더가 존재하는지 파악
    let base64Data = fs.readFileSync(`${dirPath}/${userAvatarImgName}`, 'base64');    //파일 자체를 base64로 읽어들인다.
    userAvatarDataURI = `data:image/${mimetypeStr};base64,${base64Data}`
  }
  return userAvatarDataURI
}

// 유저 프로필 이미지 변경
userFunctions.changeUserAvatarImg = async function(userIndex, userAvatarImgName, res){
  await UserModel.findByIdAndUpdate(userIndex, {userAvatar: userAvatarImgName}, function(err, doc){
    if(err) console.log('changeUserAvatarImg function error')
    else if(doc) res.sendStatus(200)
  })
}

// 유저 비밀번호 변경
userFunctions.changeUserPwd = async function(userIndex, userPwdInput, res){
  userPwdInput += ''
  let userPwdTrimmed = userPwdInput.trim()
  if(!userPwdTrimmed) res.sendStatus(203)
  else{
    await UserModel.findById(userIndex, function(err, doc){
      if(err) console.log('changeUserPwd function error')
      else if(doc){
        doc.password = userPwdTrimmed
        doc.save(function(err, created){
          if(err) console.log('changeUserPwd function save error')
          else res.sendStatus(200)  // 비밀번호 변경 성공
        })
      }
    })
  }
}

// 유저 돈 충전
userFunctions.addUserMoney = async function(userIndex, userMoneyInput, res){
  userMoneyInput += ''
  let userMoneyTrimmed = userMoneyInput.trim()
  if(!userMoneyTrimmed) res.sendStatus(203)
  else{
    await UserModel.findById(userIndex, function(err, doc){
      if(err) console.log('addUserMoney function error')
      else if(doc){
        let originUserMoney = doc.userMoney
        let addMoney = userMoneyTrimmed.replace(/[^\d]+/g, '')  // replace(/,/gi, '')
        let sum = Number(originUserMoney) + Number(addMoney)
        doc.userMoney = sum
        doc.save(function(err, created){
          if(err) console.log('addUserMoney function save error')
          else res.sendStatus(200)  // 돈 충전 성공
        })
      }
    })
  }
}

// 유저 주소 등록
userFunctions.addUserAddress = async function(userIndex, userZonecode, userRoadAddress, userDetailAddress, userName, userNumber, res) {
  userZonecode += ''
  userRoadAddress += ''
  userDetailAddress += ''
  userName += ''
  userNumber += ''
  let userZonecodeTrimmed = userZonecode.trim()
  let userRoadAddressTrimmed = userRoadAddress.trim()
  let userDetailAddressTrimmed = userDetailAddress.trim()
  let userNameTrimmed = userName.trim()
  let userNumberTrimmed = userNumber.trim()
  if(!userZonecodeTrimmed || !userRoadAddressTrimmed || !userDetailAddressTrimmed || !userNameTrimmed || !userNumberTrimmed) res.sendStatus(203)
  else {
    await UserModel.findById(userIndex, function(err, doc) {
      if(err) console.log('addUserAddress function error')
      else if(doc) {
        doc.userName = userNameTrimmed
        doc.userNumber = userNumberTrimmed
        doc.userZonecode = userZonecodeTrimmed
        doc.userRoadAddress = userRoadAddressTrimmed
        doc.userDetailAddress = userDetailAddressTrimmed
        doc.save(function(err, created){
          if(err) console.log('addUserAddress function save error')
          else res.sendStatus(200)  // 비밀번호 변경 성공
        })
      }
    })
  }
}

// 유저 회원탈퇴
userFunctions.deleteAccount = async function(userIndex, userAvatarimgNameWithoutExt, req, res){
  let dirPath = 'uploads/userImages/' + userAvatarimgNameWithoutExt
  await UserModel.deleteOne({ _id: userIndex }, function(err){
    if(err) console.log('deleteAccount function error')
    else{
      if(userAvatarimgNameWithoutExt === 'default') { req.logout(); res.sendStatus(200); }
      else{
        if(fs.existsSync(dirPath)){
          fs.readdirSync(dirPath).forEach(function(fileName, index){
            fs.unlinkSync(`${dirPath}/${fileName}`)
          })
          fs.rmdirSync(dirPath)
        }
        req.logout()
        res.sendStatus(200)
      }
    }
  })
}

// 찜하기 추가
userFunctions.addFavorites = async function(userIndex, productCode, res){
  await UserModel.findById(userIndex, function(err, doc){
    if(err) console.log('addFavorites function error')
    else{
      let existFavorites = doc.userFavorites
      existFavorites.push(productCode)
      doc.userFavorites = existFavorites
      doc.save(function(err, created){
        if(err) console.log('addFavorites function save error')
        else res.sendStatus(200)
      })
    }
  })
}

// 찜하기 삭제
userFunctions.deleteFavorites = async function(userIndex, productCode, res){
  await UserModel.findById(userIndex, function(err, doc){
    if(err) console.log('deleteFavorites function error')
    else{
      let existFavorites = doc.userFavorites
      existFavorites = existFavorites.filter(item => item !== productCode)
      doc.userFavorites = existFavorites
      doc.save(function(err, created){
        if(err) console.log('deleteFavorites function save error')
        else res.sendStatus(200)
      })
    }
  })
}

// 장바구니 추가
userFunctions.addCarts = async function(userIndex, productCode, res){
  await UserModel.findById(userIndex, function(err, doc){
    if(err) console.log('addCarts function error')
    else{
      let existCarts = doc.userCarts
      existCarts.push(productCode)
      doc.userCarts = existCarts
      doc.save(function(err, created){
        if(err) console.log('addCarts function save error')
        else res.sendStatus(200)
      })
    }
  })
}

// 장바구니 삭제
userFunctions.deleteCarts = async function(userIndex, productCode, res){
  await UserModel.findById(userIndex, function(err, doc){
    if(err) console.log('deleteCarts function error')
    else{
      let existCarts = doc.userCarts
      existCarts = existCarts.filter(item => item !== productCode)
      doc.userCarts = existCarts
      doc.save(function(err, created){
        if(err) console.log('deleteCarts function save error')
        else res.sendStatus(200)
      })
    }
  })
}

// 물건 구입
userFunctions.buyProduct = async function(userIndex, productCode, productPrice, buyQuantity, res){
  let bill = Number(productPrice) * Number(buyQuantity)
  let userDoc = await UserModel.findById(userIndex)
  let productDoc = await ProductModel.findOne({productCode: productCode.substring(0, productCode.indexOf('_'))})
  if(userDoc.userMoney < bill) res.sendStatus(202)  // 유저의 돈 부족
  else if(productDoc.productQuantity < buyQuantity) res.sendStatus(203)  // 상품의 재고 부족
  else{
    userDoc.userBuyHistory.push(productCode)  // 구입 내역에 추가
    userDoc.userMoney = Number(userDoc.userMoney) - Number(bill)
    userDoc.save(function(err){ if(err) console.log('buyProduct funtion userDoc save error') })
    productDoc.productQuantity = Number(productDoc.productQuantity) - Number(buyQuantity)
    productDoc.save(function(err){ if(err) console.log('buyProduct function productDoc save error') })
    res.sendStatus(200)
  }}

// 장바구니에 담긴 물건 모두 구입
userFunctions.buyAllProduct = async function(userIndex, productCodeList, sum, res){
  let bill = Number(sum)
  let userDoc = await UserModel.findById(userIndex)
  if(userDoc.userMoney < bill) res.sendStatus(202)
  else if(await checkQuantity(productCodeList) === false) res.sendStatus(203)
  else{
    for(let i of productCodeList) userDoc.userBuyHistory.push(i)
    userDoc.userMoney = Number(userDoc.userMoney) - Number(bill)
    userDoc.userCarts = []
    userDoc.save(function(err){ if(err) console.log('buyAllProduct funtion userDoc save error') })
    for(let productCode of productCodeList){
      let productDoc = await ProductModel.findOne({productCode: productCode.substring(0, productCode.indexOf('_'))})
      productDoc.productQuantity = Number(productDoc.productQuantity) - Number(productCode.substring(productCode.indexOf('_')+1, productCode.lastIndexOf('_')))
      productDoc.save(function(err){ if(err) console.log('buyAllProduct function productDoc save error') })
    }
    res.sendStatus(200)
  }
}

// 상품번호들 중 재고 부족한 게 있는지 검사
async function checkQuantity(productCodeList){
  for(let productCode of productCodeList){
    let productDoc = await ProductModel.findOne({productCode: productCode.substring(0, productCode.indexOf('_'))})
    if(productDoc.productQuantity < 1) return false
  }
  return true
}

// 관리자 계정으로 전환
userFunctions.changeToAdmin = async function(userIndex, admin, res){
  let userDoc = await UserModel.findById(userIndex)
  if(userDoc.administrator) res.sendStatus(202)
  else{
    if(admin === process.env.ADMIN_NUM) {
      userDoc.administrator = true
      userDoc.save(function(err){ if(err) console.log('changeToAdmin funtion userDoc save error') })
      res.sendStatus(200)
    }
    else {
      console.log('Invalid value')
      res.sendStatus(202)
    }
  }
}

module.exports = userFunctions