var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
const fs = require('fs')

var path='Data/Students.json'

const myKey='YehMeriKeyHai'

router.post('/signup', (req, res)=>{
    var students = JSON.parse(fs.readFileSync(path));
    var body = req.body
    let username = body.username
    let name = body.name
    let age = body.age
    let sex = body.sex
    let stream = body.stream

    if (!username){
        res.send(' "username" is a required attribute')
        return
    }
    if (!name){
        res.send(' "name" is a required attribute')
        return
    }
    if (!age){
        res.send(' "age" is a required attribute')
        return
    }
    if (!sex){
        res.send(' "sex" is a required attribute')
        return
    }
    if (!stream){
        res.send(' "stream" is a required attribute')
        return
    }

    student = students.find(curr_student=> curr_student.username === username)
    if (student){
        res.send('A student with this username already exists')
        return
    }
    let user = { username: username}
    const token = jwt.sign(user, myKey)
    res.send(` SignUp Successful!\nyourAccesToken: ${token} `)
    students.push(req.body)
    fs.writeFileSync(path, JSON.stringify(students, null, 2))
})


router.post('/login', (req, res)=>{
    var students = JSON.parse(fs.readFileSync(path));
    let username = req.body.username
    if (!username){
        res.send(' "username" is a required attribute')
        return
    }
    student = students.find(curr_student=> curr_student.username === username)
    if (!student){
        res.send('No student with this username exists!')
        return
    }
    let user = { username: username}
    const token = jwt.sign(user, myKey)
    res.send(` Login Successful!\nyourAccesToken: ${token} `)
})
module.exports = router;