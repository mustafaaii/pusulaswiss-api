const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

const FileUpload = (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '..', '../upload');
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error(err)
            return res.status(500).send('Dosya yüklenirken hata oluştu');
        }
        const file = files.file ? files.file[0] : null;
        if (!file) {
            return res.status(400).json({ error: 'Dosya bulunamadı' });
        }
        let fileExt = path.extname(file.originalFilename || "");
        if (!fileExt) {
            const mimeMap = {
                'audio/mpeg': '.mp3',
                'audio/wav': '.wav',
                'video/mp4': '.mp4',
                'audio/webm;codecs=opus': '.webm'
            };
            fileExt = mimeMap[file.mimetype] || '';
        }
        const fileName = file.newFilename + fileExt;
        const uploadDir = path.join(__dirname, '../../upload', fields.path ? fields.path[0] : "default");
        const newPath = path.join(uploadDir, fileName);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        fs.renameSync(file.filepath, newPath);
        res.status(200).json({ file: fileName });
    });
};
module.exports = { FileUpload };
