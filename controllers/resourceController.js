const Resource = require("../models/Resource");
const Student = require("../models/Student");

exports.getCourses = async (req, res) => {
  try {
    if (!req.session.user) {
      return res
        .status(400)
        .json({ message: "Session is required, please login first" });
    }
    email = req.session.user.accountEmail;
    console.log(email);
    let student = new Student();
    let data = await student.getStudentByEmail(email);

    console.log("got the doc");
    let domain = data.domains;
    console.log(domain);

    let resource = new Resource();
    let arrayOfDocs = await resource.getCoursesByDomain(domain);

    //main if condition
    if (arrayOfDocs.length == 0) {
      console.log("Not in the db, finding courses online");

      // sending to the model
      let result = await resource.getCourses(domain); //runs the script

      if (result == "Error occurred") {
        return { message: result };
      } else {
        //saving to the collection for easy access
        console.log("got the result from the script");
        let newObject = new Resource(result);
        let isInserted = await newObject.saveCourse(result);

        console.log("data stored in db")

        //returning the stored data
        let docs = await resource.getCoursesByDomain(domain)
        
        return { Courses: docs };
        
      }
    } else {
        console.log("Already in the db so returning directly")
        return { Courses : arrayOfDocs}
    }
    


  } catch (err) {
    console.log(err);
  }
};

exports.getArticles = async (req, res) => {

  try {
    if (!req.session.user) {
      return res
        .status(400)
        .json({ message: "Session is required, please login first" });
    }
    email = req.session.user.accountEmail;
    console.log(email);
    let student = new Student();
    let data = await student.getStudentByEmail(email);

    console.log("got the doc");
    let domain = data.domains;
    console.log(domain);

    let resource = new Resource();
    let arrayOfDocs = await resource.getArticlesByDomain(domain);

    //main if condition
    if (arrayOfDocs.length == 0) {
      console.log("Not in the db, finding courses online");

      // sending to the model
      let result = await resource.getArticles(domain); //runs the script

      if (result == "Error occurred") {
        return { message: result };
      } else {
        //saving to the collection for easy access
        console.log("got the result from the script");
        let newObject = new Resource(result);
        let isInserted = await newObject.saveArticles(result);

        console.log("data stored in db")

        //returning the stored data
        let docs = await resource.getArticlesByDomain(domain)
        
        return { Articles: docs };
        
      }
    } else {
        console.log("Already in the db so returning directly")
        return { Articles : arrayOfDocs}
    }
    


  } catch (err) {
    console.log(err);
  }

}