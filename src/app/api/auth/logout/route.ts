import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    // Create response with success status
    const response = NextResponse.json({ success: true });

    // Set cookie with past expiry in response headers to delete it
    response.cookies.set({
      name: "__session",
      value: "",
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
