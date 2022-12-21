import isEmpty from '../../functions/isEmpty.js'
import User from '../../models/user.model.js'
import Team from '../../models/team.model.js'
import roleValidator from '../../functions/roleValidator.js'

export default async function createTeam(request, response) {
	const { userid } = request

	if (isEmpty(request.body)) {
		response.status(400).send({ message: 'No information recieved' }).end()

		return
	}

	const user = await User.findById(userid)
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

	try {
		const team = await Team.create({
			...request.body,
		})

		team.save()

		if (team.students.length > 0) {
			await User.updateMany(
				{ _id: { $in: team.students } },
				{ $push: { teams: team._id } }
			)
		}

		if (team.teachers.length > 0) {
			await User.updateMany(
				{ _id: { $in: team.teachers } },
				{ $push: { teams: team._id } }
			)
		}

		response.status(201).send(team).end()

		return
	} catch (error) {
		console.log('Create team error', error)
		if (error._message) {
			response.status(400).send({ message: error._message }).end()

			return
		}

		response
			.status(500)
			.send({ message: 'Something went wrong, please try again' })
			.end()

		return
	}
}
