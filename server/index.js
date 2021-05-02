const express = require('express')
const cors = require('cors')
require('./dataconfig')


const app = express()

app.use(cors())
app.use(express.json())

app.use('/users', require('./routes/users'))
app.use('/vacations', require('./routes/vacations'))
app.use('/followers', require('./routes/followers'))

app.get('/', (req, res) => {
	res.send('Its coming soon just wait.')
})

app.listen(10778, () => console.log("up & running 10778"))