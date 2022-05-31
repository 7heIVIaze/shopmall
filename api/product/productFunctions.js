const ProductModel = require('./productDB')
const fs = require('fs')
const UserModel = require('../user/userDB')

const productFunctions = {}

// 상품 추가
productFunctions.addProduct = async function(productImgs, productTitle, productDescription, productPrice, productCode, productQuantity, productHashTag, res){
  productPrice += ''; productQuantity += '';
  let numProductQuantity = productQuantity.replace(/[^\d]+/g, '')
  let numProductPrice = productPrice.replace(/[^\d]+/g, '')
  let product = new ProductModel({
    productImgs: productImgs,  // ['A180_1569848638936.jpeg', 'A180_1569848638940.jpeg', 'A180_1569848638941.jpeg']
    productTitle: productTitle,
    productDescription: productDescription,
    productPrice: Number(numProductPrice),
    productCode: productCode,
    productQuantity: Number(numProductQuantity),
    productHashTag: productHashTag,
    productHeartColor: 'white',
    productCartColor: 'white',
    productCarousel: false,
  })
  await product.save(function(err) {
    if(err) console.log('addProduct function error')
    else res.sendStatus(200)
  })
}

// 상품 삭제
productFunctions.deleteProduct = async function(productCode, res){
  let dirPath = 'uploads/productImages/' + productCode
  await ProductModel.deleteOne({productCode: productCode}, function(err){
    if(err) console.log('deleteProduct function error')
    else{
      if(fs.existsSync(dirPath)){
        fs.readdirSync(dirPath).forEach(function(fileName, index){
          fs.unlinkSync(`${dirPath}/${fileName}`)
        })
        fs.rmdirSync(dirPath)
      }
      res.sendStatus(200)
    }
  })
}

// 페이지 나누기
productFunctions.paginateProduct = async function(req, res){
  let page = req.query.page || 1                                 // 쿼리스트링에 page가 없으면 1을 사용. 처음 시작이 1페이지.
  let limit = 5                                                  // 한 번에 띄워줄 데이터의 개수
  let offset = page * limit                                      // 얼마나 떨어져 있는지
  let pageProducts = await ProductModel.find({}).skip(offset - limit).limit(limit).select('productImgs productTitle productPrice productCode productHeartColor productCartColor').catch(e => console.log('paginateProduct function error'))
  for(let i of pageProducts){
    i.productImgs = await thumbnailDataURI_generator(i.productCode).catch(e => console.log('paginateProduct dataURI generator function error'))
  }
  let totalProducts = await ProductModel.countDocuments({}).catch(e => console.log('paginateProduct countDocuments function error'))
  let totalPage = Math.ceil(totalProducts / 5)
  res.status(200).json({
    pageProducts: pageProducts,
    totalPage: totalPage,
  })
}

// 썸네일 dataURI string 생성
async function thumbnailDataURI_generator(productCode){
  let dirPath = 'uploads/productImages/' + productCode
  let dataURIarray = []
  if(fs.existsSync(dirPath)){
    let fileNames = fs.readdirSync(dirPath)  // fileNames[0] = A190_1570518944531.jpeg
    let mimetypeStr = fileNames[0].split('.').pop()
    let base64Data = fs.readFileSync(`${dirPath}/${fileNames[0]}`, 'base64')
    let dataURI = `data:image/${mimetypeStr};base64,${base64Data}`
    dataURIarray.push(dataURI)
  }
  return dataURIarray // 썸네일 이미지로 쓸 이미지 dataURI 1개만 들어있는 배열(길이 1)
}

// 세션 유저가 찜한 상품들의 정보 응답
productFunctions.favoriteProductInfo = async function(userIndex, res){
  let doc = await UserModel.findById(userIndex)
  let userFavorites = doc.userFavorites
  let favoriteProducts = []
  if(!userFavorites || userFavorites.length === 0) res.sendStatus(202)  // 찜한 상품이 없을 경우 []. null이 아닌 length=0 상태.
  else{
    for(let i of userFavorites){
      let found = await ProductModel.findOne({productCode: i}).select('productImgs productTitle productCode')
      found.productImgs = await thumbnailDataURI_generator(found.productCode)
      favoriteProducts.push(found)
    }
    res.status(200).send(favoriteProducts)
  }
}

