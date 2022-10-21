import { Plugin } from "obsidian";

const shorthand: { [key: string]: string } = {
	I: "upper-roman",
	i: "lower-roman",
	A: "upper-alpha",
	a: "lower-alpha",
	"01": "decimal-leading-zero",
	"1": "decimal",
};

const STYLE_MATCHER = /^\s*\{([A-Za-z-0-9]+)\}\s*/;

export default class ListStylePlugin extends Plugin {
	async onload() {
		this.registerMarkdownPostProcessor((el: HTMLElement) => {
			el.querySelectorAll("ol").forEach((list: HTMLElement) => {
				const firstText = getFirstTextNode(
					list.querySelector("li") as Node
				);
				let match;
				if (
					firstText &&
					firstText.textContent &&
					(match = firstText.textContent.match(STYLE_MATCHER))
				) {
					if (shorthand[match[1]]) {
						list.style.listStyleType = shorthand[match[1]];
					} else {
						list.style.listStyleType = match[1];
					}
					firstText.textContent = firstText.textContent.slice(
						match[0].length
					);
				}
			});
		});
	}
}

function getFirstTextNode(node: Node | null): Text | null {
	if (node == null) return null;
	for (let i = 0; i < node.childNodes.length; i++) {
		if (node.childNodes[i].nodeType == Node.TEXT_NODE) {
			return node.childNodes[i] as Text;
		} else if (node.childNodes[i].hasChildNodes()) {
			const childText = getFirstTextNode(node.childNodes[i]);
			if (childText) {
				return childText;
			}
		}
	}
	return null;
}
