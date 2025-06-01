import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/app/lib/firebase-admin";

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get("__session");

    if (!sessionCookie?.value) {
      return NextResponse.json({ isValid: false }, { status: 401 });
    }

    // Verify the session cookie
    await adminAuth.verifySessionCookie(sessionCookie.value, true);
    return NextResponse.json({ isValid: true });
  } catch (error) {
    console.error("Error verifying session:", error);
    return NextResponse.json({ isValid: false }, { status: 401 });
  }
}
