import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { informtionApi } from '../data/data';
import { MainInformtion } from '../interface/main-informtion';

@Injectable({
  providedIn: 'root'
})
export class ApiInformtionService {

  constructor(private http : HttpClient) { }
  getInformtion():Observable<any>{
      return this.http.get(informtionApi)
  }
  eidtInformtion(body:MainInformtion):Observable<any>{
    return this.http.put(`${informtionApi}/2`,body)
  }
}
