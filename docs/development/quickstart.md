[👈 Back to README](../../README.md)

# Development Quickstart

Test Pilot uses Node.js v6.2.0 for development. You may be able to get by using
[the most current release](https://nodejs.org/en/download/current/), but
earlier versions will definitely result in error messages and problems. [Node
Version Manager](https://github.com/creationix/nvm/blob/master/README.markdown)
might come in handy for installing the right version of Node.js.

## First Things First

Make sure you clone the Test Pilot repo:

  `git clone https://github.com/mozilla/testpilot.git`

## For Linux & OS X hosts

Once you've got a good version of Node.js installed for your operating system,
here are some shell commands to get you started on Linux & OS X:

```bash
# Set up add-on environment and build an unsigned package
cd addon
npm install
npm run package

# Set up frontend web site environment
cd ..
npm install

# Add hostname alias to /etc/hosts and start up dev webserver
echo '127.0.0.1 testpilot.dev' | sudo tee -a /etc/hosts
npm start
```

**Note:** While you *will* be able to see the web site locally via
http://localhost:8000/ - the `testpilot.dev` hostname alias is important to
several features of this site for local development.

These steps will give you a working development web server and file
watcher that will rebuild site assets as you edit. Just a few more steps and
you should be on your way:

1. Install [Firefox Developer Edition][devedition].

1. Install the [DevPrefs][] add-on in Firefox Developer Edition.

1. Configure your browser to use your local Test Pilot server:
   
   1. Type `about:config` in the URL bar, acknowledge the warning that appears.
   
   1. Right click the list of preferences to summon a menu, pick New > String
      to create a new preference.

   1. Enter `testpilot.env` for the name.

   1. Enter `local` for the value.

1. View your local site in Firefox Developer Edition at http://testpilot.dev:8000/

[devedition]: https://www.mozilla.org/en-US/firefox/developer/
[devprefs]: https://addons.mozilla.org/en-US/firefox/addon/devprefs/

The Test Pilot add-on is a key component of this project - among other things,
it communicates with the site and grants the ability to enable & disable
experiments. Setting up your browser with the steps above should make it easier
for you to get it working. 

## Windows hosts

**Help wanted**: Getting things working on Windows may be similar to OS X,
but the team has little experience with that environment.
