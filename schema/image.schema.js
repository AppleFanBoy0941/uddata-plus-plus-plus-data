import { Schema } from 'mongoose'

const ImageSchema = new Schema({
	originalname: String,
	mimetype: String,
	filename: String,
	path: String,
	size: Number,
})

export default ImageSchema
