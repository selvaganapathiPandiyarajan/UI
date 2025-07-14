
import { RouterModule, Routes } from '@angular/router';
import { SignupdetailsComponent } from './signupdetails/signupdetails.component';
import { ForgetPageComponent } from './forget-page/forget-page.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { LogindetailsComponent } from './logindetails/logindetails.component';
import { InvestmentComponent } from './investment/investment.component';
const routes: Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'signup', component:SignupdetailsComponent},
  {path:'login', component:LogindetailsComponent},
  {path:'forget',component:ForgetPageComponent},
  {path:'user',component:CustomerDashboardComponent},
  {path:'invest',component:InvestmentComponent},
  {
    path: '',
    loadComponent: () =>
      import('./logindetails/logindetails.component')
        .then(mod => mod.LogindetailsComponent)
  }
];

export default routes;
