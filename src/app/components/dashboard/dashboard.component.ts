import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  chartColorCodes : any = ['#ADEFD1FF'];
  chartData: { monthYear: string, adherencePercentage: number }[] = [];
  adherenceData: any;
  adhPercentage: number[];
  months: string[];
  years: number[] = [];
  selectedYear: number;
  patientIncidents: any;
  incidentChartData: { monthYear: string; totalIncidents: number; }[];
  incidentCount: number[];
  monthsForIncidents: string[];

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.years = [currentYear, currentYear - 1, currentYear - 2];
    this.selectedYear = Math.max(...this.years);
    this.getMedicationAdherence();
    this.getPatientIncidents();
  }

  getMedicationAdherence() {
    this.firebaseService.getMedicationAdherenceForPatient().subscribe(res => {
      this.adherenceData = res;
      const groupedData = this.adherenceData.reduce((acc, curr) => {
        const date = new Date(curr.date);
        const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        if (!acc[monthYear]) {
          acc[monthYear] = { totalAdherence: 0, count: 0 };
        }
        acc[monthYear].totalAdherence += curr.adherence;
        acc[monthYear].count++;
        return acc;
      }, {});

      this.chartData = Object.keys(groupedData).map(monthYear => ({
        monthYear,
        adherencePercentage: (groupedData[monthYear].totalAdherence / groupedData[monthYear].count)
      }));

      this.chartData.sort((a, b) => {
        const monthA = new Date(a.monthYear + ' 1, 2000').getMonth();
        const monthB = new Date(b.monthYear + ' 1, 2000').getMonth();
        return monthA - monthB;
      });

      let chartData = this.chartData.filter(data => new Date(data.monthYear + ' 1, 2000').getFullYear() === this.selectedYear);
      this.months = chartData.map(data => data.monthYear);
      this.adhPercentage = chartData.map(data => data.adherencePercentage);
    });
  }

  getPatientIncidents() {
    this.firebaseService.getPatientIncidents().subscribe(res => {
      this.patientIncidents = res;
      const groupedData = this.patientIncidents.reduce((acc, curr) => {
        const date = new Date(curr.incidentDate);
        const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        if (!acc[monthYear]) {
          acc[monthYear] = 0;
        }
        acc[monthYear] += 1;
        return acc;
      }, {});

      this.incidentChartData = Object.keys(groupedData).map(monthYear => ({
        monthYear,
        totalIncidents: groupedData[monthYear]
      }));

      this.incidentChartData.sort((a, b) => {
        const monthA = new Date(a.monthYear + ' 1, 2000').getMonth();
        const monthB = new Date(b.monthYear + ' 1, 2000').getMonth();
        return monthA - monthB;
      });

      let chartData = this.incidentChartData.filter(data => new Date(data.monthYear + ' 1, 2000').getFullYear() === this.selectedYear);
      this.monthsForIncidents = chartData.map(data => data.monthYear);
      this.incidentCount = chartData.map(data => data.totalIncidents);
    });
  }

  filterByYear(year: number) {
    this.selectedYear = year;

    let adhChartData = this.chartData.filter(data => new Date(data.monthYear + ' 1, 2000').getFullYear() === year);
    this.months = adhChartData.map(data => data.monthYear);
    this.adhPercentage = adhChartData.map(data => data.adherencePercentage);

    let chartData = this.incidentChartData.filter(data => new Date(data.monthYear + ' 1, 2000').getFullYear() === year);
    this.monthsForIncidents = chartData.map(data => data.monthYear);
    this.incidentCount = chartData.map(data => data.totalIncidents);
  }

  getMonths(): Observable<any[]> {
    return of(this.months);
  }

  getPercentages(): Observable<any[]> {
    return of(this.adhPercentage);
  }

}
