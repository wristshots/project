const router = require('express').Router();
const Controller = require('../controllers/controller')
const uploadToGCS = require('../middleware/upload')
const Multer = require('multer');

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 4900000
  }
});

const uploadToLocal = Multer( {dest: './imageTemp'} )
router.post('/validate', uploadToLocal.single('file'), (req, res, next) => {
  if (req.file) {
      const vision = require('@google-cloud/vision');
      const client = new vision.ImageAnnotatorClient({
          keyFilename: './credentials/GrouprojectWeek2.json'
      });
      client
        .labelDetection(`./imageTemp/${req.file.filename}`)
        .then(results => {
          console.log('calculating score')
          let watchData = null;
          let strapData = null;
          let wristData = null;
          let clockData = null;
          let totalScore = 0;

          const labels = results[0].labelAnnotations;

          for (let i = 0; i < labels.length; i++) {
            if (labels[i].description == 'Watch') watchData = labels[i]
            if (labels[i].description == 'Strap') strapData = labels[i]
            if (labels[i].description == 'Wrist') wristData = labels[i]
            if (labels[i].description == 'Clock') clockData = labels[i]
          }
          if (watchData !== null && clockData===null) {
            watchData.score = watchData.score * 100
            totalScore = Math.floor(watchData.score)
            return res.status(200).json({
              score: totalScore
            })
          }  else if (watchData && clockData) {
            totalScore = Math.floor(watchData.score * 50)
            return res.status(200).json({
              score: totalScore
            })
          } else {
            watchData = { score: 0 }
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
            res.status(200).json({
              score: totalScore
            })
          }
        })
        .catch(next)
  } else {
    res.status(400).end()
  }
})

router.post('/', multer.single('file'), uploadToGCS, Controller.create)
router.get('/', Controller.findAll)
router.delete('/:id', Controller.delete)

module.exports = router;

// const upload = require("../middleware/uploadToGCS.js");
