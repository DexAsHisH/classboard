import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
export declare const protectedAuth: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=protectedAuth.d.ts.map