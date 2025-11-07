<?php
/**
 * Leave Routes
 */

use App\Core\Router;
use App\Core\Request;
use App\Core\Middleware;
use App\Controllers\LeaveController;

return function(Router $router) {
    $controller = new LeaveController();
    
    // GET /leaves - Get all leave requests
    $router->get('/leaves', function(Request $request) use ($controller) {
        Middleware::auth();
        return $controller->index();
    });
    
    // GET /leaves/pending - Get pending requests
    $router->get('/leaves/pending', function(Request $request) use ($controller) {
        Middleware::auth();
        return $controller->getPending();
    });
    
    // GET /leaves/employee/{id} - Get employee leaves
    $router->get('/leaves/employee/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        return $controller->getByEmployee((int)$params['id']);
    });
    
    // GET /leaves/statistics/{id} - Get leave statistics
    $router->get('/leaves/statistics/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        $year = $request->get('year', date('Y'));
        return $controller->getStatistics((int)$params['id'], (int)$year);
    });
    
    // POST /leaves - Submit leave request
    $router->post('/leaves', function(Request $request) use ($controller) {
        Middleware::auth();
        return $controller->store($request->data());
    });
    
    // POST /leaves/approve/{id} - Approve leave request
    $router->post('/leaves/approve/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        return $controller->approve((int)$params['id']);
    });
    
    // POST /leaves/reject/{id} - Reject leave request
    $router->post('/leaves/reject/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        return $controller->reject((int)$params['id']);
    });
};
