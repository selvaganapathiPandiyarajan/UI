import { Component, OnInit,EventEmitter, Output} from '@angular/core';
import { FormGroup,FormBuilder, FormControl,Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  public userDetails:any;
public userDetailsvalue:any;
  @Output() dashboardClicked = new EventEmitter<void>();
  @Output() resetClicked = new EventEmitter<void>();
  @Output() logoutClicked = new EventEmitter<void>();

constructor(private router: Router)
{

}
ngOnInit(): void {
    this.userDetails = sessionStorage.getItem('userpage');
    this.userDetailsvalue = JSON.parse(this.userDetails);
}
toggleSidebar() {
  const sidebar = document.getElementById('sidebarMenu');
  sidebar?.classList.toggle('show');
}
  onDashboardClick() {
    this.dashboardClicked.emit();
  }
  onResetClick() {
    this.resetClicked.emit();
  }

  onLogoutClick() {
    this.logoutClicked.emit();
  }  
}
