import React, { useEffect } from "react";
import styles from "./investment-dashboard-page.module.css";

export default function InvestmentDashboard(): React.ReactElement {
	useEffect(() => {
		document.title = "Investment Dashboard - hex0x0空间";
	}, []);

	return (
		<div className={styles.pageContainer}>
			<h1 className={styles.title}>投资数据看板</h1>
			<div className={styles.content}>
				<p className={styles.message}>🚧 Work In Progress 🚧</p>
			</div>
		</div>
	);
}
