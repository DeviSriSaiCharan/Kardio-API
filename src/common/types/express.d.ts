import { JwtPayload } from './jwt-payload.type';

/**
 * Augments the Express Request interface globally so that
 * `request.user` is strongly typed as JwtPayload across the entire project.
 *
 * TypeScript picks this up automatically because it is a `.d.ts`
 * file inside the compiled source tree.
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
