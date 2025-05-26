import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectionEvent } from '@progress/kendo-angular-grid';
import { FhirService } from '../../services/fhir.service';
import { FirebaseService } from '../../services/firebase.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.scss']
})
export class IncidentsComponent {
  isLoading = false;
  incidentData: any;
  dialogOpened: boolean;
  incidentForm: FormGroup;
  incidentSeverity = [
    { text: 'Mild', value: 'Mild' },
    { text: 'Moderate', value: 'Moderate' },
    { text: 'Severe', value: 'Severe' }
  ];
  submitted: boolean;

  constructor(private formBuilder: FormBuilder, private fhirService: FhirService, private firebaseService: FirebaseService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.incidentForm = this.formBuilder.group({
      incidentDate: [null, Validators.required],
      description: [null, Validators.required],
      location: [null, Validators.required],
      severity: [null, Validators.required],
      action: [null, Validators.required]
    });
    this.loadIncidents();
  }

  get f() {
    return this.incidentForm.controls;
  }

  openIncidentForm() {
    this.dialogOpened = true;
  }

  loadIncidents() {
    this.isLoading = true;
    this.firebaseService.getPatientIncidents().subscribe(res => {
      this.incidentData = res;
      this.isLoading = false;
    })
  }

  saveIncidents() {
    if (this.incidentForm.invalid) {
      this.incidentForm.markAllAsTouched();
      return;
    }

    let data = {
      "patientId": localStorage.getItem("patientId"),
      "incidentDate": this.incidentForm.value.incidentDate,
      "description": this.incidentForm.value.description,
      "location": this.incidentForm.value.location,
      "severity": this.incidentForm.value.severity.value,
      "action": this.incidentForm.value.action,
      "updatedToFHIR": false
    };

    this.isLoading = true;
    this.firebaseService.patientIncident(data).subscribe(res => {
      this.notificationService.info('', 'Patient Incident Added Successfully!')
      this.loadIncidents();
      this.dialogOpened = false;
      this.incidentForm.reset();
      this.isLoading = false;
    });
  }

  transformToEncounters(incidents: any[]): any[] {
    return incidents.map(incident => {
      let classCode = this.mapSeverityToClassCode(incident.severity);
      return {
        "resourceType": "Encounter",
        "status": "finished",
        "class": {
          "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
          "code": classCode,
          "display": incident.description
        },
        "subject": {
          "reference": localStorage.getItem("patientId")
        },
        "period": {
          "start": incident.incidentDate,
          "end": new Date(incident.incidentDate).toISOString()
        }
      };
    });
  }

  mapSeverityToClassCode(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'Mild':
        return 'OUTP';
      case 'Moderate':
        return 'IMP';
      case 'Severe':
        return 'EMER';
      default:
        return 'OTH';
    }
  }

  updateIncidentData() {
    this.isLoading = true;
    let incidents = this.incidentData.filter(ele => !ele.updatedToFHIR);
    if (incidents.length > 0) {
      let fhirData = this.transformToEncounters(incidents);
      fhirData.forEach(fhirIncident => {
        this.fhirService.addPatientIncidents(fhirIncident).subscribe(res => {
          console.log(res);
        })
      });

      const updatedData = { "updatedToFHIR": true };
      incidents.forEach(incident => {
        const incidentKey = incident.id;
        this.firebaseService.updateIncidentData(incidentKey, updatedData)
          .subscribe(response => {
            console.log('Data updated successfully for incident with key', incidentKey);
          }, error => {
            console.error('Error updating data for incident with key', incidentKey, ':', error);
          });
      });
      this.loadIncidents();
      this.notificationService.info('', 'Patient Incident Updated to FHIR Successfully!')
    }
    else {
      this.notificationService.info('', 'All Incidents Up to Date.');
    }
    this.isLoading = false;
  }
}
