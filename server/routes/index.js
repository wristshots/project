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


router.post('/', multer.single('file'), uploadToGCS, Controller.create)
router.get('/', Controller.findAll)

module.exports = router;

// const upload = require("../middleware/uploadToGCS.js");
