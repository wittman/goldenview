window.addEvent("domready", function () {
    new FancySettings.initWithManifest(function (settings) {
        settings.manifest.report_bug.addEvent("action", function () {
            window.open("https://github.com/wittman/goldenview/issues/new");
        });
        settings.manifest.extension_page.addEvent("action", function () {
            window.open("https://chrome.google.com/webstore/detail/"); //TBA
        });
        settings.manifest.developer_page.addEvent("action", function () {
            window.open("http://wittman.org/+");
        });
    });
});