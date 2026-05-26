import React, { useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import RemarkMathPlugin from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import EmojiConvertor from "emoji-js";
import { useTranslation } from "react-i18next";

import "katex/dist/katex.min.css";
import styles from "@/components/MarkdownRender/markdown-render.module.css";

const emoji = new EmojiConvertor();

interface CodeBlockProps {
	children?: React.ReactNode;
	className?: string;
}

interface MarkdownRenderProps {
	mdTitle: string;
	mdContent: string;
}

interface TocHeading {
	id: string;
	level: number;
	text: string;
}

function CodeBlock({
	children,
	className,
	...rest
}: CodeBlockProps): React.ReactElement {
	const match = /language-(\w+)/.exec(className || "");
	const lang = match?.[1] ?? "plaintext";

	const codeString = String(children ?? "")
		.replace(/\n$/, "")
		.replace(/\t/g, "    ");

	return (
		<SyntaxHighlighter {...rest} language={lang} style={vs} showLineNumbers>
			{codeString}
		</SyntaxHighlighter>
	);
}

function stripMarkdownSyntax(value: string): string {
	return value
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/<[^>]+>/g, "")
		.replace(/[~*_]/g, "")
		.trim();
}

function normalizeHeadingId(text: string): string {
	const normalized = text
		.toLowerCase()
		.trim()
		.replace(/[^\p{L}\p{N}\s-]/gu, "")
		.replace(/\s+/g, "-");

	return normalized || "section";
}

function extractTocHeadings(markdown: string): TocHeading[] {
	const usedIds = new Map<string, number>();

	return markdown.split(/\r?\n/).reduce<TocHeading[]>((headings, line) => {
		const match = line.match(/^(#{1,6})\s+(.*)$/);

		if (!match) {
			return headings;
		}

		const level = match[1].length;
		const text = stripMarkdownSyntax(match[2]);

		if (!text) {
			return headings;
		}

		const baseId = normalizeHeadingId(text);
		const duplicateCount = usedIds.get(baseId) ?? 0;
		usedIds.set(baseId, duplicateCount + 1);

		headings.push({
			id: duplicateCount === 0 ? baseId : `${baseId}-${duplicateCount}`,
			level,
			text,
		});

		return headings;
	}, []);
}

export default function MarkdownRender({
	mdTitle: mdTitle,
	mdContent: mdContent,
}: MarkdownRenderProps): React.ReactElement {
	const { t } = useTranslation();

	useEffect(() => {
		document.title = `${mdTitle} - hex0x0空间`;
	}, [mdTitle]);

	const headings = useMemo(() => extractTocHeadings(mdContent), [mdContent]);
	const tocHeadings = useMemo(() => {
		const nestedHeadings = headings.filter(
			(heading) => heading.level >= 2 && heading.level <= 4,
		);

		return nestedHeadings.length > 0
			? nestedHeadings
			: headings.filter((heading) => heading.level <= 4);
	}, [headings]);

	return (
		<div className={styles.layout}>
			{tocHeadings.length > 0 && (
				<aside className={styles.toc} aria-label="Table of contents">
					<div className={styles.tocCard}>
						<p className={styles.tocTitle}>{t("blog.toc")}</p>
						<ul className={styles.tocList}>
							{tocHeadings.map((heading) => (
								<li
									key={`${heading.id}-${heading.level}`}
									className={styles.tocItem}
									data-level={heading.level}
								>
									<a href={`#${heading.id}`} className={styles.tocLink}>
										{heading.text}
									</a>
								</li>
							))}
						</ul>
					</div>
				</aside>
			)}

			<div className={styles.markdownRender}>
				<ReactMarkdown
					remarkPlugins={[RemarkMathPlugin, remarkGfm]}
					rehypePlugins={[[rehypeKatex, { strict: false }], rehypeSlug]}
					components={{
						text({ children }) {
							const text = String(children);
							return text.replace(/:\w+:/g, (name) =>
								emoji.replace_colons(name),
							);
						},
						code({ children, className }) {
							return <CodeBlock className={className}>{children}</CodeBlock>;
						},
					}}
				>
					{mdContent}
				</ReactMarkdown>
			</div>
		</div>
	);
}
