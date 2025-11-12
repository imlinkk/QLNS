<?php
/**
 * Performance Routes
 */

use App\Core\Router;
use App\Core\Request;
use App\Core\Middleware;
use App\Controllers\PerformanceController;

return function(Router $router) {
    $controller = new PerformanceController();
    
    // GET /performance - Get all reviews
    $router->get('/performance', function(Request $request) use ($controller) {
        Middleware::auth();
        return $controller->index();
    });
    
    // GET /reviews - Alias for /performance
    $router->get('/reviews', function(Request $request) use ($controller) {
        Middleware::auth();
        return $controller->index();
    });
    
    // GET /performance/employee/{id} - Get employee reviews
    $router->get('/performance/employee/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        return $controller->getByEmployee((int)$params['id']);
    });
    
    // GET /performance/rating/{id} - Get average rating
    $router->get('/performance/rating/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        return $controller->getAverageRating((int)$params['id']);
    });
    
    // GET /performance/statistics - Get statistics
    $router->get('/performance/statistics', function(Request $request) use ($controller) {
        Middleware::auth();
        return $controller->statistics();
    });
    
    // POST /performance - Create review
    $router->post('/performance', function(Request $request) use ($controller) {
        Middleware::auth();
        return $controller->store($request->data());
    });
    
    // PUT /performance/{id} - Update review
    $router->put('/performance/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        return $controller->update((int)$params['id'], $request->data());
    });
};
