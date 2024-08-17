import express from 'express'
import { Request, Response, NextFunction } from 'express'
import { get, merge } from 'lodash'
import { getUserBySessionToken } from '../models/user'

export const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionToken = req.cookies['AUTH']
        console.log(sessionToken)

        if (!sessionToken) {
            return res.status(400).json({ message: 'SESSION_EXPIRED' })
        }

        const existingUser = await getUserBySessionToken(sessionToken)

        if (!existingUser) {
            return res.status(400)
        }

        merge(req, { identity: existingUser })

        return next()
    } catch (error) {
        console.log(error)
        return res.status(400)
    }
}

export const checkUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionToken = req.cookies['AUTH']

        if (!sessionToken) {
            return next()
        }

        const existingUser = await getUserBySessionToken(sessionToken)

        if (!existingUser) {
            return next()
        }

        merge(req, { identity: existingUser })

        return next()
    } catch (error) {
        console.log(error)
        return res.status(400)
    }
}

export const isAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params
        const currentUserId = get(req, 'identity._id')

        if (!currentUserId) {
            next()
        }

        const currentUserIdStr = String(currentUserId)

        console.log(id)
        console.log(currentUserIdStr)
        if (id !== currentUserIdStr) {
            next()
        }

        return next()
    } catch (error) {
        console.log(error)
        res.status(400)
    }
}
