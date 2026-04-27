import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authguardGuard: CanActivateFn = (route, state) => {
  let adminMode = localStorage.getItem('adminMode')
  let toaster = inject(ToastrService)
  if (adminMode === 'false') {
    toaster.error('You are not authorized to access this page', 'Unauthorized')
    return false
  }else{
    return true;
  }
};
