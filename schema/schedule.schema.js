import { Schema } from 'mongoose'
import AttendanceSchema from './attendance.schema.js'

const ScheduleSchema = new Schema({
	date: Date,
	from: Date,
	to: Date,
	location: { type: Schema.Types.ObjectId, ref: 'Location' },
	teachers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	attendance: [AttendanceSchema],
	team: { type: Schema.Types.ObjectId, ref: 'Team' },
})

export default ScheduleSchema
