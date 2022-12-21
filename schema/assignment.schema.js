import { Schema } from 'mongoose'
import FileSchema from './file.schema.js'
import StudentAssignementSchema from './studentAssignement.schema.js'

const AssignmentSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	descriptionFile: FileSchema,
	deadline: {
		type: Date,
		default: Date.now,
	},
	students: [StudentAssignementSchema],
	team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
	course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
})

export default AssignmentSchema
