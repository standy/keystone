var fieldTests = require('./commonFieldTestUtils.js');
var ModelTestConfig = require('../../../modelTestConfig/EmailModelTestConfig');

module.exports = {
	before: function (browser) {
		fieldTests.before(browser);
		browser.adminUIInitialFormScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIItemScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);
	},
	after: fieldTests.after,
	'Email field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Email'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name',},
			{ name: 'fieldA',},
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Email field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Email'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Email Field Test 1' },},
			{ name: 'fieldA', input: { value: 'user@example1.com' },},
		]);

		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Email Field Test 1' },},
			{ name: 'fieldA', input: { value: 'user@example1.com' },},
		]);

		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Email field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'name',},
			{ name: 'fieldA',},
			{ name: 'fieldB',},
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Email Field Test 1' },},
			{ name: 'fieldA', input: { value: 'user@example1.com' },},
		]);
	},
	'Email field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: { value: 'user@example2.com' },},
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals('flashMessage', 'Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Email Field Test 1' },},
			{ name: 'fieldA', input: { value: 'user@example1.com' },},
			{ name: 'fieldB', input: { value: 'user@example2.com' },},
		]);
	},
};
