# 🩺 CareMedix – A Health Informatics Solution for Dementia Care

A web application tailored to support Alzheimer's and dementia patients through intuitive tools for caregivers and clinicians.  
Features include **EHR (FHIR) integration**, **medication tracking with voice alert reminders**, **incident logging**, and **real-time health monitoring**.

---

## 🌐 Deployment

The application is hosted on Firebase:  
🔗 [CareMedix Live App](https://ihi-project-eda2c.web.app/)

---

## 🔗 FHIR Integration

The application utilizes the **HAPI FHIR public server** for electronic health record (EHR) integration:  
🌐 [HAPI FHIR Server](https://hapi.fhir.org/baseR4)

---

## 🔒 Authentication & Database

- **Authentication:** Firebase Authentication  
- **Database:** Firebase Realtime Database  
- Provides real-time synchronization for patient data and caregiver notes.

---

## 🧪 Synthetic Patient Data

Patient profiles are generated using **Synthea**, specifically the **dementia module**, to simulate realistic EHR scenarios.  
Patients are aged between **60 and 80**, representing a common Alzheimer's demographic.

---

## 👤 Sample User Credentials

| Patient Profile | Username   | Password      |
|-----------------|------------|---------------|
| Profile 1       | Alejandro  | Alejandro@123 |

Account is preconfigured for demo access.

---

## 🛠️ Tech Stack

- **Frontend:** Angular, Angular Material, TypeScript  
- **Backend:** Firebase (Realtime DB + Auth)  
- **Integration:** SMART on FHIR, HAPI FHIR Server  
- **Hosting:** Firebase Hosting

---

## 🎯 Learning Objectives

- Implement EHR integration using **FHIR standards**  
- Utilize **synthetic data** for realistic healthcare simulations  
- Build responsive, accessible interfaces for caregivers  
- Develop robust systems for **medication and incident tracking**  
- Apply health informatics to address challenges in **dementia care**

