import { Request, Response } from 'express'

import { PrismaClient } from "@prisma/client";

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();


export class UserController {
	
	async users(req: Request, res: Response) {
  
		try {
		  const users = await prisma.user.findMany({
			  select: {
				password: false,
				name: true,
				email: true,
				createdAt: true
			  },
			  orderBy: [
				{
				  createdAt: 'desc',
				},
			  ]
			  });
			  res.json(users);
		  } catch (error) {
			return res.status(500).json({ message: 'Internal Server Error' })
		}
	};
	  
	async create(req: Request, res: Response) {
		const {name,email,password} = req.body;
		if (!name) {
		  return res.status(400).json({ message: 'O nome é obrigatório' })
		}  
		if (!email) {
		  return res.status(400).json({ message: 'O e-mail é obrigatório' })
		}
		if (!email) {
		  return res.status(400).json({ message: 'A senha é obrigatória' })
		}
		const userExists = await prisma.user.findFirst({where: {email: email}});
		if (userExists) {
		  return res.status(400).json({ message: 'e-mail já cadastrado' })
		}
	  
		const hashPassword = await bcrypt.hash(password, 10)
		
		try {
		  const newUser = await prisma.user.create({
			data: {
			  name,
			  email,
			  password: hashPassword 
			},
		  }); 
		  const { password: _, ...user } = newUser
	  
		  return res.json(user);
		} catch (error) {
			return res.status(500).json({ message: 'Internal Server Error' })
		}
		  
	};
	  
	async login(req: Request, res: Response) {
		const { email, password } = req.body
	  
		const user = await prisma.user.findFirst({ where: { email: email }});
	  
		if (!user) {
		  return res.status(400).json({ message: 'e-mail/Senha inválidos' })
		}
		
		const verifyPass = await bcrypt.compare(password, user.password)
	  
		if (!verifyPass) {
		  return res.status(400).json({ message: 'e-mail/Senha inválidos' })
		}
		
		const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? '', {
		  expiresIn: '8h',
		})
	  
		const { password: _, ...userLogin } = user
	  
		return res.json({
		  user: userLogin,
		  token: token,
		})
	}
}
  