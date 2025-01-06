# BdjobsAngularBoilerplate

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

## UI & CSS Library
UI -- Used Tailwind css and preline ui kit for designing the ui.

## Shared Folder
1. Classes 
    Configs.ts - This is a config helper resolver class. To extend this class in any component where that component expects configs data from route resolver. This class will provide the configs data from route resolver.
2. Components
    1. Checkbox - components for using checkbox in your components, passing formcontrol and other attributes.
    2. Confirmation Modal - Configurable confirmation alert to reuse in your app by injecting ConfirmationModalService in your component and calling the openConfirmationModal method. This will return an observable which you can subscribe to get the result of the confirmation modal. You can pass the title, message, confirmButtonText, cancelButtonText, showCancelButton, showConfirmButton, and icon as parameters to the openConfirmationModal method. The icon parameter can be 'success', 'error', 'warning', or 'info'. If no icon is passed, the default icon will be 'info'.
    


