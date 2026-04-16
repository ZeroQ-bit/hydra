// Adapted version of https://github.com/Stremio/stremio-addon-sdk/blob/v1.6.2/src/landingTemplate.js
import { CustomManifest } from './types';
import { envGet } from './utils';

const STYLESHEET = `
* {
  box-sizing: border-box;
}

body,
html {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
}

body {
  padding: 4vh 2vh;
  font-size: 2vh;
  background-color: #0f0f13;
  color: #f1f1f1;
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

html {
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

/* Glassmorphism Card Effect */
#addon {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background: rgba(20, 20, 25, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 4vh 5vh;
  border-radius: 2vh;
  box-shadow: 0 2vh 4vh rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
}

h1 {
  font-size: 4vh;
  font-weight: 700;
  margin: 0 0 0.5vh 0;
  letter-spacing: -0.02em;
}

h2.version {
  font-size: 1.8vh;
  font-weight: 400;
  color: #a0a0b0;
  margin: 0 0 3vh 0;
}

h3 {
  font-size: 2.2vh;
  margin-top: 3vh;
  margin-bottom: 1.5vh;
  font-weight: 600;
}

p, .description {
  font-size: 1.75vh;
  line-height: 1.6;
  opacity: 0.9;
  text-align: left;
  margin: 0 0 2vh 0;
}

ul {
  font-size: 1.75vh;
  margin: 0;
  padding-left: 3vh;
  text-align: left;
  opacity: 0.9;
}

a {
  color: #a371f7;
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: #bfa0ff;
  text-decoration: underline;
}

button {
  border: 0;
  outline: 0;
  color: white;
  background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
  padding: 1.5vh 4vh;
  margin: 3vh auto 1vh auto;
  border-radius: 1vh;
  text-align: center;
  font-family: inherit;
  font-size: 2.2vh;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  display: inline-block;
  box-shadow: 0 1vh 2vh rgba(99, 102, 241, 0.3);
  transition: all 0.2s ease-in-out;
  width: 100%;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 1.5vh 2.5vh rgba(99, 102, 241, 0.4);
}

button:active {
  transform: translateY(1px);
  box-shadow: 0 0.5vh 1vh rgba(99, 102, 241, 0.3);
}

.logo {
  height: 14vh;
  width: 14vh;
  margin: 0 auto 2vh auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo img {
  width: 100%;
  object-fit: contain;
}

.separator {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 3vh 0;
  width: 100%;
}

/* Form Styles Override */
.pure-form {
  text-align: left;
}

.form-element {
  margin-bottom: 2vh;
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5vh;
  border-radius: 1vh;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.label-to-top {
  display: block;
  margin-bottom: 1vh;
  font-weight: 600;
  font-size: 1.6vh;
  color: #e0e0e0;
}

.label-to-right {
  margin-left: 1vh;
  font-size: 1.6vh;
  cursor: pointer;
}

input[type="text"],
input[type="password"],
input[type="number"],
select {
  width: 100%;
  padding: 1.2vh !important;
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 0.5vh !important;
  color: white !important;
  font-family: inherit;
  font-size: 1.6vh !important;
  box-shadow: none !important;
}

input[type="checkbox"] {
  cursor: pointer;
  transform: scale(1.2);
  accent-color: #7c3aed;
}

input:focus, select:focus {
  outline: none;
  border-color: #a371f7 !important;
  background: rgba(255, 255, 255, 0.1) !important;
}
`;

