import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginServices } from '../mis/services/login-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-layout',
  imports: [ReactiveFormsModule],
  templateUrl: './login-layout.html',
  styleUrl: './login-layout.css',
})
export class LoginLayout {
  
  
  private fb = inject(FormBuilder);
  private loginServices = inject(LoginServices);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      // call your auth service here
      this.loginServices.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('login success', response);
          this.router.navigate(['']);
        },
        error: (error) => {
          console.log('login error', error);
        }
      });
    }
  }
}
