# Go Room - Frontend (Angular)
Production Build:<br>
[![Netlify Status](https://api.netlify.com/api/v1/badges/a021c279-e49e-406e-84cf-48c5fc25f804/deploy-status)](https://app.netlify.com/sites/goroom-frontend/deploys)

## Setup
1. Clone/Pull Repo
2. Run `npm install`
3. Follow directions below for Development or Production

## Development server
#### "Standard"
4. Run `ng serve` for a dev server.
5. Navigate to `http://localhost:4200/`.
#### Accessible via other machines on local network
4. Run `ng serve --host 0.0.0.0` to bind to `.local` address (OS X) or IP address.
5. Use your computer's local network IP or `Computer-Name.local` after `http://` and before `:4200`, from either the host machine, or other machines on the local network.

In development mode, the app will automatically reload if you change any of the source files.

## Production/Deployment Setup
4. Built with `ng build --prod`, manually (no CI currently). Currently running in an Apache environment, hence the existence of an .htaccess file. Apache config files point the domain to the `dist/` directory.

<br><br>

## Angular's Default Readme Notes
_This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.0._

#### Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

#### Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

#### Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

#### Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

#### Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
