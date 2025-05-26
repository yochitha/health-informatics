import { Component } from '@angular/core';
import { FhirService } from '../../services/fhir.service';
import { SelectionEvent } from '@progress/kendo-angular-grid';
import { DialogThemeColor } from "@progress/kendo-angular-dialog";
import { FirebaseService } from '../../services/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { VoiceAlertService } from '../../services/voice-alert.service';

@Component({
  selector: 'app-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.css']
})
export class MedicationComponent {
  public selectedItems: any[] = [];
  public dialogOpened = false;
  medicationData: any;
  localMedicationDetails = {
    "Amoxicillin-containing product": {
      dosage: "One tablet by mouth once daily with food",
      frequency: "Once daily",
      route: "Oral"
    },
    "codeine / guaifenesin / pseudoephedrine Oral Solution [Codahistine]": {
      dosage: "One dose by mouth twice daily",
      frequency: "Twice daily",
      route: "Oral"
    },
    "thioridazine 10 MG/ML Oral Suspension": {
      dosage: "One dose by mouth thrice daily",
      frequency: "Thrice daily",
      route: "Oral"
    }
  };
  medicationFrequency: number = 3;
  timeIntervals: number;
  reminderTimes: { value: number; text: string }[] = [
    { value: 15, text: '15 minutes' },
    { value: 30, text: '30 minutes' },
    { value: 60, text: '1 hour' }
  ];
  firstInterval: any;
  secondInterval: any;
  thirdInterval: any;
  reminderInterval: any;
  adherenceDialog = false;
  secondIntervalTaken = false;
  adherenceDate: Date;
  firstAdherenceInterval: Date;
  secondAdherenceInterval: Date;
  thirdAdherenceInterval: Date;
  firstIntervalIntake: any;
  secondIntervalIntake: any;
  thirdIntervalIntake: any;
  reminderForm: FormGroup;
  submitted: boolean;
  isLoading: boolean;
  reminderList: any;

  constructor(private fhirService: FhirService, private firebaseService: FirebaseService, private formBuilder: FormBuilder,
    private notificationService: NotificationService, private voiceAlertsService: VoiceAlertService
  ) { }

  ngOnInit() {
    this.reminderForm = this.formBuilder.group({
      firstInterval: [null, Validators.required],
      secondInterval: [null],
      thirdInterval: [null],
      reminderInterval: [null, Validators.required]
    });
    this.getMedication();
  }

  get f() { return this.reminderForm.controls; }

  public onSelectionChange(event: SelectionEvent): void {
    this.selectedItems = event.selectedRows.map(row => row.dataItem);
    this.timeIntervals = this.selectedItems[0]["frequency"];
  }

  getMedication() {
    this.isLoading = true;
    this.fhirService.getMedication().subscribe(medicationRes => {
      this.medicationData = medicationRes["entry"].map(entry => {
        const medicationResource = entry.resource;
        const id = entry.resource.id;
        const medicationName = medicationResource.medicationCodeableConcept.coding[0].display;
        let status = "", dosage = "", frequency = "", route = "";
        let startDate: Date | null = null;
        let endDate: Date | null = null;

        if (medicationResource.effectiveDateTime) {
          status = "Active";
          startDate = new Date(medicationResource.effectiveDateTime);
        } else {
          status = "Stopped";
          if (medicationResource.effectivePeriod) {
            startDate = new Date(medicationResource.effectivePeriod.start);
            endDate = new Date(medicationResource.effectivePeriod.end);
          }
        }

        // const localDetails = this.localMedicationDetails[medicationName] || {};
        // const { dosage = "", frequency = "", route = "" } = localDetails;

        dosage = medicationResource.dosage[0].text;
        route = medicationResource.dosage[0].route.text;
        frequency = medicationResource.dosage[0].timing.repeat.frequency;

        return {
          id,
          medicationName,
          status,
          startDate,
          endDate,
          dosage,
          frequency,
          route,
          intervals: "",
          reminderInterval: ""
        };
      });

      this.firebaseService.getMedicationReminders().subscribe(remindersRes => {
        this.reminderList = [];
        remindersRes.forEach(reminder => {
          const medicationIndex = this.medicationData.findIndex(med => med.id === reminder.id);
          if (medicationIndex !== -1) {
            this.reminderList.push({
              "name": this.medicationData[medicationIndex].medicationName, "intervals": [reminder.firstInterval, reminder.secondInterval, reminder.thirdInterval],
              "reminderInterval": reminder.reminderInterval
            });
            const intervals = [reminder.firstInterval, reminder.secondInterval, reminder.thirdInterval]
              .filter(interval => interval)
              .map(interval => new Date(interval).toLocaleTimeString())
              .join('\n');
            this.medicationData[medicationIndex].intervals = intervals;
            this.medicationData[medicationIndex].reminderInterval = reminder.reminderInterval + " minutes";
          }
        });
        this.voiceAlertsService.setReminderList(this.reminderList);
      });
    });

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }


