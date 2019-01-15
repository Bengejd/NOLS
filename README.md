<h1 align="center">NOLS</h1>

NOLS makes writing pixel perfect CSS/SCSS easier by taking the hassle out of converting pixel `px` values to viewport 
`vh/vw` values within your project with one simple CLI command. You can now write your stylesheet with one device in 
mind, and NOLS handles making it pixel perfect (**within reason**) everywhere else. 

<div align="center">
  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square"
      alt="API stability" />
  </a>
  <!-- NPM version -->
  <a href="https://npmjs.org/package/nols">
    <img src="https://img.shields.io/npm/v/nols.svg?style=flat-square"
      alt="NPM version" />
  </a>
    <!-- NPM DOWNLOADS -->
  <a href="https://www.npmjs.com/package/nols">
    <img src="https://img.shields.io/npm/dw/nols.svg"
      alt="NPM version" />
  </a>
  <!-- Build Status -->
  <a href="https://travis-ci.org/Bengejd/NOLS">
    <img src="https://img.shields.io/travis/Bengejd/NOLS/master.svg?style=flat-square"
      alt="Build Status" />
  </a>
  <!-- CodeCov -->
  <a href="https://codecov.io/gh/Bengejd/NOLS">
   <img src="https://codecov.io/gh/Bengejd/NOLS/branch/master/graph/badge.svg" />
  </a>
  <a href="#">
    <img alt="undefined" src="https://img.shields.io/npm/l/nols.svg?style=flat-square" />
  </a>
</div>

## Project Status
NOLS is currently under development and **NOT RECOMMENDED** for production use at this time. 

<h3>About NOLS</h3>

I don't know about you, but I typically write my CSS with one device in mind. During development I work with a 
device that has a view height of `812px` and a view width of `375px`. 

Afterwards, I would always go back, and manually make the conversions, so that the CSS that looks good on my device, looks good on any device. 

This takes a lot of effort on my part because there are a lot of little calculations to be done. So I wanted to streamline this process. Since no one likes stylesheets, NOLS came to life.

Now with NOLS, I perfect my CSS on one device, run `nols`, and have the peace of mind knowing that it looks pixel perfect on any device. 

## Important Notes

It is **HIGHLY RECOMMENDED**  that you commit any files before using NOLS.

### No One Likes Dirty Repos
 
NOLS changes your project level stylesheet files. As a result of this, some changes may be **irreversible** if you do not
commit files before using NOLS or have an IDE with the ability to revert historical changes.
 
If you knowingly use NOLS before backing up your project, you accept all risks associated with NOLS potentially 
breaking your code.

This does not happen often, but it's always a possibility.

## Install

First make sure you have installed the latest version of [node.js](http://nodejs.org/)
(You may need to restart your computer after this step).

From NPM for use as a command line app:

    npm install nols -g
    
From NPM for programmatic use:
    
    npm install nols --save-dev

## Usage

If you have installed NOLS from npm, from terminal in your project directory, run the command

    nols
    
> Note: `nols` is meant to be run before any minification / compression is done. Running it on minified / compressed files will have adverse affects. Don't say I didn't warn you.
    
### Optional Parameters

`--e=` or `--entry=` - A relative path of the directory you would like NOLS to start in. Unfortunately, NOLS cannot target specific files, it has to be a parent directory of the file. 

`--h=` or `--height=` - The viewport height you would like NOLS to use in it's conversions.

`--w=` or `--width=` - The viewport width you would like NOLS to use in it's conversions.
    
### Modes

`Default` 

This is the bread and butter of the package. This will ask you a couple questions, such as what the directory you would like to target and the viewport height & viewport width that you're working with. 

By default NOLS targets your `./src/` folder as an entry point, unless one is provided via the prompt, or passed as a parameter in the `nols` command.

Afterwards, it reads & converts all stylesheets in your project `./src/` folder to use `vh` and `vw`.

`Revert`

Removes all changes made by NOLS. This is currently dependent on the assumption that you did not remove 
any comments left behind by NOLS. So if you remove a comment, it will skip that value reversion.

`Clean` 

This reverts all conversions in your project back to their original state. This command depends on the 
comments left behind by `nols`, so do not remove or alter them unless you're sure that the conversion worked correctly.

## Supported Attributes
These are the attributes that NOLS will attempt to convert for you. If you would like something to be supported by NOLS 
that isn't currently, or estabilished as known in the **unsupported attributtes** list, add it to 
[our attributes request-list](https://github.com/Bengejd/NOLS/issues/3).

#### X Attributes
- [x] height / min-height / max-height
- [x] line-height
- [x] top / bottom
- [x] padding-top / padding-bottom
- [x] margin-top / margin-bottom
- [x] transform: translateY

#### Y Attributes
- [x] width / min-width / max-width
- [x] column-width
- [x] outline-width
- [x] left / right
- [x] padding-left / padding-right
- [x] margin-left / margin-right
- [x] transform: translateX
- [x] word-spacing / letter-spacing

#### Unsupported Attributes

Nols has a few attributes that are not currently supported in this version. Some of them are because of usage 
limitations, others are because I simply haven't gotten around them yet.

- [ ] margin - `margin: 1px 2px 3px 4px;`
- [ ] padding - `padding: 1px 2px 3px 4px;`
- [ ] transform: translate - `transform: translate(50px, 50px);`
- [ ] outline - `outline: 5px solid green;`
- [ ] font-size - `font-size: 12px;`
- [ ] border-radius - All types

### Unit Compatibility 
NOLS is only compatible with pixel (`px`) unit values at this time. That means NOLS will **skip** over any value 
containing the following:

#### Absolute Units
`cm, mm, in, pt, pc`

#### Relative Units
`em, ex, ch, rem, vh, vw, vmin, vmax, %`

## Test Todo: 
- [x] Implement unit tests as much as possible.
- [x] Create more manual file tests.
- [x] Run package on fresh project to test non-linked package.

## CI TODO:
- [x] Hookup `TravisCLI`
- [x] Hookup `CodeCov`
- [ ] Hookup `GreenKeeper`
- [ ] Hook up `snyk`
- [ ] Hook up `npm audit`

## NPM TODO:
- [x] Package for `NPM`
- [X] Double check npmignore

## Github TODO:
- [ ] Create `CHANGELOG.md`
- [X] Fix up readme
- [X] Create package install/usage guide
- [x] create a release that matches the npm package.

## Code TODO:
- [x] Include JSDocs for all appropriate functions.
- [ ] Optimize project code.
- [ ] Convert parser to use AST style parsing.
- [ ] Utilize RegEx where appropriate.
- [ ] Reduce Bundle Size (250kb gzipped isn't that bad is it?).
