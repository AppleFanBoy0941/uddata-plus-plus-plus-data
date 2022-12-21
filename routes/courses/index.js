import auth from '../../middlewares/auth.js'
import createCourse from './createCourse.js'
import assignments from './assignments/index.js'
import getCourses from './getCourses.js'

export default function courses(app) {
	app.route('/api/v1/courses/:id?').all(auth).post(createCourse).get(getCourses)

	assignments(app)
}
