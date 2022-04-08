<img src="https://raw.githubusercontent.com/scope42/scope42/main/public/logo.svg" width="100%" alt="scope42 logo">

<h1 align="center">Improve your software architecture with precision!</h1>

[![Build](https://github.com/scope42/scope42/actions/workflows/build.yml/badge.svg)](https://github.com/scope42/scope42/actions/workflows/build.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![License: GPL v3](https://img.shields.io/badge/License-GPL--3.0-informational.svg)](https://github.com/scope42/scope42/blob/main/LICENSE)
[![Matrix](https://img.shields.io/matrix/scope42:matrix.org)](https://matrix.to/#/#scope42:matrix.org)
[![Twitter Follow](https://img.shields.io/twitter/follow/get_scope42?style=social)](https://twitter.com/get_scope42)

This tool helps you to keep track of issues, arising risks and possible improvements of your existing architecture. The terminology and concepts are based on [aim42, the Architecture Improvement Method](https://www.aim42.org/).

scope42 is a Progressive Web App that runs entirely inside your browser. Click the link below to access the app.

<h3 align="center">🔗 <a href="https://app.scope42.org">app.scope42.org</a></h3>

⚠⚠⚠ **This project is currently in alpha stage. Breaking changes to the data format can happen without notice. Early feedback is very welcome and helpful to stabilize soon.**

## Features

- Management of items with a fancy UI
- Graphs for visualizing the relationship between items
- Docs-as-Code principle and full data ownership

## Roadmap

- Dashboard
- Advanced graphs
- Advanced filters for tables
- Full text search
- Integration of aim42 content
- Support for media files
- Comments on items
- Support for documenting the existing architecture (based on arc42)

## Tech Stack

- [React](https://reactjs.org)
- [Ant Design](https://ant.design)
- [Cytoscape.js](https://js.cytoscape.org/)

## Develop

Contributions are always welcome!

### `npm start`

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## License
scope42 is published under the [GNU General Public License v3.0](https://github.com/scope42/scope42/blob/main/LICENSE).

The data model and basic concepts are based on the [aim42 Method Reference](https://aim42.github.io/) by [Gernot Starke](https://www.gernotstarke.de/) and community contributors, used under [CC BY-SA](https://creativecommons.org/licenses/by-sa/4.0/).

scope42 is not affiliated with aim42.
