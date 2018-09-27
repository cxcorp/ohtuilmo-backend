const loginRouter = require('express').Router()
const passport = require('passport')

module.exports = function (passport, path) {

    loginRouter.get('/okTest', (req, res) => {
            console.log(req)
            res.status(200).send({ user: req.user })
    })

    loginRouter.get('/failTest', (req, res) => {
        console.log('failure')
        console.log(req.flash('error'))
        res.status(401).send()
    })

    loginRouter.post('/', passport.authenticate('local',
        {
            // successRedirect: `${path}/okTest`,
            failureRedirect: `${path}/failTest`,
            failureFlash: true,
            badRequestMessage: 'Missing fields'
        }
    ), (req, res) => {
        res.status(200).send({ user: req.user })
    })
    loginRouter.get('/sessionTest', passport.authenticate('local',
        {
            successRedirect: `${path}/okTest`,
            failureRedirect: `${path}/failTest`
        }
    ))

    return loginRouter
}
