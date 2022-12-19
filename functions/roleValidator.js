export default function roleValidator(thisRole, roles) {
	if (!roles) {
		return false
	}

	if (roles.includes(thisRole)) {
		return true
	}

	return false
}
