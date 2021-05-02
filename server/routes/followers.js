const router = require('express').Router()
const { Query } = require('../dataconfig')
const { vt } = require('../routes/vt')

// get the number of followers for each vacation:
router.get('/:vacation_id', async (req, res) => {
    try {
        const q = `SELECT COUNT(user_id) as followersForVacation FROM followers WHERE vacation_id=${req.params.vacation_id}`
        const followersForVacationAmount = await Query(q)
        
        res.status(200).json({err: false, msg: followersForVacationAmount})
    } catch (err) {
        res.status(500).json({ err: true, msg: err })
    }
})

// get the vacation user is following
router.get('/:user_id/:vacation_id', async (req, res) => {
    try {
        const { user_id, vacation_id } = req.params
        const q = `SELECT * FROM followers where user_id=${user_id} and vacation_id=${vacation_id}`
        const isVacationFollowedByUser = await Query(q)
        
        const qq = `select * from vacations
            left join (SELECT vacation_id, count(user_id) as num_of_followers FROM followers
            group by vacation_id) as vacation_by_followers on vacations.id = vacation_by_followers.vacation_id
            left join (select vacation_id as followByUser from followers where user_id=${user_id}) as user_vacation on vacations.id = user_vacation.followByUser
            order by followByUser DESC, num_of_followers desc`
        const vacationQ = await Query(qq)    
        res.status(200).json({err: false, msg: {vacationQ,isVacationFollowedByUser}})
    } catch (err) {
        res.status(500).json({ err: true, msg:err })
    }
})

//button "follow" on each vacation.
// update the vacation ordered by "follow" before the "unfollow"  

router.post('/:vacation_id', vt, async (req, res) => {
        try {
            const { vacation_id } = req.params

            const user_id = req.user.userID

            const q = `INSERT INTO followers (user_id,  vacation_id) values (${user_id},  ${vacation_id})`
            await Query(q)
            const qq = `select * from vacations
            left join (SELECT vacation_id, count(user_id) as num_of_followers FROM followers
            group by vacation_id) as vacation_by_followers on vacations.id = vacation_by_followers.vacation_id
            left join (select vacation_id as followByUser from followers where user_id=${user_id}) as user_vacation on vacations.id = user_vacation.followByUser
            order by followByUser DESC, num_of_followers desc`
            const vacationByFollowersAdd = await Query(qq)
            res.status(200).json({err: false, msg:vacationByFollowersAdd})
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: true, msg: err })
        }
    
})


// button "unfollow" on each vacation:
// update the vacation ordered by "follow" before the "unfollow"  


router.delete('/:vacation_id', vt, async (req, res) => {
    
        try {
            const { vacation_id } = req.params
            const user_id = req.body.userID

            const q = `DELETE FROM followers  where user_id = ${user_id} AND vacation_id = ${vacation_id}`

            await Query(q)

            const qq = `select * from vacations
            left join (SELECT vacation_id, count(user_id) as num_of_followers FROM followers
            group by vacation_id) as vacation_by_followers on vacations.id = vacation_by_followers.vacation_id
            left join (select vacation_id as followByUser from followers where user_id=${user_id}) as user_vacation on vacations.id = user_vacation.followByUser
            order by followByUser DESC, num_of_followers desc`

            const vacationByFollowersDel = await Query(qq)

            res.status(200).json({err: false, msg: vacationByFollowersDel})
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: true, msg:err })
        }

})

// admin only
// data for the followers graph

router.get('/', vt, async (req, res) => {
    
        try {
            const q = `SELECT COUNT(followers.user_id) as numberOfFollowers, followers.vacation_id, vacations.destination FROM followers INNER JOIN vacations ON followers.vacation_id = vacations.id group by vacation_id`
            const followersForGraphQ = await Query(q)
            res.status(200).json({ err: false, msg: followersForGraphQ})
        } catch (err) {
            res.status(500).json({ err: true, msg:err })
        }
})


module.exports = router