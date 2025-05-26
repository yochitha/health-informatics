import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceAlertsComponent } from './voice-alerts.component';

describe('VoiceAlertsComponent', () => {
  let component: VoiceAlertsComponent;
  let fixture: ComponentFixture<VoiceAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceAlertsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
