const express = require('express')
const nodemailer = require('nodemailer');
const {PDFDocument} = require('pdf-lib');
const {readFile, writeFile} = require('fs/promises');
const { Pool } = require('pg');

const app = express()

const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Students',
    password: '2023',
    port: 5432,
  });
pool.connect()
.then(() => {
    console.log("Connection to the server has established !");
})
.catch((error) => {
    console.log(error);
})

const transpoter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kartikkharche9214@gmail.com',
        pass: 'ShriShriRadhaMadanGopal2011'
    },
    secure: true
})

app.get('/student/result', async(req, res) => {
    const { mobile_number } = req.query;

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM mock_data WHERE mobile_number = $1', [mobile_number]);
        client.release();
        
        res.json(result.rows);

    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
})
app.get('/studentHighestMarksIn', async (req, res) => {
    const { city } = req.query;
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM mock_data WHERE city = $1 ORDER BY percentage DESC LIMIT 1', [city]);
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


app.listen(4000, () => {
    console.log("Server is listening at port 4000");
})

