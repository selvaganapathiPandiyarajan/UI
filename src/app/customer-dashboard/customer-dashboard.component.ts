import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../controller/api.service';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FilterPipe } from '../filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgChartsModule } from 'ng2-charts';
import Chart from 'chart.js/auto';
import { ChartConfiguration } from 'chart.js';
import Highcharts from 'highcharts/highmaps';
import { NavComponent } from '../nav/nav.component';
import { AssetCardComponent } from '../asset-card/asset-card.component';
import { ChartCardComponent } from '../chart-card/chart-card.component';
import { InvestmentComponent } from '../investment/investment.component';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgxPaginationModule,
    FilterPipe,
    HttpClientModule,
    FullCalendarModule,
    NgChartsModule,
    NavComponent,
    AssetCardComponent,
    ChartCardComponent,
    InvestmentComponent
  ],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.css'
})
export class CustomerDashboardComponent implements OnInit {

  // Properties
  public Questiontrue = false;
  public Questiontrueone = false;
  public tableView = true;
  public ticketView = false;
  public resetPage = false;
  public passwordcheck = false;
  public passcon = false;
  public passwordform!: FormGroup;
  public userDetails: any;
  public userDetailsvalue: any;

  public reverse = false;
  public datereverse = false;
  public prioritydrop = false;
  public ticketuser: any[] = [];
  public stockArr: any[] = [];
  public bondArr: any[] = [];
  public realesteArr: any[] = [];
  public cashArr: any[] = [];
  public universalAssetArr: any[] = [];
  public pagination: any;
  public page = 1;
  public count = 0;
  public tableSize = 2;
  public size = [2, 9, 12];
  public investUser: any[] = [];
  public assetArr: any[] = [];
  public selectedAsset: string = 'Stocks';
  public chartConstructor = 'mapChart';
  public mapData: any;
  public chartInstance: Highcharts.Chart | any;
  public chartOptions: Highcharts.Options = {};
  public search: string = "";
  public date: any;
  public baseValue: number = 1000;
  public totalAssetValue: number = 0;
  public assetPercentage: number = 0;
  public globalSearchTerm: string = '';

  public calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: [{ title: '8 hour', date: '2024-05-06', color: 'red' }],
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next'
    }
  };

  public percentage = 38;
  public frequency = 'Weekly';

  public dailyPerformance: any = {
    date: '',
    return: 0,
    growth: 0,
    risk: 0,
    loss: 0
  };

  public propertyValue: any;
  public investmentValue: any;
  public expenseValue: any;
  public balanceValue: any;

  public doughnutChartLabels: string[] = ['Stock', 'Bonds', 'Cash', 'Real Estate'];
  public performanceMatreics: string[] = ['Return', 'Growth', 'Risk', 'Loss'];

  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [];

  public performnaceColor = [{
    backgroundColor: ['#f126cfff', '#28c76f', '#7367f0'],
  }];

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    }
  };

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  constructor(
    private cdr: ChangeDetectorRef,
    private form: FormBuilder,
    private api: ApiService,
    private http: HttpClient,
    private router: Router,
    private passform: FormBuilder
  ) {
    this.passwordform = this.passform.group({
      'oldpass': ['', [Validators.required]],
      'newpass': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8), Validators.pattern('^[A-Za-z]+$')]],
      'conpass': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(8), Validators.pattern('^[A-Za-z]+$')]]
    });
  }

  ngOnInit(): void {
    this.userDetails = sessionStorage.getItem('userpage');
    this.userDetailsvalue = JSON.parse(this.userDetails);
    this.getinvestorDetails();
    this.clickTab('Stocks');
    this.populateUniversalAssetArr();
    this.calculateDailyPerformance();
    this.calculateSummaryCards();
  }
