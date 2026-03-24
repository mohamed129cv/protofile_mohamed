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

@Component({
  selector: 'app-blog-cart',
  standalone: true,
  imports: [DatePipe, ProjectDisPipe, CommonModule, ReactiveFormsModule, FadeUpDirective],
  templateUrl: './blog-cart.component.html',
  styleUrl: './blog-cart.component.css'
})
export class BlogCartComponent {
  @Input({ required: true }) blogs !: Iblogs[]
  @Input({ required: true }) adminMode!: boolean
  bg !: string
  constructor(private _BlogService: BlogService, private _bg: BgService, private _UplodeImgService: UplodeImgService, private _ToastrService: ToastrService , private _Router : Router) { }
  ngOnInit(): void {
    this._bg.$theme.subscribe({
      next: res => this.bg = res
    })
    this.initFormControl()
    this.initFormGroup()
  }


  @ViewChild('form_group') formSection!: ElementRef
  showFormSection() {
    this.formSection.nativeElement.classList.add('show')
    this.formSection.nativeElement.classList.remove('hidden')
  }
  exitFormSection() {
    this.formSection.nativeElement.classList.remove('show')
    this.formSection.nativeElement.classList.add('hidden')
  }
  //!form
  id !:FormControl
  author !: FormControl
  blog_title !: FormControl
  blog_poster !: FormControl
  blog_type !: FormControl
  blog_date !: FormControl
  title !: FormControl
  poster !: FormControl
  type !: FormControl
  subject !: FormControl
  tag !: FormArray
  blog_dis !: FormArray
  content !: FormArray
  Form_blog !: FormGroup
  initFormControl() {
    this.author = new FormControl('', [Validators.required])
    this.blog_title = new FormControl('', [Validators.required])
    this.blog_poster = new FormControl(this.imgsrc, [Validators.required])
    this.blog_type = new FormControl('', [Validators.required])
    this.blog_date = new FormControl('', [Validators.required])
    this.tag = new FormArray([this.createTag()])
    this.blog_dis = new FormArray([this.createDis()])
    this.content = new FormArray([this.createContent()])
  }

  initFormGroup() {
    this.Form_blog = new FormGroup({
      author: this.author,
      blog_title: this.blog_title,
      blog_poster: this.blog_poster,
      blog_type: this.blog_type,
      blog_date: this.blog_date,
      content: this.content,
      tag: this.tag,
      blog_dis: this.blog_dis

    })
  }
  createTag(value: string = '') {
    return new FormControl(value, Validators.required)
  }
  get getTag() {
    return this.Form_blog.get('tag') as FormArray
  }
  addTag() {
    this.getTag.push(this.createTag())
  }

  createDis(value: string = '') {
    return new FormControl(value, Validators.required)
  }
  get getDis() {
    return this.Form_blog.get('blog_dis') as FormArray
  }
  addDis() {
    this.getDis.push(this.createDis())
  }


  createContent(title: string = '', subject: string[] = [], poster?: string, type: 'image' | 'video' = 'image') {
    return new FormGroup({
      title: new FormControl(title, Validators.required),
      subject: new FormArray(subject.length ? subject.map(s => new FormControl(s, Validators.required))
        : [new FormControl('', Validators.required)]),
      poster: new FormControl(poster),
      type: new FormControl(type, Validators.required),
    })
  }
  get contentControl() {
    return this.Form_blog.get('content') as FormArray
  }
  addContent() {
    this.contentControl.push(this.createContent())
  }
  getSubject(index: number) {
    return (this.content.at(index)).get('subject') as FormArray
  }
  addSub(contentIndex: number) {
    this.getSubject(contentIndex).push(new FormControl('', Validators.required))
  }

