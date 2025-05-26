import { Component, OnInit, OnDestroy } from '@angular/core';
import { VoiceAlertService } from '../../services/voice-alert.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-voice-alerts',
  templateUrl: './voice-alerts.component.html',
  styleUrls: ['./voice-alerts.component.scss']
})
export class VoiceAlertsComponent implements OnInit, OnDestroy {
  private scheduledAlerts: any[] = [];

  constructor(private voiceAlertsService: VoiceAlertService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;

      const createSpeechUtterance = (text: string): SpeechSynthesisUtterance => {
        const utterance = new SpeechSynthesisUtterance(text);
        return utterance;
      };

      const triggerSpeechAlertAtTime = (text: string, alertTime: Date) => {
        const now = new Date();
        const diff = alertTime.getTime() - now.getTime();
        if (diff > 0) {
          const timerId = setTimeout(() => {
            const utterance = createSpeechUtterance(text);
            this.notificationService.error('', text);
            synth.speak(utterance);
          }, diff);
          this.scheduledAlerts.push(timerId);
        }
      };

      this.voiceAlertsService.getReminderListObservable().subscribe(reminderList => {
        this.clearScheduledAlerts();

        reminderList.forEach(ele => {
          ele.intervals.forEach((interval, index) => {
            const intervalTime = new Date(interval);
            const alertTime = new Date(intervalTime.getTime() - ele.reminderInterval * 60 * 1000);
            const alertText = 'Time for medication ' + ele.name;
            triggerSpeechAlertAtTime(alertText, alertTime);
          });
        });
      });
    } else {
      console.log('Speech synthesis not supported');
    }
  }

  ngOnDestroy(): void {
    this.clearScheduledAlerts();
  }

  private clearScheduledAlerts(): void {
    this.scheduledAlerts.forEach(timerId => clearTimeout(timerId));
    this.scheduledAlerts = [];
  }
}
