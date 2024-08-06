import { Component, Injector, inject } from '@angular/core';
import {
  DraggableDirective,
  FloatingMenuDirective,
  NgxTiptapModule,
} from 'ngx-tiptap';
import { Editor } from '@tiptap/core';
import { StarterKit } from '@tiptap/starter-kit';
import FloatingMenu from '@tiptap/extension-floating-menu';
import Link from '@tiptap/extension-link';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import Dropcursor from '@tiptap/extension-dropcursor';
import Image from '@tiptap/extension-image';
import GlobalDragHandle from 'tiptap-extension-global-drag-handle';
import Paragraph from '@tiptap/extension-paragraph';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [NgxTiptapModule],
  styleUrls: ['./editor.scss'],
  template: `
    <tiptap-editor [editor]="editor!"></tiptap-editor>
    <tiptap-bubble-menu [editor]="editor!">
      <button (click)="editor?.chain()?.focus()?.toggleBold()?.run()">
        Bold
      </button>
      <button
        (click)="editor?.chain()?.focus()?.toggleHeading({ level: 1 })?.run()"
      >
        H1
      </button>

      <button
        (click)="editor?.chain()?.focus()?.toggleHeading({ level: 2 })?.run()"
      >
        H2
      </button>

      <button
        (click)="editor?.chain()?.focus()?.toggleHeading({ level: 3 })?.run()"
      >
        H3
      </button>
      <button (click)="setLink()">Link</button>
    </tiptap-bubble-menu>
    <tiptap-floating-menu [editor]="editor!">
      <button
        (click)="editor?.chain()?.focus()?.toggleHeading({ level: 1 })?.run()"
      >
        H1
      </button>

      <button
        (click)="editor?.chain()?.focus()?.toggleHeading({ level: 2 })?.run()"
      >
        H2
      </button>

      <button
        (click)="editor?.chain()?.focus()?.toggleHeading({ level: 3 })?.run()"
      >
        H3
      </button>
      <button (click)="editor?.chain()?.focus()?.setLink">Link</button>
    </tiptap-floating-menu>

    <!-- <button class="button-style">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="#000000"
        viewBox="0 0 256 256"
      >
        <path
          d="M104,60A12,12,0,1,1,92,48,12,12,0,0,1,104,60Zm60,12a12,12,0,1,0-12-12A12,12,0,0,0,164,72ZM92,116a12,12,0,1,0,12,12A12,12,0,0,0,92,116Zm72,0a12,12,0,1,0,12,12A12,12,0,0,0,164,116ZM92,184a12,12,0,1,0,12,12A12,12,0,0,0,92,184Zm72,0a12,12,0,1,0,12,12A12,12,0,0,0,164,184Z"
        ></path>
      </svg>
    </button> -->
  `,
})
export class EditorComponent {
  editor?: Editor;
  injector = inject(Injector);

  ngOnInit(): void {
    Paragraph.extend({
      draggable: true,
    });

    this.editor = new Editor({
      content: `
      <p>This is still the text editor you’re used to, but enriched with node views.</p>
      <img src="https://source.unsplash.com/8xznAGy4HcY/800x400" />
      `,
      extensions: [
        GlobalDragHandle,
        Image,
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
        }),
        Paragraph,
        Dropcursor.configure({ width: 2 }),
        BubbleMenu.configure({
          shouldShow: ({ editor, view, state, oldState }) => {
            return editor.isActive('image') || editor.isActive('link');
          },
        }),
        FloatingMenu.configure({
          shouldShow: ({ editor, view, state, oldState }) => {
            // show the floating within any paragraph
            return editor.isEditable;
          },
        }),
        Link.configure({
          autolink: true,
          openOnClick: true,
        }),
      ],
      editorProps: {
        attributes: {
          class:
            'p-2 border-black focus:border-blue-700 border-2 rounded-md outline-none',
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  setLink(): void | null {
    const previousUrl = this.editor?.getAttributes('link')?.['href'];
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      this.editor?.chain().focus().extendMarkRange('link').unsetLink().run();

      return;
    }

    // update link
    this.editor
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: 'https://' + url })
      .run();

    if (!this.editor) {
      return null;
    }
  }
}
