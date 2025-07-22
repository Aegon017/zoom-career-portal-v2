import { useCallback, useEffect, useState, useMemo } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $createParagraphNode,
    $getNodeByKey,
    $getSelection,
    $isRangeSelection,
    $isRootOrShadowRoot,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    INDENT_CONTENT_COMMAND,
    LexicalEditor,
    NodeKey,
    OUTDENT_CONTENT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
    $isGridSelection, // Corrected: Replaced deprecated version
} from "lexical";
import {
    $createHeadingNode,
    $createQuoteNode,
    $isHeadingNode,
    HeadingTagType,
} from "@lexical/rich-text";
import {
    $getSelectionStyleValueForProperty,
    $isParentElementRTL,
    $patchStyleText,
    $setBlocksType,
} from "@lexical/selection";
import {
    $isListNode,
    INSERT_CHECK_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    ListNode,
    REMOVE_LIST_COMMAND,
} from "@lexical/list";
import {
    $createCodeNode,
    $isCodeNode,
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
    CODE_LANGUAGE_MAP,
    getLanguageFriendlyName,
} from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
    $getNearestBlockElementAncestorOrThrow,
    $getNearestNodeOfType,
    mergeRegister,
} from "@lexical/utils";
import { getSelectedNode } from "../utils/getSelectedNode";
import { sanitizeUrl } from "../utils/url";
// Note: You must provide your own DropDown and DropDownItem components.
// See the explanation below for a placeholder implementation.
import DropDown, { DropDownItem } from "../ui/DropDown";

const blockTypeToBlockName = {
    bullet: "Bulleted List",
    check: "Check List",
    code: "Code Block",
    h1: "Heading 1",
    h2: "Heading 2",
    h3: "Heading 3",
    h4: "Heading 4",
    h5: "Heading 5",
    h6: "Heading 6",
    number: "Numbered List",
    paragraph: "Normal",
    quote: "Quote",
};

const FONT_FAMILY_OPTIONS: [ string, string ][] = [
    [ "Arial", "Arial" ],
    [ "Courier New", "Courier New" ],
    [ "Georgia", "Georgia" ],
    [ "Times New Roman", "Times New Roman" ],
    [ "Trebuchet MS", "Trebuchet MS" ],
    [ "Verdana", "Verdana" ],
];

const FONT_SIZE_OPTIONS: [ string, string ][] = [
    [ "10px", "10px" ],
    [ "11px", "11px" ],
    [ "12px", "12px" ],
    [ "13px", "13px" ],
    [ "14px", "14px" ],
    [ "15px", "15px" ],
    [ "16px", "16px" ],
    [ "17px", "17px" ],
    [ "18px", "18px" ],
    [ "19px", "19px" ],
    [ "20px", "20px" ],
];

// Helper Functions
function getCodeLanguageOptions(): [ string, string ][] {
    const options: [ string, string ][] = [];
    for ( const [ lang, friendlyName ] of Object.entries(
        CODE_LANGUAGE_FRIENDLY_NAME_MAP
    ) ) {
        options.push( [ lang, friendlyName ] );
    }
    return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

function dropDownActiveClass( active: boolean ) {
    return active ? "active dropdown-item-active" : "";
}

// Sub-components
function BlockFormatDropDown( {
    editor,
    blockType,
    disabled = false,
}: {
    blockType: keyof typeof blockTypeToBlockName;
    editor: LexicalEditor;
    disabled?: boolean;
} ): JSX.Element {
    const formatParagraph = () => {
        editor.update( () => {
            const selection = $getSelection();
            if ( $isRangeSelection( selection ) || $isGridSelection( selection ) ) {
                $setBlocksType( selection, () => $createParagraphNode() );
            }
        } );
    };

    const formatHeading = ( headingSize: HeadingTagType ) => {
        if ( blockType !== headingSize ) {
            editor.update( () => {
                const selection = $getSelection();
                if ( $isRangeSelection( selection ) || $isGridSelection( selection ) ) {
                    $setBlocksType( selection, () => $createHeadingNode( headingSize ) );
                }
            } );
        }
    };

    const formatBulletList = () => {
        if ( blockType !== "bullet" ) {
            editor.dispatchCommand( INSERT_UNORDERED_LIST_COMMAND, undefined );
        } else {
            editor.dispatchCommand( REMOVE_LIST_COMMAND, undefined );
        }
    };

    const formatCheckList = () => {
        if ( blockType !== "check" ) {
            editor.dispatchCommand( INSERT_CHECK_LIST_COMMAND, undefined );
        } else {
            editor.dispatchCommand( REMOVE_LIST_COMMAND, undefined );
        }
    };

    const formatNumberedList = () => {
        if ( blockType !== "number" ) {
            editor.dispatchCommand( INSERT_ORDERED_LIST_COMMAND, undefined );
        } else {
            editor.dispatchCommand( REMOVE_LIST_COMMAND, undefined );
        }
    };

    const formatQuote = () => {
        if ( blockType !== "quote" ) {
            editor.update( () => {
                const selection = $getSelection();
                if ( $isRangeSelection( selection ) || $isGridSelection( selection ) ) {
                    $setBlocksType( selection, () => $createQuoteNode() );
                }
            } );
        }
    };

    const formatCode = () => {
        if ( blockType !== "code" ) {
            editor.update( () => {
                let selection = $getSelection();
                if ( $isRangeSelection( selection ) || $isGridSelection( selection ) ) {
                    if ( selection.isCollapsed() ) {
                        $setBlocksType( selection, () => $createCodeNode() );
                    } else {
                        const textContent = selection.getTextContent();
                        const codeNode = $createCodeNode();
                        selection.insertNodes( [ codeNode ] );
                        selection = $getSelection();
                        if ( $isRangeSelection( selection ) )
                            selection.insertRawText( textContent );
                    }
                }
            } );
        }
    };

    return (
        <DropDown
            disabled={ disabled }
            buttonClassName="toolbar-item block-controls"
            buttonIconClassName={ "icon block-type " + blockType }
            buttonLabel={ blockTypeToBlockName[ blockType ] }
            buttonAriaLabel="Formatting options for text style"
        >
            <DropDownItem
                className={ "item " + dropDownActiveClass( blockType === "paragraph" ) }
                onClick={ formatParagraph }
            >
                <i className="icon paragraph" />
                <span className="text">Normal</span>
            </DropDownItem>
            <DropDownItem
                className={ "item " + dropDownActiveClass( blockType === "h1" ) }
                onClick={ () => formatHeading( "h1" ) }
            >
                <i className="icon h1" />
                <span className="text">Heading 1</span>
            </DropDownItem>
            {/* ... other heading levels h2, h3, etc. */ }
            <DropDownItem
                className={ "item " + dropDownActiveClass( blockType === "bullet" ) }
                onClick={ formatBulletList }
            >
                <i className="icon bullet-list" />
                <span className="text">Bullet