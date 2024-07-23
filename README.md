MVP document

This document is a stripped down MVP version of this project

# Demo-DnD

An app to coordinate stock requests between retail stores

## Project Description

This is a NextJS application aimed at

### Challenges

This has been attempt number 6 to build this project. The requirements have changed slightly due to some evolution at the stores- I can take advantage of mobile scanners that are running android. Burnout is the thing to avoid so keeping the scope small and focused is key.

The previous versions of this project used the MERN stack- I miss how clear cut some things were. Next is doing lots of things that I don't understand deeply how it works.

Some of the next challenges that I've encountered:

- Sending data between client and server components (only plain JS objects are allowed)
- Caching

The solution to these is time spend in the docs and time spent with Next.

## Defining the problem:

When retail stores want to communicate a stock request to the Seven Hills warehouse location, google sheets are used. The use of google sheets has the following issues:

- not intuitive. For example- putting all product information (sku, qty, description) within a single cell and using variable formatting
- prone to errors (no form validation)
- does not integrate with existing tech (scanners and shipping software)
- The overall process relies on manual, disconnected steps that should be part of a linked system.

What google sheet does well:

- One centralised location for the seven hills team to view all requests
- Reliable / robust text transfer
- Simple process

The use of google sheets represents an area where an application could step in the improve the overall process.

## Goals

1. Replace the use of googlesheets when paddy pallin retail stores make a request to the seven hills warehouse
2. Demonstrate value of a bespoke app

For the app to be successful, it needs to be an improvement on the existing system and gain user acceptance. Key areas where I can see how an app will improve the overall workflow:

- Scan to complete picking using zebra scanners
- More intuitive / user friendly than a spreadsheet

## Stakeholders

- Retail store staff - Improve efficiency and reduce errors. Tool more intuitive and easier to use than google sheet
- Seven Hills staff - Improve efficiency and reduce errors
- Customers - Reduce errors and improved overall experience

## MVP User Stories

### Customer

- a customer will be assigned a order reference number that they can quote to help staff person find request status

### Seven Hills staff

- a seven hills person can view all orders in a single dashboard view #17
- a seven hills person can scan barcodes to complete picking #19
- a seven hills person can generate a shipping label from the app via details entered from staff person
- a seven hills person can easily tell app which orders are being packed at once
- a seven hills person can mark an item oos

### Retail staff person

- a store staff person can create a customer request #2
- a staff person can search for products (skus) via item description #3
- a staff person can scan in a barcode or SKU directly #4
- a staff person can choose between deliver to store and ship direct to customer #5
- a staff person can see a dashboard of past orders, pending orders #6
- a staff person can easily find where a person's request is up to (in transit w/ tracking or ETA, arrived in store with location notes)
- a staff person can check SOH via app (public website endpoint) and get an idea where stock might come from

## Functional Requirements

- Secure login

## Validation and Testing

TBD

### Test Plan

### Test Cases

### Validation Criteria
