portfolioCollection = require("../db").db().collection("portfolios");
const { ObjectId } = require("mongodb");

let Portfolio = function (data) {
  (this.data = data), (this.errors = []);
};

Portfolio.prototype.cleanUp = function () {
  // Update existing properties of this.data
  this.data.studentEmail = this.data.studentEmail;

  // Update aptitudeTests array
  this.data.aptitudeTests = [
    {
      testName: this.data.qName,
      initialRes: {
        score: this.data.qScore,
        from: this.data.qFrom,
      },
      latestRes: {
        latestScore: this.data.qScore,
        latestFrom: this.data.qFrom,
      },
      tries: this.data.tries,
    },
  ];

  // Update courses array
  this.data.courses = [
    {
      courseName: this.data.courseName,
      courseDomain: this.data.courseDomain,
      courseStatus: this.data.courseStatus,
    },
  ];

  // Update articles array
  this.data.articles = [
    {
      articelName: this.data.articleName,
      articleDomain: this.data.articleDomain,
      articleStatus: this.data.articleStatus,
    },
  ];
};

Portfolio.prototype.getPortfolioByEmail = async function (accountEmail) {
  console.log("Account to find: ", accountEmail);
  try {
    let data = await portfolioCollection.findOne({
      studentEmail: accountEmail,
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

Portfolio.prototype.setAptitude = async function () {
  try {
    console.log("inside model");
    // Ensure that aptitudeTests array exists
    if (!this.data.aptitudeTests || !Array.isArray(this.data.aptitudeTests)) {
      this.data.aptitudeTests = [];
    }

    // Extract required data from this.data
    const { qName, qScore, qFrom } = this.data;

    // Create aptitudeTest object
    const aptitudeTest = {
      testName: qName,
      initialRes: {
        score: qScore,
        from: qFrom,
      },
      latestRes: {
        latestScore: qScore,
        latestFrom: qFrom,
      },
      tries: 1,
    };

    // Push aptitudeTest object to aptitudeTests array
    await this.data.aptitudeTests.push(aptitudeTest);

    // Remove unnecessary properties from this.data
    delete this.data.qName;
    delete this.data.qScore;
    delete this.data.qFrom;
    delete this.data.tries;

    //checking if email exists
    let isPortfolioExist = await this.getPortfolioByEmail(
      this.data.studentEmail
    );

    if (isPortfolioExist) {
      //checking if quizattempts exists
      // Document exists, check if aptitudeTests array contains qName

      console.log("doc exists")
      this.data.aptitudeTests.forEach((test) => {
        console.log("Test name:", test.testName); // Access testName property of each test object
      });


      const existingTestIndex = isPortfolioExist.aptitudeTests.findIndex(
        (test) => test.testName === this.data.aptitudeTests[0].testName
      );
      

      if (existingTestIndex !== -1) {
        // qName exists, update the document


        console.log("damn, test exists") 
          
          let res = await portfolioCollection.findOneAndUpdate(
            {
              studentEmail: this.data.studentEmail,
              aptitudeTests: { $elemMatch: { testName: this.data.aptitudeTests[0].testName } },
            },
            {
              $set: {
                "aptitudeTests.$.latestRes": {
                  latestScore: this.data.aptitudeTests[0].latestRes.latestScore,
                  latestFrom: this.data.aptitudeTests[0].latestRes.latestFrom,
                },
                "aptitudeTests.$.tries": 2,
              },
            },
            {
              returnDocument: 'after', // Return the updated document
            }
          );
          

        console.log(res)
        return true
      } else {
        // qName doesn't exist, add a new test
        console.log("shit test doesn't exist")

        let res = await portfolioCollection.findOneAndUpdate(
            {
              studentEmail: this.data.studentEmail,
              "aptitudeTests": {
                $not: { $elemMatch: { testName: this.data.aptitudeTests[0].testName } }
              }
            },
            {
              $push: {
                aptitudeTests: {
                  testName: this.data.aptitudeTests[0].testName,
                  initialRes: { 
                    score: this.data.aptitudeTests[0].initialRes.score, 
                    from: this.data.aptitudeTests[0].initialRes.from 
                  },
                  latestRes: {
                    latestScore: this.data.aptitudeTests[0].latestRes.latestScore,
                    latestFrom: this.data.aptitudeTests[0].latestRes.latestFrom,
                  },
                  tries: 1,
                },
              },
            },
            {
              returnDocument: 'after'
            }
          );
        
          console.log("Update Result:",res)
          return true
      }

    //   //update the existing portfolio
    //   let data = await portfolioCollection.findOneAndUpdate(
    //     { studentEmail: this.data.studentEmail },
    //     { $set: {} }
    //   );
    } 
    else {
        //portfolio dosent exist
//insert a new protfolio doc    
console.log("inserting a new doc") 
        let data = await portfolioCollection.insertOne(this.data); //this will return metadata or smthng
        console.log(data);
        if (data.acknowledged == true) {
            console.log("returning true");
            return true;
        } else {
            console.log("returning false");
            return false;
        }
    }
    } catch (err) {
        console.log(err);
  }
};

Portfolio.prototype.setCourses = function () {};

Portfolio.prototype.setArticles = function () {};

module.exports = Portfolio;
