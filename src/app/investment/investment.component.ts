import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../controller/api.service';
import { NavComponent } from '../nav/nav.component';
import { InvestDetails } from '../model/invest-details.model';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-investment',
  standalone: true,
  imports: [
    NavComponent,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './investment.component.html',
  styleUrl: './investment.component.css',
})
export class InvestmentComponent implements OnInit {
  public investForm!: FormGroup;
  public userDetails: any;
  public userDetailsValue: any;

  public investAdd: InvestDetails = new InvestDetails();

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private http: HttpClient,
    private router: Router
  ) {
    this.investForm = this.formBuilder.group({
      date: ['', Validators.required],
      Asset: [null, Validators.required],
      Quantity: ['', Validators.required],
      text: ['', Validators.required],
      Investor: [null, Validators.required],
      price: [''],
    });
  }

  ngOnInit(): void {
    const sessionData = sessionStorage.getItem('userpage');
    if (sessionData) {
      this.userDetails = sessionData;
      this.userDetailsValue = JSON.parse(this.userDetails);
    }
  }

  investSubmit(): void {
    console.log('Inside investSubmit()');

    this.investAdd.firstname = this.userDetailsValue.firstname;
    this.investAdd.lastname = this.userDetailsValue.lastname;
    this.investAdd.email = this.userDetailsValue.email;
    this.investAdd.contact = this.userDetailsValue.contact;

    this.investAdd.date = this.investForm.value.date;
    this.investAdd.Asset = this.investForm.value.Asset;
    this.investAdd.Quantity = this.investForm.value.Quantity;
    this.investAdd.text = this.investForm.value.text;
    this.investAdd.Inverstor = this.investForm.value.Investor;
    this.investAdd.price = this.investForm.value.price;

    this.api.post1(this.investAdd).subscribe(
      (res) => {
        console.log(res);
        alert('Invested Successfully');
        document.getElementById('cancel')?.click();
        this.router.navigate(['/user']);
        this.investForm.reset();
      },
      (err) => {
        alert('Something went wrong');
      }
    );
  }
}
