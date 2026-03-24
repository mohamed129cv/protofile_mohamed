import { ApexOptions } from './../../../../node_modules/ng-apexcharts/lib/model/apex-types.d';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Chart2Service } from './../../core/api/chart2.service';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Imetrics, Iproject, Iproject_reselt } from '../../core/interface/iproject';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FadeUpDirective } from "../../core/direcitve/fade-up.directive";
import { BgService } from '../../core/api/bg.service';
import { ProjectDisPipe } from '../../core/pipe/project-dis.pipe';
import { FadeLeftDirective } from "../../core/direcitve/fade-left.directive";

@Component({
  selector: 'app-analyics-page',
  standalone: true,
  imports: [CommonModule, FadeUpDirective, NgApexchartsModule, ProjectDisPipe, FadeLeftDirective, RouterLink],
  templateUrl: './analyics-page.component.html',
  styleUrl: './analyics-page.component.css'
})
export class AnalyicsPageComponent {
  constructor(private Chart2Service: Chart2Service, private _bg: BgService, private _ActivatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this._ActivatedRoute.data.subscribe((data: any) => {
      this.project = data['data']
      this.updateChart('bar')
      this.result = this.project.results
    })
    this.barChartOptions = this.Chart2Service.allDateApex(this.project) ?? {};
    ;
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this._bg.$theme.subscribe({
      next: res => {
        this.bg = res
      }
    })
  }
  bg!: string
  project: Iproject = {} as Iproject
  chart!: Chart;
  activeChart: string = 'bar'

  chartOptions: ApexOptions = {};
  barChartOptions: ApexOptions = {};
  viewsChartOptions: ApexOptions = {};
  interactionChartOptions: ApexOptions = {};
  clickChartOptions: ApexOptions = {};
  visitChartOptions: ApexOptions = {};
  followersChartOptions: ApexOptions = {};

  updateChart(chartName: string) {
    this.activeChart = chartName;

    switch (chartName) {
      case 'bar':
        this.chartOptions = this.Chart2Service.allDateApex(this.project);
        this.viewsChartOptions = this.Chart2Service.viewsDataApex(this.project)
        this.visitChartOptions = this.Chart2Service.vistDataApex(this.project)
        this.clickChartOptions = this.Chart2Service.clickDataApex(this.project)
        break;
      case 'views':
        this.chartOptions = this.Chart2Service.viewsDataApex(this.project);
        break;
      case 'interactions':
        this.chartOptions = this.Chart2Service.interactionDataApex(this.project);
        break;
      case 'clicks':
        this.chartOptions = this.Chart2Service.clickDataApex(this.project);
        break;
      case 'visits':
        this.chartOptions = this.Chart2Service.vistDataApex(this.project);
        break;
      case 'followers':
        this.chartOptions = this.Chart2Service.followersApex(this.project);
        break;
    }
  }
  clcPresent(type: 'Click' | 'visit_page' | 'view' | 'interaction' | 'New_follower') {
    let result = this.project.results
    if (!result || result.length < 2) return 0;
    let start = result[0]
    let end = result[result.length - 1]

    if (start[type] === 0) {
      return end[type] ? Number(end[type]) : 0;
    } if (!start[type] || start[type] === 0) return 0;
    return Number((((end[type] - start[type]) / start[type]) * 100).toFixed(0))
  }
  getSafePercent(type: any): number {
    let value = this.clcPresent(type);
    return Math.max(0, Math.min(value, 100));
  }
  getColor(type: any): string {
    let val = this.clcPresent(type);
    if (val >= 70) return 'green';
    if (val >= 40) return 'orange';
    return 'red';
  }
  metrics: Imetrics[]= [
      { key: 'view', label: 'Views', icon: 'fa-eye' ,chart_cace : 'views' },
      { key: 'interaction', label: 'Interactions', icon: 'fa-chart-line' ,chart_cace : 'interactions' },
      { key: 'Click', label: 'Link Clicks', icon: 'fa-link' ,chart_cace : 'clicks' },
      { key: 'visit_page', label: 'Page Visits', icon: 'fa-bookmark' ,chart_cace : 'visits' },
      { key: 'New_follower', label: 'Followers', icon: 'fa-heart-circle-plus' ,chart_cace : 'followers' }
    ];
    getTrend(type: 'Click' | 'visit_page' | 'view' | 'interaction' | 'New_follower') {
      if (!this.result || this.result.length < 2) return ''
      let start = this.result[0][type] || 0
      let end = this.result[this.result.length - 1][type] || 0

    if (end > start) return 'fa-arrow-trend-up '
    if (end < start) return 'fa-arrow-trend-down'
    return ''
  }
  //!aside toggle
  isOpen = false;
  result!: Iproject_reselt[]
  toggleAside() {
    this.isOpen = !this.isOpen;
    console.log(this.isOpen);
  }
  
}
