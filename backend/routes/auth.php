<?php

/**
 * Authentication Routes
 */

use App\Core\Router;
use App\Core\Request;
use App\Controllers\AuthController;

return function (Router $router) {
    $controller = new AuthController();

    // POST /login - User login
    $router->post('/login', function (Request $request) use ($controller) {
        return $controller->login($request->data());
    });

    // POST /register - User registration
    $router->post('/register', function (Request $request) use ($controller) {
        return $controller->register($request->data());
    });

    // POST /logout - User logout
    $router->post('/logout', function (Request $request) use ($controller) {
        return $controller->logout();
    });

    // GET/POST /auth/check - Check authentication status
    $router->get('/auth/check', function (Request $request) use ($controller) {
        return $controller->checkAuth();
    });
    $router->post('/auth/check', function (Request $request) use ($controller) {
        return $controller->checkAuth();
    });

    // GET /auth/user - Get current user
    $router->get('/auth/user', function (Request $request) use ($controller) {
        return $controller->getCurrentUser();
    });

    // PUT /auth/profile - Update profile
    $router->put('/auth/profile', function (Request $request) use ($controller) {
        return $controller->updateProfile($request->data());
    });

    // PUT /auth/password - Change password
    $router->put('/auth/password', function (Request $request) use ($controller) {
        return $controller->changePassword($request->data());
    });
};
