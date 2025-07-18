import { Component, OnInit } from '@angular/core';
import { CommonModule }            from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router }    from '@angular/router';
import { AuthService }             from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
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
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    this.twoFactorForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    try {
      const resp = await this.authService.login(this.loginForm.value).toPromise();
      if ((resp as any).requires2FA) {
        this.show2FA = true;
      } else {
        this.router.navigate(['/dashboard']);
      }
    } catch (err: any) {
      this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect';
    } finally {
      this.loading = false;
    }
  }

  async submit2FA() {
    if (this.twoFactorForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    try {
      await this.authService.verify2FA(this.twoFactorForm.value.code).toPromise();
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.errorMessage = err.error?.message || 'Code invalide';
      this.twoFactorForm.reset();
    } finally {
      this.loading = false;
    }
  }

  async signInWithGoogle() {
    this.loading = true;
    try {
      await this.authService.signInWithGoogle().toPromise();
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.errorMessage = err.error?.message || 'Erreur lors de la connexion avec Google';
    } finally {
      this.loading = false;
    }
  }

  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
