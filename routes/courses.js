const express = require('express');
const router = express.Router();
const fs = require('fs')
const jwt = require('jsonwebtoken')

var path='Data/Courses.json'

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

router.get('/', (req,res)=>{
    var courses = JSON.parse(fs.readFileSync(path))
    res.send({
        "data": courses
    })
})

router.get('/:id', (req,res)=>{
    var courses = JSON.parse(fs.readFileSync(path))
    let curr_course
    let param=req.params
    courses.forEach(course=>{
        if (course.id==param.id){
            curr_course=course
        }
    })
    res.send(curr_course)
})

router.post('/', (req,res)=>{
    var courses = JSON.parse(fs.readFileSync(path));
    course = req.body;
    if(course.name && course.description && course.enrolledStudents && course.availableSlots) {
        courses.push({
            ...course,
            id: `${courses.length + 1}`
        });
        fs.writeFileSync(path, JSON.stringify(courses, null, 2))
        res.send("Course Added Successfully!");
    }
})

router.post('/:id/enroll', authenticate, (req,res)=>{
    var courses = JSON.parse(fs.readFileSync(path))
    course = req.body;
    const student = req.user.username;
    let curr_course;
    const param = req.params;

    courses.forEach( course => {
        if (course.id == param.id){
            curr_course = 1
            if (student in course["enrolledStudents"]) {
                res.send('Student already enrolled in this course!')
            }else{
                if (course["availableSlots"]>0){
                    course["availableSlots"] -= 1
                    course["enrolledStudents"].push(student)
                    fs.writeFileSync(path, JSON.stringify(courses, null, 2))
                    res.send('Student enrolled successfully')
                }else{
                    res.send('No slots available for this course!')
                }
            }
        }
    })
    if (!curr_course){
        res.send('No course found for this id!')
    }
})

router.put('/:id/deregister', authenticate, (req,res)=>{
    var courses = JSON.parse(fs.readFileSync(path));
    let student = req.user.username;
    let curr_course;
    const param = req.params
    courses.forEach(course=>{
        if (course.id==param.id){
            curr_course=1
            const student_index = course["enrolledStudents"].indexOf(student)
            if (student_index !== -1){
                course["enrolledStudents"].splice(student_index,1)
                course["availableSlots"] += 1
                fs.writeFileSync(path, JSON.stringify(courses, null, 2))
                res.send('Student unregistered successfully')
            }else{
                res.send('No student with this id is enrolled in this course!')
            }
        }
    })
    if (!curr_course){
        res.send('No course found for this id!')
    }
})

module.exports = router;