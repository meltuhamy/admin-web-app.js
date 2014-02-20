'use strict';

describe('Service: Authentication', function () {
	// load module
	beforeEach(function(){
		module('adminPanelApp', 'templates', 'mockedResponses');
		inject(function(_$httpBackend_, _ROUTES_){
			$httpBackend = _$httpBackend_;
			ROUTES = _ROUTES_;

			$httpBackend.expectGET(_ROUTES_.USER).respond(401);
			$httpBackend.flush();
		});
	});

	var Authentication, User, $httpBackend, ROUTES,
		AuthValid, AuthInvalid, Session;

	// Load the service to test
	beforeEach(inject(function(_Authentication_, _User_, _AuthValid_, _AuthInvalid_, _Session_){
		Authentication = _Authentication_;
		User = _User_;
		AuthValid = _AuthValid_;
		AuthInvalid = _AuthInvalid_;
		Session = _Session_;
	}));

	it('Authentication should be injected.', function () {
		expect(Authentication).not.toBeUndefined();
	});

	it('User attempts login with valid credentials and valid roles.', function () {
		// prepare http response for login attempt.
		$httpBackend.expectPOST(ROUTES.AUTHENTICATION, $.param(AuthValid.req)).respond(200, AuthValid.res);
		$httpBackend.expectGET(ROUTES.SESSION).respond(200, Session.valid);

		// perform login
		Authentication.login(AuthValid.req);
		expect(User.get()).toBeNull();

		// respond to login
		$httpBackend.flush();

		// we should have user data
		var user = User.get();
		expect(user).not.toBeNull();
		expect(user.first_name).toEqual(AuthValid.res.user_first_name);
		expect(user.last_name).toEqual(AuthValid.res.user_last_name);
		expect(user.id).toEqual(AuthValid.res.user_id);
		expect(user.username).toEqual(AuthValid.res.user_username);
		expect(user.first_name).toEqual(AuthValid.res.user_first_name);
	});

	it('User attempts login with valid credentials but no cr* roles.', function () {
		// prepare http response for login attempt.
		$httpBackend.expectPOST(ROUTES.AUTHENTICATION, $.param(AuthValid.req)).respond(200, AuthValid.res);
		$httpBackend.expectGET(ROUTES.SESSION).respond(200, Session.invalid);
		$httpBackend.expectGET(ROUTES.SIGNOUT).respond(200);

		// perform login
		Authentication.login(AuthValid.req);
		expect(User.get()).toBeNull();

		// respond to login
		$httpBackend.flush();

		// we should not have user data since the user does not have a cr* role
		expect(User.get()).toBeNull();
	});

	it('User attempts login with invalid credentials.', function () {
		// prepare http response for login attempt.
		$httpBackend.expectPOST(ROUTES.AUTHENTICATION, $.param(AuthInvalid.req)).respond(400, AuthInvalid.res);

		// perform login
		Authentication.login(AuthInvalid.req);
		expect(User.get()).toBeNull();

		// respond to login
		$httpBackend.flush();

		// since login failed, we should not have user data
		expect(User.get()).toBeNull();
	});

	it('User logs out.', function () {
		// prepare http response for login attempt.
		$httpBackend.expectGET(ROUTES.SIGNOUT).respond(200);

		// set user information to pretend someone is logged in
		User.set(AuthValid.res);
		expect(User.get()).not.toBeNull();

		// perform signout request
		Authentication.logout();
		$httpBackend.flush();

		// expected signout to be successful
		expect(User.get()).toBeNull();
	});

});