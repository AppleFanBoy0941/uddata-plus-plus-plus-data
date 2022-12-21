import isEmpty from '../../functions/isEmpty.js'
import User from '../../models/user.model.js'
import Team from '../../models/team.model.js'

export default async function updateTeam(request, response) {
	if (isEmpty(request.body)) {
		response.status(400).send({ message: 'No information recieved' }).end()

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

	if (user.role !== 'admin') {
		response
			.status(403)
			.send({ message: 'Unauthorized, you do not have rights for this action' })
			.end()

		return
	}

	try {
		const team = await Team.findById(request.params.id)

		if (!team) {
			response.status(404).send({ message: 'Team not found' }).end()

			return
		}

		const updatedTeam = {
			...team._doc,
			...request.body,
		}

		await team.updateOne(updatedTeam, { new: true })

		team.save()

		const newTeam = await Team.findById(request.params.id)
			.populate('students')
			.populate('teachers')

		if (newTeam.students.length > 0) {
			await User.updateMany(
				{ _id: { $in: newTeam.students } },
				{ $addToSet: { teams: newTeam._id } }
			)
		}

		if (newTeam.teachers.length > 0) {
			await User.updateMany(
				{ _id: { $in: newTeam.teachers } },
				{ $addToSet: { teams: newTeam._id } }
			)
		}

		response
			.status(200)
			.send({
				data: newTeam,
				message:
					"Successfully updated team. Note if you have **removed** any students, teachers and/or courses you will have to remove this team manually as this call can't remove these relations.",
			})
			.end()
	} catch (error) {
		console.log('Update team error', error)
		if (error._message) {
			response.status(400).send({ message: error._message }).end()

			return
		}

		response
			.status(500)
			.send({ message: 'Something went wrong, please try again later' })
			.end()

		return
	}
}
