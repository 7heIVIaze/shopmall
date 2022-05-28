const UserModel = require('./userDB');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.use(
  new LocalStrategy(
    {
      usernameField: 'userId',  // 클라이언트로부터 받은 post 요청 속의 userId를 passport의 username으로 등록. const { userId, userPwd } = req.body 와 같다.
      passwordField: 'userPwd',
    },
    function(username, password, done){
      //console.log(usernameField + " " + passwordField)
      console.log(username + " " + password)
      UserModel.findOne({ userId: username }, function (err, user){
        if(err) return done(err)
        if(!user){
          return done(null, false, { message: 'Incorrect username.' })
        }
        if(!user.authenticate(password, user.salt, user.hashed_password)){
          return done(null, false, { message: 'Incorrect password.' })
        }
        return done(null, user)
      })
    }
  )
)

passport.serializeUser(function(user, done){
  console.log(user)
  done(null, user.id)
})

passport.deserializeUser(function(id, done){
  UserModel.findById(id, function(err, user){
    console.log(user)
    done(err, user)
  })
})

module.exports = passport