import { Box, Button, Container, Flex, Heading, HStack, Stack, Text } from "@chakra-ui/react";

export default function Home() {
	return (
		<Box minH="100vh" bg="#070C18" color="white">
			<Container maxW="7xl" px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
				<Stack gap={{ base: 14, md: 20 }}>
					<Flex align="center" justify="space-between" wrap="wrap" gap={4}>
						<Text fontSize="xl" fontWeight="semibold">
							Frameflow
						</Text>
						<HStack gap={3}>
							<Button asChild variant="outline" borderColor="whiteAlpha.500" _hover={{ bg: "whiteAlpha.100" }}>
								<a href="/login">Sign in</a>
							</Button>
							<Button asChild colorPalette="blue">
								<a href="/app">Open app</a>
							</Button>
						</HStack>
					</Flex>

					<Stack gap={6} maxW="4xl">
						<Heading as="h1" fontSize={{ base: "4xl", md: "6xl" }} lineHeight={{ base: 1.1, md: 1.05 }}>
							Collaborative review workspace for creative projects.
						</Heading>
						<Text color="whiteAlpha.800" fontSize={{ base: "lg", md: "xl" }}>
							Upload files, track reviews, and manage project workflows in one place. Sign in to access your protected project CRUD
							dashboard.
						</Text>
						<HStack gap={4} flexWrap="wrap">
							<Button asChild colorPalette="blue" size="lg" px={8}>
								<a href="/app">Go to app</a>
							</Button>
							<Button asChild size="lg" variant="outline" borderColor="whiteAlpha.600" color="white" _hover={{ bg: "whiteAlpha.100" }} px={8}>
								<a href="/login">Login</a>
							</Button>
						</HStack>
					</Stack>
				</Stack>
			</Container>
		</Box>
	);
}
