<img src="https://raw.githubusercontent.com/scope42/scope42/main/public/logo.svg" width="100%" alt="scope42 logo">

# <p align="center">Improve your software architecture with precision!</p>

[![Build](https://github.com/erikhofer/scope42/actions/workflows/build.yml/badge.svg)](https://github.com/erikhofer/scope42/actions/workflows/build.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![License: AGPL v3](https://img.shields.io/badge/License-MIT-informational.svg)](https://github.com/erikhofer/scope42/blob/main/LICENSE)

This tool helps you to keep track of issues, arising risks and possible improvements of your existing architecture. The terminology and concepts are based on aim42, the Architecture Improvement Method.

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
- Integegration of aim42 content
- Support for media files
- Comments
- i18n
- Maybe at some point:
  - Extend to arc42
  - Integration with docToolchain

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
