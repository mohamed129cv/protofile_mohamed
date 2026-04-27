import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProjectsCartComponent } from '../projects-cart/projects-cart.component';
import { ProjectApiService } from '../../core/api/ProjectApiService';
import { Iproject } from '../../core/interface/iproject';
import { SearchPipe } from '../../core/pipe/search.pipe';
import { BgService } from '../../core/api/bg.service';
import { SeoService } from '../../core/api/seo.service';
import { AdminModeService } from '../../core/api/admin-mode.service';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { LoginComponent } from "../login/login.component";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ProjectsCartComponent, SearchPipe, LoginComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})

export class ProjectsComponent {
  constructor(private _seo: SeoService, private _ToastrService: ToastrService, private _ProjectApiService: ProjectApiService, private _bg: BgService, private _AdminModeService: AdminModeService) {
  }
  ngOnInit(): void {
    this.getProjects()
    this._seo.updateMate(
      "A high-performance lead generation campaign using Facebook & Instagram Ads that increased qualified leads by 45% in 3 months.",
      "Lead Generation Campaign",
      "Lead Generation, Facebook Ads, Instagram Marketing, Conversion Rate, ROI, Performance Marketing ,Performance Marketing Expert, Meta Ads Specialist, Social Media Growth, Lead Generation Expert, Conversion Optimization"
    )
  }
  ngAfterViewInit(): void {
    this._bg.$theme.subscribe({
      next: res => {
        this.bg = res
      }
    })
    this._AdminModeService.$adminMode.subscribe({
      next: res => {
        this.adminMode = res
      }
    })

  }
  typeMode: string = 'all'
  types: string[] = []
  bg!: string
  projects: Iproject[] = [] as Iproject[]
  allProjects: Iproject[] = [] as Iproject[]
  adminMode!: boolean

  searchWord: string = ''

  saveData() {
    this.adminMode = false
    this._AdminModeService.toggleAdminMode(this.adminMode )
    this._ToastrService.success('Data Saved', 'Success')
  }

  //* جلب المشاريع
  getProjects() {
    this._ProjectApiService.getAllProjects().subscribe({
      next: res => {
        this.projects = res.filter((prj: Iproject) => prj.status == 'active')
        this.allProjects = res.filter((prj: Iproject) => prj.status == 'active')
        this.types = Array.from(new Set(this.projects.map(pro => pro.project_type.toLocaleLowerCase().trim())))
      }
    })
  }
  filterByType(type: string) {
    if (type.toLocaleLowerCase().trim() !== 'all') {
      this.projects = this.allProjects.filter(prj => prj.project_type.toLocaleLowerCase().trim() == type.toLocaleLowerCase().trim())
    }
  }
  @ViewChild('passwordInput') passwordInput!: ElementRef

  showPassword: boolean = false
  toggleInputToPassword() {
    this.showPassword = !this.showPassword
  }

  showLoginSection: boolean = false
  hiddenPopup() {
    this.showLoginSection = true
    setTimeout(() => {
      this.showLoginSection = false;
    });
  }
  open() {
    this.showLoginSection = false;
    setTimeout(() => {
      this.showLoginSection = true;
    });
  }
}
