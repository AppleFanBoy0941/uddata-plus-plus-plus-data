import bcrypt from 'bcrypt'
import roleValidator from '../../functions/roleValidator.js'
import User from '../../models/user.model.js'
import isEmpty from '../../functions/isEmpty.js'
import Team from '../../models/team.model.js'
import Course from '../../models/course.model.js'

export default async function createUser(request, response) {
	if (isEmpty(request.body)) {
		response.status(400).send({ message: 'Missing information' }).end()

		return
	}

	const user = await User.findById(request.userid)
	if (!user) {
		response
			.status(403)
			.send({ message: 'Invalid user, please get a new token and try again' })
			.end()

		return
	}

	if (!roleValidator(user.role, ['admin'])) {
		response
			.status(403)
			.send({ message: 'Unauthorized, you do not have rights for this action' })
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

		if (user.teams.length > 0) {
			await Team.updateMany(
				{ _id: { $in: user.teams } },
				{ $push: { students: user._id } }
			)
		}

		if (user.courses.length > 0) {
			await Course.updateMany(
				{ _id: { $in: user.courses } },
				{ $push: { students: user._id } }
			)
		}

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
