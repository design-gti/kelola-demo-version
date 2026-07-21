# IDP Management Gherkin Specification

``` gherkin
Feature: IDP Management for HR Admin

  As an HR Admin
  I want to create, assign, and monitor IDP for employees
  So that employee development plans can be managed centrally


  Background:
    Given HR Admin is logged in to the system
    And HR Admin accesses the IDP module


  Scenario: View employee list grouped by job or department
    Given HR Admin is on IDP dashboard
    When page is loaded
    Then system displays all employees
    And employees are grouped by job or department section
    And each employee shows their IDP summary or progress

  Scenario: Search employee in IDP dashboard
    Given HR Admin is on IDP dashboard
    When HR Admin enters employee name in search field
    Then system displays matching employee result

  Scenario: Filter employee list
    Given HR Admin is on IDP dashboard
    When HR Admin applies filter
    Then system displays employee list based on selected filter

  Scenario: Navigate to Create IDP page
    Given HR Admin is on IDP dashboard
    When HR Admin clicks "Create IDP"
    Then system redirects user to Create IDP page

  Scenario: Create IDP with manual program input
    Given HR Admin is on Create IDP page
    When HR Admin selects employee
    And fills program manually
    And fills vendor
    And selects category
    And selects aspect
    And fills development goals
    And selects start date
    And selects end date
    And assigns PIC
    And clicks "Submit IDP"
    Then system creates IDP successfully
    And assigns IDP to selected employee
    And assigns IDP visibility to employee manager

  Scenario: Create IDP using library program
    Given HR Admin is on Create IDP page
    When HR Admin selects employee
    And chooses program from library
    And completes required fields
    And clicks "Submit IDP"
    Then system creates IDP successfully

  Scenario: Create IDP using AI generated program
    Given HR Admin is on Create IDP page
    When HR Admin selects employee
    And clicks AI generate option
    And system generates program recommendation
    And HR Admin selects generated recommendation
    And completes required fields
    And clicks "Submit IDP"
    Then system creates IDP successfully

  Scenario: Add custom column in IDP table
    Given HR Admin is on Create IDP page
    When HR Admin clicks "+" icon on table
    And inputs custom column name
    Then system adds new custom column to table

  Scenario: Submit IDP with incomplete mandatory fields
    Given HR Admin is on Create IDP page
    When HR Admin clicks "Submit IDP" without completing mandatory fields
    Then system displays validation error message
    And IDP is not submitted

  Scenario: Monitor employee IDP progress
    Given employee has active IDP
    When HR Admin opens employee IDP detail
    Then system displays progress percentage
    And system displays completion status per program

  Scenario: Edit existing IDP
    Given employee already has IDP
    When HR Admin edits IDP detail
    And clicks save
    Then system updates IDP successfully

  Scenario: Delete existing IDP
    Given employee already has IDP
    When HR Admin deletes IDP
    And confirms deletion
    Then system removes IDP successfully
```
