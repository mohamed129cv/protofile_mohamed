import { Component, ElementRef, ViewChild } from '@angular/core';
import { AdminModeService } from '../../../core/api/admin-mode.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlogService } from '../../../core/api/blog.service';
import { Iblogs } from '../../../core/interface/iblogs';
import { BlogCartComponent } from '../blog-cart/blog-cart.component';
import { UplodeImgService } from '../../../core/api/uplode-img.service';
import { FadeUpDirective } from "../../../core/direcitve/fade-up.directive";
import { SeoService } from '../../../core/api/seo.service';
import { SearchBlogPipe } from '../../../core/pipe/search-blog.pipe';
import { BgService } from '../../../core/api/bg.service';
import { getAuth, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { LoginComponent } from "../../login/login.component";

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, SearchBlogPipe, FormsModule, BlogCartComponent, ReactiveFormsModule, FadeUpDirective, RouterLink, LoginComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  constructor(
    private _bg: BgService,
    private _BlogService: BlogService, private _AdminModeService: AdminModeService,
    private _Router: Router,
    private _UplodeImgService: UplodeImgService, private _ToastrService: ToastrService, private _SeoService: SeoService) { }

  ngOnInit(): void {
    this.getBlogs()
    this._SeoService.updateMate(
      'SEO & Digital Marketing Blog',
      'Learn proven SEO techniques, social media strategies, and marketing tips to grow your business online.',
      'digital marketing, SEO, search engine optimization, social media marketing, online marketing, internet marketing ,digital marketing, SEO, search engine optimization, social media marketing, online marketing, internet marketing , social media strategy, instagram marketing, facebook marketing, content marketing, social media growth'
    )
    this._bg.$theme.subscribe(res => {
      this.bg = res
    })
  }
  bg!: string
  searword: string = ''
  adminMode !: boolean
  ngAfterViewInit(): void {
    this._AdminModeService.$adminMode.subscribe({
      next: res => {
        this.adminMode = res
      }
    })
  }



  //* get blog
  blogs !: Iblogs[]
  getBlogs() {
    this._BlogService.getBlog().subscribe({
      next: res => {
        this.blogs = res.filter((blog: Iblogs) => blog.status == 'active')
      },
      error: err => {
        console.log(err);
      }
    })
  }
  showLoginSection: boolean = false
  hiddenPopup(){
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
  saveData() {

    this.adminMode = !this.adminMode
    this._AdminModeService.toggleAdminMode(this.adminMode )
    this._ToastrService.success('Data Saved', 'Success')
  }
}
