import { Schema } from 'mongoose'
import FileSchema from './file.schema.js'

const StudentAssignementSchema = new Schema({
	student: { type: Schema.Types.ObjectId, ref: 'User' },
	file: FileSchema,
	grade: {
		type: Number,
		required: false,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	comments: [
		{
			comment: String,
			date: Date,
		},
	],
	feedback: {
		comment: String,
		date: Date,
		teacher: { type: Schema.Types.ObjectId, ref: 'User' },
	},
})

export default StudentAssignementSchema
