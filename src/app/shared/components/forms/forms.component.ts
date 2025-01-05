import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { reinitializePreline } from '../../utils/reinitializePreline';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [NgTemplateOutlet, ReactiveFormsModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormsComponent {

  @Input() form!: FormGroup;
  @Input() btnTemplates!: TemplateRef<HTMLElement>;
  @Input() inputTemplates!: TemplateRef<HTMLElement>;

  ngAfterViewInit(){
    reinitializePreline();
  }
}
