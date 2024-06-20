import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor() { }


  /**
* shows overlay
*/
showOverlay(): void {
  let div = document.getElementById('overlay')
  if (div) {
    div.classList.remove('dNone')
  }
}

/**
* closes overlay
*/
closeOverlay(): void {
  let div = document.getElementById('overlay')
  if (div) {
    div.classList.add('dNone')
  }
}

}
