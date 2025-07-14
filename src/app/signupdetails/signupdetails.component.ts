import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../controller/api.service';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { UserDetails } from '../model/user-details.model';

@Component({
  selector: 'app-signupdetails',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './signupdetails.component.html',
  styleUrl: './signupdetails.component.css'
})
export class SignupdetailsComponent implements OnInit {

  public signupForm!: FormGroup;

  // Flags for UI validation feedback
  public passcon = false;
  public emailcheck = false;
  public cvvCheck = false;
  public accNoCheck = false;

  public otpvalue: any;
  public accDetails: any;
  public accDetailsValue: any;

  // Data object to be sent to backend
  DataAdd: UserDetails = new UserDetails();

  constructor(
    private form: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private api: ApiService
  ) {
    // Form initialization with validators
    this.signupForm = this.form.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern('[a-z0-9]+@[a-z]+\\.[a-z]{2,3}')
      ])],
      lastname: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[A-Za-z]+$')
      ])],
      firstname: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(8),
        Validators.pattern('^[A-Za-z]+$')
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(8),
        Validators.pattern('^[A-Za-z]+$')
      ])],
      conpassword: ['', Validators.required],
      address: ['', Validators.required],
      contact: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ])],
      cardNo: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(12)
      ])],
      Cvv: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(3)
      ])]
    });
  }

  ngOnInit(): void {}

  /**
   * Checks if email already exists in backend.
   */
  checkEmail() {
    this.api.getuser(this.signupForm.value.email).subscribe(res => {
      const match = res.find((a: any) => a.email === this.signupForm.value.email);
      this.emailcheck = !!match;
    }, err => {
      alert('Something went wrong while checking email');
    });
  }

  /**
   * Compares password and confirm password fields.
   */
  checkPassword() {
    const pass = this.signupForm.value.password;
    const conpass = this.signupForm.value.conpassword;
    this.passcon = pass !== conpass;
  }

  /**
   * Generates a 6-digit random OTP.
   */
  getOtp() {
    const min = 100000;
    const max = 999999;
    this.otpvalue = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log("Generated OTP:", this.otpvalue);
  }

  /**
   * Register the user with form data and session-stored account details.
   */
  register() {
    console.log("Inside register function");

    this.getOtp(); // Generate OTP

    // Retrieve account details from session storage
    this.accDetails = sessionStorage.getItem('AccountPage');
    this.accDetailsValue = JSON.parse(this.accDetails);

    // Assign form and account values to user object
    this.DataAdd.firstname = this.signupForm.value.firstname;
    this.DataAdd.lastname = this.signupForm.value.lastname;
    this.DataAdd.email = this.signupForm.value.email;
    this.DataAdd.password = this.signupForm.value.password;
    this.DataAdd.conpassword = this.signupForm.value.conpassword;
    this.DataAdd.address = this.signupForm.value.address;
    this.DataAdd.contact = this.signupForm.value.contact;
    this.DataAdd.cardNo = this.accDetailsValue.CardNO;
    this.DataAdd.Cvv = this.accDetailsValue.Cvv;
    this.DataAdd.Amount = this.accDetailsValue.Amount;
    this.DataAdd.ExDate = this.accDetailsValue.ExDate;
    this.DataAdd.otp = this.otpvalue;

    console.log("Final registration object:", this.DataAdd);

    // Submit registration data to backend
    this.api.post(this.DataAdd).subscribe(res => {
      console.log(res);
      alert("Registered Successfully");

      // Close modal or reset UI (if any)
      let ref = document.getElementById('cancel');
      ref?.click();

      this.router.navigate(['/login']);
      this.signupForm.reset();

    }, err => {
      alert("Something went wrong during registration");
    });
  }

  /**
   * Verifies if card/account number exists in backend.
   */
  checkAccno() {
    console.log("Checking Account Number");

    this.api.getAccno(this.signupForm.value.cardNo).subscribe(res => {
      const match = res.find((a: any) => a.CardNO === this.signupForm.value.cardNo);
      if (match) {
        console.log("Account Number FOUND");
        sessionStorage.setItem('AccountPage', JSON.stringify(match));
        this.accNoCheck = false;
      } else {
        console.log("Account Number NOT FOUND");
        this.accNoCheck = true;
      }
    }, err => {
      alert('Something went wrong while checking account number');
    });
  }
}
