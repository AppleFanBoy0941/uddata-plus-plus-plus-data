import User from '../../models/user.model.js'

export default async function deleteUser(request, response) {
	const { id } = request.params
	const { userid } = request

	const user = await User.findById(userid)

	if (user.role !== 'admin') {
		return response.status(403).json({
			message: 'You do not have permission to delete users.',
		})
	}

	try {
		const deletedUser = await User.findByIdAndDelete(id)

		if (!deletedUser) {
			return response.status(404).json({
				message: 'User not found.',
			})
		}

		return response.status(200).json({
			data: deletedUser,
			message: 'User deleted successfully',
		})
	} catch (error) {
		console.log('Delete user error', error)

		return response.status(500).json({
			message: 'Internal server error.',
		})
	}
}
