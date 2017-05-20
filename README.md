# Archie the Architect

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/5323e8ecc9e94a3abe87f86279365ddb)](https://www.codacy.com/app/thezimmee/archie?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=thezimmee/archie&amp;utm_campaign=Badge_Grade)
[![CodeFactor](https://www.codefactor.io/repository/github/thezimmee/archie/badge)](https://www.codefactor.io/repository/github/thezimmee/archie)
[![codecov](https://codecov.io/gh/thezimmee/archie/branch/v1/graph/badge.svg)](https://codecov.io/gh/thezimmee/archie)
[![Coverage Status](https://coveralls.io/repos/github/thezimmee/archie/badge.svg?branch=v1)](https://coveralls.io/github/thezimmee/archie?branch=v1)

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
3. [x] Feature: Add [test coverage](https://docs.codeclimate.com/docs/setting-up-test-coverage) and [other badges](https://github.com/dwyl/repo-badges) to readme ([coveralls.io](https://coveralls.io) or [codeclimate.com](https://codeclimate.com) or [nyc](https://libraries.io/npm/nyc)).
4. [x] Feature: Add following config options to archie.data._installer:
    - [x] `src`: Source files to install (makes `<src>` optional)
    - [x] `dest`: Destination directory.
    - [x] `ignore`: Files to not install / compile (useful for partial file includes).
    - [x] `merge`: JSON files to merge, not overwrite (useful for dynamic .json files, such as package.json).
    - [x] `profile`: Sets configuration property; e.g., --profile=archie will set archie.data._archie as configuration object.
5. [ ] Automate project creation:
    - [ ] Automatigically create README.md
    - [ ] Automatigically create CONTRIBUTING.md (pull in latest contributors: commiters, reviewers, issue creators, issue commenters, PR creators)
    - [ ] Automatigically create LICENSE.md
    - [ ] Automatigically create BACKERS.md (pull in latest sponsors)
    - [ ] Automatigically create HISTORY.md / CHANGELOG.md
    - [ ] Automatigically inject badges
    - [ ] Automatigically inject installation instructions
