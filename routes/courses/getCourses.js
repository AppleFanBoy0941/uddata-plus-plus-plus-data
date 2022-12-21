import { ObjectId } from 'mongodb'
import Course from '../../models/course.model.js'
import dotenv from 'dotenv'
import URLBuilder from '../../functions/URLBuilder.js'

export default async function getCourses(request, response) {
	const { id } = request.params
	const query = request.body

	const limit = parseInt(request.params.limit) || 100
	const skip = parseInt(request.params.skip) || 0

	const userQuery = id ? { _id: ObjectId(id) } : query ? query : {}

	try {
		const courses = await Course.find(userQuery)
			.limit(limit)
			.skip(skip)
			.populate('teams')

		const length = await Course.countDocuments(userQuery)

		const nextLink =
			skip + limit >= length
				? null
				: process.env.HOST_URL +
				  `/api/v1/courses?limit=${limit}&skip=${skip + limit}`
		const prevLink =
			skip === 0
				? null
				: process.env.HOST_URL +
				  `/api/v1/courses?limit=${limit}&skip=${
						skip - limit < 0 ? 0 : skip - limit
				  }`

		const presentation = {
			count: length,
			next: nextLink,
			prev: prevLink,
			data: courses.map(course => ({
				...course._doc,
				url: URLBuilder('courses', course._id),
			})),
		}

		response
			.status(200)
			.send(id ? courses[0] : presentation)
			.end()
	} catch (error) {
		console.log(error)
		if (error._message) {
			response.status(404).send({ message: 'Course not found' }).end()

			return
		}

		response.status(500).send({ message: 'Internal server error' }).end()
	}
}
