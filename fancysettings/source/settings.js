window.addEvent("domready", function () {
    new FancySettings.initWithManifest(function (settings) {
	    settings.manifest.force_selector_map_update.addEvent("action", function () {
           	chrome.extension.sendRequest({ name: "force_selector_map_update_once_init", message: true });
			alert(chrome.i18n.getMessage("options_force_selector_map_update_clicked_alert"));
        });
        settings.manifest.report_bug.addEvent("action", function () {
            window.open("https://github.com/wittman/goldenview/issues/new");
        });
        settings.manifest.extension_page.addEvent("action", function () {
            window.open("https://chrome.google.com/webstore/detail/gijclepbhbekkghfmcdfkpmbkbefcokp");
        });
        settings.manifest.developer_page.addEvent("action", function () {
            window.open("http://wittman.org/+");
        });
    });
});