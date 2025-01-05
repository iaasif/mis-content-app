import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageboxComponent } from './messagebox.component';
import { ChatMessageService } from '../../../features/applicant/services/chat-message.service';

describe('MessageboxComponent', () => {
  let component: MessageboxComponent;
  let fixture: ComponentFixture<MessageboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageboxComponent],
      providers: [ChatMessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