export function landingTemplate(manifest: CustomManifest) {
  const background = manifest.background || 'https://dl.strem.io/addon-background.jpg';
  const logo = manifest.logo || 'https://dl.strem.io/addon-logo.png';
  const contactHTML = manifest.contactEmail
    ? `<div class="contact">
      <p>Contact ${manifest.name} creator:</p>
      <a href="mailto:${manifest.contactEmail}">${manifest.contactEmail}</a>
    </div>`
    : '';

  const stylizedTypes = manifest.types
    .map(types => types.charAt(0).toUpperCase() + types.slice(1) + (types !== 'series' ? 's' : ''));

  let formHTML = '';
  let script = '';

  if ((manifest.config || []).length) {
    let options = '';
    manifest.config.forEach((elem) => {
      const key = elem.key;
      if (['text', 'number', 'password'].includes(elem.type)) {
        const isRequired = elem.required ? ' required' : '';
        const defaultHTML = elem.default ? ` value="${elem.default}"` : '';
        const inputType = elem.type;
        options += `
        <div class="form-element">
          <div class="label-to-top">${elem.title}</div>
          <input type="${inputType}" id="${key}" name="${key}" class="full-width"${defaultHTML}${isRequired}/>
        </div>
        `;
      } else if (elem.type === 'checkbox') {
        const isChecked = elem.default === 'checked' ? ' checked' : '';
        options += `
        <div class="form-element">
          <label for="${key}">
            <input type="checkbox" id="${key}" name="${key}"${isChecked}> <span class="label-to-right">${elem.title}</span>
          </label>
        </div>
        `;
      } else if (elem.type === 'select') {
        const defaultValue = elem.default || (elem.options || [])[0];
        options += `<div class="form-element">
        <div class="label-to-top">${elem.title}</div>
        <select id="${key}" name="${key}" class="full-width">
        `;
        const selections = elem.options || [];
        selections.forEach((el) => {
          const isSelected = el === defaultValue ? ' selected' : '';
          options += `<option value="${el}"${isSelected}>${el}</option>`;
        });
        options += `</select>
               </div>
               `;
      }
    });
    if (options.length) {
      formHTML = `
      <form class="pure-form" id="mainForm">
        ${options}
      </form>

      <div class="separator"></div>
      `;
      script += `
      installLink.onclick = () => {
        return mainForm.reportValidity()
      }
      const updateLink = () => {
        const config = Object.fromEntries(new FormData(mainForm))
        config.mediaFlowProxyUrl = config.mediaFlowProxyUrl.replace(/^https?.\\/\\//, '');
        installLink.href = 'stremio://' + window.location.host + '/' + encodeURIComponent(JSON.stringify(config)) + '/manifest.json'
      }
      mainForm.onchange = updateLink
      `;
    }
  }

  return `
  <!DOCTYPE html>
  <html style="background-image: url(${background});" lang="en">

  <head>
    <meta charset="utf-8">
    <title>${manifest.name} - Stremio Addon</title>
    <style>${STYLESHEET}</style>
    <link rel="shortcut icon" href="${logo}" type="image/x-icon">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/purecss@2.1.0/build/pure-min.css" integrity="sha384-yHIFVG6ClnONEA5yB5DJXfW2/KC173DIQrYoZMEtBvGzmf0PKiGyNEqe9N6BNDBH" crossorigin="anonymous">
  </head>

  <body>
    <div id="addon">
      <div class="logo">
      <img src="${logo}" alt="logo">
      </div>
      <h1 class="name">${manifest.name}</h1>
      <h2 class="version">v${manifest.version || '0.0.0'}</h2>
      <div class="description"><small>${manifest.description.replace(/\n/g, '<br>') || ''}</small></div>

      <div class="separator"></div>

      <p>
        The source code can be found on <a href="https://github.com/zainulnazir/hydra" target="_blank">GitHub</a>.
      </p>

      <div class="separator"></div>

      ${envGet('CONFIGURATION_DESCRIPTION') || ''}

      <div class="separator"></div>

      <p>
        Note: HTTP streams have limitations. For a better experience, I'd advise using a Debrid service and Hydra as fallback.
        <a href="https://torbox.app/subscription?referral=f22eb00d-27ce-4e20-85fc-68da3d018b99" target="_blank"><strong>TorBox</strong></a> is working very well. 
      </p>

      <div class="separator"></div>

      <h3 class="gives">This addon has more :</h3>
      <ul>
      ${stylizedTypes.map(t => `<li>${t}</li>`).join('')}
      </ul>

      <div class="separator"></div>

      ${formHTML}

      <a id="installLink" class="install-link" href="#">
      <button name="Install">INSTALL</button>
      </a>
      ${contactHTML}
    </div>
    <script>
      ${script}

      if (typeof updateLink === 'function')
      updateLink()
      else
      installLink.href = 'stremio://' + window.location.host + '/manifest.json'
    </script>
  </body>

  </html>`;
}
