# Product Requirements Document (PRD)

## Individual Development Plan (IDP) Management System

------------------------------------------------------------------------

## 1. Overview

### Product Name

IDP Management System

### Purpose

The IDP Management System is designed to help HR Admin manage employee
Individual Development Plans (IDP) in a centralized platform. The system
enables HR Admin to create, assign, monitor, and track employee
development programs efficiently.

### Target Users

-   HR Admin
-   Employee
-   Manager
-   PIC (Person In Charge)

------------------------------------------------------------------------

## 2. Problem Statement

Currently, IDP processes are often managed manually using spreadsheets
or disconnected tools, causing: - Difficulty monitoring employee
development progress - Lack of centralized documentation - Inconsistent
IDP format - Limited visibility for managers and stakeholders - Manual
tracking overhead for HR team

------------------------------------------------------------------------

## 3. Goals & Objectives

### Business Goals

-   Standardize employee IDP creation process
-   Improve visibility of employee development progress
-   Reduce manual monitoring effort for HR

### User Goals

HR Admin should be able to: - Create IDP for employees - Assign PIC and
stakeholders - Monitor IDP progress - View all employee IDP details in
one platform

------------------------------------------------------------------------

## 4. Scope

### In Scope

-   Employee list dashboard
-   Employee grouping by job/department
-   Create IDP
-   Program input (manual, library, AI generate)
-   Custom table columns
-   Assign employee and manager
-   IDP monitoring dashboard
-   Edit/delete IDP

### Out of Scope

-   Learning platform integration
-   Budget approval workflow
-   External vendor payment

------------------------------------------------------------------------

## 5. User Roles & Permissions

## HR Admin

Can: - View all employees - Create IDP - Edit IDP - Delete IDP - Monitor
all IDPs

## Employee

Can: - View assigned IDP - View progress - Update progress (future
scope)

## Manager

Can: - View team member IDP - Monitor progress

------------------------------------------------------------------------

## 6. Functional Requirements

## 6.1 IDP Dashboard

### Features

-   View all employee list
-   Group employee by job/department
-   Search employee
-   Filter employee
-   View IDP progress summary

------------------------------------------------------------------------

## 6.2 Create IDP

### Required Fields

-   Employee
-   Program
-   Vendor
-   Category
-   Aspect
-   Development Goals
-   Start Date
-   End Date
-   PIC

### Actions

-   Create new IDP
-   Submit IDP
-   Validation required fields

------------------------------------------------------------------------

## 6.3 Program Input Methods

### Manual Input

HR Admin manually types program.

### Library Selection

HR Admin selects predefined program from library.

### AI Generate

HR Admin generates recommendations using AI.

Expected output: - Suggested program - Suggested category/aspect

------------------------------------------------------------------------

## 6.4 Custom Columns

HR Admin can: - Click "+" icon - Add custom column - Fill custom values

Use cases: - Budget - Provider link - Priority - Certification target

------------------------------------------------------------------------

## 6.5 Assignment

After submission: - IDP assigned to employee - Manager receives
visibility access

------------------------------------------------------------------------

## 6.6 Monitoring

HR Admin can view: - IDP details - Program list - PIC - Timeline -
Progress percentage - Completion per program

------------------------------------------------------------------------

## 6.7 Edit/Delete IDP

### Edit

HR Admin can update existing IDP.

### Delete

HR Admin can remove IDP after confirmation.

------------------------------------------------------------------------

## 7. Validation Rules

-   Employee is mandatory
-   Program is mandatory
-   PIC is mandatory
-   Start Date is mandatory
-   End Date is mandatory
-   End Date cannot be earlier than Start Date

------------------------------------------------------------------------

## 8. Success Metrics

### Product Metrics

-   \% employees with active IDP
-   IDP completion rate
-   Average program completion time

### Operational Metrics

-   Reduced manual tracking effort
-   Faster IDP creation time

------------------------------------------------------------------------

## 9. Future Enhancements

-   Employee progress update
-   Reminder notification
-   Approval workflow
-   Export to Excel/PDF
-   Dashboard analytics
-   Integration with LMS

------------------------------------------------------------------------

## 10. Assumptions & Dependencies

### Assumptions

-   Employee master data exists
-   Manager mapping exists

### Dependencies

-   Employee database
-   Authentication system
-   AI recommendation service

------------------------------------------------------------------------
