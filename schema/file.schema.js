import { Schema } from 'mongoose'

const FileSchema = new Schema({
	filename: {
		type: String,
		required: true,
		trim: true,
	},
	originalName: {
		type: String,
		required: true,
		trim: true,
	},
	mimetype: {
		type: String,
		required: true,
		trim: true,
	},
	path: {
		type: String,
		required: true,
		trim: true,
	},
	size: {
		type: Number,
		required: true,
	},
})

export default FileSchema
