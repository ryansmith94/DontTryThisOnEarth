# DontTryThisOnEarth
Website to suggest mankind’s “firsts” on Mars. Created for the coursework of the HCI module (2013/2014, Semester 2) at Oxford Brookes University.

All rights reserved.


## Contributing
### Getting Started
1. [Install Github](https://help.github.com/articles/set-up-git)
2. [Install Node](http://nodejs.org/)
3. Clone the repository on [Mac](github-mac://openRepo/https://github.com/ryansmith94/DontTryThisOnEarth) or [Windows](github-windows://openRepo/https://github.com/ryansmith94/DontTryThisOnEarth)
4. Install Node packages
	1. Open up the terminal/console
	2. Change to the directory that contains the code for this repository
	3. Type `npm install`

### Directory Structure
- Markup written in [Jade](http://jade-lang.com/) should be put in the `src/markup` directory.
- Scripts written in [CoffeeScript](http://coffeescript.org/) should be put in the `src/scripts` directory.
- Styles written in [SCSS](http://sass-lang.com/) should be put in the `src/styles` directory.

### Testing
1. Open up the terminal/console
2. Change to the directory that contains the code for this repository
3. Type `grunt`
4. Type `node server.js` (May prompt security window in Windows.)
5. Open `127.0.0.1:8000/index.html` in Google Chrome. (May throw err "Cannot find module 'express'". Update npm with 'npm install') 

Note: you may want to use `grunt watch` so that you don't have to keep doing this process (this watches files waiting for you to save them and then does the build process) and you may also want to use a live page reloader so that you can view the page whilst you work.


## Credit
[Oxford Brookes University](http://www.brookes.ac.uk)


