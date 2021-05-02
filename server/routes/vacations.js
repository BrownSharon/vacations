const router = require('express').Router()
const { Query } = require('../dataconfig.js')
const { vt } = require('./vt')


// for the uploaded of the site
router.get('/home', vt ,async (req, res) => {

    try {
        const q = `select * from vacations
            left join (SELECT vacation_id, count(user_id) as num_of_followers FROM followers
            group by vacation_id) as vacation_by_followers on vacations.id = vacation_by_followers.vacation_id
            left join (select vacation_id as followByUser from followers where user_id=1) as user_vacation on vacations.id = user_vacation.followByUser
            order by followByUser DESC, num_of_followers desc`
        const vacationByFollowersQ = await Query(q)
        res.status(200).json({ err: false, msg: vacationByFollowersQ })
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: true, msg: err })
    }

})


// add vacation only the admin
router.post('/', vt, async (req, res) => {
    try {
        const { destination, description, image_link, from_date, to_date, price } = req.body

        const q = `INSERT INTO vacations (destination, description, image_link, from_date, to_date, price) VALUES ("${destination}", "${description}", "${image_link}", "${from_date}", "${to_date}", "${price}")`

        await Query(q)

        const qq = `SELECT vacations.destination, COUNT(followers.user_id) AS numberOfFollowers FROM vacations 
            LEFT JOIN followers ON vacations.id= followers.vacation_id
            GROUP BY destination
            order by numberOfFollowers desc`

        const vacationsAfterAddQ = await Query(qq)

        res.status(200).json({err: false, msg:vacationsAfterAddQ})
    } catch (err) {
        res.status(500).json({ err: true, err })
    }
})

// delete vacation only the admin
router.delete('/:id', vt, async (req, res) => {

    try {
        const { id } = req.params

        const q = `DELETE FROM vacations WHERE id=${id}`

        await Query(q)

        const qq = `SELECT vacations.destination, COUNT(followers.user_id) AS numberOfFollowers FROM vacations 
            LEFT JOIN followers ON vacations.id= followers.vacation_id
            GROUP BY destination
            order by numberOfFollowers desc`

        const vacationsAfterDeleteQ = await Query(qq)

        res.status(200).json({err: false, msg:vacationsAfterDeleteQ})
    } catch (err) {
        res.status(500).json({ err: true, msg: err })
    }

})

// editing vacation only admin
// onClick save changes 
router.post('/edit', vt, async (req, res) => {
    try {

        const q = `SELECT * FROM vacations 
        WHERE id=${req.body.id}`
        const vacation = await Query(q)
        res.status(200).json({ err: false, msg: vacation })
    } catch (err) {
        res.status(500).json({ err: true, msg: err })
    }
})
router.put('/:id', vt, async (req, res) => {
    try {
        const { id } = req.params
        const { destination, description, image_link, from_date, to_date, price } = req.body
        console.log(req.body);
        const q = `UPDATE vacations SET destination="${destination}", description="${description}", image_link="${image_link}", from_date="${from_date}", to_date="${to_date}", price=${price} WHERE id=${id}`

        let what = await Query(q)
        console.log(what);
        const qq = `SELECT vacations.destination, COUNT(followers.user_id) AS numberOfFollowers FROM vacations 
            LEFT JOIN followers ON vacations.id= followers.vacation_id
            GROUP BY destination
            order by numberOfFollowers desc`

        const vacationsAfterEditQ = await Query(qq)
        console.log(vacationsAfterEditQ);
        res.status(200).json({err: false, msg:vacationsAfterEditQ})
    } catch (err) {
        res.status(500).json({ err: true, msg: err })
    }
})

module.exports = router