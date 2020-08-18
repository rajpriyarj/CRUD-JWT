var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
const fs = require('fs')

var path='Data/Students.json'

const myKey='YehMeriKeyHai'

const authenticate = (req, res, next)=>{
    var token = req.headers.authorization
    if (!token){
        res.send('Token value required as Authorization under header!')
    }else{
        token=token.split(' ')[1]
        if (token){
            jwt.verify(token, myKey, (err, user)=>{
                if (err){
                    res.send('Invalid Access Token')
                }else{
                    req.user = user
                    next()
                }
            })
        }else{
            res.send(' Access Token not found! ')
        }
    }
}
router.get('/', authenticate,(req, res)=>{
    var students = JSON.parse(fs.readFileSync(path));
    var curr_student
    students.forEach(student =>{
        if (student.username === req.user.username){
            curr_student = student
        }
    })
    res.send({
        "Students Details": curr_student
    })
})

router.delete('/', authenticate, (req, res)=>{
    var students = JSON.parse(fs.readFileSync(path));
    var curr_student
    students.forEach(student =>{
        if (student.username === req.user.username){
            curr_student = student
        }
    })
    students.splice(students.indexOf(curr_student),1)
    fs.writeFileSync(path, JSON.stringify(students, null, 2))
    res.send('Student Deleted Successfully')
})

module.exports = router;