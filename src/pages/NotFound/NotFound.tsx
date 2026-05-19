import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound(): React.ReactElement {
	const location = useLocation();

	return (
		<div className={styles.container}>
			<div className={styles.title}>404</div>
			<div className={styles.subtitle}>
				Page not found: <code>{location.pathname}</code>
			</div>

			<div className={styles.actions}>
				<Link className={styles.link} to="/">
					Go to Home
				</Link>
				<Link className={styles.link} to="/blogs">
					Blogs
				</Link>
				<Link className={styles.link} to="/about">
					About
				</Link>
			</div>
		</div>
	);
}
