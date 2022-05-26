const multer  = require('multer')
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let userId = req.body.userId
    let dirPath = 'uploads/userImages/' + userId
    
    if(fs.existsSync(dirPath)){                                              // 폴더가 존재하면
      fs.readdirSync(dirPath).forEach(function(fileName, index){             // 디렉토리 속 파일들을 순차순회하면서 하나씩 읽음과 동시에 콜백함수 실행.
        fs.unlinkSync(`${dirPath}/${fileName}`)
      })
    }
    else fs.mkdirSync(dirPath)                                               // 폴더가 존재하지 않으면 새로운 디렉토리를 만든다.

    cb(null, dirPath)
  },
  filename: function (req, file, cb) {
    let userId = req.body.userId
    let ext = file.mimetype.split('/')[1]
    cb(null, userId + '.' + ext)
  }
})

const userUpload = multer({ storage: storage })

module.exports = userUpload