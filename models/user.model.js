import { model, Schema } from 'mongoose'
import ImageSchema from '../schema/image.schema.js'

function validateEmail(email) {
	const match = /.*@\w*.\w{2,3}\.\w{2,3}/

	return match.test(email)
}

const UserSchema = new Schema({
	first_name: {
		type: String,
		required: true,
		trim: true,
	},
	last_name: {
		type: String,
		required: true,
		trim: true,
	},
	role: {
		type: String,
		enum: ['admin', 'student', 'teacher'],
		required: true,
	},
	avatar: ImageSchema,
	email: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		validate: [validateEmail, 'Please fill a valid email address'],
	},
	phone: {
		type: String || Number,
		required: false,
		trim: true,
	},
	password: {
		type: String,
		required: true,
	},
	address: {
		street: {
			type: String,
			trim: true,
			required: true,
		},
		city: {
			type: String,
			trim: true,
			required: true,
		},
		zip: {
			type: Number,
			trim: true,
			required: true,
		},
	},
	teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
	courses: [
		{
			course: { type: Schema.Types.ObjectId, ref: 'Course' },
			role: { type: String, enum: ['student', 'teacher'] },
			grades: {
				assignments: [
					{
						assignment: { type: Schema.Types.ObjectId, ref: 'Assignment' },
						grade: Number,
					},
				],
			},
		},
	],
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date },
})

const User = model('User', UserSchema)

export default User
