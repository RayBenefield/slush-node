import describe from 'rxt';
import 'should';

describe('Dot Files', it => {
    it('should pass tests', ex => ex
        .given('')
        .when(() => true)
        .then(result => result.should.be.ok())
    );
});
