import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  twoFactorForm: FormGroup;
  showPassword = false;
  loading = false;
  errorMessage = '';
  show2FA = false;
  rememberMe = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.twoFactorForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit() {
    // If already logged in, redirect straight to dashboard
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.loginForm.valid) return;

    this.loading = true;
    this.errorMessage = '';

    this.auth.login({
      email:    this.loginForm.value.email,
      password: this.loginForm.value.password
    }).subscribe({
      next: response => {
        this.loading = false;
        if ((response as any).requires2FA) {
          this.show2FA = true;
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect';
      }
    });
  }

  submit2FA() {
    if (!this.twoFactorForm.valid) return;

    this.loading = true;
    this.errorMessage = '';

    this.auth.verify2FA(this.twoFactorForm.value.code).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Code invalide';
        this.twoFactorForm.reset();
      }
    });
  }

  signInWithGoogle() {
    this.loading = true;
    this.errorMessage = '';

    this.auth.signInWithGoogle().subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la connexion avec Google';
      }
    });
  }

  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
