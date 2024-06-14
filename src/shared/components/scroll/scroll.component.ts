import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll',
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.scss']
})
export class ScrollComponent {
  showScrollTopButton: boolean = false;

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = document.documentElement.scrollTop;
    const scrollThreshold = window.innerHeight * 0.2;
    this.showScrollTopButton = scrollPosition > scrollThreshold;
  }
}
