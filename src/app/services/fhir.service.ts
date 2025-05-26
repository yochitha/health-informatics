import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FhirService {
  private baseUrl = 'https://hapi.fhir.org/baseR4';
  private readonly bearerToken = '12345';

  constructor(private http: HttpClient) { }

  getPatientsByNames(firstName: string, lastName: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Accept', 'application/fhir+json');
    // .set('Authorization', `Bearer ${this.bearerToken}`);
    const params = new HttpParams()
      .set('family', lastName)
      .set('given', firstName);

    return this.http.get<any[]>(`${this.baseUrl}/Patient`, { headers, params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getMedication(){
    const headers = new HttpHeaders().set('Accept', 'application/fhir+json');
    // .set('Authorization', `Bearer ${this.bearerToken}`);
    const params = new HttpParams()
      .set('patient', localStorage.getItem("patientId"));

    return this.http.get<any[]>(`${this.baseUrl}/MedicationStatement`, { headers, params })
    .pipe(
      catchError(this.handleError)
    );
  }

  addPatientIncidents(data){
    const headers = new HttpHeaders().set('Accept', 'application/fhir+json');
    // .set('Authorization', `Bearer ${this.bearerToken}`);
    return this.http.post(`${this.baseUrl}/Encounter`, data, { headers });
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return new Observable<never>(() => { throw error; });
  }
}