  removeContent(index: number, control: FormArray) {
    if (control.length > 1) {
      control.removeAt(index)
      this._ToastrService.success('The item was successfully deleted', '')
    } else {
      this._ToastrService.warning('The last item cannot be deleted',)
    }
  }
  removeSubject(contentIndex: number, subIndex: number) {
    this.getSubject(contentIndex).removeAt(subIndex)
    this._ToastrService.success('The item was successfully deleted', '')
  }

  submit() {
    if (!this.cheackForm()) return
    this._BlogService.addBlog(this.Form_blog.value).subscribe({
      next: res => {
       this.beforeAllStage()
        this._ToastrService.success('Project added successfully')
      },
      error: err => {
        this._ToastrService.error('POST ERROR', 'ERROR')
      }
    });


  }
  //* التاكد من صح البيانات
  cheackForm() {
    if (this.Form_blog.valid) {
      return true
    } else {
      this.Form_blog.markAsTouched()
      Object.keys(this.Form_blog.controls).forEach(c => this.Form_blog.controls[c].markAsDirty())
      this._ToastrService.error('Please fill in all required fields.', 'Error')
      return false
    }
  }
  //! img
  imgsrc: string = ''
  uplodeImg(event: any) {
    let file = event.target.files[0]
    let formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'portfolio_upload')
    this._UplodeImgService.uplodeImg(formData).subscribe({
      next: res => {
        this.imgsrc = res.secure_url
        this.Form_blog.get('blog_poster')?.setValue(this.imgsrc)
      }
    })
  }
  //* get all blogs
  getBlogs() {
    this._BlogService.getBlog().subscribe({
      next: res => {
        this.blogs = res
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
  //* update blog
  editMode: boolean = false
  blogId!: number
  enableEdit(id: number = 0) {
    let blog = this.blogs.find(blog => blog.id == id)
    if (!blog) return
    this.editMode = true
    this.blogId = blog.id || 0
    this.Form_blog.reset()        // ✅ مهم
    this.clearControls()
    if (blog.tag?.length) {
      blog.tag.forEach(tag => {
        this.getTag.push(this.createTag(tag))
      })
    } else {
      this.getTag.push(this.createTag()) // 👈 مهم
    }

    // ✅ DESCRIPTION
    if (blog.blog_dis?.length) {
      blog.blog_dis.forEach(dis => {
        this.getDis.push(this.createDis(dis))
      })
    } else {
      this.getDis.push(this.createDis()) // 👈 مهم
    }

    // ✅ CONTENT
    if (blog.content?.length) {
      blog.content.forEach(e => {
        this.contentControl.push(
          this.createContent(e.title, e.subject, e.poster, e.type)
        )
      })
    } else {
      this.contentControl.push(this.createContent()) // 👈 مهم
    }
    // ✅ IMAGE
    this.imgsrc = blog.blog_poster

    // ✅ PATCH
    this.Form_blog.patchValue({
      blog_date: blog.blog_date,
      blog_title: blog.blog_title,
      author: blog.author,
      blog_type: blog.blog_type,
      blog_poster: blog.blog_poster
    })

    this.showFormSection()
  }

  updateBlog() {
    if (!this.cheackForm()) return
    let id: number = this.blogId
    this._BlogService.updateBlog(this.Form_blog.value, id).subscribe({
      next: res => {
        this.editMode = false
        this._ToastrService.success('Updeta blog', 'SUCCESS')
        this.Form_blog.reset()
        this.beforeAllStage()
      }
    })

  }
  //*اعادة الفورم الي طبيعتها بعد الحقظ
  clearControls() {
    this.getDis.clear()
    this.getTag.clear()
    this.contentControl.clear()
  }
  psuhControl() {
    this.createTag()
    this.createDis
    this.createContent()
  }
  beforeAllStage() {
    this.Form_blog.reset()
    this.getTag.push(this.getBlogs())
    this.getDis.push(this.clearControls())
    this.contentControl.push(this.psuhControl())
  }
  goToDetalis(id : number =0){
    this._Router.navigate(['blog/' ,id])
  }
}
