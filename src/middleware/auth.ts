import type { Request, Response, NextFunction } from 'express'
import { getErrorMessage } from "../utils/error.js";

import jwt  from 'jsonwebtoken';
import { error } from 'console';

function authorizeRoles(...allowedRoles: string[]){
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (! token) return res.status(403).json({message: getErrorMessage(error)});
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {id: string, role: string};
            if (! allowedRoles.includes(decoded.role)) {
                return res.status(403).json({message: "access denied"});
            }
            req.user = decoded;
            next ();

        } catch{
            return res.status(403).json({message: "invalid token"})
        }
    };

}

export {authorizeRoles};