import auth from '../../middlewares/auth.js'
import createTeam from './createTeam.js'
import getTeams from './getTeams.js'
import updateTeam from './updateTeam.js'

export default function teams(app) {
	app
		.route('/api/v1/teams/:id?')
		.all(auth)
		.post(createTeam)
		.get(getTeams)
		.patch(updateTeam)
}
