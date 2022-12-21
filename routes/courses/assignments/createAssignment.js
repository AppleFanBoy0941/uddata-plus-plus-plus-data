import User from '../../../models/user.model.js'
import isEmpty from '../../../functions/isEmpty.js'
import roleValidator from '../../../functions/roleValidator.js'
import Team from '../../../models/team.model.js'
import Course from '../../../models/course.model.js'

export default async function createAssignment(request, response) {
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

	if (!roleValidator(user.role, ['admin', 'teacher'])) {
		response
			.status(403)
			.send({ message: 'Unauthorized, you do not have rights for this action' })
			.end()

		return
	}

	let studentAssignments = {}
	let team

	try {
		team = await Team.findById(request.body.team)

		if (!team) {
			response.status(404).send({ message: 'Team not found' }).end()

			return
		}

		studentAssignments = team.students.map(student => ({
			student: student,
		}))
	} catch (error) {
		console.log('An error occured when trying to add students from team', error)
		if (error._message) {
			response
				.status(400)
				.send({
					message: 'An error occured when trying to add students from team',
					error: error._message,
				})
				.end()

			return
		}

		response.status(500).send({ message: 'Internal server error' }).end()

		return
	}

	try {
		const assignment = {
			...request.body,
			students: studentAssignments,
			course: request.params.id,
		}

		const course = await Course.findByIdAndUpdate(
			request.params.id,
			{
				$push: { assignments: assignment },
			},
			{ new: true }
		)

		console.log('course', course.assignments[course.assignments.length - 1])

		course.save()

		if (!course) {
			response.status(404).send({ message: 'Course not found' }).end()

			return
		}

		console.log('team.students', team.students)
		console.log(
			'course.assignments[course.assignments.length - 1]._id',
			course.assignments[course.assignments.length - 1]._id
		)

		await User.updateMany(
			{ _id: { $in: team.students } },
			{
				$push: {
					assignments: course.assignments[course.assignments.length - 1]._id,
				},
			}
		)

		response
			.status(200)
			.send({
				message: 'Assignment created',
				data: course.assignments[course.assignments.length - 1],
			})
			.end()
	} catch (error) {
		console.log('Create assignment error', error)
		if (error._message) {
			response
				.status(400)
				.send({
					message: 'An error occured. Could not create assignment in course',
					error: error._message,
				})
				.end()

			return
		}

		response.status(500).send({ message: 'Internal server error' }).end()

		return
	}
}
