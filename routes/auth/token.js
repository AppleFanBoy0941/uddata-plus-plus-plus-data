import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../../models/user.model.js'

dotenv.config()

export default async function token(request, response) {
	if (!request.body || !request.body.email || !request.body.password) {
		response.status(400).send({ message: 'Email and password required' }).end()

		return
	}

	try {
		const user = await User.findOne({ email: request.body.email })

		if (!user) {
			response.status(403).send({ message: 'Invalid email or password' }).end()

			return
		}

		if (!(await bcrypt.compare(request.body.password, user.password))) {
			response.status(403).send({ message: 'Invalid email or password' }).end()

			return
		}

		const newToken = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
			expiresIn: '2h',
		})

		response.status(200).send({ token: newToken }).end()
	} catch (error) {
		console.log('Authentication token error', error)

		response.status(500).send('Authentication error').end()
	}
}
