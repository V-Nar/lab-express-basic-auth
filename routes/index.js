const router = require('express').Router()

/* GET default route */
router.get('/', (req, res, next) => {
  res.json({ success: true })
})

router.use('/auth', require('./auth.route'))

module.exports = router
