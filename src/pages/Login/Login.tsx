import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { login, storeAuthToken } from "@/api/auth-api";
import styles from "./login-page.module.css";

/**
 * Login Page Component
 */
const Login: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		document.title = t("login.title");
	}, [t]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(false);

		// Validation
		if (!name.trim()) {
			setError(t("login.errorNoName"));
			return;
		}

		if (!password.trim()) {
			setError(t("login.errorNoPassword"));
			return;
		}

		setLoading(true);

		try {
			// Call the login API
			const response = await login({ name, password });

			// Store the auth token in localStorage
			if (response.data) {
				storeAuthToken(response.data);
				setSuccess(true);
				setError(null);

				// 获取登录前保存的返回地址
				const returnUrl = localStorage.getItem("returnUrl");

				// 清除保存的返回地址
				localStorage.removeItem("returnUrl");

				// 延迟跳转，让用户看到成功消息
				setTimeout(() => {
					if (returnUrl) {
						// 返回原页面并带上参数，告知打开表单
						navigate(returnUrl + "?openForm=true");
					} else {
						// 没有返回地址，跳转到首页
						navigate("/");
					}
				}, 500);
			} else {
				setError(t("login.errorNoToken"));
			}
		} catch (err) {
			// Handle error
			const errorMessage =
				err instanceof Error ? err.message : t("login.errorDefault");
			setError(errorMessage);
			setSuccess(false);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.loginContainer}>
			<h1 className={styles.loginTitle}>{t("login.heading")}</h1>

			<form onSubmit={handleSubmit} className={styles.loginForm}>
				<div className={styles.formGroup}>
					<label htmlFor="name" className={styles.label}>
						{t("login.name")}
					</label>
					<input
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className={styles.input}
						placeholder={t("login.namePlaceholder")}
						disabled={loading}
						autoComplete="username"
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="password" className={styles.label}>
						{t("login.password")}
					</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className={styles.input}
						placeholder={t("login.passwordPlaceholder")}
						disabled={loading}
						autoComplete="current-password"
					/>
				</div>

				{error && <div className={styles.errorMessage}>{error}</div>}

				{success && (
					<div className={styles.successMessage}>{t("login.loginSuccess")}</div>
				)}

				<button
					type="submit"
					className={styles.submitButton}
					disabled={loading}
				>
					{loading ? t("login.loggingIn") : t("login.loginButton")}
				</button>
			</form>
		</div>
	);
};

export default Login;
