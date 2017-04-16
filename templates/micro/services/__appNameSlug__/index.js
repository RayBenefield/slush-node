import path from 'path';
import restify from 'restify';
import { Observable } from 'rxjs';
import { RxHttpRequest } from 'rx-http-request';
import validation from '@rai/validation';

const server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(validation(path.resolve(__dirname, 'readme.md')));

server.__lowerVerb__('/', (req, res) => {
    Observable.from([req.params])
        .subscribe((output) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(200, output);
        });
});

server.name = '__appNameSlug__';
server.listen(__serverPort__, () => {
    // eslint-disable-next-line no-console
    console.log(`${server.name} listening at ${server.url}`);
});
