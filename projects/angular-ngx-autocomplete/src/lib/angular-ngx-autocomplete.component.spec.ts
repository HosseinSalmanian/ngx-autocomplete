import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularNgxAutocompleteComponent } from './angular-ngx-autocomplete.component';

describe('AngularNgxAutocompleteComponent', () => {
  let component: AngularNgxAutocompleteComponent;
  let fixture: ComponentFixture<AngularNgxAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AngularNgxAutocompleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngularNgxAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
