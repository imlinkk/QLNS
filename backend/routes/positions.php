<?php
/**
 * Position Routes
 */

use App\Core\Router;
use App\Core\Request;
use App\Core\Middleware;
use App\Controllers\PositionController;

return function(Router $router) {
    $controller = new PositionController();
    
    // GET /positions - Get all positions
    $router->get('/positions', function(Request $request) use ($controller) {
        Middleware::auth();
        return $controller->index();
    });
    
    // GET /positions/{id} - Get position by ID
    $router->get('/positions/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        return $controller->show((int)$params['id']);
    });
    
    // POST /positions - Create position
    $router->post('/positions', function(Request $request) use ($controller) {
        Middleware::auth();
        return $controller->store($request->data());
    });
    
    // PUT /positions/{id} - Update position
    $router->put('/positions/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        return $controller->update((int)$params['id'], $request->data());
    });
    
    // DELETE /positions/{id} - Delete position
    $router->delete('/positions/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        return $controller->destroy((int)$params['id']);
    });
};
