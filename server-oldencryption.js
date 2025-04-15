var express = require('express');
var crypto = require('crypto-js');
var fs = require('fs');
const path = require('path');
var jsencrypt = require('nodejs-jsencrypt');
// import { AES, enc } from 'crypto-js';
// import { JSEncrypt } from 'jsencrypt';
var app = express();
DataPrivateKey = 'Lq9uk9WTC8f3709phzh36hMuTU4tx18A';

function AesEncrypt(text, privatekey) {
    var key = crypto.enc.Utf8.parse(privatekey);
    var iv = crypto.enc.Utf8.parse('8080808080808080');

    var encrypted = crypto.AES.encrypt(text, key, {
        iv: iv,
    });
    return crypto.enc.Base64.stringify(encrypted.ciphertext);
}
function AesEncryptUTF8(text, privatekey) {
    var key = crypto.enc.Utf8.parse(privatekey);
    var iv = crypto.enc.Utf8.parse('8080808080808080');

    var encrypted = crypto.AES.encrypt(crypto.enc.Utf8.parse(text), key, {
        iv: iv,
    });
    return crypto.enc.Base64.stringify(encrypted.ciphertext);
}

function AesDecrypt(text, privatekey) {
    var key = crypto.enc.Utf8.parse(privatekey);
    var iv = crypto.enc.Utf8.parse('8080808080808080');

    var decrypted = crypto.AES.decrypt(text, key, {
        iv: iv,
    });
    console.log(decrypted);
    return decrypted.toString(crypto.enc.Utf8);
}
function AesDecryptUTF8(text, privatekey) {
    var key = crypto.enc.Utf8.parse(privatekey);
    var iv = crypto.enc.Utf8.parse('8080808080808080');

    var decrypted = crypto.AES.decrypt(text, key, {
        iv: iv,
    });
    console.log(decrypted);
    return decrypted.toString(crypto.enc.Utf8);
}
function basicEncryption(PlainText) {
    var crypt = new jsencrypt.JSEncrypt();

    crypt.setPublicKey(
        '-----BEGIN KEY-----' +
        '\n' +
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDPO524rEZVxUZdRJf5dAvkfblf' +
        '\n' +
        'uvw4k8h+wLCZW89hQdUbJf3hbgc4tN7SdOiQfnZgmfFh6On8IUOYoqkZ+10KpQtY' +
        '\n' +
        'K8Sqr5BkG0GiAAsfI4l6aeutX3XBSBnT6wofGn7lTvmEbZq2uXBIN6B8zkeFvhvN' +
        '\n' +
        'xB059Cczm8kbob08HQIDAQAB' +
        '\n' +
        '-----END KEY-----' +
        '\n');

    return crypt.encrypt(PlainText);
}
function basicDecryption(EncryptedText) {
    var decrypt = new jsencrypt.JSEncrypt();

    decrypt.setPrivateKey(DataPrivateKey);

    return decrypt.decrypt(EncryptedText);
}

function generatePrivateKey() {
    var privateKey;

    privateKey = Math.round(new Date().valueOf() / 1000).toString();
    privateKey = String('0000000000000000' + privateKey).slice(-16);

    return privateKey;
}
function guid() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });

    return uuid;
}
app.use(express.urlencoded({ extended: true ,limit: '50mb'}))
app.use(express.json({limit: '50mb'}))
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});
app.get('/decrypt', function (req, res) {
    res.sendFile(path.join(__dirname, '/decrypt.html'));
});
app.get('/encrypt', function (req, res) {
    // var privateKey = generatePrivateKey();
    fs.readFile("data/request.json", "utf8", function (err, data) {
        if (err)
            throw err;
        console.log(data);
        // console.log(crypto.enc.Base64.stringify(data))
        var out = AesEncrypt(data, DataPrivateKey);
		res.send(out);

        // var input = AesDecrypt(data, DataPrivateKey);
        // res.send(input);
    });
});
app.post('/encrypt-online', function (req, res) {
    console.log(req.body.data);
    var input = AesDecrypt(req.body.data, DataPrivateKey);
    res.send(input);
});
app.post('/decrypt-online', function (req, res) {
    console.log(req.body.data);
    var input = AesEncrypt(req.body.data, DataPrivateKey);
    res.send(input);
});

app.get('/basic', function (req, res) {
    // var privateKey = generatePrivateKey();
    fs.readFile("data/request.json", "utf8", function (err, data) {
        if (err)
            throw err;
        console.log(data);
        // console.log(Base64decode(data))

        var input = basicEncryption('kykuUh%010');
        res.send(input);
    });
    // res.send("Hello world! "+out+' '+input);
});

app.listen(5000, function () {
    console.log("server started on 5000")
});