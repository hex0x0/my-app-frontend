import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MarkdownRender from "@/components/MarkdownRender/MarkdownRender";
import { prodPathToTitleMap } from "@/pages/Blogs/constants";
import { ENV } from "@/config/env";

export default function BlogDetail(): React.ReactElement {
	const params = useParams<{ path: string }>();
	const [mdContent, setMdContent] = useState<string>("");

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
						`${ENV.OBJECT_STORAGE_URL}/blogs/${path}.md`,
					);
					body = await response.text();
				}

				setMdContent(body);
			} catch (e) {
				console.error("Failed to fetch markdown:", e);
				setMdContent("# Failed to fetch markdown");
			}
		};

		loadBlog(params.path);
	}, [params.path]);

	const mdTitle = params.path
		? prodPathToTitleMap.get(params.path) || params.path
		: "Untitled";

	return <MarkdownRender mdTitle={mdTitle} mdContent={mdContent} />;
}
