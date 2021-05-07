const express = require('express')
const {addStudent,getAllStudents,getStudent,UpdateStudent,deleteStudent} = require('../controllers/studentController')

const router = express.Router()

router.post('/student',addStudent);
router.get('/students',getAllStudents)
router.get('/student/:id',getStudent)
router.put('/update/:id',UpdateStudent)
router.delete('/delete/:id',deleteStudent)

module.exports = {
    routes: router
}