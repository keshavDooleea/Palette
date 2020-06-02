# Color Palette APP

A full stack application developped during summer 2020 utilizing the MERN concept and CRUD. 

It is deployed on [colorpalettemern.herokuapp.com](https://colorpalettemern.herokuapp.com)

Allows to generate random colors which can be changed and ajusted as wished. User can save their chosen colors in a palette for further use.

## Installation

/root (backend part)

Add your MongoDB account credentiels in .env file

```bash
npm install mongoose express nodemon cors dotenv jsonwebtoken
create .env file (add mondodb, jwt)
nodemon server.js
```
/frontend

```bash
npm init 
npm install chroma-js clipboard-polyfill moment
npm start 
```
