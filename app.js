const express = require('express');
const mysql = require('mysql2');
const app = express();
const path = require('path');
const ejs = require('ejs');
const axios = require('axios');
const jquery = require('jquery')
const morgan = require('morgan')

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
process.on('uncaughtException', function (err) {console.log(err);
});
app.use(morgan('dev'));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '123456',
    database: 'hunnithensmysql'    
});

db.connect((err) => {
    if (err) {console.log(err)}
    console.log('MySql Connected...')
});

app.post('/newscore', async (req, res) => {
    const name = req.body.name;
    const score = req.body.score;
    console.log(name, score)
    let sql = `INSERT INTO scoreboard (name, score) VALUES ('${name}', '${score}')`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result)
        console.log('record inserted');
        res.redirect('/')
    });
});

app.get('/', async (req, res) => {
    res.render('menu');
})

app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE hunnithensmysql';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Database created...');
    })
})

app.get('/createtable', (req, res) => {
    let sql = 'CREATE TABLE scoreboard(id int AUTO_INCREMENT, username VARCHAR(255), score VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Posts table created...');
    });
})

app.get('/game', async (req, res) => {
    let sql = "SELECT * FROM scoreboard ORDER BY score DESC";
    let query = db.query(sql, (err, results) => {
        if (err) {
            console.log(err); 
            res.render('game', { players: '' })
        } else {
            results.sort((a,b) => (parseInt(a.score) > parseInt(b.score) ? 1 : (parseInt(b.score)  > parseInt(a.score)) ? -1 : 0))
            results.reverse()
            console.log('Scoreboard received...')
            res.render('game', { players: results })
            console.log(results)
        }
    })
})

app.listen('8080', () => {
    console.log('Server started on port 8080')
})