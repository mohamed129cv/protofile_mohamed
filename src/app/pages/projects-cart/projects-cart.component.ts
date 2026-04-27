import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Iproject } from '../../core/interface/iproject';
import { ProjectApiService } from '../../core/api/ProjectApiService';
import { ProjectDisPipe } from '../../core/pipe/project-dis.pipe';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FadeUpDirective } from "../../core/direcitve/fade-up.directive";
import { BgService } from '../../core/api/bg.service';
import { UplodeImgService } from '../../core/api/uplode-img.service';
import { FadeRightDirective } from "../../core/direcitve/fade-right.directive";
import { ProjectFormComponent } from "../project-form/project-form.component";

@Component({
  selector: 'app-projects-cart',
  standalone: true,
  imports: [CommonModule, ProjectDisPipe, ReactiveFormsModule, FadeUpDirective, ProjectFormComponent],
  templateUrl: './projects-cart.component.html',
  styleUrl: './projects-cart.component.css'
})
export class ProjectsCartComponent {
  constructor(
    private _ProjectApiService: ProjectApiService,
    private _ToastrService: ToastrService,
    private _router: Router,
    private _bg: BgService,
    private _uplodeImg: UplodeImgService,
  ) { }
  @Input({ required: true }) adminMode: boolean = false
  @Input({ required: true }) projcets: Iproject[] = [] as Iproject[]

  show: boolean = false
  editMode: boolean = false
  my_project : Iproject | null = null
   openEdit(project: Iproject) {
    this.my_project = null;
    this.show = false;
    this.editMode = false;
    setTimeout(() => {
      this.my_project = { ...project };
      this.editMode = true;
      this.show = true;
    });
  }

  bg!: string
  ngAfterViewInit(): void {
    this._bg.$theme.subscribe({
      next: res => {
        this.bg = res
      }
    })
  }
  //* جلب المشاريع
    getProjects() {
    this._ProjectApiService.getAllProjects().subscribe({
      next: res => {
        this.projcets = res.filter((prj:Iproject)=> prj.status == 'active')
      }
    })
  }
  //* حذف مشروع
  deleteProject(id: number) {
    this._ProjectApiService.deletProject(id).subscribe({
      next: res => {
        this._ToastrService.success('Project deleted successfully.', 'Success ')
        this.getProjects()
      }
    })
  }

  //! الذهاب الي صفحة تفاصيل المشروع
  detalisProject(id: number) {
    this._router.navigate(['project/details', id])
  }



}
