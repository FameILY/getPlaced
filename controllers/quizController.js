const Student = require("../models/Student");
const Portfolio = require("../models/Portfolio");

const fs = require("fs");
const path = require("path");

const testDataFolderPath = "./test-data";

const getTestData = () => {
  const files = fs.readdirSync(testDataFolderPath);
  // Filter out only JSON files
  const jsonFiles = files.filter((file) => path.extname(file) === ".json");
  // Extract quiz names
  const quizNames = jsonFiles.map((file) => path.basename(file, ".json"));
  return quizNames;
};

exports.renderCQuestions = async (req, res) => {
  if (!req.session.user) {
    res.send("No session");
  } else {
    let stud = new Student();
    let prof = await stud.getStudentByEmail(req.session.user.accountEmail);

    const qData = {
      quizNames: getTestData(),
    };

    res.render("cQuestions", {
      Student: prof,
      qData: qData,
      currentRoute: "cQuestions",
    });
  }
};

exports.renderQuiz = async (req, res) => {
  try {
    let stud = new Student();
    let prof = await stud.getStudentByEmail(req.session.user.accountEmail);

    let name = req.params.qName;
    console.log("param: ", name);

    jsonFiles = getTestData();

    if (jsonFiles.includes(name)) {
      const jsonData = require(`../test-data/${name}.json`);
      res
        .status(200)
        .render("quiz/quiz2", { qData: jsonData, Student: prof, qName: name });
    } else {
      res.status(404).send("no");
    }
  } catch (e) {
    console.log(e);
  }
};

exports.renderPrepare = async (req, res) => {
  try {
    let stud = new Student();
    let prof = await stud.getStudentByEmail(req.session.user.accountEmail);

    let name = req.params.qName;
    console.log("param: ", name);

    jsonFiles = getTestData();

    // Check if the requested quiz name exists in the array
    if (jsonFiles.includes(name)) {
      // Dynamically require the JSON file based on the quiz name
      const jsonData = require(`../test-data/${name}.json`);
      res
        .status(200)
        .render("quiz/prepare", {
          qData: jsonData,
          Student: prof,
          qName: name,
        });
    } else {
      res.status(404).send("Quiz not found");
    }
  } catch (error) {
    console.error("Error rendering prepare page:", error);
    res.status(500).redirect("/what");
  }
};

exports.saveScore = async (req, res) => {
  if (!req.session.user) {
    res.status(400).send("No session");
  } else {
    console.log("inside controller")

    req.body.studentEmail = req.session.user.accountEmail
    console.log("Data from Quiz:" ,req.body)
    let portfolio = new Portfolio(req.body);

    let result = await portfolio.setAptitude();

    if (result == true) {
        console.log("its true")
      res.status(200).redirect("/cQuestions");
    } else {
        console.log("its false")

      res.status(400).redirect("/what");
    }
  }
};
