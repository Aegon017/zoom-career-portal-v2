import {
    LexicalEditor,
    LexicalNode,
    ParagraphNode,
    TextNode,
    DOMExportOutput,
    DOMExportOutputMap,
    DOMConversionMap,
    Klass
} from 'lexical';
import { removeStylesExportDOM } from './utils/exportHelpers';
import { constructImportMap } from './utils/importHelpers';
import ExampleTheme from './ExampleTheme';

export const editorConfig = {
    namespace: 'React.js Demo',
    theme: ExampleTheme,
    nodes: [ParagraphNode, TextNode],
    onError: (error: Error) => {
        throw error;
    },
    html: {
        export: new Map<Klass<LexicalNode>, (editor: LexicalEditor, node: LexicalNode) => DOMExportOutput>([
            [ParagraphNode, removeStylesExportDOM],
            [TextNode, removeStylesExportDOM],
        ]),
        import: constructImportMap(),
    }
};
