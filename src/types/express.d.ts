/**
 * Augments the Express Request interface globally so that `request.user`
 * is recognised by TypeScript across the entire project.
 *
 * The shape here matches the JWT payload attached by jwtAuthGuard.
 */
declare namespace Express {
  interface Request {
    user: JwtPayload;
  }
}
