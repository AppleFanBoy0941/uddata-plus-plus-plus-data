export default function matchingPrivileges(thisRole, roles) {
	if (!roles) {
		return false
	}

	if (roles.includes(thisRole)) {
		return true
	}

	return false
}
