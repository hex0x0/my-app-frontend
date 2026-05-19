import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./toolkit-page.module.css";

export default function Toolkit(): React.ReactElement {
	const { t } = useTranslation();

	useEffect(() => {
		document.title = t("toolkit.title");
	}, [t]);

	return (
		<div className={styles.toolkitContainer}>
			<div className={styles.toolkitTitle}>{t("toolkit.heading")}</div>
			<div className={styles.toolkitLinks}>
				<Link to={"investment-dashboard"} className={styles.toolkitLinkItem}>
					<span className={styles.toolkitLinkIcon}>📈</span>
					<span className={styles.toolkitLinkText}>投资数据看板</span>
				</Link>
				<Link to={"mortgage-calculator"} className={styles.toolkitLinkItem}>
					<span className={styles.toolkitLinkIcon}>💰</span>
					<span className={styles.toolkitLinkText}>提前还贷计算器</span>
				</Link>
			</div>
		</div>
	);
}
