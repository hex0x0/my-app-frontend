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
			<h1 className={styles.toolkitTitle}>{t("toolkit.heading")}</h1>
			<ul className={styles.toolkitLinks}>
				<li className={styles.toolkitItem}>
					<Link to={"mortgage-calculator"} className={styles.toolkitLinkItem}>
						<span className={styles.toolkitLinkIcon}>💰</span>
						<span className={styles.toolkitLinkText}>{t('toolkit.mortgageCalculator.title')}</span>
					</Link>
				</li>
				<li className={styles.toolkitItem}>
					<Link to={"investment-dashboard"} className={styles.toolkitLinkItem}>
						<span className={styles.toolkitLinkIcon}>📈</span>
						<span className={styles.toolkitLinkText}>{t('toolkit.investmentDashboard.title')}</span>
					</Link>
				</li>
			</ul>
		</div>
	);
}
