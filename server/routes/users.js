const router = require('express').Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { Query } = require('../dataconfig.js')
const { vt } = require('./vt')

 
// register
router.post('/', async (req, res) => {
    try {
        const { first_name, last_name, user_name, password } = req.body

        if (!first_name || !last_name || !user_name || !password)
            return res.status(400).json({ err: true, msg: "missing some info" })

        const q = `SELECT * FROM users WHERE user_name="${user_name}"`

        const users = await Query(q)
        let user = users[0]

        if (user) return res.status(400).json({ err: true, msg: "username is taken, try something else" })
        // hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);
        savePassword = hashedPassword
        const user_role = 2
        const qq = `INSERT INTO users (first_name, last_name, user_name, password, role_id)
        values ("${first_name}", "${last_name}", "${user_name}", "${hashedPassword}", ${user_role});`

        await Query(qq)
        user = await Query(q)
        user = user[0]
        console.log(user.id);
        res.status(200).json({ err: false, msg: user.id })
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: true, msg: err })
    }
})

// login
router.post('/token', async (req, res) => {
    try {
        const { user_name, password } = req.body
       
        if (!user_name || !password)
            return res.status(400).json({ err: true, msg: "missing some info" })

        const q = `SELECT * FROM users WHERE user_name="${user_name}"`

        const users = await Query(q)
      
        const user = users[0]
        
        if (!user) return res.status(401).json({ err: true, msg: "user not found" })
        
        console.log(bcrypt.compareSync(password, user.password));
       
        if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ err: true, msg: "wrong password" })

        // only if the info is correct

        const token = jwt.sign({
            userID: user.id,
            username: user.user_name,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role_id
        }, "YosiKushiApp", { expiresIn: "1m" })
        res.json({ err: false, msg: token })
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: true, msg: err })
    }
})

router.post('/check', vt ,async (req, res) => {
    try {
            res.json({err: false, msg: "user still valid"})
    }catch (err){
        res.json({err: true, msg: err})
    }
})
module.exports = router