const {
	DEV,
	PROD,
	MODE,

	VITE_API_BASE_URL,
	VITE_OBJ_STORAGE_URL,
} = import.meta.env;

const DEBUG = DEV;

export const ENV = Object.freeze({
	// Vite built-ins
	isDev: DEV,
	isProd: PROD,
	mode: MODE,

	// Custom envs
	API_BASE_URL: VITE_API_BASE_URL,
	OBJECT_STORAGE_URL: VITE_OBJ_STORAGE_URL,

	DEBUG,
});

/**
 * Safely build API URLs
 *
 * Example:
 * getApiUrl('/users')
 * -> https://api.example.com/users
 */
export const getApiUrl = (path: string): string =>
	`${ENV.API_BASE_URL ?? ""}/${path}`.replace(/([^:]\/)\/+/g, "$1");

type LoggerMethod = "log" | "info" | "warn" | "error";

const createLogger =
	(method: LoggerMethod, prefix: string) =>
	(...args: unknown[]): void => {
		if (!DEBUG) return;

		console[method](`[${prefix}]`, ...args);
	};

export const logger = Object.freeze({
	log: createLogger("log", "APP"),
	info: createLogger("info", "APP INFO"),
	warn: createLogger("warn", "APP WARN"),
	error: createLogger("error", "APP ERROR"),
});

/**
 * Development-only environment debug
 */
if (DEV) {
	console.groupCollapsed("⚙️ Environment Configuration");

	console.table({
		MODE: ENV.mode,
		API_BASE_URL: ENV.API_BASE_URL,
		OBJECT_STORAGE_URL: ENV.OBJECT_STORAGE_URL,
	});

	console.groupEnd();
}
