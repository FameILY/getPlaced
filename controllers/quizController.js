const amazon = require('../test-data/amazon.json')
const Student = require('../models/Student')

exports.renderQuiz = async (req,res) => {
    let stud = new Student()
    let prof = stud.getStudentByEmail(req.session.user.accountEmail)

    let d = null
    let name = req.body.qName
    if (name == 'amazon'){
        let d = amazon
    }

    res.status(200).render('quiz/quiz2', {qData: d, Student: prof})

    
}