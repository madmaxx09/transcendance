# transcendance
For the sake of fullstack

To test this project 
 - git clone this repo
 - cd into it
 - have docker launched
 - docker-compose up --build
 - https://localhost:8000 in your nav bar to access the website (it uses a selfsigned certificate, so a warning will be triggered)


(for testing purposes I left the .env file, but removed arguments related to the 42 API for obvious reasons, so the "login with 42" button won't work)

The goal of this project was to create a simple website to play the original pong game. 
To validate the project we needed a certain amount of features. 
We used bootstrap for the frontend
Django with PostgreSql for the backend
The website has a simple login system
With friends request and online status
You can play alone vs the computer or duo on the same keyboard
There is a tournament system
And there is quite complete statistics/match history system
