import User from '../../models/user.model.js'
import { ObjectId } from 'mongodb'
import dotenv from 'dotenv'
import URLBuilder from '../../functions/URLBuilder.js'

dotenv.config()

export default async function getUsers(request, response) {
	const id = request.params.id
	const query = request.body.query

	const limit = parseInt(request.query.limit) || 100
	const skip = parseInt(request.query.skip) || 0

	const userQuery = id ? { _id: ObjectId(id) } : query ? query : {}

	try {
		const users = await User.find(userQuery).limit(limit).skip(skip)
		const length = await User.countDocuments(userQuery)

		const nextLink =
			skip + limit >= length
				? null
				: process.env.HOST_URL +
				  `/api/v1/users?limit=${limit}&skip=${skip + limit}`

		const prevLink =
			skip === 0
				? null
				: process.env.HOST_URL +
				  `/api/v1/users?limit=${limit}&skip=${
						skip - limit < 0 ? 0 : skip - limit
				  }`

		const presentation = {
			count: length,
			next: nextLink,
			prev: prevLink,
			data: users.map(user => ({
				...user._doc,
				url: URLBuilder('users', user._id),
			})),
		}

		response
			.status(200)
			.send(id ? users[0] : presentation)
			.end()
	} catch (error) {}
}
