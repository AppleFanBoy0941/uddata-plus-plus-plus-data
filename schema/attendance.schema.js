import { Schema } from 'mongoose'

const AttendanceSchema = new Schema({
	student: { type: Schema.Types.ObjectId, ref: 'User' },
	attended: { type: Boolean, required: true },
	period: { type: Schema.Types.ObjectId, ref: 'Schedule' },
})

export default AttendanceSchema
