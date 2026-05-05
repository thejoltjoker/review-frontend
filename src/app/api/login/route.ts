import { NextResponse } from "next/server";
import { client } from "@/lib/api/client";
import type { components } from "@/lib/api/v1";

type LoginRequest = components["schemas"]["LoginRequest"];

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as LoginRequest;

		if (!body?.email || !body?.password) {
			return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
		}

		const { data, error, response } = await client.POST("/login", {
			body: {
				email: body.email,
				password: body.password,
			},
		});

		if (error || !response.ok || !data?.accessToken || !data?.refreshToken) {
			return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
		}

		const responseBody = {
			accessToken: data.accessToken,
			refreshToken: data.refreshToken,
			expiresIn: data.expiresIn,
			tokenType: data.tokenType,
		};

		const responseData = NextResponse.json(
			{
				...responseBody,
			},
			{ status: 200 },
		);

		// Keep tokens in httpOnly cookies so authenticated routes can be protected server-side.
		responseData.cookies.set("accessToken", data.accessToken, {
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: typeof data.expiresIn === "number" ? data.expiresIn : 60 * 60,
		});

		responseData.cookies.set("refreshToken", data.refreshToken, {
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: 60 * 60 * 24 * 30,
		});

		return responseData;
	} catch {
		return NextResponse.json({ message: "Unable to process login request." }, { status: 500 });
	}
}
