# Routes

The application is a single-screen Angular application with no Angular Router.

| URL | Entry | Layout |
| --- | --- | --- |
| `/` / Electron local file | `src/app/app.component.html` | `AppComponent` full-screen shell |

Electron selects the content source in `electron/main.js`: local and development load the built `index.html`; staging and production load a configured remote URL.

