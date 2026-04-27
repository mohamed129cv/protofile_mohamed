import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProjectApiService } from '../../core/api/ProjectApiService';
import { BgService } from '../../core/api/bg.service';
import { CommonModule } from '@angular/common';
import { AdminModeService } from '../../core/api/admin-mode.service';

// declare const autoTranslate: any
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor( private _bg: BgService , private _adminMode : AdminModeService) { }
  adminMode : boolean = false
  ngOnInit(): void {
    if (localStorage.getItem('bg_protfile') == 'dark') {
      document.body.classList.add('dark')
    }
    this._adminMode.$adminMode.subscribe(res=> this.adminMode = res)
  }

  pages: string[] = ['home', 'project', 'blog' , 'contact-us' ];

  ngAfterViewInit(): void {
    this._adminMode.$adminMode.subscribe(res=> this.adminMode = res)
    this._bg.$theme.subscribe({
      next: res => {
        this.bg = res
      }
    })
  }

  bg !: any
  toggleBg() {
    this._bg.toggleTheme()
  }

}
