import { model, Schema } from 'mongoose'
import AssignmentSchema from '../schema/assignment.schema.js'
import ScheduleSchema from '../schema/schedule.schema.js'

const CourseSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	created_at: {
		type: Date,
		default: Date.now,
	},
	assignments: [AssignmentSchema],
	color: String,
	schedules: [ScheduleSchema],
	teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
})

const Course = model('Course', CourseSchema)

export default Course
