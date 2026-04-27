import { ToastrService } from 'ngx-toastr';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Iblogs } from '../../../core/interface/iblogs';
import { BlogService } from '../../../core/api/blog.service';
import { ProjectDisPipe } from '../../../core/pipe/project-dis.pipe';
import { CommonModule, DatePipe } from '@angular/common';
import { BgService } from '../../../core/api/bg.service';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UplodeImgService } from '../../../core/api/uplode-img.service';
import { Router } from '@angular/router';
import { FadeUpDirective } from "../../../core/direcitve/fade-up.directive";
import { FadeLeftDirective } from "../../../core/direcitve/fade-left.directive";
import { BlogFormComponent } from '../blog-form/blog-form.component';

@Component({
  selector: 'app-blog-cart',
  standalone: true,
  imports: [BlogFormComponent, DatePipe, ProjectDisPipe, CommonModule, ReactiveFormsModule, FadeUpDirective],
  templateUrl: './blog-cart.component.html',
  styleUrl: './blog-cart.component.css'
})
export class BlogCartComponent {
  @Input({ required: true }) blogs !: Iblogs[]
  @Input({ required: true }) adminMode!: boolean
  editMode!: boolean
  show!: boolean
  my_blog : Iblogs | null = null

  openEdit(blog: Iblogs) {
  this.my_blog = null;
  this.show = false;
  this.editMode = false;
  setTimeout(() => {
    this.my_blog = { ...blog };
    this.editMode = true;
    this.show = true;
  });
}
  bg !: string
  constructor(private _BlogService: BlogService, private _bg: BgService, private _UplodeImgService: UplodeImgService, private _ToastrService: ToastrService, private _Router: Router) { }
  ngOnInit(): void {
    this._bg.$theme.subscribe({
      next: res => this.bg = res
    })

  }

  //* get all blogs
  getBlogs() {
    this._BlogService.getBlog().subscribe({
      next: res => {
        this.blogs = res.filter((prj:Iblogs)=> prj.status == 'active')
      },
      error: err => {
        console.log(err);
      }
    })
  }
  //* delete blog
  delBlog(id: number = 0) {
    this._BlogService.delBlog(id).subscribe({
      next: res => {
        this.getBlogs()
        this._ToastrService.success('deleted this item', 'success')
      }
    })
  }
  goToDetalis(id: number = 0) {
    this._Router.navigate(['blog/', id])
  }
}
