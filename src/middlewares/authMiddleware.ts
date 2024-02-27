import { NextFunction, Request, Response } from 'express'
import { PrismaClient } from "@prisma/client";

import jwt from 'jsonwebtoken'

type JwtPayload = {
	id: number
}

const prisma = new PrismaClient();

export const authMiddleware = async ( req: Request, res: Response, next: NextFunction ) => {
	const { authorization } = req.headers

	if (!authorization) {
		return res.status(401).json({ message: 'Não autorizado' })
	}

	const token = authorization.split(' ')[1]
	return res.json({ token: token })

	next()
}
