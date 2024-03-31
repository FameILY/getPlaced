const Student = require("../models/Student");
const Account = require("../models/Account");
const path = require("path");

exports.setUpProfile = async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(400).json({ message: "Session required" });
    } else {
      // They should also give me email address or _id from session
      console.log("Inside Controller");
      let student = new Student();

      // console.log(req.files.profileImage);
      // console.log(req.files.certificateImage);

      if (req.files.profileImage) {
        console.log("pfp received, saving");
        let file = req.files.profileImage;
        const fileName = new Date().getTime().toString() + "-" + file.name;
        const savePath = path.join(
          __dirname,
          "../public/",
          "profileImages",
          fileName
        );
        await file.mv(savePath);
        req.body.profileImage = fileName;
      }

      if (req.files.certificateImage) {
        console.log("certificates received, saving");
        let file = req.files.certificateImage;
        const fileName = new Date().getTime().toString() + "-" + file.name;
        const savePath = path.join(
          __dirname,
          "../public/",
          "certificates",
          fileName
        );
        await file.mv(savePath);
        req.body.certificateImage = fileName;
      }

      //sending to model
      console.log(req.session.user.accountEmail)
      let email = req.session.user.accountEmail;
      let data = await student.setUpProfile(req.body, email);
      console.log("Back to controller");

      if (data != null) {
        let account = new Account();
        // console.log("data._id")
        // console.log(data._id)
        let result = account.updateStatus(data.studentEmail);
        if (result != null) {
          return res.status(200).json({ message: data });
        } else {
          console.log("Something wrong when updating status");
        }
      } else {
        console.log("check session email");
        return res.status(400).json({ message: data });
      }
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
