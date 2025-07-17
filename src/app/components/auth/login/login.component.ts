// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
    // Vérifier si l'utilisateur est déjà connecté
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      try {
        const response = await this.authService.login(
          this.loginForm.value.email,
          this.loginForm.value.password,
          this.rememberMe
        );
        
        if (response.requires2FA) {
          this.show2FA = true;
        } else {
          this.router.navigate(['/dashboard']);
        }
      } catch (error: any) {
        this.errorMessage = error.message || 'Email ou mot de passe incorrect';
      } finally {
        this.loading = false;
      }
    }
  }

  async submit2FA() {
    if (this.twoFactorForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      try {
        await this.authService.verify2FA(this.twoFactorForm.value.code);
        this.router.navigate(['/dashboard']);
      } catch (error: any) {
        this.errorMessage = error.message || 'Code invalide';
        this.twoFactorForm.reset();
      } finally {
        this.loading = false;
      }
    }
  }

  async signInWithGoogle() {
    this.loading = true;
    try {
      await this.authService.signInWithGoogle();
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Erreur lors de la connexion avec Google';
    } finally {
      this.loading = false;
    }
  }

  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}