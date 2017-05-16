# Archie the Architect

## Planned v1 features

1. [x] Feature: Archie the installer (`archie install {src} {dest}`):
    - [x] Install / compile templated files to your project, applying archie data on compilation.
    - [x] `{src}` is required and should throw an error if not passed. If provided, it can be a file, directory, or glob of files. If it is a directory, it should glob all files inside that directory.
    - [x] `{dest}` is optional and defaults to `process.cwd()`.
    - [x] `{data}` is optional and defaults to `process.cwd()/archie.config.js`. If provided, it can either be a string path to a `.js` or `.json` data file or an actual object.
    - [x] Provide a way to compile vanilla JS to a JSON file (like package.json).
    - [x] Run archie install from cli.
    - [x] Option to merge json to file if file doesn't exist. This is so files like package.json don't get overwritten completely.
2. [x] Feature: Archie the task master (`archie {cmd}`):
    - [x] When `{cmd}` in `archie {cmd}` is anything but another predefined archie command, pass the command and all arguments to `npm run {task}`.
3. [ ] Feature: Add [test coverage](https://docs.codeclimate.com/docs/setting-up-test-coverage) and [other badges](https://github.com/dwyl/repo-badges) to readme ([coveralls.io](https://coveralls.io) or [codeclimate.com](https://codeclimate.com) or [nyc](https://libraries.io/npm/nyc)).
