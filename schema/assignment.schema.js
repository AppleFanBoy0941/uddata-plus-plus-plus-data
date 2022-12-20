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
		required: true,
		trim: true,
	},
	descriptionFile: FileSchema,
	deadline: {
		type: Date,
		required: true,
	},
	students: [StudentAssignementSchema],
})

export default AssignmentSchema
