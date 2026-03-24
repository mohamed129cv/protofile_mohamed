import { CommonModule, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { BlogService } from '../../../core/api/blog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Iblogs } from '../../../core/interface/iblogs';
import { BgService } from '../../../core/api/bg.service';
import { FadeUpDirective } from "../../../core/direcitve/fade-up.directive";
import { FadeLeftDirective } from "../../../core/direcitve/fade-left.directive";
import { FadeRightDirective } from "../../../core/direcitve/fade-right.directive";

@Component({
  selector: 'app-blog-detalis',
  standalone: true,
  imports: [CommonModule, FadeUpDirective, FadeLeftDirective, FadeRightDirective],
  templateUrl: './blog-detalis.component.html',
  styleUrl: './blog-detalis.component.css'
})
export class BlogDetalisComponent {
  blog: Iblogs = {} as Iblogs;
  allBlogs: Iblogs[] = []
  id!: number;
  bg !:string 
  constructor(
    private _bg : BgService ,
    private _Router: Router,
    private route: ActivatedRoute,
    private _BlogService: BlogService, private viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.route.data.subscribe((res: any) => {
      this.blog = res['blog']
    })
    this.getAllBlogs()
    this._bg.$theme.subscribe(res=>{
      this.bg = res
    })
  }
  getAllBlogs() {
    this._BlogService.getBlog().subscribe(res => {
      this.allBlogs = res
    })
  }
  goToBlog(id: number = 0) {
    this._Router.navigate(['blog/', id])
  }
  getId(title: string) {
    return title.replace(/\s+/g, '-').toLowerCase();
  }

  scrollTo(title: string) {
    const id = this.getId(title);
    this.viewportScroller.scrollToAnchor(id);
  }
}
