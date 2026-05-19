import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./main-navbar.module.css";

export default function NaiveNavbar(): React.ReactElement {
	const { t, i18n } = useTranslation();

	const linkMap = new Map<string, string>();
	linkMap.set("/", t("nav.home"));
	linkMap.set("/blogs", t("nav.blogs"));
	linkMap.set("/about", t("nav.about"));
	linkMap.set("/toolkit", t("nav.toolkit"));

	const links = Array.from(linkMap).map(([k, v]) => (
		<Link to={k} className={styles.navLink} key={k}>
			{v}
		</Link>
	));

	const handleLanguageChange = (
		event: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const newLanguage = event.target.value;
		i18n.changeLanguage(newLanguage);
		localStorage.setItem("language", newLanguage);
	};

	return (
		<Navbar className={styles.navbar}>
			<Nav className={styles.navContainer}>
				<div className={styles.navItems}>{links}</div>
				<div className={styles.languageSelector}>
					<select
						value={i18n.language}
						onChange={handleLanguageChange}
						className={styles.languageDropdown}
					>
						<option value="en">{t("language.en")}</option>
						<option value="zh">{t("language.zh")}</option>
					</select>
				</div>
			</Nav>
		</Navbar>
	);
}
