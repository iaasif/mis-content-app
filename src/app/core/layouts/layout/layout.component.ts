import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  Type,
} from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { CircularLoaderService } from '../../services/circularLoader/circular-loader.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalService } from '../../services/modal/modal.service';
import { ModalContainerComponent } from '../../../shared/components/modal-container/modal-container.component';
import { ModalAttributes } from '../../../shared/utils/app.const';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalService } from '../../services/confirmationModal/confirmation-modal.service';
import { VideoPlayerService } from '../../../shared/services/video-player.service';
import { LocalstorageService } from '../../services/essentials/localstorage.service';
import { JobNoLocalStorage } from '../../../shared/enums/app.enums';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent,
    ModalContainerComponent,
    ConfirmationModalComponent,
    ReactiveFormsModule
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LayoutComponent implements OnInit {
  private circularLoaderService = inject(CircularLoaderService);
  private destroy$ = inject(DestroyRef);
  private modalService = inject(ModalService);
  private confirmationModalService = inject(ConfirmationModalService);
  private videoPlayerService = inject(VideoPlayerService);
  jobNo: string='';
  link: string='';
  isLoading = signal<boolean>(false);
  selectedComponent = signal<Type<any>>(null as any);
  modalAttributes = signal<Record<string, string | boolean>>(ModalAttributes);
  inputs = signal<Record<string, any>>({});
  isEnableMessage = signal<boolean>(false);
  isEnableConfirmation = signal<boolean>(false);
  getModalTitle = signal<string>('');
  getModalContent = signal<string>('');
  isOpen = signal<boolean>(false);
  getOpenButtonText = signal<string>('');
  getCloseButtonText = signal<string>('');
  getSaveButtonText = signal<string>('');
  isClose = signal<boolean>(false);
  showlivebtn:boolean=false;
  examlevel:number=0;
  isPNPLJob=signal<boolean>(false);
  selectedIndex=1;
  priceList= [
    { text: 'Unlock All Contacts', value: 5145 },
    { text: 'Unlocked 5 Contacts', value: 1040 },
    { text: 'Unlocked 10 Contacts', value: 1575 },
    { text: 'Unlocked 15 Contacts', value: 1995 },
    { text: 'Unlocked 20 Contacts', value: 2615 },
  ];
  isPricingSectionVisible=true;
  purchase='You haven’t purchased yet.';

  constructor(private localStorageService: LocalstorageService) {
    this.jobNo = this.localStorageService.getItem(JobNoLocalStorage);
    this.link = `https://corporate3.bdjobs.com/onlinetest-dashboard.asp?jobno=${this.jobNo}&pgLevelType=${this.examlevel}`;    
  }
  
  ngOnInit() {
    this.listenOnLoading();
    this.listenOnModal();
    this.listenConfirmationModal();
    this.onClickPriceList();
  }

  private listenOnLoading() {
    this.circularLoaderService.loadingState$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((loading) => {
        this.isLoading.update(() => loading);
      });
  }

  private listenOnModal() {
    this.modalService.modalConfig$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((config) => {
        if (config.isClose) {
          this.isClose.update(() => true);
        } else if (config.componentRef) {
          this.selectedComponent.update(() => config.componentRef);
          this.modalAttributes.update(() => config.attributes);
          this.inputs.update(() => (config.inputs ? config.inputs : {}));
        }
      });
  }

  onCloseEvent(event: boolean) {
    this.selectedComponent.update(() => null as any);
    if (event) {
      this.isClose.update(() => false);
    }
    this.modalService.onCloseModalSubject.next(true);
    this.inputs.update(() => ({}));
    this.videoPlayerService.resetVideoPlayerStatus()
  }

  private listenConfirmationModal() {
    this.confirmationModalService.modalConfig$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((config) => {
        this.isEnableConfirmation.update(() => config.isOpen ?? false);
      });
  }

  toggleModal(event: boolean): void {
    this.isOpen.set(event);
  }
  saveChanges(event: boolean): void {
    this.isOpen.set(event);
  }

  onClickPriceList() {
    this.isPricingSectionVisible = false;
  }
  onClickStat(){
    this.isPricingSectionVisible = true;
    this.purchase="You haven’t purchased yet."
  }

  onRadioChange(index: number): void {
    this.selectedIndex = index;
  }

}
