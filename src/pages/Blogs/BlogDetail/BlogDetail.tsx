import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MarkdownRender from "@/components/MarkdownRender/MarkdownRender";
import { prodPathToTitleMap } from "@/pages/Blogs/constants";
import { ENV } from "@/config/env";

export default function MarkdownFetcher(): React.ReactElement {
	const params = useParams<{ path: string }>();
	const [markdown, setMarkdown] = useState<string>("");

	useEffect(() => {
		const loadBlog = async (path: string | undefined) => {
			if (!path) return;

			try {
				let body: string;

				if (ENV.isDev) {
					const module = await import(`@/assets/blogs/${path}.md?raw`);
					body = module.default;
				} else {
					const response = await fetch(
						`${ENV.OBJECT_STORAGE_URL}/blog/${path}.md`,
					);
					body = await response.text();
				}

				setMarkdown(body);
			} catch (e) {
				console.error("Failed to fetch markdown:", e);
				setMarkdown("# Failed to fetch markdown");
			}
		};

		loadBlog(params.path);
	}, [params.path]);

	const title = params.path
		? prodPathToTitleMap.get(params.path) || params.path
		: "Untitled";

	return <MarkdownRender title={title} markdown={markdown} />;
}
