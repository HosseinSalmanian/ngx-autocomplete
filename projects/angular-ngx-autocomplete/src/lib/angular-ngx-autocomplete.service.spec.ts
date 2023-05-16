import { TestBed } from '@angular/core/testing';

import { AngularNgxAutocompleteService } from './angular-ngx-autocomplete.service';

describe('AngularNgxAutocompleteService', () => {
  let service: AngularNgxAutocompleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularNgxAutocompleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
