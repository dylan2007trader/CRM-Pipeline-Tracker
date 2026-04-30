# CRM Pipeline Tracker

I build a simple CRM pipeline tracker for a take-home project for Skillify. The track I chose was the Fullstack track. I want to show I can connect the frontend and backend and build both up even for a small project. I also wanted to work on my skills through this project a little bit, so I took more time than the expected as I liked the concept. I made the backend with Node/Express API with JSON for storage. I built the frontend with HTML/CSS/JS that connects to backend with fetch.
<img width="2830" height="1412" alt="image" src="https://github.com/user-attachments/assets/31342e8b-e9cb-49eb-9146-aef6174c78f3" />

## Tech Setup
I picked JS over React as I am more comfortable with regular JS even though I have worked with both. This helped me work on the API design over figuring out React framework. I picked a JSON file over a database to keep it simple as someone just needs Node to run this project.

## How to Run
### 1.) install Node.js in a terminal by running:

node --version

### 2.) clone the repository :

git clone https://github.com/dylan2007trader/CRM-Pipeline-Tracker.git

cd CRM-Pipeline-Tracker

### 3.) install express

npm install express

### 4.) start the server

node server.js

You should see "Server running at http://localhost:3000"

Leave the terminal open while using the app, and press ctrl c on computer to stop server

### 5.) in a browser, type http://localhost:3000/ and press enter


The app comes loaded with customers in data.json, you can start with empty list by replacing the contents in the file with [].

## Test API Directly
You can also test the API directly without the UI. I tested this using curl in powershell.

### List all customers
curl http://localhost:3000/api/customers

### Filter by stage
curl http://localhost:3000/api/customers?stage=Lead

### Create a customer
curl -Method POST -Uri http://localhost:3000/api/customers -ContentType "application/json" -Body '{"name":"Test User","email":"test@test.com","company":"TestCo","stage":"Lead"}'

### Move a customer to a new stage (replace ID)
curl -Method POST -Uri http://localhost:3000/api/customers/PASTE_ID/stage -ContentType "application/json" -Body '{"stage":"Contacted"}'

## Features
-add customers wit name, email, company, and starting stage

-display all customers on kanban board by stage

-move customers to next stage

-delete customers with a confirmation prompt

-search a customer by name or company

-filter by stage

-stage history tracking of each customer can be viewed in the data.json

## Future Improvements

- edit customer info from the frontend view an edit button on each customer car. I implemented this in the backend with the PUT endpoint but I didn't connect it to the UI

- authenticatation in order for customer info to be secure. I would add a login for each user to have their own pipeline

- deployment into Railway and Vercel so it can be accessed without local setup

- tests for the API instead of having to manually test with curl

- add back button for each customer card so they can move back in the progress or a drag for the user to drag the customer into any stage

- add a real database like PostgreSQL so it handles large amounts of data

- let the user see the history timeline for each customer, it shows up in data.json but not in the frontend now

- better UI, I would like the look of the site look more appealing and crispy, I am very much a beginner in CSS styling at the moment
