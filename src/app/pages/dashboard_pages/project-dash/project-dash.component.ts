import { Component } from '@angular/core';
import { ProjectApiService } from '../../../core/api/ProjectApiService';
import { Iproject } from '../../../core/interface/iproject';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ProjectFormComponent } from '../../project-form/project-form.component';
import { ProjectDisPipe } from '../../../core/pipe/project-dis.pipe';
import { SearchPipe } from '../../../core/pipe/search.pipe';
import { FormsModule } from '@angular/forms';
import { BgService } from '../../../core/api/bg.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-project-dash',
  standalone: true,
  imports: [FormsModule, CommonModule, ProjectFormComponent, ProjectDisPipe, SearchPipe, RouterLink],
  templateUrl: './project-dash.component.html',
  styleUrl: './project-dash.component.css'
})
export class ProjectDashComponent {
  constructor(private _project: ProjectApiService, private _toastr: ToastrService , private _bg:BgService) { }
  ngOnInit(): void {
    this.getAllProjects()
  }
  ngAfterViewInit(): void {
    this._bg.$theme.subscribe(res=> this.bg=res)
  }
  bg!: string
  searchWord:string=''
  allProjects: Iproject[] = []
  show: boolean = false
  eidtMode: boolean = false
  project: Iproject | null = null
loading:boolean = false
  filter: ('all' | 'active' | 'inactive')[] = ['all', 'active', 'inactive']
  filterKey: 'all' | 'active' | 'inactive' = 'all'
  showFilter: boolean = false
  getAllProjects() {
    this.loading = true
    this._project.getAllProjects().subscribe((res) => {
      this.allProjects = res
      this.loading = false
    })
  }

  deleteProject(id: number) {
      if(confirm('Are you sure you want to delete?')) {

    this._project.deletProject(id).subscribe(res => {
      this._toastr.success("Project Deleted Successfully")
      this.getAllProjects()
    })
  }
  }
  openForm(prject: Iproject) {
    this.show = false
    this.project = null
    this.eidtMode = false
    setTimeout(() => {
      this.show = true
      this.project = prject
      this.eidtMode = true
    })
  }


  toggleFilter() {
    this.showFilter = !this.showFilter
  }
  setFilterValue(value: 'all' | 'active' | 'inactive') {
    this.filterKey = value
    this.showFilter = false
  }

  get filteredProjects() {
    if (this.filterKey === 'all') return this.allProjects;

    return this.allProjects.filter(p => p.status === this.filterKey);
  }
  get activeProjectsCount() {
    return this.allProjects.filter(p=>p.status =='active').length
  }

  get inactiveProjectsCount() {
    return this.allProjects.filter(p=>p.status =='inactive').length
  }

}
