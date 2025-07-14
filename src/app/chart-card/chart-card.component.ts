import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts'; 

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports:[CommonModule,NgChartsModule],
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.css']
})
export class ChartCardComponent implements OnInit {
  // Dropdown and tab filters
  assetCategories: string[] = [];
  companies: string[] = [];
  selectedAssetCategory: string = '';
  selectedCompany: string = '';
  public selectedAsset: string = 'Stock';
  public assetVal='Asset Category'
  public companyName='Company Name'
  // Fixed color map
 companyColorMap: { [key: string]: string } = {
  'google': '#3e95cd',            
  'property trust': '#8e5ea2',           
  'apple': '#ff6384',           
  'cash holdings': '#00b894',    
  'bank savings': '#fdcb6e',
  'estateco': '#e17055',         
  'bondco': '#6c5ce7'    
};
companyColorMapVal:{ [key: string]: string } = {
  'google': '#8e5ea2',           
  'property trust': '#fdcb6e',           
  'apple': '#f7a6e9ff',
  'cash holdings': '#3e95cd',
  'bank savings': '#6c5ce7',
  'estateco': '#ff6384',         
  'bondco': '#e17055'    
};

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true
  };

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true
  };

  // Full data from API
  rawData: any[] = [];
  barOptions: number[] = [2025, 2024];
  selectedYearVal="Year"
  selectedYear: number = 2025; 
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
  this.http.get<any[]>('http://localhost:3000/chartdata').subscribe(data => {
    this.rawData = data;
  this.updateBarChart('Stock',2025);

    // Get unique asset categories from the raw data
    this.assetCategories = [...new Set(data.map(d => d.category))];

    // Set default asset category to 'Stock'
    this.selectedAssetCategory = 'Stock';

    // Get companies under 'Stock' category
    const stockData = data.filter(d => d.category === 'Stock');
    this.companies = [...new Set(stockData.map(d => d.company))];

    // Load all 'Stock' companies' data into line chart
    this.lineChartData = {
      labels: stockData[0]?.data.map((d: any) => d.label) || [],
      datasets: stockData.map(entry => ({
        label: entry.company,
        data: entry.data.map((d: any) => d.value),
         backgroundColor: this.hexToRgba(this.companyColorMap[entry.company] || '#333', 0.2), // 👈 added for background fill
    fill: true, //
    tension:0.4
      }))
    };
  });
}
filterBar(type: string): void {
  this.selectedAsset = type;  
  this.updateBarChart(type);
}
hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


onBarDropdownSelect(year: number): void {
  this.selectedYear = year;
  this.selectedYearVal=`${year}`;
  this.updateBarChart(this.selectedAssetCategory, this.selectedYear);
}

  selectAssetCategory(category: string): void {
  this.selectedAssetCategory = category;
  this.assetVal=category
  // Filter data for category and year 2025
  const filtered = this.rawData.filter(d => d.category === category && d.year === 2025);

  this.companies = [...new Set(filtered.map(d => d.company))];

  this.lineChartData = {
    labels: filtered[0]?.data.map((d: any) => d.label) || [],
    datasets: filtered.map(entry => ({
      label: entry.company,
      data: entry.data.map((d: any) => d.value),
      borderColor: this.companyColorMap[entry.company] || '#333',
      backgroundColor: this.hexToRgba(this.companyColorMap[entry.company] || '#333', 0.2),
      fill: true,
      tension: 0.4
    }))
  };
}

selectCompany(company: string): void {
  this.companyName=company
  const match = this.rawData.find(
    d => d.company === company && d.category === this.selectedAssetCategory && d.year === 2025
  );

  if (match) {
    this.lineChartData = {
      labels: match.data.map((d: any) => d.label),
      datasets: [{
        label: match.company,
        data: match.data.map((d: any) => d.value),
        borderColor: this.companyColorMap[match.company] || '#333',
        backgroundColor: this.hexToRgba(this.companyColorMap[match.company] || '#333', 0.2),
      fill: true,
      tension: 0.4
  
      }]
    };
  }
}

updateBarChart(type: string, year: number = 2025): void {
  console.log("updateBarChart called with type:", type, "year:", year);
  console.log("rawData:", this.rawData);

  const filtered = this.rawData.filter(d => d.category === type && d.year === year);
  console.log("Filtered data:", filtered);

  const labels = filtered[0]?.data.map((d: any) => d.label) || [];
  this.barChartData = {
    labels,
    datasets: filtered.map(entry => ({
      label: entry.company,
      data: entry.data.map((d: any) => d.value),
      backgroundColor: this.companyColorMapVal[entry.company] || '#ccc'
    }))
  };
}

}
