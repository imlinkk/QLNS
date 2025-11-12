<?php

/**
 * Router Class
 * 
 * Handles route registration and dispatching
 */

namespace App\Core;

class Router
{
    private array $routes = [];
    private Request $request;

    /**
     * Constructor
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Register a GET route
     */
    public function get(string $path, callable $handler): void
    {
        $this->addRoute('GET', $path, $handler);
    }

    /**
     * Register a POST route
     */
    public function post(string $path, callable $handler): void
    {
        $this->addRoute('POST', $path, $handler);
    }

    /**
     * Register a PUT route
     */
    public function put(string $path, callable $handler): void
    {
        $this->addRoute('PUT', $path, $handler);
    }

    /**
     * Register a DELETE route
     */
    public function delete(string $path, callable $handler): void
    {
        $this->addRoute('DELETE', $path, $handler);
    }

    /**
     * Register a route for any method
     */
    public function any(string $path, callable $handler): void
    {
        foreach (['GET', 'POST', 'PUT', 'DELETE'] as $method) {
            $this->addRoute($method, $path, $handler);
        }
    }

    /**
     * Add route to routes array
     */
    private function addRoute(string $method, string $path, callable $handler): void
    {
        $pattern = $this->pathToPattern($path);
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'pattern' => $pattern,
            'handler' => $handler
        ];
    }

    /**
     * Convert path to regex pattern
     */
    private function pathToPattern(string $path): string
    {
        // Replace {id} with regex pattern
        $pattern = preg_replace('/\{(\w+)\}/', '(?P<$1>\d+)', $path);
        // Replace {action} with regex pattern
        $pattern = preg_replace('/\{(\w+):(\w+)\}/', '(?P<$1>$2)', $pattern);
        // Escape forward slashes
        $pattern = str_replace('/', '\/', $pattern);
        return '/^' . $pattern . '$/';
    }

    /**
     * Match request to route
     */
    private function match(): ?array
    {
        // Build request path from segments
        $requestPath = $this->request->path();

        foreach ($this->routes as $route) {
            if ($route['method'] !== $this->request->method()) {
                continue;
            }

            if (preg_match($route['pattern'], $requestPath, $matches)) {
                return [
                    'handler' => $route['handler'],
                    'params' => array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY)
                ];
            }
        }

        return null;
    }

    /**
     * Dispatch request to matching route
     */
    public function dispatch(): void
    {
        $match = $this->match();

        if ($match === null) {
            Response::notFound('Endpoint not found');
            return;
        }

        try {
            $handler = $match['handler'];
            $params = $match['params'];

            $response = $handler($this->request, $params);

            if (is_array($response)) {
                Response::json($response);
            }
        } catch (\Exception $e) {
            error_log("Router error: " . $e->getMessage());
            Response::serverError('An error occurred', $e->getMessage());
        }
    }

    /**
     * Get request object
     */
    public function request(): Request
    {
        return $this->request;
    }
}