populateUniversalAssetArr(): void {
  const assetTypes = ['Stocks', 'Bonds', 'Cash', 'Real Estate'];

  this.universalAssetArr = assetTypes.map(assetType => {
    const total = this.investUser
      .filter(item => item.Asset === assetType)
      .reduce((sum, curr) => sum + Number(curr.price), 0);

    return { asset: assetType, total };
  });

  console.log("Universal Asset Array:", this.universalAssetArr);

  this.totalAssetValue = this.universalAssetArr.reduce((sum, item) => sum + item.total, 0);

  this.baseValue = 10000;
  this.assetPercentage = this.baseValue === 0 ? 0 : (this.totalAssetValue / this.baseValue) * 100;

  console.log("Total Asset Value:", this.totalAssetValue);
  console.log("Percentage:", this.assetPercentage);

  this.doughnutChartDatasets = [
    {
      data: this.universalAssetArr.map(item => item.total),
      label: 'Portfolio',
      backgroundColor: ['#00cfe8', '#28c76f', '#7367f0', '#f39c12'],
      borderWidth: 0,
    },
  ];

  this.chart?.update();
}

onGlobalSearch(term: string): void {
  this.globalSearchTerm = term;
}

getChartInstance(chart: Chart): void {
  this.chartInstance = chart;
}

toggleSidebar(): void {
  const sidebar = document.getElementById('sidebarMenu');
  sidebar?.classList.toggle('show');
}

calculateDailyPerformance(): void {
  const todayDate = new Date().toISOString().slice(0, 10);
  this.dailyPerformance.date = todayDate;

  const todaysInvestments = this.investUser.filter(item => item.date === todayDate);

  console.log('Today investments:', todaysInvestments);

  this.dailyPerformance.return = todaysInvestments.reduce((sum, curr) => sum + Number(curr.price) * 0.1, 0);
  this.dailyPerformance.growth = todaysInvestments.reduce((sum, curr) => sum + Number(curr.price) * 0.2, 0);
  this.dailyPerformance.risk = todaysInvestments.reduce((sum, curr) => sum + Number(curr.price) * 0.05, 0);
  this.dailyPerformance.loss = todaysInvestments.reduce((sum, curr) => sum + Number(curr.price) * 0.01, 0);
}

handleDateClick(arg: any): void {
  alert('Date clicked: ' + arg.dateStr);
  this.date = arg.dateStr;
  this.getevent(this.date);
  console.log(arg, 'allDay');
}

getPerformanceColor(index: number): string {
  const bg = this.performnaceColor[0].backgroundColor;
  return Array.isArray(bg) ? (bg[index] as string ?? '#ccc') : '#ccc';
}

getColor(index: number): string {
  const bg = this.doughnutChartDatasets[0].backgroundColor;
  return Array.isArray(bg) ? (bg[index] as string ?? '#ccc') : '#ccc';
}

updateCalendarEventsFromInvestments(): void {
  if (!this.investUser || this.investUser.length === 0) return;

  const investmentEvents = this.investUser.map(investment => {
    const asset = investment.Asset || 'Investment';
    const price = investment.price || 0;

    return {
      title: `₹ ${price}`,
      date: investment.date,
      color: this.getColorByAsset(asset),
      textColor: 'black'
    };
  });

  this.calendarOptions.events = [...investmentEvents];
  this.cdr.detectChanges();
}

getColorByAsset(asset: string): string {
  switch ((asset || '').toLowerCase()) {
    case 'stocks': return '#26f7f0ff';
    case 'bonds': return '#ed8a48ff';
    case 'cash': return '#f76356ff';
    case 'real estate': return '#8278f4ff';
    default: return '#7d07c1';
  }
}

