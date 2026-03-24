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

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, SearchBlogPipe, FormsModule, BlogCartComponent, ReactiveFormsModule, FadeUpDirective, RouterLink],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  constructor(
    private _bg:BgService ,
    private _BlogService: BlogService, private _AdminModeService: AdminModeService,
    private _Router: Router,
    private _UplodeImgService: UplodeImgService, private _ToastrService: ToastrService , private _SeoService:SeoService) { }

  ngOnInit(): void {
    this.getBlogs()
    this._SeoService.updateMate(
      'SEO & Digital Marketing Blog' ,
    'Learn proven SEO techniques, social media strategies, and marketing tips to grow your business online.' ,
    'digital marketing, SEO, search engine optimization, social media marketing, online marketing, internet marketing ,digital marketing, SEO, search engine optimization, social media marketing, online marketing, internet marketing , social media strategy, instagram marketing, facebook marketing, content marketing, social media growth'
   )
   this._bg.$theme.subscribe(res=>{
    this.bg= res
   })
  }
  bg!:string
  searword : string = ''
  ngAfterViewInit(): void {
    this._AdminModeService.$adminMode.subscribe({
      next: res => {
        this.adminMode = res
      }
    })
  }

  adminMode!: boolean
  password: string = 'army4'
  userName: string = 'admin'
  inputUser: string = ''
  inputPass: string = ''
  @ViewChild('login') loginSection!: ElementRef

  submitUser() {
    if (!this.inputUser || !this.inputPass) {
      this._ToastrService.error('Please fill all fields');
      return;
    }
    if (this.password.toUpperCase().trim() === this.inputPass.toUpperCase().trim() && this.userName.toUpperCase().trim() === this.inputUser.toUpperCase().trim()) {
      this.adminMode = true
      this._AdminModeService.toggleAdminMode(this.adminMode)
      this._ToastrService.success('Hello , Admin mode has been activated', 'Success Login')
      this.exitLoginSection()
    } else {
      this._ToastrService.error('User Name Or Password is false', 'Error')
    }
  }

  showLoginSection() {
    this.loginSection.nativeElement.classList.add('show')
    this.loginSection.nativeElement.classList.remove('hidden')
  }
  exitLoginSection() {
    this.loginSection.nativeElement.classList.remove('show')
    this.loginSection.nativeElement.classList.add('hidden')
  }


  //* get blog
  blogs !: Iblogs[]
  getBlogs() {
    this._BlogService.getBlog().subscribe({
      next: res => {
        this.blogs = res
        console.log(res);
      },
      error: err => {
        console.log(err);
      }
    })
  }
  showPassword :boolean = false
  toggleInputToPassword(){
    this.showPassword = !this.showPassword
  }

}
