import { ResolveFn } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { Iblogs } from '../interface/iblogs';
import { inject } from '@angular/core';
import { BlogService } from '../api/blog.service';

export const blogResolver: ResolveFn<Observable <Iblogs>> = (route, state) => {
  let api = inject(BlogService)
  let id = Number(route.paramMap.get('id'))
  return id ? api.getBlogById(id) : EMPTY;
};

