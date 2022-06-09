const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const AWS = require('aws-sdk')
const multerS3 = require('multer-s3')
const router = require('express').Router()
require('dotenv').config()

AWS.config.update({
    region: process.env.S3_REGION,
    creden: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
})

// 상품 이미지 저장
const productuploads = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: process.env.S3_BUCKET_NAME,
        
        key: (req, file, cb) => {
            cb(null, `uploads/productImages/${path.basename(file.originalname)}`)
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
})

// 유저 이미지 저장
const useruploads = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: process.env.S3_BUCKET_NAME,
        
        key: (req, file, cb) => {
            cb(null, `uploads/userImages/${path.basename(file.originalname)}`)
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
})

module.exports = router