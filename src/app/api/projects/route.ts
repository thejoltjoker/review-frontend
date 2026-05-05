import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { client } from "@/lib/api/client";
import type { components } from "@/lib/api/v1";

type CreateProjectDto = components["schemas"]["CreateProjectDto"];

function getUnauthorizedResponse() {
	return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export async function GET() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	if (!accessToken) {
		return getUnauthorizedResponse();
	}

	const { data, error, response } = await client.GET("/Projects", {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (error || !response.ok) {
		return NextResponse.json({ message: "Unable to fetch projects." }, { status: response.status || 500 });
	}

	return NextResponse.json(data ?? [], { status: 200 });
}

export async function POST(request: Request) {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	if (!accessToken) {
		return getUnauthorizedResponse();
	}

	try {
		const body = (await request.json()) as CreateProjectDto;

		if (!body?.name?.trim()) {
			return NextResponse.json({ message: "Project name is required." }, { status: 400 });
		}

		const { data, error, response } = await client.POST("/Projects", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			body: {
				name: body.name.trim(),
			},
		});

		if (error || !response.ok) {
			return NextResponse.json({ message: "Unable to create project." }, { status: response.status || 500 });
		}

		return NextResponse.json(data, { status: 200 });
	} catch {
		return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
	}
}
