import { Pipe, PipeTransform } from '@angular/core';
import { Iblogs } from '../interface/iblogs';

@Pipe({
  name: 'searchBlog',
  standalone: true
})
export class SearchBlogPipe implements PipeTransform {

  transform(blogs: Iblogs[] ,searchWord: string) {
    if(!searchWord) return blogs
      if (!blogs) return [];

    let word = searchWord.toLowerCase().trim()
    return blogs.filter(blog=>blog.blog_title.toLowerCase().trim().includes(word) || blog.tag.some(t=>t.toLowerCase().trim().includes(word)) )
  }

}
