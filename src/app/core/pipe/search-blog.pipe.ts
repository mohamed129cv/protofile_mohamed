import { Pipe, PipeTransform } from '@angular/core';
import { Iblogs } from '../interface/iblogs';

@Pipe({
  name: 'searchBlog',
  standalone: true
})
export class SearchBlogPipe implements PipeTransform {

  transform(blogs: Iblogs[] ,searchWord: string) {
    if(!searchWord) return 
      if (!blogs) return [];

    let word = searchWord.toLowerCase().trim()
    return blogs.filter(blog=>blog.blog_title.toLowerCase().trim().includes(word))
  }

}
