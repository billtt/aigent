module.exports = {
    apps: [{
        name: "aigent",
        script: "./index.js",
        cwd: "./",
        log_file: "./logs/pm2.log",
        restart_delay: 10000,
        env: {
        }
    }, {
        name: "aigent-log-watcher",
        script: "./log-watcher.js",
        cwd: "./",
        log_file: "./logs/log-watcher.log",
        restart_delay: 1000,
        env: {}
    }]
}