import auth from '../../../middlewares/auth.js'
import createAssignment from './createAssignment.js'

export default function assignments(app) {
	app
		.route('/api/v1/courses/:id/assignments/:assignmentId?')
		.all(auth)
		.post(createAssignment)
}