// 세션 유저가 담아놓은 장바구니 상품들의 정보 응답
productFunctions.cartProductInfo = async function(userIndex, res){
  let doc = await UserModel.findById(userIndex)
  let userCarts = doc.userCarts
  let cartProducts = []
  if(!userCarts || userCarts.length === 0) res.sendStatus(202)
  else{
    for(let i of userCarts){
      let found = await ProductModel.findOne({productCode: i}).select('productImgs productTitle productPrice productCode')
      found.productImgs = await thumbnailDataURI_generator(found.productCode)
      cartProducts.push(found)
    }
    res.status(200).send(cartProducts)
  }
}

// 상품 검색
productFunctions.searchProduct = async function(searchInput, res){
  let found = await ProductModel.find().or([ {productHashTag: searchInput}, {productTitle: RegExp(searchInput, 'g')} ]).select('productImgs productTitle productPrice productCode productHeartColor productCartColor').catch(e => console.log('searchProduct Function error'))
  if(!found) res.sendStatus(202)
  else{
    for(let i of found) i.productImgs = await thumbnailDataURI_generator(i.productCode).catch(e => console.log('searchProduct function dataURI error'))
    res.status(200).json(found)
  }
}

// 상품 상세 페이지
productFunctions.detailProduct = async function(productCode, res, userIndex){
  if(userIndex){
    let userDoc = await UserModel.findById(userIndex).catch(e => console.log('detailProduct user findById error'))
    let productDoc = await ProductModel.findOne({productCode: productCode}).catch(e => console.log('detailProduct product findOne error'))
    if(userDoc.userFavorites && userDoc.userFavorites.length !== 0) for(let i of userDoc.userFavorites) if(productDoc.productCode === i) productDoc.productHeartColor = 'red'
    if(userDoc.userCarts && userDoc.userCarts.length !== 0) for(let j of userDoc.userCarts) if(productDoc.productCode === j) productDoc.productCartColor = 'red'
    productDoc.productImgs = await dataURI_generator(productDoc.productCode)
    res.status(200).json(productDoc)
  }

  else{
    await ProductModel.findOne({productCode: productCode}, async function(err, doc){
      if(err) console.log('detailProduct with no userIndex function error')
      else{
        doc.productImgs = await dataURI_generator(doc.productCode)
        res.status(200).json(doc)
      }
    })
  }
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

// 세션 유저가 구매한 상품들의 정보 응답
productFunctions.purchaseProductInfo = async function(userIndex, res){
  let userDoc = await UserModel.findById(userIndex).catch(e=> console.log('purchaseProductInfo function error'))
  let userBuyHistory = userDoc.userBuyHistory
  let purchasedHistoryProducts = []
  if(!userBuyHistory || userBuyHistory.length === 0) res.sendStatus(202)
  else{
    for(let i of userBuyHistory){
      let found = await ProductModel.findOne({productCode: i.substring(0, i.indexOf('_'))}).select('productImgs productTitle productCode')
      found.productImgs = await thumbnailDataURI_generator(found.productCode)
      found.productCode = i  // 상품 구매 개수 및 구입 날짜 포함된 코드로 할당
      purchasedHistoryProducts.push(found)
    }
    res.status(200).send(purchasedHistoryProducts)
  }
}

// DB에 저장된 모든 상품 찾기
async function findAllProduct_DB(){
  console.log('DB에 저장된 모든 상품들은 다음과 같습니다.')
  await ProductModel.find({}, function(err, docs){
    if(err) console.log('findAllProduct_DB function error')
    console.log(docs)
  })
}

// dataURI 배열 생성
async function dataURI_generator(productCode){
  let dirPath = 'uploads/productImages/' + productCode
  let dataURIarray = []
  if(fs.existsSync(dirPath)){
    fs.readdirSync(dirPath).forEach(function(fileName, index){
      let mimetypeStr = fileName.split('.').pop()
      let base64Data = fs.readFileSync(`${dirPath}/${fileName}`, 'base64')
      let dataURI = `data:image/${mimetypeStr};base64,${base64Data}`
      dataURIarray.push(dataURI)
    })
  }
  return dataURIarray
}

// 추천 상품(Carousel) 등록
productFunctions.addCarousel = async function(productCode, res){
  await ProductModel.findOneAndUpdate({productCode: productCode}, {productCarousel: true}, function(err, result){
    if(err) console.log('addCarousel function error')
    else if(!result) res.sendStatus(202)
    else res.sendStatus(200)
  })
}

productFunctions.deleteCarousel = async function(productCode, res){
  await ProductModel.findOneAndUpdate({productCode: productCode}, {productCarousel: false}, function(err, result){
    if(err) console.log('deleteCarousel function error')
    else if(!result) res.sendStatus(202)
    else res.sendStatus(200)
  })
}

// 추천 상품(Carousel) 정보 응답
productFunctions.getCarousel = async function(res){
  let productDocs = await ProductModel.find({productCarousel: true}).select('productImgs productTitle productCode')
  for(let i of productDocs) i.productImgs = await thumbnailDataURI_generator(i.productCode)
  res.status(200).send(productDocs)
}

// 상품 이미지 수정(재등록)
productFunctions.reviseProductImage = async function(productCode, productImgs, res){
  await ProductModel.findOneAndUpdate({productCode: productCode}, {productImgs: productImgs}, {new: true}, function(err, result){  // 원래 findOneAndUpdate의 result는 수정되기 전의 상태(doc)이다. 하지만, 옵션에 { new: true }를 넣으면 수정 이후의 다큐먼트를 반환한다.
    if(err) console.log('reviseProductImage function error')
    else if(!result) res.sendStatus(202)  // 일치하는 상품을 찾지 못했으면 result 값은 null
    else res.sendStatus(200)
  })
}

// 상품 타이틀 수정
productFunctions.reviseProductTitle = async function(productCode, productTitle, res){
  await ProductModel.findOneAndUpdate({productCode: productCode}, {productTitle: productTitle}, {new: true}, function(err, result){
    if(err) console.log('reviseProductTitle function error')
    else if(!result) res.sendStatus(202)
    else res.sendStatus(200)
  })
}

// 상품 설명 수정
productFunctions.reviseProductDescription = async function(productCode, productDescription, res){
  await ProductModel.findOneAndUpdate({productCode: productCode}, {productDescription: productDescription}, {new: true}, function(err, result){
    if(err) console.log('reviseProductDescription function error')
    else if(!result) res.sendStatus(202)
    else res.sendStatus(200)
  })
}

// 상품 가격 수정
productFunctions.reviseProductPrice = async function(productCode, productPrice, res){
  let numProductPrice = productPrice.replace(/[^\d]+/g, '')
  await ProductModel.findOneAndUpdate({productCode: productCode}, {productPrice: Number(numProductPrice)}, {new: true}, function(err, result){
    if(err) console.log('reviseProductPrice function error')
    else if(!result) res.sendStatus(202)
    else res.sendStatus(200)
  })
}

// 상품 수량 수정
productFunctions.reviseProductQuantity = async function(productCode, productQuantity, res){
  let numProductQuantity = productQuantity.replace(/[^\d]+/g, '')
  await ProductModel.findOneAndUpdate({productCode: productCode}, {productQuantity: Number(numProductQuantity)}, {new: true}, function(err, result){
    if(err) console.log('reviseProductQuantity function error')
    else if(!result) res.sendStatus(202)
    else res.sendStatus(200)
  })
}

// 상품 해시태그 수정
productFunctions.reviseProductHashTag = async function(productCode, productHashTag, res){
  await ProductModel.findOneAndUpdate({productCode: productCode}, {productHashTag: productHashTag}, {new: true}, function(err, result){
    if(err) console.log('reviseProductHashTag function error')
    else if(!result) res.sendStatus(202)
    else res.sendStatus(200)
  })
}



module.exports = productFunctions
