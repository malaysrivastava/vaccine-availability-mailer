var nodemailer = require('nodemailer');
const config = require('./config')

var transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user: config.user,
        pass: config.pass
    }
})

// var mailOptions = {
//   from: config.user,
//   to: 'malaypreet2013@gmail.com',
//   subject: 'Sending Email from Node.js',
//   text: `Hi MERN stack developer wondering about MaruKhoshi`
// }

exports.sendEmail = function (email, subjectLine, slotDetails, callback) {
    let options = {
        from: config.user,
        to: email,
        subject: subjectLine,
        text: 'Vaccine available. Details: \n\n' + slotDetails
    };
    transporter.sendMail(options, (error, info) => {
        if (error) {
            return callback(error);
        } else {
            console.log('Email sent: '+info.response)
        }
        callback(error, info);
    });
};



