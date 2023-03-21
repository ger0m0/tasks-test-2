import express from 'express';
import * as session from 'express-session';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import multer from 'multer';
import mysql2 from 'mysql2/promise';
import MySQLStore from 'express-mysql-session';
import RedisStore from "connect-redis"
import {createClient} from "redis"
import { emailValidate } from './modules/form-validate.mjs';

const errorCodes = JSON.parse(fs.readFileSync('error-codes.json', 'utf-8'))
const port = process.env.PORT || 4000;
const app = express()

const buildPath = 'react-app/build'
const upload = multer({ dest: `${buildPath}/uploads/` })

const MYSQL_DATABASE = process.env.MYSQL_DATABASE ? process.env.MYSQL_DATABASE : 'tasks'
const MySQLOptions: any = {
    host: (process.env.MYSQL_HOST) ? process.env.MYSQL_HOST : '45.9.42.100',
    user: process.env.MYSQL_USER ? process.env.MYSQL_USER : 'root',
    password: process.env.MYSQL_PASSWORD ? process.env.MYSQL_PASSWORD : 'reqreq',
    port: process.env.MYSQL_PORT ? process.env.MYSQL_PORT : 3307,
    database: MYSQL_DATABASE,
    connectionLimit: 10,
}
  
const connection =  mysql2.createPool(MySQLOptions) 
const [table]: any[] = await connection.query(`SHOW TABLES LIKE 'tasks'`) 
if (table.length === 0) {
    await connection.query(`CREATE TABLE tasks (
        id int NOT NULL AUTO_INCREMENT,
        name varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
        email varchar(255) COLLATE utf8mb3_bin DEFAULT NULL,
        text text COLLATE utf8mb3_bin,
        status int DEFAULT '0',
        editor int DEFAULT NULL,
        UNIQUE KEY id_UNIQUE (id)
      ) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin`)
}

let redisClient = createClient({ 
    url: 'redis://45.9.42.100:6379', 
})
redisClient.connect().catch(console.error) 

let redisStore = new RedisStore({ 
  client: redisClient,
  prefix: "myapp:", 
})

// const Store = MySQLStore(session); 
// const sessionStore = new Store(MySQLOptions);


app.use(session.default({
    name: 'session_id',
    secret: 'супер мега секретный код',
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 15
    }
}));

app.use('/api', cors({
    origin: true,
    credentials: true
}))

app.use(express.static(buildPath));

app.get('/', async (req, res) => {
    res.status(200).sendFile(path.join(buildPath, 'index.html'));
});

app.get('/error-codes.json', cors(), async (req, res) => {
    res.send(errorCodes);
});

app.get('/api/:action', async (req: any, res: any) => {
    let data: any = {}

    const limit = (parseInt(req.query.count)) ? parseInt(req.query.count) : 30
    const offset = parseInt(req.query.offset) ? parseInt(req.query.offset) : 0

    let sort = { name: 'id', order: 'desc' }
    if (req.query.sort) {
        try {
            const sortParse = JSON.parse(req.query.sort)
            if (sortParse.name && sortParse.order) {
                sort = sortParse
            }
        } catch {
            data.error = errorCodes['2']
        }
    }

    const query: { [name: string]: any } = {}
    for (const name in req.query) {
        if (typeof req.query[name] === 'string') {
            query[name] = req.query[name]
        }
    }

    if (!data.error) {
        switch (req.params.action) {
            case 'task.getList':
                try {
                    data.data = (await connection.query(`SELECT id, name, email, text, status, editor FROM tasks order by ${sort.name} ${sort.order} limit ${limit} offset ${offset}`))[0];
                    const [rows]: any = await connection.query('SELECT COUNT(id) FROM tasks')
                    data.countMax = rows[0]['COUNT(id)']
                } catch (error) {
                    console.error(error);
                    data.error = errorCodes['1']
                }
                break;
            case 'task.getForm':
                try {
                    const [rows]: any = await connection.query(`SELECT text, status FROM tasks where id = ${query.id}`);
                    if (rows[0]) {
                        data.data = {
                            id: query.id,
                            text: rows[0].text,
                            status: (rows[0].status === 1) ? true : false
                        }
                    } else {
                        data.data = {}
                    }
                } catch (error) {
                    console.error(error);
                    data.error = errorCodes['1']
                }
                break;
            default:
                data = { error: `No command <${req.params.action}>` }
                break;
        }
    }
    res.send(JSON.stringify(data))
})

app.post('/api/:action', upload.any(), async (req: any, res: any) => {
    let data: any = {}

    const body: { [name: string]: any } = {}
    for (const name in req.body) {
        if (name === 'email') {
            if (!emailValidate(req.body[name])) {
                data.error = errorCodes['3']
                break
            }
        }

        if (name === 'id') {
            body[name] = parseInt(req.body[name])
        } else if (typeof req.body[name] === 'string') {
            body[name] = req.body[name]
        }
    }

    switch (req.params.action) {
        case 'auth.login':
            if (req.session.user) {
                data.data = req.session.user
            } else if (body.login === 'admin' && body.password === '123') {
                const user = {
                    id: 1,
                    access: 1
                }

                req.session.user = user
                data.data = user

                req.session.regenerate((err: any) => {
                    if (err) {
                        console.error(err)
                    } else {
                        req.session.save((err: any) => {
                            if (err) console.error(err);
                        })
                    }
                })
            } else if (body.login === '' || body.password === '') {
                data.error = errorCodes['4']
            } else {
                data.error = errorCodes['5']
            }
            break;
        case 'auth.logout':
            req.session.user = null
            req.session.save((err: any) => {
                if (err) {
                    console.error(err)
                } else {
                    req.session.regenerate((err: any) => {
                        if (err) console.error(err)
                    })
                }
            })
            data.data = ''
            break;
        case 'task.edit': 
            if (req.session.user?.access === 1) {
                if (body.id) {
                    try {
                        data.data = await connection.query(`UPDATE tasks SET text = '${body.text}', status = '${body.status ? 1 : 0}', editor = 1 WHERE (id = '${body.id}')`)
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    data.error = errorCodes['6']
                }
            } else {
                data.error = errorCodes['7']
            }
            break;
        case 'task.add':
            try {
                data.data = await connection.query(`INSERT INTO \`tasks\`.\`tasks\` (\`name\`, \`email\`, \`text\`) 
                VALUES ('${body.name}', '${body.email}', '${body.text}')`);
            } catch (error) {
                console.error(error);
            }
            break;
        default:
            data = { error: `No command <${req.params.action}>` }
            break;
    }
    res.status(200).send(JSON.stringify(data))
})

app.listen(port, () => {
    console.log(`Прослушивание порта http://localhost:${port}`)
})