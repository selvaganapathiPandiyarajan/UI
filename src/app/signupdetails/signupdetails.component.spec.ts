import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupdetailsComponent } from './signupdetails.component';

describe('SignupdetailsComponent', () => {
  let component: SignupdetailsComponent;
  let fixture: ComponentFixture<SignupdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignupdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
