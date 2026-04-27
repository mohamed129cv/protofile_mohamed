import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminModeService {

  constructor() { }
  adminMode = new BehaviorSubject<boolean>(false)
  $adminMode = this.adminMode.asObservable()
  toggleAdminMode(value: boolean ) {
    localStorage.setItem('adminMode', value.toString())
    this.adminMode.next(value)
  }
  getAdminMode() {
    return this.adminMode.asObservable();
  }
}
