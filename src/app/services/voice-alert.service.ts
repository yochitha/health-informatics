import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoiceAlertService {

  private reminderListSubject = new BehaviorSubject<any[]>([]);

  constructor() { }

  getReminderListObservable() {
    return this.reminderListSubject.asObservable();
  }

  setReminderList(reminderList: any[]) {
    this.reminderListSubject.next(reminderList);
  }
}
