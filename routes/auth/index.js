import token from './token.js'

export default function auth(app) {
	app.route('/api/v1/auth').post(token)
}
