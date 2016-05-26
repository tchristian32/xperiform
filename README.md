# Xperiform - Experimentation Platform for Node.js

This project creates an experimentation platform that can be used with Node.js. It enables loosely coupled modules to be included dynamically into a bundle to be served to the client.

## Implementation details

This project uses gulp to build the bundle on demand. It also has an internal cache mechanism.

## Future additions

 * Reading the settings from a database
 * Enable choosing which browsers a test supports
 * Enable choosing which mobile browsers/os a test supports
 * UI to set various settings for how a test should be run
   * % of traffic to each variation
   * Browsers to send traffic from