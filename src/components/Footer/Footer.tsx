import React from "react";
import styles from "./footer.module.css";

export default function Footer(): React.ReactElement {
	return (
		<div className={styles.footer}>
			<a
				href="https://beian.miit.gov.cn/"
				target="_blank"
				rel="noreferrer"
				className={styles.footerText}
			>
				浙ICP备18016225号
			</a>
		</div>
	);
}
