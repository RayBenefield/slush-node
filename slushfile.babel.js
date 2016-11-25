import _ from 'underscore';
import gulp from 'gulp';
import _string from 'underscore.string';
import inquirer from 'inquirer';
import path from 'path';
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

gulp.task('default', (done) => {
    const prompts = [{
        name: 'appName',
        message: 'What is the name of your project?',
        default: defaults.appName,
    }, {
        name: 'appDescription',
        message: 'What is the description?',
    }, {
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?',
    }];

    // Ask
    inquirer.prompt(prompts,
        (answers) => {
            _.templateSettings = {
                interpolate: /__(.+?)__/g,
            };
            if (!answers.moveon) {
                done();
                return;
            }
            answers = _.defaults(answers, defaults);
            answers.appNameSlug = _string.slugify(answers.appName);
            gulp.src(path.join(__dirname, '/templates/**'))
                .pipe($.template(answers))
                .pipe($.rename((file) => {
                    file.basename = _.template(file.basename)(answers);
                    if (file.basename[0] === '_') {
                        file.basename = `.${file.basename.slice(1)}`;
                    }
                }))
                .pipe($.conflict('./'))
                .pipe(gulp.dest('./'))
                .on('end', () => {
                    childProcess.spawnSync('yarn', [], {
                        stdio: 'inherit', // <== IMPORTANT: use this option to inherit the parent's environment
                    });
                    done();
                });
        });
});
