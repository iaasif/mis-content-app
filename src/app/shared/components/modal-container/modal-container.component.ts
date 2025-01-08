import { NgComponentOutlet, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  EventEmitter,
  input,
  Output,
  Type,
  viewChild,
} from '@angular/core';
import { ModalAttributes } from '../../utils/app.const';
export type ModalType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-modal-container',
  standalone: true,
  imports: [NgComponentOutlet, NgStyle],
  templateUrl: './modal-container.component.html',
  styleUrls: ['./modal-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalContainerComponent {
  componentRef = input<Type<any>>(null as unknown as Type<any>);
  attributes = input<Record<string, string | boolean>>(ModalAttributes);
  inputs = input<Record<string, any>>({});
  isClose = input<boolean>(false);
  @Output() onClose = new EventEmitter<boolean>();
  modalWidth = computed(() => {
    if (this.attributes()['modalWidth']) {
      return this.attributes()['modalWidth']
    }
    return '600px';
  })
  modalCloseEl = viewChild<ElementRef>('closeElem');

  oncloseEvent = () => this.onClose.emit(true);

  constructor() {
    effect(() => {
      if (this.isClose()) {
        this.modalCloseEl()?.nativeElement.click();
      }
    });
  }
}
