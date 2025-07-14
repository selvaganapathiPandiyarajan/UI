import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../controller/api.service';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-logindetails',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './logindetails.component.html',
  styleUrl: './logindetails.component.css'
})
export class LogindetailsComponent implements OnInit {

  // Reactive form instance
  public loginForm!: FormGroup;

  // Injecting required Angular services: form builder, router, API, HTTP client
  constructor(
    private form: FormBuilder,
    private router: Router,
    private api: ApiService,
    private http: HttpClient
  ) {
    // Initialize login form with validators
    this.loginForm = this.form.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('[a-z0-9]+@[a-z]+\\.[a-z]{2,3}')
        ])
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[A-Za-z0-9]+$')
        ])
      ]
    });
  }

  ngOnInit(): void {
    // Can be used to run startup logic if needed
  }

  // Login function to authenticate user
  login(): void {
    console.log("Login function triggered");

    // If form is invalid, alert and return
    if (this.loginForm.invalid) {
      alert('Please enter valid email and password');
      return;
    }

    // Call API to get users and check credentials
    this.api.getLogin(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe(res => {
        // Find the matching user based on entered credentials
        const user = res.find((b: any) =>
          b.email === this.loginForm.value.email &&
          b.password === this.loginForm.value.password
        );

        if (user) {
          // Store user in session and redirect to dashboard
          sessionStorage.setItem('userpage', JSON.stringify(user));
          alert('Login successful');
          this.router.navigate(['/user']);
          this.loginForm.reset();
          console.log("User login successful");
        } else {
          alert('Invalid credentials');
        }
      }, err => {
        alert('Login failed. Server error or incorrect details.');
        console.error(err);
      });
  }
}
