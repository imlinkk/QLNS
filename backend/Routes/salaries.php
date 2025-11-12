<?php
/**
 * Salary Routes
 */

use App\Core\Router;
use App\Core\Request;
use App\Core\Middleware;
use App\Controllers\SalaryController;

return function(Router $router) {
    $controller = new SalaryController();
    
    // GET /salaries - Get current month salaries
    $router->get('/salaries', function(Request $request) use ($controller) {
        Middleware::auth();
        return $controller->index();
    });
    
    // GET /salaries/period - Get salaries by period
    $router->get('/salaries/period', function(Request $request) use ($controller) {
        Middleware::auth();
        $month = $request->get('month', date('n'));
        $year = $request->get('year', date('Y'));
        return $controller->getByPeriod((int)$month, (int)$year);
    });
    
    // GET /salaries/employee/{id} - Get employee salary history
    $router->get('/salaries/employee/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        return $controller->getByEmployee((int)$params['id']);
    });
    
    // GET /salaries/statistics - Get salary statistics
    $router->get('/salaries/statistics', function(Request $request) use ($controller) {
        Middleware::auth();
        $month = $request->get('month');
        $year = $request->get('year');
        return $controller->statistics($month, $year);
    });
    
    // POST /salaries - Create salary record
    $router->post('/salaries', function(Request $request) use ($controller) {
        Middleware::auth();
        return $controller->store($request->data());
    });
    
    // PUT /salaries/{id} - Update salary record
    $router->put('/salaries/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        return $controller->update((int)$params['id'], $request->data());
    });
};
