import isEmpty from '../../functions/isEmpty.js'
import Team from '../../models/team.model.js'
import User from '../../models/user.model.js'
import Course from '../../models/course.model.js'
import roleValidator from '../../functions/roleValidator.js'

export default async function updateCoure(request, response) {
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

	try {
		const course = await Course.findById(request.params.id)

		if (!course) {
			response.status(404).send({ message: 'Course not found' }).end()

			return
		}

		const updatedCourse = await Course.findByIdAndUpdate(
			request.params.id,
			{ ...request.body },
			{ new: true }
		)
	} catch (error) {
		console.log('Update team error', error)
		if (error._message) {
			response.status(400).send({ message: error._message }).end()

			return
		}

		response.status(500).send({ message: 'Internal server error' }).end()

		return
	}
}
