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
  gaTrackingId: 'UA-163945569-2',
  pokerApi: 'https://goroom-poker.herokuapp.com'
};
