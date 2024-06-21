import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookBasketComponent } from './book-basket.component';

describe('BookBasketComponent', () => {
  let component: BookBasketComponent;
  let fixture: ComponentFixture<BookBasketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookBasketComponent]
    });
    fixture = TestBed.createComponent(BookBasketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
