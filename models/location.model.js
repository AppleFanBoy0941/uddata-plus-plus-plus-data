import { model, Schema } from 'mongoose'

const LocationSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	code: {
		type: String,
		required: true,
		trim: true,
	},
	type: {
		type: String,
		enum: ['classroom', 'conferenceroom', 'office', 'workshop', 'dining'],
	},
})

const Location = model('Location', LocationSchema)

export default Location
