# Color Palette APP

A full stack application developped during summer 2020 utilizing  Rest API/CRUD and the MERN concept.

It is deployed on [colorpalettemern.herokuapp.com](https://colorpalettemern.herokuapp.com)

Allows to generate random colors which can be changed and ajusted as wished. User can save their chosen colors in a palette for further use and view all users palette. 

## Installation

On the root (backend part)

```bash
npm init
npm install mongoose express nodemon cors dotenv jsonwebtoken
create .env file (add mondoDb account, jwt)
nodemon server.js
```
/frontend

```bash
npm init 
npm install chroma-js clipboard-polyfill moment
npm start 
```
