Nug Skeleton
=================

## Install

Make sure you have grunt-cli installed:
```
sudo npm install -g grunt-cli
```

Install server packages
```
npm install
```

Install client packages
```
bower install
```

Make sure you have ruby and sass installed (to pre-compile the stylesheets)
>This task requires you to have Ruby and Sass installed. If you're on OS X or Linux you probably already have Ruby installed; test with ruby -v in your terminal. When you've confirmed you have Ruby installed, run gem install sass to install Sass.

Start the server
```
grunt serve
```

Point your browser at **http://localhost:3000**

## To deploy to Heroku
To deploy a feature branch to heroku (for example feature/customersettings)
```
git push heroku feature/customersettings:master
```
This says, 'take our feature/customersettings branch and deploy it to the heroku master branch'.  Because heroku only likes to deploy the master branch

March 3rd 2019, connected to git master branch for auto deploy
