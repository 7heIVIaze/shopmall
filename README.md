# 딱맞아 쇼핑몰

> Nuxt를 이용한 서버사이드 렌더링 쇼핑몰 제작 프로젝트

> 기본적인 틀은 https://github.com/hummingengineer/nuxt_damoa_shoppingmall 에서 참고하였습니다.


## Used
- node.js
- Nuxt.js
- express.js
- mongoDB
- vue
- vuetify

## Installed Dependencies
- express-session
- mongoose
- multer
- passport
- passport-local
- dotenv

## 설치 방법

``` bash
# download
$ git clone https://github.com/hummingengineer/nuxt_damoa_shoppingmall.git

# move
$ cd nuxt_damoa_shoppingmall

# install dependencies
$ yarn install

# .env 파일 생성 및 내용 작성
eg)
SESSION_SECRETKEY = 'your secret key'
DB_URL = mongodb://localhost:27017/test

# 개발 모드 구동
$ yarn dev

# 크롬으로 localhost:3000 접속
```

## 쇼핑몰 관리자 계정 만드는 방법

```text
회원가입 및 로그인 후, 마이페이지로 들어간 다음
우측 하단의 floating action button을 클릭하면 관리자 계정으로 전환할 수 있다.
```

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
