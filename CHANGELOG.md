# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- Japanese language
### Fixed
- 10/3*3 = 9.999... &ne; 10
- Unknown bugs

## [PG-1.0.7]
### Added
- Fontawesome latest version resource files
### Fixed
- Text error
- X letter convert to * sign fail
- Can't type any word in UI's input
- The twice multiplication or division sign error(5+5**5 = 125)
- Webserver can't correct get resource, because not use the absolute URL
- Incorrect display of error messages. e.g. 3,55 &rarr; A space between two numbers
### Removed
- Rotating gear on UI
- Fontawesome old version resource files

## [PG-1.0.6] - 2022-01-22
### Added
- History
- traditional Chinese
- Quick reload of history
- Autocomplete parentheses
- Autocomplete multiplication sign
- A setting for number of decimal places
- calculator some sign(&#960;, e, log, and ln)
### Changed
- Put more icon on UI
- More better UI for this calculator
- Gear button(Show or hide setting)
- History button(Show or hide history)
- Trash button(Delete formula or history)
### Deprecated
- Rotating gear on UI

## [PG-1.0.0] - 2021-12-20
### Added
- Basic calculator function(+, -, *, /, and ^)
- Basic UI for this calculator