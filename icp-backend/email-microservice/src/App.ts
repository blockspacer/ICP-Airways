import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as nodemailer from 'nodemailer'
import * as epimetheus from 'epimetheus'

class App {

  public express: express.Application;
  constructor() {
    this.express = express();
    epimetheus.instrument(this.express)
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "*");
      res.header("Connection", "keep-alive");
      next();
    });
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }
  private routes(): void {
    let router = express.Router();
    router.post('/email', (req, res, next) => {
      console.log(req.body.toemail,req.body.src,req.body.dest)
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: '587',
        secure: false,
        auth: {
               user: 'icpairways@gmail.com',
               pass: '.icpairways'
           }
       });
       const mailOptions = {
        from: 'icpairways@gmail.com', // sender address
        to: req.body.toemail, // list of receivers
        subject: 'Your Flight Booking', // Subject line
        html: '<p>Congratualtion you have booked flight from ' + req.body.src + ' to ' + req.body.dest + '</p>'
      };
      console.log('<p>Congratualtion you have booked flight from ' + req.body.src + ' to ' + req.body.dest + '</p>')
      // console.log(process.env.EMAILUSERNAME)
      // console.log(process.env.EMAILPASSWORD)
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          res.status(404).json({ err });
          console.log(err);
        }
        else{
          res.json({
            message: "sucessful"
          });
          console.log(info);
        }
     });
    });
    router.get('/healthz', (req, res, next) => {
      res.send('success');
    });
    this.express.use('/', router);
  }
}
export default new App().express;