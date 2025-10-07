export function assertAdmin(request) {
  const headerToken = request.headers.get("x-admin-token");
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken || headerToken !== adminToken) {
    const resBody = JSON.stringify({ success: false, error: "Unauthorized" });
    return new Response(resBody, { status: 401 });
  }
  return null;
}


