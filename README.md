# m-ng-ts
Angular 1.5 & Typescript with webpack.

## Setup
1. Install git, nodejs(recommend >=5.x). **Optional**: You can install `yarn` to replace the usage of `npm`
2. If you already have a repository

  ```
git remote add bp https://github.com/martin-liu/m-ng-ts.git
git pull bp master
```
3. `npm run setup`

Note:
You can use `git config --global url."https://".insteadOf git://` to solve possible network issue
**For Windows User**, prefer use `cmd` rather than `git bash`, please switch to `cmd` if `git bash` not work well(you may need remove node_modules and run `npm run setup` again).

## Development
Run `npm start`, this will start a web server on http://localhost:8888

It's using **webpack-dev-server**, will auto compile files and reload page.

### Add 3rd party libraries
1. Check if the library supports NodeJS style `require`
  * Install that library by `npm install --save xxx`
  * Check library's `package.json` file, see if there's `main` attribute
  * Check the file which `main` points to, search if there's `module.exports` code
2. If it supports, then
  * Add the name of library to `webpack.vendor.js`, this is for better compile performance in development
  * Use `const xxx = require('xxx')` to use that library
3. If the library not support NodeJS style `require`, then
  * Remove it from `package.json`
  * Save js file to `app/assets` folder and reference it in `app/index.html`

## Deployment
`npm run deploy-dev` or `npm run deploy-prod`

## How it works

### Structure
```
├── app
│   ├── assets
│   ├── common
│   │   ├── components
│   │   ├── partials
│   │   └── services
│   ├── components
│   │   ├── about
│   │   └── home
│   ├── config
│   ├── core
│   ├── lib
│   └── services
│       └── remote
```

### Details
1. Entry: `app/core/bootstrap.ts`.
2. `app/config/config.ts` is local config file and will **ignored** by git
3. `app/config/routes.ts` is route config, it will be used to bind route with components
4. `app/config/intro.ts` is for [intro.js](https://github.com/usablica/intro.js)
5. All common components and services are located in `app/common` folder
6. Add your code in `app/components` and `app/services`


## Note
* You can add 3rd party libraries in `app/core/modules.ts`
* For assets like images or other assets
  + Global assets, you can put it in `app/assets`
  + Component assets, you just put it in component folder, and reference it by **relative path** in you html file
