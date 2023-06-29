module.exports = {
    apps: [{
      script: "main.js",
      watch: ["./"],
      watch_delay: 1000,
      ignore_watch : ["node_modules", "session", "command"],
    }]
  }
