"use client";

import { Button, Card, Field, Heading, Input, Link, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSubmit = async (event: FormEvent<HTMLDivElement>) => {
		event.preventDefault();
		setErrorMessage(null);
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
				}),
			});
			const data = (await response.json()) as { accessToken?: string; refreshToken?: string; message?: string };

			if (!response.ok || !data?.accessToken || !data?.refreshToken) {
				setErrorMessage(data.message ?? "Invalid email or password.");
				return;
			}

			router.replace("/app");
			router.refresh();
		} catch {
			setErrorMessage("Something went wrong. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Stack minH="100vh" align="center" justify="center" bg="bg.subtle" px={4} py={{ base: 8, md: 12 }}>
			<Card.Root w="full" maxW={{ base: "sm", md: "md" }} shadow="lg" borderColor="border.subtle">
				<Card.Header>
					<Heading as="h1" size="xl">
						Welcome back
					</Heading>
					<Text color="fg.muted" mt={2}>
						Sign in to continue to your account.
					</Text>
				</Card.Header>

				<Card.Body>
					<Stack as="form" gap={4} onSubmit={handleSubmit}>
						<Field.Root required invalid={!!errorMessage}>
							<Field.Label>Email address</Field.Label>
							<Input
								type="email"
								name="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								placeholder="you@example.com"
								autoComplete="email"
								disabled={isSubmitting}
							/>
						</Field.Root>

						<Field.Root required invalid={!!errorMessage}>
							<Field.Label>Password</Field.Label>
							<Input
								type="password"
								name="password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								placeholder="Enter your password"
								autoComplete="current-password"
								disabled={isSubmitting}
							/>
							{errorMessage ? <Field.ErrorText>{errorMessage}</Field.ErrorText> : null}
						</Field.Root>

						<Button type="submit" colorPalette="blue" size="lg" mt={2} loading={isSubmitting} disabled={isSubmitting}>
							Sign in
						</Button>
					</Stack>
				</Card.Body>

				<Card.Footer justifyContent="space-between" gap={3} flexWrap="wrap">
					<Link href="#" color="fg.muted" fontSize="sm">
						Forgot password?
					</Link>
					<Text color="fg.muted" fontSize="sm">
						No account yet?{" "}
						<Link href="#" colorPalette="blue">
							Create one
						</Link>
					</Text>
				</Card.Footer>
			</Card.Root>
		</Stack>
	);
}
