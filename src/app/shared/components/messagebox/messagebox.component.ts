import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { MessageBoxService } from '../../../core/services/messageBox/message-box.service';
import { FormsModule } from '@angular/forms';
import { ChatMessageRequest } from '../../../features/applicant/class/card-query-builder';
import { ChatMessageData } from '../../../features/applicant/models/applicant.model';
import { filter, interval, Observable, Subscription, switchMap, tap } from 'rxjs';
import { ApiResponse } from '../../models/response';
import { CompanyName, JobNoLocalStorage, UserId } from '../../enums/app.enums';
import { LocalstorageService } from '../../../core/services/essentials/localstorage.service';
import { ChatMessageService } from '../../../features/applicant/services/chat-message.service';
import { ConfirmationModalService,ModalConfig } from '../../../core/services/confirmationModal/confirmation-modal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-messagebox',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './messagebox.component.html',
  styleUrl: './messagebox.component.scss'
})
export class MessageboxComponent implements OnInit {
  applicantName: string = '';
  applicantText: string = '';
  recruiterText: string = '';
  isOpen: boolean = false;
  messageText: string = '';

  private messageBoxService = inject(MessageBoxService);
  @Output() closeMessage = new EventEmitter<void>();
  @Output() saveAction = new EventEmitter<string>();

  msgText: string = '';
  senderType: string = '';
  textSendBy: string = '';
  textReadDate: string = '';
  textSendDate: string = '';
  textSendTime: string = '';
  photoLink: string = '';
  isBlockChat: boolean = false;
  chatMessages: any = [];
  applyId = 0;
  unMuteValue: string = '';
  modalTitle: string = '';
  modalContent: string = '';

  private chatMessageService = inject(ChatMessageService);
  private localStorageService = inject(LocalstorageService);
  private confirmationModalService = inject(ConfirmationModalService);
  private destroyRef = inject(DestroyRef)
  eMessageRData = '';
  eChatPid = '';
  private messagePollingSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.messageBoxService.messageBoxData$.subscribe(data => {
      this.isOpen = data.isOpen;
      if (this.isOpen) {
        this.startPollingMessages();
      } else {
        this.stopPollingMessages();
      }
      if (data.content) {
        this.applicantName = data.content.applicantName || '';
        this.applicantText = data.content.applicantText || '';
        this.recruiterText = data.content.employerText || '';
        this.photoLink = data.content.photoLink || '';
        this.applyId = data.content.applyId || 0;
        this.getChatData();
      }
    });
  }

  startPollingMessages(): void {
    this.stopPollingMessages();
    this.messagePollingSubscription = interval(3000).subscribe(() => {
      this.getMessage();
    });
  }

  stopPollingMessages(): void {
    if (this.messagePollingSubscription) {
      this.messagePollingSubscription.unsubscribe();
      this.messagePollingSubscription = undefined;
    }
  }

  getChatData() {
    const query: ChatMessageRequest = {
      applyId: (this.applyId || '').toString(),
    };

    this.chatMessageService.getChatData(query)
      .pipe(
        tap((res: ApiResponse<ChatMessageData>) => {
          this.eMessageRData = res.data?.eMessageRData?.toString() || '';
          this.eChatPid = res.data?.eChatPid || '';
        }
        ),
        switchMap(() => this.chatMessageService.getMessages({
          encodedValue: (this.eMessageRData).toString(),
          devicetype: 'web',
        })
        )
      ).subscribe({
        next: (res) => {
          if (res.data) {
            this.getMessageCommon(res.data);
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
  receiveMessage() {
    this.messageBoxService.currentMessage$.subscribe(message => {
      if (message.data) {
        this.getMessageCommon(message.data);
      }
    });
  }

  getMessage() {
    const query: ChatMessageRequest = {
      encodedValue: (this.eMessageRData).toString(),
      devicetype: 'web',
    };

    this.chatMessageService.getMessages(query)
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.getMessageCommon(res.data);
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
  }
  getMessageCommon(data: any) {
    this.chatMessages = [];

    data.getChatMessages.forEach((element: any) => {
      const ChatMessageRequest = {
        text: element.text,
        senderType: element.textSenderType,
        sendBy: element.textSendBy,
        sendDate: element.textSendDate,
        sendTime: element.textSendTime
      };
      this.chatMessages.push(ChatMessageRequest);
    });
    this.isBlockChat = data.getChatDataCommon.isblockchat || false;
  }

  sendMessageData(data: ChatMessageData) {
    this.messageBoxService.updateMessage({
      data: { ...data }
    });
  }

  close() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.closeMessage.emit();
      this.chatMessages = [];
      this.messageBoxService.closeMessageBox();
    }
  }

  sendMessage() {
    if (this.messageText.trim()) {
      this.messageSend();
      this.messageText = '';
    }
  }
  BlockUser(data: Number) {
    this.unMuteValue = data.toString();
    this.getBlockUser();
  }
  messageSend() {
    const query: ChatMessageRequest = {
      ePid: this.eChatPid,
      jpid: this.localStorageService.getItem(JobNoLocalStorage),
      devicetype: 'web',
      userid: this.localStorageService.getItem(UserId).toString(),
      message: this.messageText,
      senderType: 'R',
      companyName: this.localStorageService.getItem(CompanyName),
    };
    this.chatMessageService.messageSend(query)
      .subscribe({
        next: (res) => {
          this.getMessage();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  getBlockUser() {
    const query: ChatMessageRequest = {
      ePid: this.eChatPid,
      jpid: this.localStorageService.getItem(JobNoLocalStorage),
      devicetype: 'web',
      action: this.unMuteValue,
    };
    this.chatMessageService.blockMessageUser(query)
      .subscribe({
        next: (res) => {
          this.getMessage();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  private openConfirmationModal(): Observable<ModalConfig> {
    this.modalTitle = 'Confirmation Alert';
    this.modalContent = 'Do you want to mute this applicant now?';
  
    return this.confirmationModalService.openModal({
      isOpen: true,
      content: {
        title: this.modalTitle,
        content: this.modalContent,
        closeButtonText: 'No',
        saveButtonText: 'Yes',
        isCloseButtonVisible: true,
        isSaveButtonVisible: true
      }
    });
  }
  confirmationModal(): void {
    this.openConfirmationModal()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(res => res.event?.isConfirm!!)
      )
      .subscribe({
        next: () => this.BlockUser(1), 
        error: (err) => console.error(err)
      });
    }
}
