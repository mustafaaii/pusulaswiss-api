const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const http = require('http');
const WebSocket = require('ws');


const app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

//WS Sockect

const server = http.createServer(app);
const Stats = require('./api/server/server.stats')
Stats(server);
server.listen(5000, () => {
    console.log('Sunucu 5000 portunda çalışıyor');
});


const USERNAME = 'admin';
const PASSWORD = 'password123';

function authenticate(req, res, next) {
    const { username, password } = req.body;
    if (username === USERNAME && password === PASSWORD) {
        next();
    } else {
        res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }
}

//GLOBAL
const controlGLOBAL = require('./api/control.global');
app.post('/control-global', authenticate, controlGLOBAL.Control);
const deleteGLOBAL = require('./api/delete');
app.post('/delete', authenticate, deleteGLOBAL.Delete);
const selectGLOBAL = require('./api/select');
app.post('/select', authenticate, selectGLOBAL.Select);

//Post
const postCOUNT = require('./api/post/count.post');
app.post('/count-post', authenticate, postCOUNT.Count);
const postTABLE = require('./api/post/table.post');
app.post('/post-table', authenticate, postTABLE.Table);
const postDETAIL = require('./api/post/detail.post');
app.post('/detail-post', authenticate, postDETAIL.Detail);
const postINSERT = require('./api/post/insert.post');
app.post('/insert-post', authenticate, postINSERT.Insert);
const postUPDATE = require('./api/post/update.post');
app.post('/update-post', authenticate, postUPDATE.Update);
const postDELETE = require('./api/post/delete.post');
app.post('/delete-post', authenticate, postDELETE.Delete);
const featuredINSERT = require('./api/post/insert.post.featured');
app.post('/insert-featured', authenticate, featuredINSERT.Insert);
const featuredUPDATE = require('./api/post/update.post.featured');
app.post('/update-featured', authenticate, featuredUPDATE.Update);
const psotNAVIGATION = require('./api/post/navigation.post');
app.post('/navigation-post', authenticate, psotNAVIGATION.Navigation);
const psotSEARCH = require('./api/post/search.post');
app.post('/search-post', authenticate, psotSEARCH.Search);
const postBREAKING = require('./api/post/breaking.post');
app.post('/breaking-post', authenticate, postBREAKING.Breaking);
const postDATE = require('./api/post/date.post');
app.post('/date-post', authenticate, postDATE.Dates);


//Podcast
const podcastINSERT = require('./api/post/insert.post.podcast');
app.post('/insert-podcast', authenticate, podcastINSERT.Insert);

//Galery
const galeryINSERT = require('./api/post/insert.post.galery');
app.post('/insert-galery', authenticate, galeryINSERT.Insert);
const galeryUPDATE = require('./api/post/update.post.galery');
app.post('/update-galery', authenticate, galeryUPDATE.Update);

//Video
const videoINSERT = require('./api/post/insert.post.video');
app.post('/insert-video', authenticate, videoINSERT.Insert);
const videoUPDATE = require('./api/post/update.post.video');
app.post('/update-video', authenticate, videoUPDATE.Update);

//Event
const eventINSERT = require('./api/post/insert.post.event');
app.post('/insert-event', authenticate, eventINSERT.Insert);

//Plan
const planINSERT = require('./api/post/insert.post.plan');
app.post('/insert-plan', authenticate, planINSERT.Insert);
const planUPDATE = require('./api/post/update.post.plan');
app.post('/update-plan', authenticate, planUPDATE.Update);

//Writer
const writerDETAIL = require('./api/writer/detail.writer');
app.post('/writer-detail', authenticate, writerDETAIL.Detail);
const writerDELETE = require('./api/writer/delete.writer');
app.post('/writer-delete', authenticate, writerDELETE.Delete);
const writerLIST = require('./api/writer/list');
app.post('/writer-list', authenticate, writerLIST.List);
const writerLAST = require('./api/writer/last.writer');
app.post('/writer-last', authenticate, writerLAST.Last);
const writerTABLE = require('./api/writer/table.writer');
app.post('/writer-table', authenticate, writerTABLE.Table);
const writerINSERT = require('./api/writer/insert.writer');
app.post('/writer-insert', authenticate, writerINSERT.Insert);
const writerUPDATE = require('./api/writer/update-writer');
app.post('/writer-update', authenticate, writerUPDATE.Update);
const writerPOST = require('./api/writer/writer.post');
app.post('/writer-post', authenticate, writerPOST.Post);

