import { model, Schema } from 'mongoose'

const TeamSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	teachers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
	start_date: {
		type: Date,
		required: true,
		default: Date.now,
	},
	end_date: {
		type: Date,
		required: true,
	},
})

const Team = model('Team', TeamSchema)

export default Team