getevent(date: string): void {
  const newEvent = { title: 'New Event', date, color: 'blue' };

  this.calendarOptions.events = [
    ...(this.calendarOptions.events as any[]),
    newEvent
  ];

  this.cdr.detectChanges();
  console.log('Updated events:', this.calendarOptions.events);
}
    Clickdropdown(): void {
    this.prioritydrop = true;
  }

  ClickdropdownTwo(): void {
    this.Questiontrueone = true;
  }

  ClickticketPage(): void {
    this.router.navigate(['/invest']);
    this.ticketView = true;
    this.tableView = false;
  }

  // Data Initialization
  getinvestorDetails(): void {
    this.http.get<any>('http://localhost:3000/InvestDetails?email=' + this.userDetailsvalue.email)
      .subscribe(res => {
        this.investUser = [];
        const filteredInvestments = res.filter((b: any) => b.email === this.userDetailsvalue.email);
        this.investUser.push(...filteredInvestments);

        console.log(this.investUser, "Filtered investUser");

        this.initializeAssetArr();
        this.getAllticketdetails(this.investUser);
        this.updateCalendarEventsFromInvestments();
        this.populateUniversalAssetArr();
        this.calculateDailyPerformance();
        this.calculateSummaryCards();

        if (filteredInvestments.length > 0) {
          sessionStorage.setItem('InvestPage', JSON.stringify(filteredInvestments));
        }
      });
  }

  initializeAssetArr(): void {
    this.assetArr = this.investUser.filter(item => item.Asset === this.selectedAsset);
  }

  clickTab(assetType: string): void {
    this.selectedAsset = assetType;
    this.assetArr = this.investUser.filter(item =>
      item.Asset?.toLowerCase() === assetType.toLowerCase()
    );
    this.count = this.assetArr.length;
    this.page = 1;
    console.log(assetType, this.assetArr, "Filtered asset array");
  }

  // Summary Calculations
  calculateSummaryCards(): void {
    const propertyTotal = this.getTotalByAsset('Real Estate');
    const investmentTotal = this.getTotalByAsset('Bonds') + this.getTotalByAsset('Stocks');
    const balanceTotal = this.getTotalByAsset('Cash');
    const expenseTotal = propertyTotal + investmentTotal;

    this.propertyValue = propertyTotal;
    this.investmentValue = investmentTotal;
    this.expenseValue = expenseTotal;
    this.balanceValue = balanceTotal;
  }

  getTotalByAsset(assetName: string): number {
    return this.investUser
      .filter(item => item.Asset === assetName)
      .reduce((sum, curr) => sum + Number(curr.price), 0);
  }

  getPercentage(value: number): string {
    const total = this.propertyValue + this.investmentValue + this.expenseValue + this.balanceValue;
    return total === 0 ? '0%' : `+${Math.round((value / total) * 100)}%`;
  }

  getPerformanceValue(metric: string): number {
    switch (metric) {
      case 'Return': return this.dailyPerformance.return;
      case 'Growth': return this.dailyPerformance.growth;
      case 'Risk': return this.dailyPerformance.risk;
      case 'Loss': return this.dailyPerformance.loss;
      default: return 0;
    }
  }

  // Calendar Event Handling
  updateCalendarEvents(weekdays: any): void {
    const newEvents = weekdays.flatMap((e: any) => {
      return Object.keys(e)
        .filter(key => key.startsWith('Day'))
        .map(dayKey => {
          const dayData = JSON.parse(e[dayKey]);
          const isLeave = e.Leave && e.leavedate === dayData.Date;

          return {
            title: isLeave ? '0\nHours' : `${dayData.Hours || '8'}\nHours`,
            date: dayData.Date,
            color: isLeave ? '#ffcc00' : '#99cc33',
            textColor: 'black',
            fontSize: 'bold'
          };
        });
    });

    this.calendarOptions.events = [...newEvents];
    this.cdr.detectChanges();
  }

  // Sorting
  sortValue(): void {
    console.log("inside sorting");
    this.ticketuser.sort((a: any, b: any) =>
      this.reverse ? b.id - a.id : a.id - b.id
    );
    this.reverse = !this.reverse;
  }

  sortdate(): void {
    console.log("inside sorting date");
    this.investUser.sort((a: any, b: any) =>
      this.datereverse
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    this.assetArr = this.selectedAsset
      ? this.investUser.filter(item => item.Asset === this.selectedAsset)
      : [...this.investUser];

    this.datereverse = !this.datereverse;
    console.log("Sorted assetArr:", this.assetArr);
  }

  // Time Calculators
  calculateDiff(dataDate: any): number {
    const now = new Date().getTime();
    const past = new Date(dataDate).getTime();
    const diff = now - past;
    const diffDay = Math.floor(diff / 86400000);
    const diffHour = Math.floor((diff % 86400000) / 3600000);

    return (diffDay >= 1 || diffDay === 30 || diffDay === 31) ? diffDay : diffHour;
  }

  hourTime(key: any): string {
    const now = new Date().getTime();
    const past = new Date(key.age).getTime();
    const diffDay = Math.floor((now - past) / 86400000);

    if (diffDay >= 31) return "Month ago";
    if (diffDay >= 1) return "days ago";
    return "hr ago";
  }

  // PDF Export
  openPDF(): void {
    const DATA = document.getElementById('excel-table');
    if (!DATA) return;

    html2canvas(DATA).then(canvas => {
      const fileWidth = 208;
      const fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');

      const PDF = new jsPDF('p', 'mm', 'a4');
      PDF.addImage(FILEURI, 'PNG', 0, 0, fileWidth, fileHeight);
      PDF.save('ticketDetails.pdf');
    });
  }

  // Dropdown Filter
  checkticketLevel(): void {
    this.Questiontrueone = true;
    const input = document.getElementById('ticketLevel') as HTMLInputElement;
    const val = input?.value;

    switch (val) {
      case "Stocks":
        this.investUser = this.stockArr;
        break;
      case "Bonds":
        this.investUser = this.bondArr;
        break;
      case "Real Estate":
        this.investUser = this.realesteArr;
        break;
      case "Cash":
        this.investUser = this.cashArr;
        break;
    }

    this.Questiontrueone = false;
    console.log(this.investUser, 'Filtered based on ticketLevel');
  }

// Pagination
pages(): void {
  this.api.get1().subscribe(res => {
    this.pagination = res;
  });
}

pageChangeEvent(event: number): void {
  this.page = event;
  this.pages();
}

sizeChange(event: any): void {
  console.log("inside size change function");
  this.tableSize = +event.target.value;
  this.page = 1;
  this.pages();
}

// Categorize investment details by asset type
getAllticketdetails(investArrList: any[]): void {
  this.stockArr = [];
  this.bondArr = [];
  this.realesteArr = [];
  this.cashArr = [];

  investArrList.forEach(invest => {
    switch ((invest.Asset || '').toLowerCase()) {
      case "stocks":
        this.stockArr.push(invest);
        break;
      case "bonds":
        this.bondArr.push(invest);
        break;
      case "real estate":
        this.realesteArr.push(invest);
        break;
      case "cash":
        this.cashArr.push(invest);
        break;
      default:
        console.warn("Unknown Asset Type:", invest.Asset);
    }
  });
}

// Logout and clear session
logout(): void {
  console.log("logout function");
  sessionStorage.removeItem('userpage');
  this.router.navigate(['/login']);
}

// Toggle views
getResetpage(): void {
  this.tableView = false;
  this.ticketView = false;
  this.resetPage = true;
}

getmaindashboard(): void {
  this.tableView = true;
  this.ticketView = false;
  this.resetPage = false;
}

// Check if previous password is valid
checkprevisouspass(): void {
  console.log("inside previous pass");
  this.http.get<any>('http://localhost:3000/userDetails?email=' + this.userDetailsvalue.email)
    .subscribe(res => {
      const match = res.find((c: any) => c.password === this.passwordform.value.oldpass);
      this.passwordcheck = !match;
    }, err => {
      alert('Something went wrong');
    });
}

// Change password
changepass(): void {
  console.log("inside change pass");
  this.http.get<any>('http://localhost:3000/userDetails?id=' + this.userDetailsvalue.id)
    .subscribe(res => {
      const user = res.find((c: any) => c.id === this.userDetailsvalue.id);
      if (user) {
        user.password = this.passwordform.value.newpass;
        user.conpassword = this.passwordform.value.conpass;

        this.api.update(user, this.userDetailsvalue.id).subscribe(() => {
          alert("Updated Successfully");
          document.getElementById('cancel')?.click();
          this.router.navigate(['/login']);
        });
      }
    }, err => {
      alert('Something went wrong');
    });
}

// Validate if new password and confirm password match
checkPassword(): void {
  const pass = this.passwordform.value.newpass;
  const conpass = this.passwordform.value.conpass;
  this.passcon = pass !== conpass;
}

}
