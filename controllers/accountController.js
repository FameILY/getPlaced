const Account = require("../models/Account");
const Student = require("../models/Student");
const resourceController = require("./resourceController")

exports.regAccount = async (req, res) => {
  try {
    //we got the req.body here:
    console.log("Inside controller");
    console.log("data received in the controller:");
    // console.log(req.body);

    //passing this to the model to save,
    let account = new Account(req.body);
    if (req.body.role === "student") {
      try {
        console.log("if student ran");
        //run the model function
        let isSuccess = await account.regAccount();
        if (isSuccess != null) {
          console.log("back in controller");

          let student = new Student(req.body);
          //running the stud model
          let data = await student.regStudent(); 

          console.log("back in controller again");
          // console.log("data from student:");
          // console.log(data);

          if (data !== null) {
            console.log(data._id);
            // return res.status(200).json({ data: isSuccess, id: data._id });
            res.redirect('/')
          } else {
            return res.status(400).json({ message: data });
          }
        } else {
          return res.status(400).json({ message: isSuccess });
        }
      } catch (error) {
        return res.status(400).json({ message: error });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

exports.loginAccount = async (req, res) => {
  try {
    console.log("inside controller");
    // console.log(req.body);

    //passing to the model
    let account = new Account();
    let data = await account.loginAccount(req.body);
    console.log(data);
    console.log("Back in controller");

    if (data == "Invalid Credentials") {
      // console.log("invalid creds")
      // req.flash('errors', 'Invalid Creds baby!')
      // return res.status(400).json({ message: data });
      res.redirect('/login') 
    } else {
      console.log("This user Logged in: ", data.accountEmail);
      if (data.role == "student") {
        try {
          
          console.log("in controller again")
        
          console.log("creating session")
          req.session.user = {
            _id: data._id.toString(),
            accountFirstName: data.accountFirstName,
            accountLastName: data.accountLastName,
            accountEmail: data.accountEmail,
            role: "student",
          };
          req.session.save(() => {
            // res.redirect("/admin/dashboard");
            console.log("Session created!")
            // req.flash('success', 'Welcome!')
            res.status(200).redirect('/home');
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log("its not student, in the else block");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.logout = async (req, res) => {
  try {
    req.session.destroy(() => {
      // res.redirect("/admin/signin");
      res.status(200).redirect("/login")
      console.log("successfully kicked the user out")
    });
  } catch (error) {
    console.log(error);
  }
}; 


exports.landing = (req, res) => {
  if (req.session.user){
    res.redirect('/home')
  } else {
    console.log("no session")
    res.redirect('/login')
  }
}

exports.renderHome = async (req, res) => {
  if (!req.session.user){
    res.redirect('/')
  } else {
    if(req.session.user.role == 'student'){
      let student = await new Student()
      let studProf = await student.getStudentByEmail(req.session.user.accountEmail)

      let account = new Account()
      let checkProfile = await account.checkProfile(req.session.user.accountEmail)
      if(checkProfile == false) {
        console.log("profile not set")


        // // Check if errors have not been set before
        // if (!req.session.profileErrorSet) {
        //   await req.flash('errors', "Set up your profile to get personalized interface");
        //   req.session.profileErrorSet = true; // Set flag to indicate that error has been set
        // }
        
        // console.log(req.flash('errors'));
        res.render('dashboard', { Student: studProf, Course: null, Articles: null, errors:  ["Set up your profile to get personalized interface"], currentRoute: 'home'})

      } else {
        console.log("profile is set")
        let courses = await resourceController.getCourses(req, res)
        // console.log(courses)
        let articles = await resourceController.getArticles(req, res)
        // console.log(articles)
      
        res.render('dashboard', { Student: studProf, Course: courses, Articles: articles, currentRoute: 'home'})
      }
    } else {
      console.log('not a student')
      res.status(200).json({message: "not a student"})
    }

  }
}


