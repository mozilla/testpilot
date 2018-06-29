[👈 Back to README](../../README.md)

# Development Quickstart

Test Pilot uses Node.js [v8.9.4](https://nodejs.org/dist/latest-v8.x/) for
development. You may be able to get by using
[the most current release](https://nodejs.org/en/download/current/), but
earlier versions will definitely result in error messages and problems. [Node
Version Manager](https://github.com/creationix/nvm/blob/master/README.md)
might come in handy for installing the right version of Node.js.

## First Things First

Make sure you clone the Test Pilot repo:

  `git clone https://github.com/mozilla/testpilot.git`
  
Windows users will want to enable symlinks:

  `git clone -c core.symlinks=true https://github.com/mozilla/testpilot.git`

## For Linux & OS X hosts

Once you've got a good version of Node.js installed for your operating system,
here are some shell commands to get you started on Linux & OS X:

```bash
cd testpilot

# Install project dependencies
npm install

# Set up add-on environment and build an unsigned package
cd addon
npm install
npm run package

# Set up frontend web site environment
# Add hostname alias to /etc/hosts and start up dev webserver
echo '127.0.0.1 example.com' | sudo tee -a /etc/hosts
cd ..
npm start
```

**Note:** While you *will* be able to see the web site locally via
http://localhost:8000/ - the `example.com` hostname alias is important to
several features of this site for local development. The domain `example.com`
is whitelisted and allowed to use the mozAddonManager api to manage add-ons.

These steps will give you a working development web server and file
watcher that will rebuild site assets as you edit. Just a few more steps and
you should be on your way:

1. Install [Firefox Developer Edition][devedition].

1. Configure your browser to use your local Test Pilot server:

   1. Type `about:config` in the URL bar, acknowledge the warning that appears.

   1. Right click the list of preferences to summon a menu, pick New > Boolean
      to create a new preference.

   1. Enter `extensions.webapi.testing` for the name.

   1. Enter `true` for the value. This is needed for whitelisting mozAddonManager
      on testpilot.stage.mozaws.net, testpilot.dev.mozaws.net, and example.com.

1. View your local site in Firefox Developer Edition at https://example.com:8000/

[aboutconfig]: https://support.mozilla.org/en-US/kb/about-config-editor-firefox
[devedition]: https://www.mozilla.org/en-US/firefox/developer/
[devprefs]: https://addons.mozilla.org/en-US/firefox/addon/devprefs/

The Test Pilot add-on is a key component of this project - among other things,
it communicates with the site and grants the ability to enable & disable
experiments. Setting up your browser with the steps above should make it easier
for you to get it working.

## For Windows hosts

After installing Node.js for Windows, run these commands to get started:

```cmd
cd testpilot
npm install

:: Set up add-on environment and build an unsigned package
cd addon
npm install
npm run package

:: Set up frontend web site environment
cd ..
```

Now, open a second command prompt window, this time with admin privileges and run this:

```cmd
:: Add hostname alias to /etc/hosts and start up dev webserver
echo 127.0.0.1 example.com >> %WINDIR%\System32\Drivers\Etc\Hosts
```

Go back to the previous command prompt window and run

```cmd
npm start
```

Follow the remaining instructions from **Linux & OS X** section and you're all set.
