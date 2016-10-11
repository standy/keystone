var fieldTests = require('./commonFieldTestUtils.js');
var ModelTestConfig = require('../../../modelTestConfig/PasswordModelTestConfig');

module.exports = {
	// '@disabled': true,  // TODO: enable after https://github.com/keystonejs/keystone/issues/3428 is fixed
	before: function (browser) {
		fieldTests.before(browser);
		browser.adminUIInitialFormScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIItemScreen.setDefaultModelTestConfig(ModelTestConfig);
		browser.adminUIListScreen.setDefaultModelTestConfig(ModelTestConfig);
	},
	after: fieldTests.after,
	'Password field should show correctly in the initial modal': function (browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Password'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.assertFieldUIVisible([
			{ name: 'name',},
			{ name: 'fieldA', options: { passwordShown: true }, }
		]);

		browser.adminUIInitialFormScreen.cancel();
		browser.adminUIApp.waitForListScreen();
	},
	'Password field can be filled via the initial modal': function(browser) {
		browser.adminUIApp.openList({section: 'fields', list: 'Password'});

		browser.adminUIListScreen.clickCreateItemButton();
		browser.adminUIApp.waitForInitialFormScreen();

		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'name', input: { value: 'Password Field Test 1' }, },
			{ name: 'fieldA', input: {value: 'password1', confirm: 'wrongPassword1'}, },
		]);
		browser.adminUIInitialFormScreen.save();
		browser.adminUIInitialFormScreen.assertElementTextEquals('flashError', "Passwords must match");
		browser.adminUIInitialFormScreen.fillFieldInputs([
			{ name: 'fieldA', input: {value: 'password1', confirm: 'password1'}, },
		]);
		browser.adminUIInitialFormScreen.assertFieldInputs([
			{ name: 'fieldA', input: {value: 'password1', confirm: 'password1'}, },
		]);
		browser.adminUIInitialFormScreen.save();
		browser.adminUIApp.waitForItemScreen();
	},
	'Password field should show correctly in the edit form': function(browser) {
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', options: { passwordShown: false }, },
			{ name: 'fieldB', options: { passwordShown: false }, }
		]);

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Password Field Test 1' }, },
		])
	},
	'Password field can be filled via the edit form': function(browser) {
		browser.adminUIItemScreen.clickFieldUI([
			{ name: 'fieldB', 'click': 'setPasswordButton', },
		]);
		browser.adminUIItemScreen.assertFieldUIVisible([
			{ name: 'fieldA', options: { passwordShown: false }, },
			{ name: 'fieldB', options: { passwordShown: true }, }
		]);
		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: {value: 'password2', confirm: 'wrongPassword2'}, },
		]);

		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals('flashError', 'Passwords must match');

		browser.adminUIItemScreen.fillFieldInputs([
			{ name: 'fieldB', input: {value: 'password2', confirm: 'password2'}, },
		]);
		browser.adminUIItemScreen.save();
		browser.adminUIApp.waitForItemScreen();

		browser.adminUIItemScreen.assertElementTextEquals('flashMessage', 'Your changes have been saved successfully');

		browser.adminUIItemScreen.assertFieldInputs([
			{ name: 'name', input: { value: 'Password Field Test 1' }, },
		])
	},
};
