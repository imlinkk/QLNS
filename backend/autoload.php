<?php
/**
 * Simple PSR-4 Autoloader
 * Maps App\ namespace to backend/ directory
 */

spl_autoload_register(function ($class) {
    // Project-specific namespace prefix
    $prefix = 'App\\';
    
    // Base directory for the namespace prefix
    $base_dir = __DIR__ . '/';
    
    // Does the class use the namespace prefix?
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        // No, move to the next registered autoloader
        return;
    }
    
    // Get the relative class name
    $relative_class = substr($class, $len);
    
    // Replace namespace separators with directory separators
    // Replace the namespace prefix with the base directory
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    
    // If the file exists, require it
    if (file_exists($file)) {
        require $file;
    } else {
        error_log("Autoloader: Could not find file for class $class at $file");
    }
});
