const Post = require('../models/post')

class Controller {
  static create (req, res, next) {
    let props = {
      caption: req.body.caption,
      imageUrl: req.file.cloudStoragePublicUrl,
      imageName: req.file.cloudStorageObject,
    }
  
    Post.create(props)
      .then(post => {
        console.log("created 1 post")
        res.status(201).json(post)
      })
      .catch(next)
  }

  static findAll(req, res, next) {
    Post.find()
      .exec()
      .then(posts => {
        res.json(posts)
      })
      .catch(next)
  }

  static delete(req, res, next) {
    Post.findByIdAndDelete(req.params.id)
      .exec()
      .then(() => {
        console.log("deleted 1 post")
        res.status(204).end()
      })
      .catch(next)
  }
}

module.exports = Controller;