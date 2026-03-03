export function verifyBasicAuth(authHeader: string | null): boolean {
  const user = process.env.ADMIN_BASIC_USER;
  const pass = process.env.ADMIN_BASIC_PASS;

  if (!user || !pass) {
    return true;
  }

  if (!authHeader?.startsWith("Basic ")) {
    return false;
  }

  const decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf8");
  const [providedUser, providedPass] = decoded.split(":");

  return providedUser === user && providedPass === pass;
}
