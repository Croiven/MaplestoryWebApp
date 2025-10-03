import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  discordUserId: string
  iat: number
  exp: number
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET not configured')
    }

    const decoded = jwt.verify(token, secret) as JwtPayload
    ;(req as any).user = { id: decoded.discordUserId }
    next()
  } catch (error) {
    console.error('Token verification error:', error)
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}
