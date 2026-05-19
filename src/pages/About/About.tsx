import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./about-page.module.css";

export default function About(): React.ReactElement {
	const { t } = useTranslation();

	useEffect(() => {
		document.title = t("about.title");
	}, [t]);

	interface Experience {
		date: string;
		company: string;
		role: string;
	}

	const experienceList: Experience[] = [
		{
			date: "about.present",
			company: "about.selfEmployment",
			role: "☀️ 🛌 📖 👨‍🍳 🐱 🔠 🧋 🏋️‍♂️ 🏀 🏖",
		},
		{
			date: "2024-07 - 2026-04",
			company: "about.alibaba",
			role: "about.softwareEngineer",
		},
		{
			date: "2022-02 - 2024-04",
			company: "about.byteDance",
			role: "about.softwareEngineer",
		},
		{
			date: "2019-07 - 2021-12",
			company: "GrowingIO",
			role: "about.softwareEngineer",
		},
	];

	const experienceListDiv = experienceList.map((e) => (
		<div className={styles.timelineItem}>
			<div className={styles.timelineMarker}></div>
			<div className={styles.timelineContent}>
				<div className={styles.timelineDate}>{t(e.date)}</div>
				<div className={styles.timelineCompany}>{t(e.company)}</div>
				<div className={styles.timelineRole}>{t(e.role)}</div>
			</div>
		</div>
	));

	return (
		<div className={styles.aboutContainer}>
			<div className={styles.aboutSection}>
				<h2 className={styles.aboutSectionTitle}>{t("about.experience")}</h2>
				<div className={styles.timeline}>{experienceListDiv}</div>
			</div>

			<div className={styles.aboutSection}>
				<h2 className={styles.aboutSectionTitle}>{t("about.contact")}</h2>
				<div className={styles.contactInfo}>
					<div className={styles.contactItem}>
						<div className={styles.contactIcon}>
							<div className={styles.label}>{t("about.email")}</div>
						</div>
						<div className={styles.contactLink}>sqh1107@gmail.com</div>
					</div>
				</div>
			</div>
		</div>
	);
}
