<?php
/**
 * Department Routes
 */

use App\Core\Router;
use App\Core\Request;
use App\Core\Middleware;
use App\Controllers\DepartmentController;

return function(Router $router) {
    $controller = new DepartmentController();
    
    // GET /departments - Get all departments
    $router->get('/departments', function(Request $request) use ($controller) {
        Middleware::auth();
        return $controller->index();
    });
    
    // GET /departments/{id} - Get department by ID
    $router->get('/departments/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        return $controller->show((int)$params['id']);
    });
    
    // POST /departments - Create department
    $router->post('/departments', function(Request $request) use ($controller) {
        Middleware::auth();
        return $controller->store($request->data());
    });
    
    // PUT /departments/{id} - Update department
    $router->put('/departments/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        return $controller->update((int)$params['id'], $request->data());
    });
    
    // DELETE /departments/{id} - Delete department
    $router->delete('/departments/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        return $controller->destroy((int)$params['id']);
    });
};
