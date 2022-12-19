import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export default function auth(request, response, next) {
	if (!request.headers.authorization) {
		response.status(401).send('Unauthorized').end()

		return
	}

	const header = request.headers.authorization.split(' ')
	if (header.length !== 2 || header[0].toLowerCase() !== 'bearer') {
		response.status(401).send('Unauthorized').end()

		return
	}

	try {
		const verify = jwt.verify(header[1], process.env.TOKEN_SECRET)
		console.log(verify)
		request.userid = verify.id
		next()
	} catch {
		response.status(401).send('Unauthorized').end()

		return
	}
}
