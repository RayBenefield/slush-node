import restify from 'restify';
import { Observable } from 'rxjs';
import { RxHttpRequest } from 'rx-http-request';
import validation from './validation';

const server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(validation);

server.__lowerVerb__('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(200, {});
});

server.name = '__appNameSlug__';
server.listen(__port__, () => {
    // eslint-disable-next-line no-console
    console.log(`${server.name} listening at ${server.url}`);
});
