const router = require('express').Router();
const Controller = require('../controllers/controller')
const uploadToGCS = require('../middleware/upload')
const uploadToLocal = multer( {dest: '../imageTemp'} )

// const {Storage} = require('@google-cloud/storage');
// const storage = new Storage({
//   keyFilename: './max_service_account.json'
// }); // Creates a client

const Multer = require('multer');
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 4900000
  }
});

router.post('/validate', uploadToLocal.single('file'), (req, res) => {
  if (req.file) {
      let path = `./imageTemp/${req.file.filename}`;
      
      const vision = require('@google-cloud/vision');
      const client = new vision.ImageAnnotatorClient({

          keyFilename: './GrouprojectWeek2.json'

      });

      client
        .labelDetection(`./tester/test11.jpg`)
        .then(results => {
          let watchData = null;
          let strapData = null;
          let wristData = null;
          let totalScore = 0;

          const labels = results[0].labelAnnotations;

          for (let i = 0; i < labels.length; i++) {
              if (labels[i].description == 'Watch') watchData = labels[i]
              if (labels[i].description == 'Strap') strapData = labels[i]
              if (labels[i].description == 'Wrist') wristData = labels[i]
          }

          if (watchData !== null) {
              watchData.score = watchData.score * 100
              totalScore = Math.floor(watchData.score)
          }  else {
              watchData = {
                  score: 0
              }
          }

          if (totalScore == 0) {
              if (strapData !== null) { 
                  strapData.score = strapData.score * 100
              } else {
                  strapData = {
                      score: 0
                  }
              }
          
              if (wristData !== null) {
                  wristData.score = wristData.score * 100
              } else {
                  wristData = {
                      score: 0
                  }
              }   

              totalScore = Math.floor((watchData.score + strapData.score + wristData.score)/3)

          }
        })
        .catch(err => {
          console.error('ERROR:', err);
        });
  } else {
      console.log('No File Uploaded')
  }
})

router.post('/', multer.single('file'), uploadToGCS, Controller.create)
router.get('/', Controller.findAll)

module.exports = router;

// const upload = require("../middleware/uploadToGCS.js");
