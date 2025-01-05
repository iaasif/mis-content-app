import { ChangeDetectionStrategy, Component, HostListener,EventEmitter, Input, Output, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmationModalService } from '../../../core/services/confirmationModal/confirmation-modal.service';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationModalComponent implements OnInit {
  
  @Input() modalTitle: string = '';
  @Input() modalContent: string = '';
  @Input() isOpen: boolean = false;
  @Input() closeButtonText: string = '';
  @Input() saveButtonText: string = '';

  isCloseButtonVisible: boolean = true;
  isSaveButtonVisible: boolean = true;
  
private confirmationModalService = inject(ConfirmationModalService);
  @Output() saveAction = new EventEmitter<boolean>();
  @Output() closeModal = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.confirmationModalService.modalConfig$.subscribe(data => {
      this.isOpen = data.isOpen || false;
      if (data.content) {
        this.modalTitle = data.content.title || '';
        this.modalContent = data.content.content || '';
        this.closeButtonText = data.content.closeButtonText || '';
        this.saveButtonText = data.content.saveButtonText || '';
        this.isCloseButtonVisible = data.content.isCloseButtonVisible;
        this.isSaveButtonVisible = data.content.isSaveButtonVisible;
      }
    });
  }
  toggleModal(isYes?: boolean) {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.closeModal.emit(false);
    }

    if (!isYes) {
      this.confirmationModalService.modalConfigSubject.next({event: {isConfirm: false}})
    }
  }
  saveChanges() {
    this.confirmationModalService.modalConfigSubject.next({event: {isConfirm: true}})
    this.toggleModal(true);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    // const targetElement = event.target as HTMLElement;
    // if (this.isOpen && targetElement.classList.contains('modal-backdrop')) {
    //   this.toggleModal();
    // }
  }
}