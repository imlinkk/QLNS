<?php
/**
 * Employee Routes
 */

use App\Core\Router;
use App\Core\Request;
use App\Core\Middleware;
use App\Controllers\EmployeeController;

return function(Router $router) {
    $controller = new EmployeeController();
    
    // GET /employees - Get all employees
    $router->get('/employees', function(Request $request) use ($controller) {
        Middleware::auth();
        return $controller->index();
    });
    
    // GET /employees/{id} - Get employee by ID
    $router->get('/employees/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        return $controller->show((int)$params['id']);
    });
    
    // POST /employees - Create employee
    $router->post('/employees', function(Request $request) use ($controller) {
        Middleware::auth();
        return $controller->store($request->data());
    });
    
    // PUT /employees/{id} - Update employee
    $router->put('/employees/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        return $controller->update((int)$params['id'], $request->data());
    });
    
    // DELETE /employees/{id} - Delete employee
    $router->delete('/employees/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        return $controller->destroy((int)$params['id']);
    });
    
    // GET /employees/search - Search employees
    $router->get('/employees/search', function(Request $request) use ($controller) {
        Middleware::auth();
        return $controller->search($request->data());
    });
    
    // GET /employees/statistics - Get statistics
    $router->get('/employees/statistics', function(Request $request) use ($controller) {
        Middleware::auth();
        return $controller->statistics();
    });
};
