import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminModeService {

  constructor() { }
  adminMode = new BehaviorSubject<boolean>(false)
  $adminMode = this.adminMode.asObservable()
  toggleAdminMode(value: boolean) {
    this.adminMode.next(value)
  }
  getAdminMode() {
    return this.adminMode.asObservable();
  }
}
