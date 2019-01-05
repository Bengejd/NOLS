<h1 align="center">NOLS</h1>

NOLS makes writing responsive SCSS easier by taking the hassle out of converting pixel `px` values to viewport `vh/vw` 
values within your project with one simple CLI command. You write your stylesheet with one device in mind, and NOLS 
handles the rest. 

<div align="center">
  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square"
      alt="API stability" />
  </a>
  <!-- NPM version -->
  <a href="https://npmjs.org/package/NOLS">
    <img src="https://img.shields.io/npm/v/nols.svg?style=flat-square"
      alt="NPM version" />
  </a>
  <!-- Build Status -->
  <a href="https://travis-ci.org/Bengejd/NOLS">
    <img src="https://img.shields.io/travis/Bengejd/NOLS/master.svg?style=flat-square"
      alt="Build Status" />
  </a>
</div>


<h3>For example</h3>

If your device has a height of `812px` and a width of `375px`. You would write your css so that it looks beautiful on
 that particular device, using Pixel values. Once you get it looking how you want, you would run `nols`, which will 
 go through your project, converting all of your `px` values to `vh` and `vw` values.


## Project Status
NOLS is currently under development and **NOT RECOMMENDED** for production use at this time. 

# TODO: 

- [ ] Add --clean CLI argument (will remove all comments that NOLS adds, but also makes it so you cannot revert 
changes.)

- [ ] Add --revert CLI argument (will revert all NOLS changes, detected by comments in .scss files.)

- [ ] Add optional CLI arguments (--clean, --revert)

- [X] Unit tests as much as possible

- [ ] Create more manual file tests

- [ ] Include JSDocs for all utility functions

- [ ] Hookup TravisCLI

- [X] Package for NPM

- [ ] Fix up readMe

- [ ] Optimize project code
