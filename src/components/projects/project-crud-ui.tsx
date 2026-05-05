"use client";

import { Badge, Box, Button, Field, Flex, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { components } from "@/lib/api/v1";

type ProjectDto = components["schemas"]["ProjectDto"];

type Project = {
	id: string;
	name: string;
	createdAt?: string;
};

function mapProject(project: ProjectDto): Project | null {
	if (!project.id || !project.name) {
		return null;
	}

	return {
		id: project.id,
		name: project.name,
		createdAt: project.createdAt,
	};
}

function formatDate(isoDate?: string) {
	if (!isoDate) {
		return "Unknown date";
	}

	return new Intl.DateTimeFormat("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(isoDate));
}

export function ProjectCrudUI() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [query, setQuery] = useState("");
	const [name, setName] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

	const filteredProjects = useMemo(() => {
		const normalized = query.trim().toLowerCase();

		if (!normalized) {
			return projects;
		}

		return projects.filter((project) => {
			return project.name.toLowerCase().includes(normalized);
		});
	}, [projects, query]);

	const loadProjects = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/projects");
			const data = (await response.json()) as ProjectDto[] | { message?: string };

			if (!response.ok) {
				setError("message" in data ? (data.message ?? "Unable to load projects.") : "Unable to load projects.");
				return;
			}

			const mapped = Array.isArray(data) ? data.map(mapProject).filter((project): project is Project => !!project) : [];
			setProjects(mapped);
		} catch {
			setError("Unable to load projects.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		void loadProjects();
	}, []);

	const resetForm = () => {
		setName("");
		setEditingId(null);
		setError(null);
	};

	const handleSubmit = async (event: FormEvent<HTMLDivElement>) => {
		event.preventDefault();
		setError(null);

		if (!name.trim()) {
			setError("Project name is required.");
			return;
		}

		setIsSaving(true);

		try {
			if (editingId) {
				const response = await fetch(`/api/projects/${editingId}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ name: name.trim() }),
				});

				if (!response.ok) {
					const data = (await response.json()) as { message?: string };
					setError(data.message ?? "Unable to update project.");
					return;
				}
			} else {
				const response = await fetch("/api/projects", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ name: name.trim() }),
				});

				if (!response.ok) {
					const data = (await response.json()) as { message?: string };
					setError(data.message ?? "Unable to create project.");
					return;
				}
			}

			resetForm();
			await loadProjects();
		} catch {
			setError(editingId ? "Unable to update project." : "Unable to create project.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleEdit = (project: Project) => {
		setEditingId(project.id);
		setName(project.name);
		setError(null);
	};

	const handleDelete = async (projectId: string) => {
		setError(null);
		setIsDeletingId(projectId);

		try {
			const response = await fetch(`/api/projects/${projectId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const data = (await response.json()) as { message?: string };
				setError(data.message ?? "Unable to delete project.");
				return;
			}

			setProjects((currentProjects) => currentProjects.filter((project) => project.id !== projectId));

			if (projectId === editingId) {
				resetForm();
			}
		} catch {
			setError("Unable to delete project.");
		} finally {
			setIsDeletingId(null);
		}
	};

	return (
		<Stack gap={5}>
			<Box border="1px solid" borderColor="#1F2A40" borderRadius="xl" bg="#0F1728" p={{ base: 4, md: 5 }}>
				<Stack as="form" gap={4} onSubmit={handleSubmit}>
					<Flex justify="space-between" align="center" wrap="wrap" gap={3}>
						<Text fontSize="xl" fontWeight="semibold" color="white">
							Project CRUD
						</Text>
						<Badge colorPalette={editingId ? "orange" : "blue"} textTransform="none" px={2}>
							{editingId ? "Update mode" : "Create mode"}{isSaving ? " • Saving..." : ""}
						</Badge>
					</Flex>

					<Field.Root required invalid={!!error}>
						<Field.Label>Project name</Field.Label>
						<Input
							value={name}
							onChange={(event) => setName(event.target.value)}
							placeholder="Enter project name"
							bg="#10192B"
							borderColor="#26324A"
							disabled={isSaving}
						/>
						{error ? <Field.ErrorText>{error}</Field.ErrorText> : null}
					</Field.Root>

					<HStack gap={3} flexWrap="wrap">
						<Button type="submit" colorPalette="blue" loading={isSaving} disabled={isSaving}>
							{editingId ? "Update project" : "Create project"}
						</Button>
						{editingId ? (
							<Button type="button" variant="outline" onClick={resetForm} disabled={isSaving}>
								Cancel edit
							</Button>
						) : null}
					</HStack>
				</Stack>
			</Box>

			<Box border="1px solid" borderColor="#1F2A40" borderRadius="xl" bg="#0F1728" p={{ base: 4, md: 5 }}>
				<Stack gap={4}>
					<Flex justify="space-between" align="center" wrap="wrap" gap={3}>
						<Text fontSize="lg" fontWeight="semibold" color="white">
							Projects ({isLoading ? "..." : filteredProjects.length})
						</Text>
						<Input
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Search projects..."
							maxW={{ base: "full", md: "280px" }}
							bg="#10192B"
							borderColor="#26324A"
							disabled={isLoading}
						/>
					</Flex>

					<Stack gap={3}>
						{isLoading ? (
							<Box border="1px dashed" borderColor="#2A3550" borderRadius="lg" px={4} py={8}>
								<Text textAlign="center" color="#8A97B7">
									Loading projects...
								</Text>
							</Box>
						) : null}

						{filteredProjects.map((project) => (
							<Box key={project.id} border="1px solid" borderColor="#1C2940" borderRadius="lg" bg="#0E1525" px={4} py={3}>
								<Flex justify="space-between" align={{ base: "start", md: "center" }} gap={3} direction={{ base: "column", md: "row" }}>
									<Stack gap={1}>
										<HStack gap={2} flexWrap="wrap">
											<Text color="#EDF2FF" fontWeight="medium">
												{project.name}
											</Text>
										</HStack>
										<Text color="#6F7EA3" fontSize="xs">
											Created {formatDate(project.createdAt)}
										</Text>
									</Stack>

									<HStack gap={2}>
										<Button size="sm" variant="outline" onClick={() => handleEdit(project)} disabled={isSaving || isDeletingId === project.id}>
											<FiEdit2 />
											<Box as="span" ml={2}>
												Edit
											</Box>
										</Button>
										<Button
											size="sm"
											colorPalette="red"
											variant="subtle"
											onClick={() => handleDelete(project.id)}
											loading={isDeletingId === project.id}
											disabled={isSaving || isDeletingId === project.id}
										>
											<FiTrash2 />
											<Box as="span" ml={2}>
												Delete
											</Box>
										</Button>
									</HStack>
								</Flex>
							</Box>
						))}

						{!isLoading && filteredProjects.length === 0 ? (
							<Box border="1px dashed" borderColor="#2A3550" borderRadius="lg" px={4} py={8}>
								<Text textAlign="center" color="#8A97B7">
									No projects match your search.
								</Text>
							</Box>
						) : null}
					</Stack>
				</Stack>
			</Box>
		</Stack>
	);
}
