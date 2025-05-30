import { LexicalEditor, LexicalNode } from 'lexical';
import { isHTMLElement } from 'lexical';
import { DOMExportOutput } from 'lexical';

export function removeStylesExportDOM(editor: LexicalEditor, target: LexicalNode): DOMExportOutput {
    const output = target.exportDOM(editor);
    if (output && isHTMLElement(output.element)) {
        [output.element, ...output.element.querySelectorAll('[style],[class],[dir="ltr"]')].forEach(el => {
            el.removeAttribute('class');
            el.removeAttribute('style');
            if (el.getAttribute('dir') === 'ltr') el.removeAttribute('dir');
        });
    }
    return output;
}
