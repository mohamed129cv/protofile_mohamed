export interface MainInformtion {
  jobTitle: string;
  description: string[];
  resume: Iresume[];
  achievements: Iachievement[];
  services: Iservice[];

}
export interface Iresume {
  course_name: string;
  resume_description: string;
  course_place: string;
  start_date: string;
  end_date: string;
}

export interface Iachievement {
  achievement_name: string;
  achievement_icon : string;
  count : number;

}
export interface Iservice {
  service_name: string;
  service_icon : string;
  service_description : string;
}