  openReminderDialog() {
    this.dialogOpened = true;
    this.submitted = false;
    if (this.timeIntervals > 1) {
      this.reminderForm.get('secondInterval').setValidators(Validators.required);
    }
    if (this.timeIntervals > 2) {
      this.reminderForm.get('thirdInterval').setValidators(Validators.required);
    }
    this.reminderForm.updateValueAndValidity();
  }

  openMedicationAdherence() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    this.adherenceDate = currentDate;
    const intervals = this.selectedItems[0].intervals.split('\n');
    if (intervals.length > 0 && intervals[0] != '') {
      const firstTime = intervals[0].split(':');
      this.firstAdherenceInterval = new Date(0, 0, 0, +firstTime[0], +firstTime[1], 0);
      this.firstIntervalIntake = false;

      if (intervals.length > 1) {
        const secondTime = intervals[1].split(':');
        this.secondAdherenceInterval = new Date(0, 0, 0, +secondTime[0], +secondTime[1], 0);
        this.secondIntervalIntake = false;

        if (intervals.length > 2) {
          const thirdTime = intervals[2].split(':');
          this.thirdAdherenceInterval = new Date(0, 0, 0, +thirdTime[0], +thirdTime[1], 0);
          this.thirdIntervalIntake = false;
        }
      }
      this.adherenceDialog = true;
    }
    else {
      this.notificationService.info('', 'Please set medication reminders.')
    }
  }

  setReminders() {
    this.submitted = true;

    if (this.reminderForm.invalid) {
      return;
    }

    let reminderData = {
      "id": this.selectedItems[0]["id"],
      "firstInterval": this.reminderForm.value.firstInterval,
      "secondInterval": this.reminderForm.value.secondInterval,
      "thirdInterval": this.reminderForm.value.thirdInterval,
      "reminderInterval": this.reminderForm.value.reminderInterval.value
    }

    this.isLoading = true;
    this.firebaseService.medicationReminder(reminderData).subscribe(res => {
      this.notificationService.success('', 'Medication Reminder Added Successfully!');
      this.getMedication();
      this.dialogOpened = false;
      this.reminderForm.reset();
      this.isLoading = false;
    });
  }

  addAdherence() {
    let checkboxValues = [this.firstIntervalIntake];
    if (this.timeIntervals > 1) {
      checkboxValues.push(this.secondIntervalIntake);
      if (this.timeIntervals > 2) checkboxValues.push(this.thirdIntervalIntake);
    }

    const trueCount = checkboxValues.filter(value => value === true).length;
    let adherenceData = {
      "patientId": localStorage.getItem("patientId"),
      "medicationId": this.selectedItems[0]["id"],
      "medication": this.selectedItems[0]["medicationName"],
      "date": this.adherenceDate,
      "adherence": parseFloat(((trueCount / this.timeIntervals) * 100).toFixed(2))
    }

    this.isLoading = true;
    this.firebaseService.medicationAdherence(adherenceData).subscribe(res => {
      this.notificationService.success('', 'Medication Adherence Added Successfully!');
      this.adherenceDialog = false;
      this.firstIntervalIntake = null;
      this.secondIntervalIntake = null;
      this.thirdIntervalIntake = null;
      this.isLoading = false;
    });
  }
}
