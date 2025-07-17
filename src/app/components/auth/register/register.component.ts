import { Component }             from '@angular/core';
import { CommonModule }          from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router }  from '@angular/router';
import { AuthService }           from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const p = form.get('password');
    const c = form.get('confirmPassword');
    if (p && c && p.value !== c.value) {
      c.setErrors({ passwordMismatch: true });
    } else {
      c?.setErrors(null);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    this.auth.signup(this.registerForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'An error occurred during registration';
      }
    });
  }
}
