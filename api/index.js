import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import bodyParser from 'body-parser';

const app = express()

app.use(cors())
app.use(fileUpload())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/uploadVideo',(req,res) => {
    let EDFile = req.files.file
    EDFile.mv(`./static/share/video/${EDFile.name}`,err => {
        if(err) return res.status(500).send({ message : err })

        return res.status(200).send({ message : 'File uploaded success', filename: EDFile.name })
    })
})

app.post('/login', (req,res) => {
    return (req.body.email === 'video' && req.body.password === '123456') ? res.json(req.body) : res.status(500).send({ message : 'auth error' })
})

app.post('/logout', (req,res) => {
    res.send({ "resp": "Bye bye" });
})

app.get('/error', (req, res) => {
    res.status(500).send({ message : 'error' })
})

app.get('/user', (req,res) => {
    res.send({ "id": 1, "name": "Video MOS", "email": "video@mos.com" });
})

module.exports = {
   path: '/api',
   handler: app
}