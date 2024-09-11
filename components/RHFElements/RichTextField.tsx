import React from 'react';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  LinkBubbleMenu,
  LinkBubbleMenuHandler,
  MenuButtonAddImage,
  MenuButtonAddTable,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonCode,
  MenuButtonEditLink,
  MenuButtonIndent,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonRedo,
  MenuButtonStrikethrough,
  MenuButtonTextColor,
  MenuButtonUnderline,
  MenuButtonUndo,
  MenuButtonUnindent,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  MenuSelectTextAlign,
  ResizableImage,
  RichTextEditorProvider,
  RichTextField as RichTextFieldComponent,
  TableBubbleMenu,
  TableImproved,
  isTouchDevice
} from 'mui-tiptap';
import { useFormContext } from 'react-hook-form';
import { Box, FormHelperText, useTheme } from '@mui/material';
import { Field } from '@/types/common/IForm';
import Divider from '../common/Divider';

// define your extension array
const extensions = [
  TableImproved.configure({
    resizable: true
  }),
  StarterKit,
  Underline,
  TextStyle,
  Color,
  TextAlign,
  ListItem,
  ResizableImage,
  Link.extend({
    inclusive: false
  }).configure({
    autolink: true,
    linkOnPaste: true,
    openOnClick: false
  }),
  LinkBubbleMenuHandler,
  TableRow,
  TableHeader,
  TableCell
];

interface RichTextFieldProps extends Field {}

const RichTextField: React.FC<RichTextFieldProps> = ({ name }) => {
  const { setValue, watch, formState } = useFormContext();
  const theme = useTheme();
  const error = name in formState.errors ? formState.errors[name] : null;

  const watchValue = watch(name);

  const editor = useEditor({
    extensions,
    onUpdate({ editor }) {
      setValue(name, editor.getHTML(), { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    }
  });

  // T
  React.useEffect(() => {
    if (watchValue) {
      editor?.commands.setContent(watchValue);
    }
  }, [watchValue]);

  return (
    <Box sx={{ width: '100%' }}>
      <RichTextEditorProvider editor={editor}>
        <RichTextFieldComponent
          controls={
            <React.Fragment>
              <MenuControlsContainer>
                <MenuButtonBold />
                <MenuButtonItalic />
                <MenuButtonUnderline />
                <MenuButtonStrikethrough />
                <MenuButtonTextColor defaultTextColor={theme.palette.text.primary} />
                <MenuSelectHeading />
                <MenuSelectTextAlign />
                <MenuButtonOrderedList />
                <MenuButtonBulletedList />
              </MenuControlsContainer>
              <Divider />

              <MenuControlsContainer>
                {isTouchDevice() && (
                  <React.Fragment>
                    <MenuButtonIndent />

                    <MenuButtonUnindent />
                  </React.Fragment>
                )}
                <MenuButtonAddImage
                  onClick={() => {
                    const url = window.prompt('Image URL');

                    if (url) {
                      editor?.chain().focus().setImage({ src: url }).run();
                    }
                  }}
                />
                <LinkBubbleMenu />
                <MenuButtonEditLink />
                <TableBubbleMenu />
                <MenuButtonAddTable />
                <MenuButtonUndo />
                <MenuButtonRedo />
                <MenuDivider />
                <MenuButtonCode />
              </MenuControlsContainer>
            </React.Fragment>
          }
        />
      </RichTextEditorProvider>
      {error && <FormHelperText error>{error.message as string}</FormHelperText>}
    </Box>
  );
};

export default RichTextField;
