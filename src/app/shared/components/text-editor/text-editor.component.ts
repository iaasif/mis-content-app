import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [ReactiveFormsModule, NgxEditorModule, NgClass,NgStyle],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextEditorComponent {
  @Input() placeholder = 'Type here...';
  @Input() label = 'Label';
  type = input<InputTypeTextEditor>('Advance');
  @Input() isRequired: boolean = false;
  @Input() name = "";
  @Input() height = '250px';
  @Input() control: any;

  toolbar = computed(() => {
    if (this.type() === 'Advance') {
      return this.fullOptions;
    } else if(this.type() === 'Basic'){
      return [
        ['bold', 'italic'],
        ['code', 'blockquote'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['link'],
        ['undo', 'redo'],
      ] as Toolbar;
    } else if(this.type() === 'Minimal'){
      return [
        ['superscript','subscript'],
        ['bold', 'italic'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
      ] as Toolbar;
    }
    return this.fullOptions;
  })

  fullOptions: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear', 'indent', 'outdent'],
    ['superscript', 'subscript'],
    ['undo', 'redo'],
  ];

  editor!: any;
  html!: '';

  async ngOnInit() {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

}

export type InputTypeTextEditor = 'Minimal' | 'Basic' | 'Advance';


