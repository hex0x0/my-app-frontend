import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { devPathToTitleMap, prodPathToTitleMap } from "@/pages/Blogs/constants";
import styles from "./blog-list-page.module.css";
import { ENV } from "@/config/env";

export default function BlogList(): React.ReactElement {
	const { t } = useTranslation();

	useEffect(() => {
		document.title = t("blog.title");
	}, [t]);

	let pathToTitleMap: Map<string, string>;
	if (ENV.isDev) {
		pathToTitleMap = devPathToTitleMap;
	} else {
		pathToTitleMap = prodPathToTitleMap;
	}

	const items = Array.from(pathToTitleMap).map(([path, title]) => {
		return (
			<li key={path} className={styles.blogItem}>
				<Link
					rel="canonical"
					to={"/blog/" + path}
					className={styles.blogItemLink}
				>
					<h2 className={styles.blogItemTitle}>{title}</h2>
				</Link>
			</li>
		);
	});

	return (
		<div className={styles.blogIndexContainer}>
			<h1 className={styles.blogIndexTitle}>{t("blog.blogList")}</h1>
			<ul className={styles.blogList}>{items}</ul>
		</div>
	);
}
