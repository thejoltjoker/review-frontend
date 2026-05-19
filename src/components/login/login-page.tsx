"use client";

import {
  Box,
  Button,
  Checkbox,
  Field,
  Flex,
  Heading,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";

export function LoginPage() {
  return (
    <Flex minH="100dvh">
      <Box
        display={{ base: "none", lg: "flex" }}
        flex="1"
        alignItems="center"
        justifyContent="center"
        p="12"
        bg="bg.emphasized"
      >
        <Stack gap="4" maxW="md">
          <Heading size="3xl">Review</Heading>
          <Text color="fg.muted" fontSize="lg">
            Sign in to manage reviews, track progress, and collaborate with your
            team.
          </Text>
        </Stack>
      </Box>

      <Flex flex="1" direction="column" position="relative">
        <Flex justify="flex-end" p="4">
          <ColorModeButton />
        </Flex>

        <Flex flex="1" align="center" justify="center" px="6" pb="12">
          <Box w="full" maxW="md">
            <Stack gap="8">
              <Stack gap="2">
                <Heading size="2xl">Sign in</Heading>
                <Text color="fg.muted">
                  Enter your credentials to continue.
                </Text>
              </Stack>

              <Stack
                as="form"
                gap="5"
                onSubmit={(event) => {
                  event.preventDefault();
                }}
              >
                <Field.Root required>
                  <Field.Label>Email</Field.Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Password</Field.Label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </Field.Root>

                <Flex
                  justify="space-between"
                  align="center"
                  wrap="wrap"
                  gap="3"
                >
                  <Checkbox.Root defaultChecked>
                    <Checkbox.HiddenInput name="remember" />
                    <Checkbox.Control />
                    <Checkbox.Label>Remember me</Checkbox.Label>
                  </Checkbox.Root>
                  <Link href="#" variant="underline">
                    Forgot password?
                  </Link>
                </Flex>

                <Button type="submit" size="lg" w="full">
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
