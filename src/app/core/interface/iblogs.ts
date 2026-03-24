export interface Iblogs {
  id?: number  ,
  author : string,
  blog_title : string ,
  blog_poster : string ,
  blog_dis : string [] ,
  blog_type : string ,
  blog_date : Date ,
  tag : string [] ,
  content : Icontent []
}
export interface Icontent{
  title: string
  subject : string [],
  poster ?: string ,
  type ?: 'image' | 'video'
}
