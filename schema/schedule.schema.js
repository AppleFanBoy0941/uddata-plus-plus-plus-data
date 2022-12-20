import { Schema } from 'mongoose'
import AttendanceSchema from './attendance.schema'

const ScheduleSchema = new Schema({
	date: Date,
	from: Date,
	to: Date,
	location: String, //TODO: Change to location schema
	teachers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	attendance: [AttendanceSchema],
	team: { type: Schema.Types.ObjectId, ref: 'Team' },
})

export default ScheduleSchema
