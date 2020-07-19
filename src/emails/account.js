const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'dilippoudel578@gmail.com',
        subject: 'Thanks for Joining in!',
        text: `Welcome to the app, ${name} 
        Let me know how yo get along with the app.`
    })
}

const cancelAccount = (email,name) => {
    sgMail.send({
        to:email,
        from:'dilippoudel578@gmail.com',
        subject:'Sorry to see you go!!!',
        text:`Hi ${name}!
        Your account has been canelled successfully.
        What was the wrong with Application?
        We appreciate for your feedback.
        Regards!
        Dilip`
    })
}
module.exports = {
    sendWelcomeEmail,
    cancelAccount
}