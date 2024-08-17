import express from 'express'

import { getAllUsers, deleteUser } from '../controllers/me'
import { isAuthenticated, isAdmin } from '../middlewares/index'

const me = express.Router()

me.get('/users', getAllUsers)
me.delete('/users/delete/:id', deleteUser)

export default me
