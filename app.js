// app.js
import express from 'express'
import './database.js'
import auth from './routes/auth/index.js'
import teams from './routes/teams/index.js'
import users from './routes/users/index.js'

const app = express()

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
users(app)
teams(app)
auth(app)

app.listen(1337, () => {
	console.log('Server running on port 1337')
})
