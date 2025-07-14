import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPageComponent } from './forget-page.component';

describe('ForgetPageComponent', () => {
  let component: ForgetPageComponent;
  let fixture: ComponentFixture<ForgetPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgetPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForgetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
