import { TestBed } from '@angular/core/testing';

import { VoiceAlertService } from './voice-alert.service';

describe('VoiceAlertService', () => {
  let service: VoiceAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
