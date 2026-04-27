import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogService } from '../../../core/api/blog.service';
import { BgService } from '../../../core/api/bg.service';
import { UplodeImgService } from '../../../core/api/uplode-img.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Iblogs } from '../../../core/interface/iblogs';
import { CommonModule } from '@angular/common';
import { FadeUpDirective } from "../../../core/direcitve/fade-up.directive";

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FadeUpDirective],
  templateUrl: './blog-form.component.html',
  styleUrl: './blog-form.component.css'
})
export class BlogFormComponent {
  @Input({ required: true }) eidtMode: boolean = false
  @Input({ required: true }) show: boolean = false
  @Input ({required : true}) blog : Iblogs | null = null
   @Output() close = new EventEmitter<void>();
   @Output() refresh = new EventEmitter<void>();

   constructor(  private _BlogService: BlogService, private _bg: BgService, private _UplodeImgService: UplodeImgService, private _ToastrService: ToastrService, private _Router: Router) { }

   bg !: string
  ngOnInit(): void {
    this.initFormControl()
    this.initFormGroup()
  }
  ngOnChanges(): void {
    this._bg.$theme.subscribe(res=> this.bg = res)
    if(this.show && this.eidtMode && this.blog){
      setTimeout(()=>{
          this.enableEdit()
      })
    }
  }
  exitFormSection() {
    this.eidtMode = false
    this.show = false
    this.clearControls()
    this.beforeAllStage()
    this.close.emit()
  }
  //!form
  id !: FormControl
  author !: FormControl
  blog_title !: FormControl
  blog_poster !: FormControl
  blog_type !: FormControl
  blog_date !: FormControl
  title !: FormControl
  poster !: FormControl
  type !: FormControl
  subject !: FormControl
  status !: FormControl
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
    this.status = new FormControl('', [Validators.required])
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
      status: this.status,
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
        this.refresh.emit()
        this.eidtMode = false
        this.show = false
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
  uplodeImgMedia(event: any, index: number) {
    let file = event.target.files[0]
    let formDate = new FormData()
    formDate.append('file', file)
    formDate.append('upload_preset', "portfolio_upload")
    this._UplodeImgService.uplodeImg(formDate).subscribe({
      next: res => {
        let img = res.secure_url
        this.contentControl.at(index).get('poster')?.setValue(img)
      },
      error: err => {
        this._ToastrService.error('error try agin anther time', '')
      }
    })
  }
  //* update blog
  blogs !: Iblogs[]
  blogId!: number
  enableEdit() {
    if (!this.blog) return
    this.blogId = this.blog.id || 0
    this.Form_blog.reset()
    this.clearControls()
    if (this.blog.tag?.length) {
      this.blog.tag.forEach(tag => {
        this.getTag.push(this.createTag(tag))
      })
    } else {
      this.getTag.push(this.createTag())
    }

    // ✅ DESCRIPTION
    if (this.blog.blog_dis?.length) {
      this.blog.blog_dis.forEach(dis => {
        this.getDis.push(this.createDis(dis))
      })
    } else {
      this.getDis.push(this.createDis()) // 👈 مهم
    }
    // ✅ CONTENT
    if (this.blog.content?.length) {
      this.blog.content.forEach(e => {
        this.contentControl.push(
          this.createContent(e.title, e.subject, e.poster, e.type)
        )
      })
    } else {
      this.contentControl.push(this.createContent()) // 👈 مهم
    }
    // ✅ IMAGE
    this.imgsrc = this.blog.blog_poster

    // ✅ PATCH
    this.Form_blog.patchValue({
      blog_date: this.blog.blog_date,
      blog_title: this.blog.blog_title,
      author: this.blog.author,
      blog_type: this.blog.blog_type,
      status: this.blog.status,
      blog_poster: this.imgsrc
    })

    this.show = true
  }

  updateBlog() {
    if (!this.cheackForm()) return
    let id: number = this.blogId
    this._BlogService.updateBlog(this.Form_blog.value, this.blog?.id || 0 ).subscribe({
      next: res => {
        this._ToastrService.success('Updeta blog', 'SUCCESS')
        this.refresh.emit()
        this.eidtMode = false
        this.show = false
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
    this.getTag.push(this.createTag())
    this.getDis.push(this.createDis())
    this.contentControl.push(this.createContent())
  }

}
