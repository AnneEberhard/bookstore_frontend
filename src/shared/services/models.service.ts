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
    title: string;
    created_at?: string;
    description: string;
    genre: BookGenre;
    id?: number;
    thumbnail_file_url: string;
}


export interface User {
    name: string;
    email: string;
    password?: string;
}