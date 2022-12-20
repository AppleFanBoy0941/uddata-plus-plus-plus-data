import Team from '../../models/team.model.js'
import dotenv from 'dotenv'
import URLBuilder from '../../functions/URLBuilder.js'
import { ObjectId } from 'mongodb'

dotenv.config()

export default async function getTeams(request, response) {
	const { id } = request.params
	const { query } = request.body

	const limit = parseInt(request.params.limit) || 100
	const skip = parseInt(request.params.skip) || 0

	const userQuery = id ? { _id: ObjectId(id) } : query ? query : {}

	try {
		const teams = await Team.find(userQuery)
			.limit(limit)
			.skip(skip)
			.populate('students')
		const length = await Team.countDocuments(userQuery)

		const nextLink =
			skip + limit >= length
				? null
				: process.env.HOST_URL +
				  `/api/v1/teams?limit=${limit}&skip=${skip + limit}`
		const prevLink =
			skip === 0
				? null
				: process.env.HOST_URL +
				  `/api/v1/teams?limit=${limit}&skip=${
						skip - limit < 0 ? 0 : skip - limit
				  }`

		const presentation = {
			count: length,
			next: nextLink,
			prev: prevLink,
			data: teams.map(team => ({
				...team._doc,
				url: URLBuilder('teams', team._id),
			})),
		}

		response
			.status(200)
			.send(id ? teams[0] : presentation)
			.end()
	} catch (error) {
		console.log(error)
		if (error._message) {
			response.status(404).send({ message: 'Team not found' }).end()

			return
		}

		response.status(500).send({ message: 'Internal server error' }).end()

		return
	}
}
