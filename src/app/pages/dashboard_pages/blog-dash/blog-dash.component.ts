import { Component } from '@angular/core';
import { BlogService } from '../../../core/api/blog.service';
import { ToastrService } from 'ngx-toastr';
import { Iblogs } from '../../../core/interface/iblogs';
import { CommonModule } from '@angular/common';
import { BlogFormComponent } from '../../blog/blog-form/blog-form.component';
import { ProjectDisPipe } from '../../../core/pipe/project-dis.pipe';
import { FormsModule } from '@angular/forms';
import { SearchBlogPipe } from '../../../core/pipe/search-blog.pipe';
import { BgService } from '../../../core/api/bg.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-blog-dash',
  standalone: true,
  imports: [SearchBlogPipe, FormsModule, CommonModule, BlogFormComponent, ProjectDisPipe, RouterLink],
  templateUrl: './blog-dash.component.html',
  styleUrl: './blog-dash.component.css'
})
export class BlogDashComponent {
  constructor(private _blog: BlogService, private toster: ToastrService , private _bg : BgService) { }
  ngOnInit(): void {
    this.getAllBlogs()
  }
   ngAfterViewInit(): void {
    this._bg.$theme.subscribe(res=> this.bg=res)
  }
  bg!: string
  filter: ('all' | 'active' | 'inactive')[] = ['all', 'active', 'inactive']
  filterKey: 'all' | 'active' | 'inactive' = 'all'
  showFilter: boolean = false
  searchWord: string = ''
  blog: Iblogs | null = null
  show: boolean = false
  eidtMode: boolean = false
  allblogs: Iblogs[] = []
  loading: boolean = false

  getAllBlogs() {
    this.loading = true
    this._blog.getBlog().subscribe(res => {
      this.allblogs = res
      this.loading = false
    })
  }
  deleteBlog(id: number) {
    this._blog.delBlog(id).subscribe(res => {
      this.toster.error("Blog Deleted")
      this.getAllBlogs()
    })
  }
  openEidt(blog: Iblogs) {
    setTimeout(() => {
      this.blog = blog
      this.show = true
      this.eidtMode = true
    });
  }
    toggleFilter() {
    this.showFilter = !this.showFilter
  }
  setFilterValue(value: 'all' | 'active' | 'inactive') {
    this.filterKey = value
    this.showFilter = false
  }
  get filteredBlogs() {
      if(this.filterKey == 'all') return this.allblogs
    return this.allblogs.filter(b=> b.status == this.filterKey )
  }
    get activeblogsCount() {
    return this.allblogs.filter(p=>p.status =='active').length
  }

  get inactiveblogsCount() {
    return this.allblogs.filter(p=>p.status =='inactive').length
  }
}
