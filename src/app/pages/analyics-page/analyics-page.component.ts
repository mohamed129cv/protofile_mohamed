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
      console.log(this.result);
    })
    this.barChartOptions = this.Chart2Service.allDateApex(this.project) ?? {};
    ;
  }
  ngAfterViewInit(): void {
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

  getColor(type: 'Click' | 'visit_page' | 'view' | 'interaction' | 'New_follower'): string {
    const start = Number(this.result[0][type]) || 0;
    const end = Number(this.result[this.result.length - 1][type]) || 0;

    if (start === 0 && end === 0) return 'black';
    if (end > start) return 'green';
    if (end === start) return 'black';
    return 'red';
  }
  metrics: Imetrics[] = [
    { key: 'view', label: 'Views', icon: 'fa-eye', chart_cace: 'views' },
    { key: 'interaction', label: 'Interactions', icon: 'fa-chart-line', chart_cace: 'interactions' },
    { key: 'Click', label: 'Link Clicks', icon: 'fa-link', chart_cace: 'clicks' },
    { key: 'visit_page', label: 'Page Visits', icon: 'fa-bookmark', chart_cace: 'visits' },
    { key: 'New_follower', label: 'Followers', icon: 'fa-heart-circle-plus', chart_cace: 'followers' }
  ];
  getLastNumber(type: 'Click' | 'visit_page' | 'view' | 'interaction' | 'New_follower') {
    if (!this.result || this.result.length < 2) return 0

    return Number(this.result[this.result.length - 1][type])
  }

  getGrowth(type: 'Click' | 'visit_page' | 'view' | 'interaction' | 'New_follower') {
    if (!this.result || this.result.length < 2) return 0;
    let start = this.result[0][type]
    let end = this.result[this.result.length - 1][type]
    return end - start
  }

  formatNumber(num: number) {
      const abs = Math.abs(num);

    if (abs >= 1_000_000_000) {
      return (abs / 1_000_000_000).toFixed() + 'B'
    } else if (abs >= 1_000_000) {
      return (abs / 1_000_000).toFixed() + 'M'
    } else if (abs >= 1_000) {
      return (abs / 1_000).toFixed() + 'K'

    } else {
      return num.toString()
    }
  }

  getTrend(type: 'Click' | 'visit_page' | 'view' | 'interaction' | 'New_follower') {
    if (!this.result || this.result.length < 2) return ''
    let start = this.result[0][type] || 0
    let end = this.result[this.result.length - 1][type] || 0
    let r = end - start
    if (r > 0) return 'fa-arrow-trend-up '
    if (r < 0) return 'fa-arrow-trend-down'
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
