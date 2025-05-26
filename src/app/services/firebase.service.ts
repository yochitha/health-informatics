import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  private currentUserSubject: BehaviorSubject<string>;
  public currentUser: Observable<string>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<string>(localStorage.getItem('patientId'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public patientRegistration(user) {
    return this.http.post("https://ihi-project-eda2c-default-rtdb.firebaseio.com/patients.json", user);
  }

  public getPatients(userName: string, password: string): Observable<Patient | null> {
    return this.http.get<Patient[]>("https://ihi-project-eda2c-default-rtdb.firebaseio.com/patients.json").pipe(
      map((patients: Patient[]) => {
        for (const key in patients) {
          if (patients.hasOwnProperty(key)) {
            const patient = patients[key];
            if (patient.userName === userName && patient.password === password) {
              this.currentUserSubject.next(patient.patientId);
              return patient;
            }
          }
        }
        return null;
      })
    );
  }

  public medicationReminder(medicationData) {
    return this.http.post("https://ihi-project-eda2c-default-rtdb.firebaseio.com/reminders.json", medicationData);
  }

  public getMedicationReminders(): Observable<any[]> {
    return this.http.get<any>("https://ihi-project-eda2c-default-rtdb.firebaseio.com/reminders.json").pipe(
      map((data: any) => {
        if (data) {
          return Object.keys(data).map(key => ({ id: key, ...data[key] }));
        } else {
          return [];
        }
      })
    );
  }

  public medicationAdherence(medicationData) {
    return this.http.post("https://ihi-project-eda2c-default-rtdb.firebaseio.com/adherence.json", medicationData);
  }

  getMedicationAdherenceForPatient(): Observable<any[]> {
    return this.http.get<any>("https://ihi-project-eda2c-default-rtdb.firebaseio.com/adherence.json").pipe(
      map((data: any) => {
        if (data) {
          return Object.keys(data)
            .filter(key => data[key].patientId === localStorage.getItem("patientId"))
            .map(key => ({ id: key, ...data[key] }));
        } else {
          return [];
        }
      })
    );
  }

  getPatientIncidents(): Observable<any[]> {
    return this.http.get<any>("https://ihi-project-eda2c-default-rtdb.firebaseio.com/incidents.json").pipe(
      map((data: any) => {
        if (data) {
          return Object.keys(data)
            .filter(key => data[key].patientId === localStorage.getItem("patientId"))
            .map(key => ({ id: key, ...data[key] }));
        } else {
          return [];
        }
      })
    );
  }

  public patientIncident(incident) {
    return this.http.post("https://ihi-project-eda2c-default-rtdb.firebaseio.com/incidents.json", incident);
  }

  public getIncidentLogs(): Observable<any[]> {
    return this.http.get<any>("https://ihi-project-eda2c-default-rtdb.firebaseio.com/incidents.json").pipe(
      map((data: any) => {
        if (data) {
          return Object.keys(data).map(key => ({ id: key, ...data[key] }));
        } else {
          return [];
        }
      })
    );
  }
  
  updateIncidentData(incidentKey: string, updatedData: any): Observable<any> {
    const url = `https://ihi-project-eda2c-default-rtdb.firebaseio.com/incidents/${incidentKey}.json`;
    return this.http.patch(url, updatedData);
  }

  logout() {
    localStorage.removeItem('patientId');
    this.currentUserSubject.next(null);
  }
}

interface Patient {
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  patientId: string;
}
