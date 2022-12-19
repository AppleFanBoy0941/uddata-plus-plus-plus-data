import auth from '../../middlewares/auth.js'
import createUser from './createUser.js'
import getUsers from './getUsers.js'
import updateUser from './updateUser.js'
import deleteUser from './deleteUser.js'

export default function users(app) {
	app
		.route('/api/v1/users/:id?')
		.all(auth)
		.get(getUsers)
		.post(createUser)
		.patch(updateUser)
		.delete(deleteUser)
}
