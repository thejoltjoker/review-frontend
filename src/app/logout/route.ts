import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const response = NextResponse.redirect(new URL("/", request.url));

	response.cookies.set("accessToken", "", {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		expires: new Date(0),
	});

	response.cookies.set("refreshToken", "", {
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		path: "/",
		expires: new Date(0),
	});

	return response;
}
