const amazonQs = require('../test-data/amazon.json')
const Student = require('../models/Student')


exports.renderCQuestions = async (req, res)=> {

    if (!req.session.user){
        res.send("No session")
    } else {

    

    let stud = new Student()
    let prof = await stud.getStudentByEmail(req.session.user.accountEmail)

    res.render('cQuestions', {Student: prof})
    }

}



exports.renderQuiz = async (req,res) => {
    let stud = new Student()
    let prof = await stud.getStudentByEmail(req.session.user.accountEmail)

    let d = null
    let name = req.params.qName
    console.log("param: ",name)
    if (name == 'amazon'){
        let d = amazonQs 
        res.status(200).render('quiz/quiz2', {qData: d, Student: prof, qName: name})
    } else {
        res.status(404).send("no")
    }
}

exports.renderPrepare = async (req, res) => {

    let stud = new Student()
    let prof = await stud.getStudentByEmail(req.session.user.accountEmail)

    let d = null
    let name = req.params.qName
    console.log("param: ",name)
    if (name == 'amazon'){
        let d = amazonQs 
        res.status(200).render("quiz/prepare", {qData: d, Student: prof, qName: name})
    } else {
        res.status(404).send("no")
    }

}

exports.saveScore = async (req,res) => {
    res.send(req.body)
    // res.redirect('/cQuestions')
    
}