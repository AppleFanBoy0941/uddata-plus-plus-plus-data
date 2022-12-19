export default function assignRoles(user, roles) {
	console.log(user, roles)
	const array = []

	if (Object.keys(roles).length === 0) {
		throw new Error('No roles provided')
	}

	const role = user.role
	const self = user.self

	console.log('assign role', role, self)

	if (self) {
		const selfPrivileges = roles.self
		array.push(...selfPrivileges)
	}

	switch (role) {
		case 'admin':
			const adminPrivileges = roles.admin
			array.push(...adminPrivileges)
			break
		case 'teacher':
			const teacherPrivileges = roles.teacher
			array.push(...teacherPrivileges)
			break
		case 'student':
			const studentPrivileges = roles.student
			array.push(...studentPrivileges)
			break
		default:
			console.log('Invalid role')
	}

	const privileges = [...new Set(array)]

	return privileges
}
