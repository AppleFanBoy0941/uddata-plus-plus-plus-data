import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.MONGODB_URI

async function main() {
	await mongoose.connect(uri)
	console.log('Connected to MongoDB')
}

main().catch(err => console.log('Error connecting to MongoDB: ', err))
