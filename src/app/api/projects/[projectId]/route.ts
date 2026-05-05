import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { client } from "@/lib/api/client";
import type { components } from "@/lib/api/v1";

type UpdateProjectDto = components["schemas"]["UpdateProjectDto"];

function getUnauthorizedResponse() {
	return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

type RouteContext = {
	params: Promise<{
		projectId: string;
	}>;
};

export async function PUT(request: Request, context: RouteContext) {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	if (!accessToken) {
		return getUnauthorizedResponse();
	}

	const { projectId } = await context.params;

	if (!projectId) {
		return NextResponse.json({ message: "Project id is required." }, { status: 400 });
	}

	try {
		const body = (await request.json()) as UpdateProjectDto;

		if (!body?.name?.trim()) {
			return NextResponse.json({ message: "Project name is required." }, { status: 400 });
		}

		const { error, response } = await client.PUT("/Projects/{projectId}", {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			params: {
				path: { projectId },
			},
			body: {
				name: body.name.trim(),
			},
		});

		if (error || !response.ok) {
			return NextResponse.json({ message: "Unable to update project." }, { status: response.status || 500 });
		}

		return NextResponse.json({ success: true }, { status: 200 });
	} catch {
		return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
	}
}

export async function DELETE(_request: Request, context: RouteContext) {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	if (!accessToken) {
		return getUnauthorizedResponse();
	}

	const { projectId } = await context.params;

	if (!projectId) {
		return NextResponse.json({ message: "Project id is required." }, { status: 400 });
	}

	const { error, response } = await client.DELETE("/Projects/{projectId}", {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		params: {
			path: { projectId },
		},
	});

	if (error || !response.ok) {
		return NextResponse.json({ message: "Unable to delete project." }, { status: response.status || 500 });
	}

	return NextResponse.json({ success: true }, { status: 200 });
}
