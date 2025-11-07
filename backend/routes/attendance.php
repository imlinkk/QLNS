<?php
/**
 * Attendance Routes
 */

use App\Core\Router;
use App\Core\Request;
use App\Core\Middleware;
use App\Controllers\AttendanceController;

return function(Router $router) {
    $controller = new AttendanceController();
    
    // GET /attendance - Get today's attendance
    $router->get('/attendance', function(Request $request) use ($controller) {
        Middleware::auth();
        return $controller->index();
    });
    
    // GET /attendance/employee/{id} - Get employee attendance
    $router->get('/attendance/employee/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        $month = $request->get('month');
        $year = $request->get('year');
        return $controller->getByEmployee((int)$params['id'], $month, $year);
    });
    
    // GET /attendance/summary/{id} - Get attendance summary
    $router->get('/attendance/summary/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        $month = $request->get('month', date('n'));
        $year = $request->get('year', date('Y'));
        return $controller->getSummary((int)$params['id'], (int)$month, (int)$year);
    });
    
    // POST /attendance - Record attendance
    $router->post('/attendance', function(Request $request) use ($controller) {
        Middleware::auth();
        return $controller->store($request->data());
    });
    
    // PUT /attendance/{id} - Update attendance
    $router->put('/attendance/{id}', function(Request $request, array $params) use ($controller) {
        Middleware::auth();
        return $controller->update((int)$params['id'], $request->data());
    });
};
