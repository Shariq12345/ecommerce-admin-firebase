import { NextResponse } from "next/server";
// export function setCorsHeaders(response: NextResponse) {
//   response.headers.set(
//     "Access-Control-Allow-Origin",
//     process.env.NEXT_PUBLIC_FRONTEND_URL || "*"
//   );
//   response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   response.headers.set(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization"
//   );
//   return response;
// }

export function setCorsHeaders(response: NextResponse) {
  // Replace with your actual frontend origin
  const origin = process.env.FRONTEND_URL || "http://localhost:3000";

  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}
