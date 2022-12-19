import dotenv from 'dotenv'

dotenv.config()

export default function URLBuilder(resource, id) {
	return process.env.HOST_URL + `/api/v1/${resource}/${id}`
}
