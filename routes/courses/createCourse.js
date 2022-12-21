import User from '../../models/user.model.js'
import isEmpty from '../../functions/isEmpty.js'
import roleValidator from '../../functions/roleValidator.js'
import Course from '../../models/course.model.js'
import Team from '../../models/team.model.js'

export default async function createCourse(request, response) {
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
		const course = await Course.create({
			...request.body,
		})

		course.save()

		console.log('Course', course)

		// Checks if the course has teams
		if (course.teams.length > 0) {
			// Adds the course to each team
			await Team.updateMany(
				{ _id: { $in: course.teams } },
				{ $push: { courses: course._id } }
			)

			// Loops through each team and finds their students and teachers and adds the course to them
			course.teams.forEach(async teamId => {
				const team = await Team.findById(teamId)

				// Adds to students if any
				if (team.students.length > 0) {
					console.log('student', course._id)
					const student = await User.updateMany(
						{ _id: { $in: team.students } },
						{ $push: { courses: { course: course._id } } },
						{ new: true }
					)
					console.log('Student', student)
				}

				// Adds to teachers if any
				if (team.teachers.length > 0) {
					console.log('student', course._id)
					const teacher = await User.updateMany(
						{ _id: { $in: team.teachers } },
						{ $push: { courses: { course: course._id } } },
						{ new: true }
					)

					console.log('Teacher', teacher)
				}
			})
		}

		response.status(201).send(course).end()

		return
	} catch (error) {
		response.status(400).send({ message: error.message }).end()

		return
	}
}
