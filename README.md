# reazy-native-config
A simple configuration module based on .env for Reazy Native Apps

This is included in your Reazy app by default.

## Usage

This plugin is a wrapper around [react-native-config](https://github.com/luggit/react-native-config)

Refer their [documentation](https://github.com/luggit/react-native-config) for usage.

The only change is that instead of importing `Config` from `'react-native-config'`, you can get it from Reazy app instance

```js
const config = app.config;
```
