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

## Project Status
NOLS is currently under development and **NOT RECOMMENDED** for production use at this time. 

<h3>About NOLS</h3>

I don't know about you, but I typically write my CSS with one device in mind, during development. I work with a device that has a height of `812px` and a width of `375px`. Afterward, I would always go back, and manually make the conversions, so that the CSS that looks good on that device, looks good on any device. 

This takes a lot of effort on my part because there are a lot of little calculations to be done. So I wanted to streamline this process. Since no one likes stylesheets, NOLS came to life

Now with NOLS, I perfect the CSS on one device, and then run the command, ensuring that it looks the same across any number of devices. 

## Supported attributes
- [x] height, width
- [x] left, right, top, bottom
- [x] margin-left, margin-right, margin-top, margin-bottom
- [x] padding-left, padding-right, padding-top, padding-bottom
- [x] translateY, translateX
- [ ] margin
- [ ] padding
- [ ] translate

## CLI commands
- [x] nols: Runs the conversion on your project
- [ ] nols --revert: reverts project back to pre-nols state.
- [ ] nols --clean: removes all nols comments.

## Commands explained

`nols`: This is the bread and butter of the package. This will ask you a couple questions, such as what the device height & width that you're working with. Afterwards, it converts your project to use `vh` and `vw`. 

This command will add in comments for you to see later on, if you're curious what the original values were. Leave these in, as they are necessary for reverting the conversions that `nols` did.

`nols --revert`: This reverts all conversions in your project back to their original state. This command depends on the comments left behind by `nols`, so do not remove them unless you're sure that the conversion worked correctly.

`nols --clean`: This removes all comments left behind by `nols`.
This also makes it so that you cannot revert the changes. So use this carefully. Check all of your application, before using this command.

# TODO: 
- [X] Unit tests as much as possible
- [X] Package for NPM
- [ ] Create more manual file tests
- [ ] Add project logo
- [ ] Include JSDocs for all utility functions
- [ ] Hookup TravisCLI
- [ ] Fix up readMe
- [ ] Optimize project code
