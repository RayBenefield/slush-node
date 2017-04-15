import restify from 'restify';

const server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/', (req, res) => {
    res.send(200);
});

server.name = '__appNameSlug__';
server.listen(8000, () => {
    // eslint-disable-next-line no-console
    console.log(`${server.name} listening at ${server.url}`);
});
