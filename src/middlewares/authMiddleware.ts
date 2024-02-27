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
	try {
		const token = authorization.split(' ')[1]
		const { id } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload
		const idString = String(id)

		const user = await prisma.user.findFirst({ where: { id: idString }});

		if (!user) {
			return res.status(401).json({ message: 'Não autorizado' })
		}
	
		const { password: _, ...loggedUser } = user
	
		req.user = loggedUser
		
	} catch (error) {
		return res.status(401).json({ message: 'Não autorizado' })
	}

	next()
}
