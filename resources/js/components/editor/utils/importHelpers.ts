import { DOMConversionMap, $isTextNode, TextNode } from 'lexical';
import { parseAllowedColor, parseAllowedFontSize } from '../styleConfig';

function getExtraStyles(el: HTMLElement): string {
    const fontSize = parseAllowedFontSize(el.style.fontSize);
    const bg = parseAllowedColor(el.style.backgroundColor);
    const color = parseAllowedColor(el.style.color);

    let result = '';
    if (fontSize && fontSize !== '15px') result += `font-size: ${fontSize};`;
    if (bg && bg !== 'rgb(255, 255, 255)') result += `background-color: ${bg};`;
    if (color && color !== 'rgb(0, 0, 0)') result += `color: ${color};`;

    return result;
}

export function constructImportMap(): DOMConversionMap {
    const importMap: DOMConversionMap = {};
    const textImporters = TextNode.importDOM() || {};

    for (const [tag, fn] of Object.entries(textImporters)) {
        importMap[tag] = (node) => {
            const importer = fn(node);
            if (!importer) return null;

            return {
                ...importer,
                conversion: (el) => {
                    const result = importer.conversion(el);
                    if (!result || result.after || result.node) return result;

                    const styles = getExtraStyles(el);
                    if (styles) {
                        return {
                            ...result,
                            forChild: (child, parent) => {
                                const textNode = result.forChild(child, parent);
                                if ($isTextNode(textNode)) {
                                    textNode.setStyle(textNode.getStyle() + styles);
                                }
                                return textNode;
                            }
                        };
                    }
                    return result;
                }
            };
        };
    }

    return importMap;
}
