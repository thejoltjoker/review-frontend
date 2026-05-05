import { Avatar, Badge, Box, Button, Flex, Grid, GridItem, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { ProjectCrudUI } from "@/components/projects/project-crud-ui";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FiFolder, FiGrid, FiHome, FiSearch, FiUsers } from "react-icons/fi";

const sideNav = [
	{ label: "Home", icon: FiHome, active: true },
	{ label: "Search", icon: FiSearch },
	{ label: "Projects", icon: FiFolder },
];

const tabs = ["Projects", "Members", "Activity", "Settings"];

export default async function AppPage() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken");

	if (!accessToken?.value) {
		redirect("/login");
	}

	return (
		<Box minH="100vh" bg="#070B14" color="#E8EDF8">
			<Grid templateColumns={{ base: "1fr", lg: "260px 1fr" }} minH="100vh">
				<GridItem borderRight="1px solid" borderColor="#1A2030" bg="#0B1120" p={4}>
					<Stack gap={5}>
						<HStack justify="space-between">
							<Text fontWeight="semibold" color="white">
								Caffeine Creations
							</Text>
							<Badge bg="#151E31" color="#A5B4D4" borderRadius="md" px={2} py={1} textTransform="none">
								v
							</Badge>
						</HStack>

						<Button justifyContent="flex-start" bg="#141B2B" color="#D6DEEF" _hover={{ bg: "#1A2336" }}>
							+ New Project
						</Button>

						<Stack gap={1}>
							{sideNav.map((item) => (
								<Button
									key={item.label}
									justifyContent="flex-start"
									variant="ghost"
									color={item.active ? "white" : "#8A97B7"}
									bg={item.active ? "#141B2B" : "transparent"}
									_hover={{ bg: "#141B2B", color: "white" }}
								>
									<item.icon />
									<Box as="span" ml={2}>
										{item.label}
									</Box>
								</Button>
							))}
						</Stack>

						<Box borderTop="1px solid" borderColor="#1A2030" pt={4}>
							<Text fontSize="xs" color="#8A97B7" mb={2}>
								PROJECTS
							</Text>
							<Button justifyContent="flex-start" variant="ghost" w="full" bg="#141B2B" color="white" _hover={{ bg: "#1A2336" }}>
								showreel_2017
							</Button>
						</Box>
					</Stack>
				</GridItem>

				<GridItem p={{ base: 4, md: 6 }}>
					<Stack gap={6}>
						<Flex justify="space-between" align="center" gap={4} wrap="wrap">
							<Input
								placeholder="Jump to project or file..."
								maxW={{ base: "full", md: "360px" }}
								bg="#10192B"
								borderColor="#26324A"
								_placeholder={{ color: "#7D8AAD" }}
							/>

							<HStack gap={3}>
								<Button bg="#141E30" color="#D4DEEF" _hover={{ bg: "#1A263B" }} size="sm">
									Upgrade
								</Button>
								<Avatar.Root size="sm">
									<Avatar.Fallback name="A" />
								</Avatar.Root>
								<Avatar.Root size="sm">
									<Avatar.Fallback name="J" />
								</Avatar.Root>
								<Button asChild size="sm" bg="#4E6BFF" _hover={{ bg: "#5B79FF" }}>
									<a href="/logout">Log out</a>
								</Button>
							</HStack>
						</Flex>

						<Stack gap={3}>
							<Text fontSize="2xl" fontWeight="semibold" color="white">
								Project Workspace
							</Text>
							<HStack gap={5} borderBottom="1px solid" borderColor="#1C2639" pb={3} flexWrap="wrap">
								{tabs.map((item, index) => (
									<Text key={item} color={index === 0 ? "#E8EDF8" : "#8190B3"} fontWeight={index === 0 ? "medium" : "normal"}>
										{item}
									</Text>
								))}
							</HStack>
						</Stack>

						<ProjectCrudUI />

						<HStack color="#7E8CB1" fontSize="sm">
							<FiUsers />
							<Text>3 team members online</Text>
							<FiGrid />
							<Text>4 active projects</Text>
						</HStack>
					</Stack>
				</GridItem>
			</Grid>
		</Box>
	);
}
