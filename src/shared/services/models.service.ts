import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModelsService {

  constructor() { }
}
/**
 * this service delacres all models used in the frontend
 */

export type BookGenre = "Dystopia" | "Fantasy" | "Historical" | "Spy" | "Contemporary" | "Unclassified";


export interface Book {
  id?: number;
  created_at?: string;
  title: string;
  url_title?: string;
  description: string;
  cover_image: File;
  genre: BookGenre;
  is_published: boolean;
  author: CustomUser
}


export interface CustomUser {
  id?: number;
  author_pseudonym?: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
