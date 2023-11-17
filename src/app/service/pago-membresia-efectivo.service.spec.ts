import { TestBed } from '@angular/core/testing';

import { PagoMembresiaEfectivoService } from './pago-membresia-efectivo.service';

describe('PagoMembresiaEfectivoService', () => {
  let service: PagoMembresiaEfectivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagoMembresiaEfectivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
