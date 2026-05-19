/**
 * Authentication API utilities
 */

import { getApiUrl, logger } from "@/config/env";

export interface LoginRequest {
	name: string;
	password: string;
}

export interface LoginResponse {
	code: string;
	message: string;
	data: string; // JWT token
}

/**
 * Login user with name and password
 * @param credentials User credentials
 * @returns Auth token
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
	try {
		const response = await fetch(getApiUrl("/account/verify-v2"), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: credentials.name,
				password: credentials.password,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				errorData.message || `Login failed: ${response.statusText}`,
			);
		}

		const data: LoginResponse = await response.json();

		// Check if login was successful (code should be "0")
		if (data.code !== "0") {
			throw new Error(data.message || "Login failed");
		}

		logger.log("Login successful");

		return data;
	} catch (error) {
		logger.error("Login error:", error);
		throw error;
	}
}

/**
 * Store auth token in localStorage
 * @param token Auth token
 */
export function storeAuthToken(token: string): void {
	try {
		localStorage.setItem("authToken", token);
		logger.log("Auth token stored in localStorage");
	} catch (error) {
		logger.error("Failed to store auth token:", error);
		throw new Error("Failed to store authentication token", { cause: error });
	}
}

/**
 * Get auth token from localStorage
 * @returns Auth token or null
 */
export function getAuthToken(): string | null {
	try {
		return localStorage.getItem("authToken");
	} catch (error) {
		logger.error("Failed to get auth token:", error);
		return null;
	}
}

/**
 * Remove auth token from localStorage
 */
export function removeAuthToken(): void {
	try {
		localStorage.removeItem("authToken");
		logger.log("Auth token removed from localStorage");
	} catch (error) {
		logger.error("Failed to remove auth token:", error);
	}
}

/**
 * Check if user is authenticated
 * @returns True if user has a token
 */
export function isAuthenticated(): boolean {
	return !!getAuthToken();
}
