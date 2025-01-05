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
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalService } from '../../services/modal/modal.service';
import { ModalContainerComponent } from '../../../shared/components/modal-container/modal-container.component';
import { ModalAttributes } from '../../../shared/utils/app.const';
import { ImageUploaderModalComponent } from '../../../shared/components/image-uploader-modal/image-uploader-modal.component';
import { MessageboxComponent } from '../../../shared/components/messagebox/messagebox.component';
import { MessageBoxService } from '../../services/messageBox/message-box.service';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { ConfirmationModalService } from '../../services/confirmationModal/confirmation-modal.service';
import { VideoPlayerComponent } from '../../../shared/components/video-player/video-player.component';
import { SalesPersonData } from '../nav/class/navbarResponse';
import { VideoPlayerService } from '../../../shared/services/video-player.service';
import { LocalstorageService } from '../../services/essentials/localstorage.service';
import { JobNoLocalStorage } from '../../../shared/enums/app.enums';
import { JobInfoService } from '../../../shared/services/job-info.service';
import { RadioComponent } from "../../../shared/components/radio/radio.component";
import { ReactiveFormsModule } from '@angular/forms';
import { PnplService } from '../nav/services/pnpl.service';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent,
    FooterComponent,
    AvatarComponent,
    ModalContainerComponent,
    MessageboxComponent,
    ConfirmationModalComponent,
    RadioComponent,
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
  private messageBoxService = inject(MessageBoxService);
  private confirmationModalService = inject(ConfirmationModalService);
  private videoPlayerService = inject(VideoPlayerService)
  private pnplService = inject(PnplService);
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

  public jobInfoService = inject(JobInfoService);
  navbarData: SalesPersonData | null = null;

  constructor(private localStorageService: LocalstorageService) {
    
    this.jobNo = this.localStorageService.getItem(JobNoLocalStorage);
    
    this.link = `https://corporate3.bdjobs.com/onlinetest-dashboard.asp?jobno=${this.jobNo}&pgLevelType=${this.examlevel}`;

    
  }
  ngOnInit() {
    this.listenOnLoading();
    this.listenOnModal();
    this.listenOnMessageBox();
    this.listenConfirmationModal();
    setTimeout(() => {
      this.showLiveOnlineBtn();
    },1000);
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
  showLiveOnlineBtn(){
    this.showlivebtn=this.jobInfoService.getJobInfo()?.data.showDeshboardLink;
    this.examlevel=this.jobInfoService.getJobInfo()?.data.examLevel;

    if(this.jobInfoService.getJobInfo()?.data.regionalJob===5){
      this.isPNPLJob.update(()=>true);
    }
  }
  
  private listenOnMessageBox() {
    this.messageBoxService.messageBoxData$
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((data) => {
        this.isEnableMessage.update(() => data.isOpen);
      });
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
  onNavbarDataLoaded(data: SalesPersonData) {
    this.navbarData = data;
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
  pnplPurchase(){
    this.pnplService.pnplPayment(this.selectedIndex);
  }

}
