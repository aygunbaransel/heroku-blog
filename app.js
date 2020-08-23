const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View Engine Setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.locals.layout = false;
app.get('/', (req,res) => {
	res.render('contact');
});

app.post('/', (req, res) => {
  const output = `
  <p>You have a new contact request</p>
  <h3>Contact Details</h3>
  <ul>
  <li>Name: ${req.body.name}</li>
  <li>E-mail: ${req.body.email}</li>
  <li>Subject: ${req.body.subject}</li>
  </ul>
  <h3>Mesagge</h3>
  <p>${req.body.message}</p>
  `;
  async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aygnbrnsl@gmail.com', 
      pass: '123Asdzx', 
    },
	tls:{
		rejectUnauthorized:false
	}
  });


  let info = await transporter.sendMail({
    from: '"John Doe Blog" <aygnbrnsl@gmail.com>', 
    to: 'allahbaba55@gmail.com', 
    subject: (req.body.subject), 
    text: "Hello world?", 
    html: output
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
  res.render('contact', {msg:'Email has been sent.'});
}
main().catch(console.error);
});
app.listen(3000, () => console.log('Server Started'));