//Category
const categoryDETAIL = require('./api/category/detail.category');
app.post('/category-detail', authenticate, categoryDETAIL.Detail);
const categoryLIST = require('./api/category/list');
app.post('/category-list', authenticate, categoryLIST.List);
const categoryTABLE = require('./api/category/table.category');
app.post('/category-table', authenticate, categoryTABLE.Table);
const categoryPOST = require('./api/category/post.category');
app.post('/category-post', authenticate, categoryPOST.Post);
const categoryBY = require('./api/category/by.category');
app.post('/category-by', authenticate, categoryBY.By);

//Banner
const bannerINSERT = require('./api/advert/insert.banner');
app.post('/banner-insert', authenticate, bannerINSERT.Insert);
const bannerTABLE = require('./api/advert/table.banner');
app.post('/banner-table', authenticate, bannerTABLE.Table);
const bannerDELETE = require('./api/advert/delete-banner');
app.post('/banner-delete', authenticate, bannerDELETE.Delete);
const bannerUPDATE = require('./api/advert/update-banner');
app.post('/banner-update', authenticate, bannerUPDATE.Update);

//crypto
const bcrypt = require('./api/auth/bcrypt');
app.post('/auth-bcrypt', authenticate, bcrypt);
const crypto = require('./api/auth/crypto');
app.post('/auth-crypto', authenticate, crypto);


//Auth

const authCONTROL = require('./api/auth/control');
app.post('/auth-control', authenticate, authCONTROL.Control);
const authSIGIN = require('./api/auth/signin');
app.post('/auth-signin', authenticate, authSIGIN.Signin);
const authSIGUP = require('./api/auth/signup');
app.post('/auth-signup', authenticate, authSIGUP.Signup);
const authUPDATE = require('./api/auth/update');
app.post('/auth-update', authenticate, authUPDATE.Update);
const authTOKEN = require('./api/auth/token');
app.post('/auth-token', authenticate, authTOKEN.Token);


//Weather
const weatherApi = require('./api/api/weather/index');
app.post('/weather-api', authenticate, weatherApi.Weather);
const { Cron } = require('./api/api/weather/cron');
cron.schedule('27 21 * * *', async () => {
    console.log('Günlük hava durumu verisi güncelleniyor...');
    try {
        await Cron();
        console.log('Hava durumu verisi başarıyla güncellendi.');
    } catch (error) {
        console.error('Hava durumu verisi güncellenirken hata oluştu:', error);
    }
});

//Currency
const currencyApi = require('./api/api/currency/index');
app.post('/currency-api', authenticate, currencyApi.Currency);
const { CurrencyCron } = require('./api/api/currency/cron');
cron.schedule('27 21 * * *', async () => {
    console.log('Döviz durumu verisi güncelleniyor...');
    try {
        await CurrencyCron();
        console.log('Döviz durumu verisi başarıyla güncellendi.');
    } catch (error) {
        console.error('Döviz verisi güncellenirken hata oluştu:', error);
    }
});

//Cpanel
const cpanelSelect = require('./api/api/cpanel/select');
app.post('/cpanel-select', authenticate, cpanelSelect.Select);
const emailINSERT = require('./api/api/cpanel/insert.email');
app.post('/email-insert', authenticate, emailINSERT.Insert);
const emailDELETE = require('./api/api/cpanel/delete.email');
app.post('/email-delete', authenticate, emailDELETE.Delete);

//File
const fileUPLAOD = require('./api/file/upload');
app.post('/upload', fileUPLAOD.FileUpload);
app.use('/upload', express.static(path.resolve(__dirname, 'upload')));
const fileMANAGER = require('./api/file/manager');
app.post('/file-manager', fileMANAGER.Manager);
const fileDELETE = require('./api/file/delete.file');
app.post('/file-delete', fileDELETE.Delete);


//Mysql
const mysqlSTATS = require('./api/server/mysql.stats');
app.post('/mysql-stats', mysqlSTATS.Stats);


app.get('/download/:folder/:filename', (req, res) => {
    const folder = req.params.folder;
    const filename = req.params.filename;
    const filePath = path.resolve(__dirname, 'upload', folder, filename);

    res.download(filePath, filename, (err) => {
        if (err) {
            console.error("İndirme hatası:", err);
            res.status(404).send("Dosya bulunamadı");
        }
    });
});

//Compline
app.listen(4000, () => { console.log('Sunucu 4000 portunda çalışıyor'); });
