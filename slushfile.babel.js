import gulp from 'gulp';
import path from 'path';
import _ from 'underscore';
import inquirer from 'inquirer';
import _string from 'underscore.string';
import childProcess from 'child_process';
import loadPlugins from 'gulp-load-plugins';

const $ = loadPlugins();

const defaults = (function defaults() {
    const workingDirName = path.basename(process.cwd());

    return {
        appName: workingDirName,
        userName: 'RayBenefield',
        authorName: 'Raymond Benefield',
        authorEmail: 'raymond.benefield@wellsfargo.com',
        appVersion: '0.0.1',
        license: 'MIT',
    };
}());

const loadTemplates = folder => (done) => {
    const prompts = [{
        name: 'appName',
        message: 'What is the name of your project?',
        default: defaults.appName,
    }, {
        name: 'appDescription',
        message: 'What is the description?',
    }];

    // If we are building a microservice then add API Blueprint stuff
    if (folder === 'micro') {
        prompts.push({
            name: 'port',
            message: 'What port will this service be on?',
            default: 8000,
        });
        prompts.push({
            name: 'serviceDescription',
            message: 'What is the summary description for the service?',
        });
        prompts.push({
            name: 'task',
            message: 'What is the task this service will do?',
        });
        prompts.push({
            name: 'taskDescription',
            type: 'editor',
            message: 'Enter the detailed description for the task.',
        });
        prompts.push({
            name: 'verb',
            type: 'list',
            message: 'What HTTP verb will be used to access this task?',
            choices: ['GET', 'POST'],
        });
        prompts.push({
            name: 'dataStructures',
            type: 'editor',
            message: 'Create the data structures for this service.',
        });
        prompts.push({
            name: 'requestStructure',
            message: 'Which data structure is used for the request?',
            default: 'object',
        });
        prompts.push({
            name: 'responseStructure',
            message: 'Which data structure is used for the request?',
            default: 'object',
        });
    }

    // Add confirm last
    prompts.push({
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?',
    });

    // Ask
    inquirer.prompt(prompts)
        .then((answers) => {
            _.templateSettings = {
                interpolate: /__(.+?)__/g,
            };
            if (!answers.moveon) {
                done();
                return;
            }
            answers = _.defaults(answers, defaults);
            answers.appNameSlug = _string.slugify(answers.appName);

            $.git.init();

            const stream = gulp.src(path.join(__dirname, `/templates/${folder}/**`))
                .pipe($.template(answers, {
                    interpolate: /__(.+?)__/g,
                }))
                .pipe($.rename((file) => {
                    file.basename = _.template(file.basename)(answers);
                    file.dirname = _.template(file.dirname)(answers);
                    if (file.basename[0] === '_') {
                        file.basename = `.${file.basename.slice(1)}`;
                    }
                }))
                .pipe($.conflict('./'))
                .pipe(gulp.dest('./'));

            stream.on('end', () => {
                childProcess.spawnSync('yarn', [], { stdio: 'inherit' });

                $.git.exec({ args: 'add .' }, () => {
                    $.git.exec({ args: 'commit -m "v0.0.1"' }, () => {
                        $.git.tag('v0.0.1', 'Initial setup.');
                        $.shell('yarn config set version-git-message "v%s"');
                        done();
                    });
                });
            });
        });
}

gulp.task('default', loadTemplates('default'));
gulp.task('mono', loadTemplates('mono'));
gulp.task('micro', loadTemplates('micro'));
