import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { blogapi } from '../data/data';
import { Iblogs } from '../interface/iblogs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private _HttpClient:HttpClient) { }

  getBlog():Observable<any>{
    return this._HttpClient.get(`${blogapi}/blog` )
  }
  addBlog(body: Iblogs):Observable<any>{
   return this._HttpClient.post(`${blogapi}/blog`, body )
  }
  delBlog(id:number):Observable<any>{
    return this._HttpClient.delete(`${blogapi}/blog/${id}`)
  }
  updateBlog(body : Iblogs, id : number): Observable<any>{
    return this._HttpClient.put(`${blogapi}/blog/${id}` , body)
  }
  getBlogById(id:number): Observable<any>{
    return this._HttpClient.get(`${blogapi}/blog/${id}`)
  }
}
