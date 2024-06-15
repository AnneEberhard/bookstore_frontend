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

export type BookGenre = "Dystopia" | "Fantasy" | "Historical" | "Spy" | "Contemporary";


export interface Book {
  id?: number;
  created_at?: string;
  title: string;
  url_title: string;
  description: string;
  cover_image: string;
  genre: BookGenre;
  is_published: boolean;
  author: CustomUser
}


export interface User {
  name: string;
  email: string;
  password?: string;
}


export interface CustomUser {
  id: number;
  author_pseudonym: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
}
