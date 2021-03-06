// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  
  // ben testing over his local network
  // apiUrl: 'http://ben-air.local:3000',
  // whitelistedDomains: ['ben-air.local:3000'],
  
  // standard URLs for localhost and VSCode Live Share
  apiUrl: 'http://localhost:3000',
  whitelistedDomains: ['localhost:3000'],
  
  agora: {
    appId: '516c8452e59e4505aed64d368917ffca'
  },
  gaTrackingId: 'UA-163945569-1',
  pokerApi: 'localhost:5000'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
