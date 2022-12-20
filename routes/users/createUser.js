import bcrypt from 'bcrypt'
import roleValidator from '../../functions/roleValidator.js'
import User from '../../models/user.model.js'

export default async function createUser(request, response) {
	if (!request.body || !request.body.first_name || !request.body.last_name) {
		response.status(400).send('Missing information').end()

		return
	}

	const user = await User.findById(request.userid)
	if (!user) {
		response
			.status(403)
			.send('Invalid user, please get a new token and try again')
			.end()

		return
	}

	if (!roleValidator(user.role, ['admin'])) {
		response
			.status(403)
			.send('Unauthorized, you do not have rights for this action')
			.end()

		return
	}

	const saltRounds = 10
	const hash = await bcrypt.hash(request.body.password, saltRounds)

	try {
		const address = {
			street: request.body.street,
			city: request.body.city,
			zip: request.body.zip,
		}

		const user = await User.create({
			...request.body,
			password: hash,
			address,
		})

		user.save()

		response.status(201).send(user).end()
	} catch (error) {
		if (error._message) {
			response.status(400).send({ message: error._message }).end()

			return
		}

		response.status(500).send(error).end()

		return
	}
}
