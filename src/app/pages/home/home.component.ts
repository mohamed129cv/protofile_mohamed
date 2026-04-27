import { MainInformtion } from './../../core/interface/main-informtion';
import { Iblogs } from './../../core/interface/iblogs';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FadeUpDirective } from "../../core/direcitve/fade-up.directive";
import { FadeRightDirective } from "../../core/direcitve/fade-right.directive";
import { FadeLeftDirective } from "../../core/direcitve/fade-left.directive";
import { ProjectsCartComponent } from '../projects-cart/projects-cart.component';
import { Iproject } from '../../core/interface/iproject';
import { ProjectApiService } from '../../core/api/ProjectApiService';
import { RouterLink } from '@angular/router';
import { BgService } from '../../core/api/bg.service';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../core/api/seo.service';
import { BlogService } from '../../core/api/blog.service';
import { AdminModeService } from '../../core/api/admin-mode.service';
import { BlogCartComponent } from '../blog/blog-cart/blog-cart.component';
import { ApiInformtionService } from '../../core/api/api-informtion.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FadeUpDirective, RouterLink, FadeRightDirective, FadeLeftDirective, ProjectsCartComponent, CommonModule, BlogCartComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private _ApiInformtionService: ApiInformtionService, private _blog: BlogService, private _adminMode: AdminModeService, private _seo: SeoService, private _bg: BgService, private _ProjectApiService: ProjectApiService, private _BgService: BgService) {

  }
  ngOnInit(): void {
    this.getBlogs()
    this.getProjects()
    this.getInformtion()
    this._BgService.$theme.subscribe({
      next: res => {
        this.bg = res
      }
    })
    this._adminMode.$adminMode.subscribe(res => this.adminMode = res)
    this._seo.updateMate(
      "Results-driven Digital Marketing Specialist focused on scaling brands with targeted campaigns, advanced analytics, and ROI-focused strategies across social media and paid advertising platforms",
      "Growth-Focused Digital Marketing Expert Digital Marketing Specialist | Performance & Growth Expert",
      "Lead Generation, Facebook Ads, Instagram Marketing, Conversion Rate, ROI, Performance Marketing ,Performance Marketing Expert, Meta Ads Specialist, Social Media Growth, Lead Generation Expert, Conversion Optimization"
    )
  }
  ngAfterViewInit() {
    this._bg.$theme.subscribe({
      next: res => {
        this.bg = res
      }
    })
  }
  bg!: string
  scrollToAboutMe() {
    let aboutMeSection = document.getElementById('about_me')
    if (aboutMeSection) {
      aboutMeSection.scrollIntoView({ behavior: 'smooth' })
    }
  }
  skillMode: 'tool' | 'skill' = 'skill'
  counts : Record<string, number> = {}
  targets : Record<string, number> = {}
  buildTargets() {
    this.targets = {};
      this.counts = {};

    for (let item of this.data.achievements) {
      this.targets[item.achievement_name] = item.count;
      this.counts[item.achievement_name] = 0
    }
  }

  @ViewChild('achievement') achievementsContect!: ElementRef;
  hasAnimated = false;

observ() {
  const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting && !this.hasAnimated) {
        this.hasAnimated = true;

        for (let i of this.data.achievements) {
          this.animateCounter(i.achievement_name);
        }

        observer.disconnect();
      }

    });

  });

  if (this.achievementsContect) {
    observer.observe(this.achievementsContect.nativeElement);
  }
}

  animateCounter(type: keyof typeof this.counts) {
    let count = 0;
    let target = this.targets[type] || 0;

    let speed = 20;

    let interval = setInterval(() => {

      if (count < target) {
        count++;
        this.counts[type] = count;
      } else {
        clearInterval(interval);
      }

    }, speed);
  }
  adminMode !: boolean
  blogs: Iblogs[] = []
  projects: Iproject[] = []
  getProjects() {
    this._ProjectApiService.getAllProjects().subscribe({
      next: (res:Iproject[]) => {
        this.projects = res.filter(pro=>pro.status == 'active').slice(0, 6)
      }
    })
  }
  getBlogs() {
    this._blog.getBlog().subscribe((res:Iblogs[]) => {
      this.blogs = res.filter(blog=>blog.status == 'active' ).slice(0, 6)
    })
  }
  data : MainInformtion =  {} as MainInformtion
  getInformtion() {
    this._ApiInformtionService.getInformtion().subscribe(res => {
      this.data = res[0]
      this.buildTargets()
      this.observ()
    })
  }
}
