import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./home-page.module.css";

export default function Home(): React.ReactElement {
	const { t } = useTranslation();

	useEffect(() => {
		document.title = t("home.title");
	}, [t]);

	return (
		<div className={styles.home}>
			<div className={styles.content}>
				<div>{t("home.l1Heading")}</div>
			</div>
			<div>{t("home.l2Heading")}</div>
		</div>
	);
}
