const Car = require('mongoose').model('Car')
const errorHandler = require('../utilities/error-handler')

module.exports = {
  addGet: (req, res) => {
    res.render('cars/add')
  },
  addPost: (req, res) => {
    let carReq = req.body

    if (carReq.pricePerDay <= 0) {
      res.locals.globalError = 'Price per day cannot be less than zero'
      res.render('cars/add', carReq)
      return
    }

    Car
        .create({
          make: carReq.make,
          model: carReq.model,
          year: carReq.year,
          pricePerDay: carReq.pricePerDay,
          power: carReq.power,
          image: carReq.image
        })
        .then(car => {
          res.redirect('cars/all')
        })
        .catch(err => {
          let message = errorHandler.handleMongooseError(err)
          res.locals.globalError = message
          res.render('cars/add', carReq)
        })
  },
  all: (req, res) => {
    let pageSize = 2
    let page = parseInt(req.query.page) || 1

    Car
            .find({})
            .sort('-createdOn')
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .then(cars => {
              res.render('cars/all', {
                cars: cars,
                hasPrevPage: page > 1,
                hasNextPage: cars.length > 0,
                prevPage: page - 1,
                nextPage: page + 1
              })
            })
  }
}
