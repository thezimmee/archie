# Archie the Architect

## Planned v1 features

1. [ ] Feature: Archie the installer (`archie install {src} {dest}`):
    - [ ] Scenario 1: Archie install:
        - [ ] Given:
            - [ ] EJS template files...
            - [ ] And an `archie.data.js` (or data file set by `--data`) file...
        - [ ] When:
            - [ ] User runs `archie install {src} {dest}`
        - [ ] Then:
            - [ ] All file templates from `{src}` should be populated with data from `archie.data.js`.
            - [ ] And compiled files should be put in `{dest}` (or `process.cwd()` if no `{dest` is specified).
    - [ ] Scenario 2: Existing `.json` files:
        - [ ] Given:
            - [ ] Same givens as scenario 1...
        - [ ] When:
            - [ ] User runs `archie install {src} {dest}`...
            - [ ] And the `{src}` being compiled has `.json` extension...
            - [ ] And the same relative path already exist in `{dest}`...
        - [ ] Then:
            - [ ] Archie should read the `{dest}` json file and only update the properties from `{src}` json file.
    - [ ] Conditions for all scenarios:
        - [ ] `{src}` is required and should throw an error if not passed.
        - [ ] `{src}` can be a directory or a glob of files. If it is a directory, it should glob all files inside that directory.
        - [ ] `{dest}` is optional and defaults to `process.cwd()`.
2. [ ] Feature: Archie the task master (`archie {cmd}`):
    - [ ] Scenario 1: Archie task:
        - [ ] Given:
            - [ ] No conditions required...
        - [ ] When:
            - [ ] User runs `archie {task}`...
            - [ ] And `{task}` is anything but a predefined archie command...
        - [ ] Then:
            - [ ] Archie passes `{task}` to `npm run {task}`...
            - [ ] And also passes any arguments
