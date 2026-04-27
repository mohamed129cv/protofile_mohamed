import { AdminModeService } from './../../core/api/admin-mode.service';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BgService } from '../../core/api/bg.service';
import { getAuth, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private _bg: BgService, private _ToastrService: ToastrService, private _AdminModeService: AdminModeService) { }
  adminMode!: boolean
  ngOnInit(): void {
    this._AdminModeService.$adminMode.subscribe(res => this.adminMode = res)
  }
  @Input({ required: true }) showPopup: boolean = false
  @Output() close = new EventEmitter<void>();
  password: string = 'army4'
  userName: string = 'admin'
  inputUser: string = ''
  inputPass: string = ''
  @ViewChild('login') loginSection!: ElementRef
  loginWithGoogle() {
    const auth = getAuth()
    const provied = new GoogleAuthProvider()
    signInWithPopup(auth, provied).then(r => {
      let user = r.user
      if (user.email == 'mohamed129cv@gmail.com' || user.email == 'mohamed8abdulaziz@gmail.com') {
        this.adminMode = true
        this._AdminModeService.toggleAdminMode(this.adminMode)
        this._ToastrService.success('Hello , Admin mode has been activated', 'Success Login')
        this.showPopup = false
      } else {
        this._ToastrService.error('You are not authorized to access this page', 'Unauthorized');
      }
    })
      .catch(e => {
        this._ToastrService.error('Incorrect data was entered', "Error")
      })
  }
  loginWithEmailAndPassword() {
    const email = this.inputUser.trim()
    const pass = this.inputPass.trim()
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email, pass).then(r => {
      let user = r.user
      if (user.email == 'mohamed129cv@gmail.com' || user.email == 'mohamed8abdulaziz@gmail.com') {
        this.adminMode = true
        this._AdminModeService.toggleAdminMode(this.adminMode)
        this._ToastrService.success('Hello , Admin mode has been activated', 'Success Login')
        this.inputPass = ''
        this.inputUser = ''
        this.showPopup = false
      } else {
        this._ToastrService.error('You are not authorized to access this page', 'Unauthorized');
      }
    })
      .catch(e => {
        console.log(this.inputPass);
        console.log(this.userName);
        this._ToastrService.error('Incorrect data was entered', "Error")
      })
  }
  emailReset: string = ''
  ForgotPassword: boolean = false
  resetPassword() {
    const auth = getAuth()
    const email = this.emailReset
    if (!this.emailReset) {
      this._ToastrService.error('Enter your email first');
      return;
    }
    sendPasswordResetEmail(auth, email).then(e => {
      this._ToastrService.success('Check your email to reset your password')
      this.ForgotPassword = false
    })
  }

  showPassword: boolean = false
  toggleInputToPassword() {
    this.showPassword = !this.showPassword
  }

}
