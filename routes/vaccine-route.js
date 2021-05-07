const express = require('express')
const {getAllData} = require('../controllers/vaccineController')

const router = express.Router()

router.get('/',getAllData)

module.exports = {
    routes: router
}