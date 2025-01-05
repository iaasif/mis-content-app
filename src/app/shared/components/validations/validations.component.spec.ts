import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationsComponent } from './validations.component';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('ValidationsComponent', () => {
  let component: ValidationsComponent;
  let fixture: ComponentFixture<ValidationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should render required error message if input is empty and submitted', ()=> {
    const formControl = new FormControl('someInput');
    formControl.setErrors({
      required: true
    })
    const submitted = true;
    const name = 'someInput';

    component.formControl = formControl;
    component.submitted = submitted;
    component.name = name;
    fixture.detectChanges();

    const errorMessageElem = fixture.debugElement.query(By.css('.text-red-500'))?.nativeElement;
    expect(errorMessageElem).toBeTruthy();
    expect(errorMessageElem.textContent.trim()).toBe(name + ' is Required');
  });

  it('Should render invalid error message if input is email and invalid address', () => {
    const emailControl = new FormControl('email');
    const name = 'email';
    const submitted = true;
    emailControl.setErrors({
      email: true
    });

    component.formControl = emailControl;
    component.name = name;
    component.submitted = submitted;
    fixture.detectChanges();

    const errorMessageElem = fixture.debugElement.query(By.css('.text-red-500'))?.nativeElement;
    expect(errorMessageElem).toBeTruthy();
    expect(errorMessageElem.textContent.trim()).toBe('Invalid email address');
  })

  it('No Error message rendered when control matches all the requirements', () => {
    const formControl = new FormControl('test');
    formControl.setErrors(null);
    formControl.updateValueAndValidity();
    const name = 'NoError';
    const submitted = true;

    component.formControl = formControl;
    component.name = name;
    component.submitted = submitted;
    fixture.detectChanges();

    const errorMessageElem = fixture.debugElement.query(By.css('.text-red-500'))?.nativeElement;
    expect(errorMessageElem).toBeUndefined(); 
  })

  it('Should show Min length message if the length is less than required', () => {
    const formControl = new FormControl(12345678);
    formControl.setErrors({
      minlength: {
        requiredLength: 11,
        actualLength: 8
      }
    })
    const name = 'NID';
    const submitted = true;

    component.formControl = formControl;
    component.name = name;
    component.submitted = submitted;
    fixture.detectChanges();

    const errorMessageElem = fixture.debugElement.query(By.css('.text-red-500'))?.nativeElement;
    expect(errorMessageElem).toBeTruthy(); 
    expect(errorMessageElem.textContent.trim()).toBe(`Minimum length is ${formControl.errors?.['minlength'].requiredLength}`);
  })

  it('Should show Max length message if the length is more than required', () => {
    const formControl = new FormControl(12345678);
    formControl.setErrors({
      maxlength: {
        requiredLength: 5,
        actualLength: 8
      }
    })
    const name = 'NID';
    const submitted = true;

    component.formControl = formControl;
    component.name = name;
    component.submitted = submitted;
    fixture.detectChanges();

    const errorMessageElem = fixture.debugElement.query(By.css('.text-red-500'))?.nativeElement;
    expect(errorMessageElem).toBeTruthy(); 
    expect(errorMessageElem.textContent.trim()).toBe(`Maximum length is ${formControl.errors?.['maxlength'].requiredLength}`);
  })
});
