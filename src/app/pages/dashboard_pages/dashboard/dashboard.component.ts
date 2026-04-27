import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProjectDashComponent } from "../project-dash/project-dash.component";
import { BlogDashComponent } from "../blog-dash/blog-dash.component";
import { MainInformtionComponent } from "../main-informtion/main-informtion.component";
import { BgService } from '../../../core/api/bg.service';
import { EmailAuthProvider, getAuth, onAuthStateChanged, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { AdminModeService } from '../../../core/api/admin-mode.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, ProjectDashComponent, BlogDashComponent, CommonModule, MainInformtionComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private toaster: ToastrService, private _bg: BgService, private _admin: AdminModeService) { }
  ngOnInit(): void {
    this.initFormControl()
    this.initFormGroup()
  }
  items = [
    { name: 'Profile', key: 'Profile', icon: 'fa-user' },
    { name: 'Informtion', key: 'informtion', icon: 'fa-circle-info' },
    { name: 'Projects', key: 'projects', icon: 'fa-folder' },
    { name: 'Blogs', key: 'blogs', icon: 'fa-blog' }
  ];
  openTap = 'Profile'
  isOpen = false
  bg!: string
  user !: any
  inputEmail: string = ''
  inputPassword: string = ''
  ngAfterViewInit(): void {
    this._bg.$theme.subscribe(res => this.bg = res)
    let auth = getAuth()
    onAuthStateChanged(auth, user => {
      this.user = user
    })
  }
  toggleAside() {
    this.isOpen = !this.isOpen
  }
  form !: FormGroup
  oldPass !: FormControl
  newPass !: FormControl
  initFormControl() {
    this.oldPass = new FormControl('', Validators.required)
    this.newPass = new FormControl('', Validators.required)
  }
  initFormGroup() {
    this.form = new FormGroup({
      oldPass: this.oldPass,
      newPass: this.newPass,
    })
  }
  updatePassword() {
    let newPassword = this.form.value.newPass
    let oldPassword = this.form.value.oldPass
    let email = this.user.email
    const credential = EmailAuthProvider.credential(email, oldPassword)
    reauthenticateWithCredential(this.user, credential).then(() => {
      updatePassword(this.user, newPassword).then(res => {
        if (this.user && newPassword) {
          this.toaster.success(' Your data has been updated ')
        }
      }).catch(() => {
        this.toaster.success(' Something went wrong ')
      })
    }).catch(() => {
      this.toaster.error('Old password incorrect');
    })
  }

}
