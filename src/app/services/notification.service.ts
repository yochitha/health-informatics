import { Injectable } from '@angular/core';
import { Subject, Observable } from "rxjs";

@Injectable()
export class NotificationService {

  private _subject = new Subject<Notification>();
  private _idx = 0;

  constructor() { }

  getObservable(): Observable<Notification> {
    return this._subject.asObservable();
  }

  info(title: string, message: string, timeout = 3000) {
    this._subject.next(new Notification(this._idx++, NotificationType.info, title, message, timeout));
  }

  success(title: string, message: string, timeout = 3000) {
    this._subject.next(new Notification(this._idx++, NotificationType.success, title, message, timeout));
  }

  warning(title: string, message: string, timeout = 3000) {
    this._subject.next(new Notification(this._idx++, NotificationType.warning, title, message, timeout));
  }

  error(title: string, message: string, timeout = 0) {
    this._subject.next(new Notification(this._idx++, NotificationType.error, title, message, timeout));
  }
}

export class Notification {
  constructor(
    public id: number,
    public type: NotificationType,
    public title: string,
    public message: string,
    public timeout: number,
  ) { }

}

export enum NotificationType {
  success = 0,
  warning = 1,
  error = 2,
  info = 3
}