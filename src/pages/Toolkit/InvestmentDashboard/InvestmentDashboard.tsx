import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./investment-dashboard-page.module.css";

export default function InvestmentDashboard(): React.ReactElement {
	const { t } = useTranslation();

	useEffect(() => {
		document.title = t('toolkit.investmentDashboard.title') + ' - hex0x0空间';
	}, [t]);

	return (
		<div className={styles.pageContainer}>
			<h1 className={styles.title}>{t('toolkit.investmentDashboard.title')}</h1>
			<div className={styles.content}>
				<p className={styles.message}>🚧 Work In Progress 🚧</p>
			</div>
		</div>
	);
}
