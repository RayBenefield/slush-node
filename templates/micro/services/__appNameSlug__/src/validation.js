import fs from 'fs';
import path from 'path';
import Bluth from 'bluth';

const spec = fs.readFileSync(path.resolve(__dirname, '../readme.md'), 'utf-8');
const bluth = new Bluth(spec);

export default (req, res, next) => {
    bluth
        .validate(req.body, {
            type: 'request',
            route: '/',
            method: '__verb__',
        })
        .then(() => next(req, res))
        .catch(() => res.send(200, {}));
};
