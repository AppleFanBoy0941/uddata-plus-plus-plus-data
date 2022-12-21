import assignRoles from '../../functions/assignRoles.js'
import isEmpty from '../../functions/isEmpty.js'
import User from '../../models/user.model.js'

export default async function updateUser(request, response) {
	if (isEmpty(request.body)) {
		response.status(400).send('No information recieved').end()

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

	const role = user.role

	const privileges = assignRoles(
		{ role, self: request.userid === request.params.id },
		{
			admin: [
				'first_name',
				'last_name',
				'email',
				'address',
				'avatar',
				'phone',
				'teams',
				'courses',
			],
			teacher: ['courses'],
			student: [],
			self: ['first_name', 'last_name', 'email', 'address', 'avatar', 'phone'],
		}
	)

	if (privileges.length === 0) {
		response
			.status(403)
			.send({ message: 'Unauthorized, you do not have rights for this action' })
			.end()

		return
	}

	const update = {}
	const errors = []

	Object.keys(request.body).forEach(newItem => {
		if (privileges.includes(newItem)) {
			update[newItem] = request.body[newItem]
		} else {
			errors.push(newItem)
		}
	})

	try {
		const updatedUser = await User.findByIdAndUpdate(
			request.params.id,
			update,
			{ new: true }
		)

		const presentation = {
			data: isEmpty(update) ? 'No update' : updatedUser,
			message:
				Object.keys(update).length === 0
					? 'No changes made. User could not be updated due to missing privileges'
					: errors.length > 0
					? `These fields were not updated due to missing privileges: ${errors.join(
							', '
					  )}`
					: 'User updated successfully',
		}

		response.status(200).send(presentation).end()
	} catch (error) {
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
