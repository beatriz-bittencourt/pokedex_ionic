import { TestBed } from '@angular/core/testing';

import { TratamentosService } from './tratamentos.service';

describe('Tratamentos', () => {
  let service: TratamentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TratamentosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
