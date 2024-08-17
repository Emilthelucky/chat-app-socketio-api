import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import compression from 'compression'
import http from 'http'
import { config } from 'dotenv'
import router from './router/index'
import { checkUser } from './middlewares/index'
import { Server } from 'socket.io'

config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URL = process.env.MONGO_URL

app.use(cors())
app.use(compression())
app.use(cookieParser())
app.use(express.json())
// app.use(checkUser)

const server = http.createServer(app)

export const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id)

    socket.on('registerUser', (userId) => {
        socket.join(userId)
        console.log(`User ${userId} joined room ${userId}`)
    })

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
    })
})

app.use('/api', router)

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})

mongoose.Promise = Promise
mongoose.connect(MONGO_URL, {
    dbName: 'TS_API',
})

mongoose.connection.on('error', (error: Error) => {
    console.log('MongoDB connection error:', error)
})

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB')
})

mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB')
})
