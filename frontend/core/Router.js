/**
 * Router - Frontend routing manager
 */

export class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.currentController = null;
  }

  /**
   * Register a route
   */
  register(name, controller) {
    this.routes.set(name, controller);
  }

  /**
   * Navigate to a route
   */
  async navigate(name) {
    // Destroy current controller if exists
    if (
      this.currentController &&
      typeof this.currentController.destroy === "function"
    ) {
      this.currentController.destroy();
    }

    // Get controller class for route
    const ControllerClass = this.routes.get(name);

    if (!ControllerClass) {
      console.error(`Route not found: ${name}`);
      return;
    }

    // Get content container
    const contentContainer = document.getElementById("content");
    if (!contentContainer) {
      console.error("Content container not found");
      return;
    }

    // Create and initialize controller
    this.currentController = new ControllerClass(contentContainer);
    this.currentRoute = name;

    // Initialize controller
    if (typeof this.currentController.init === "function") {
      await this.currentController.init();
    }

    // Update active menu item
    this.updateActiveMenu(name);
  }

  /**
   * Update active menu item in sidebar
   */
  updateActiveMenu(name) {
    // Remove active class from all menu items
    document.querySelectorAll("#sidebar a").forEach((link) => {
      link.classList.remove("active");
    });

    // Add active class to current route
    const activeLink = document.querySelector(
      `#sidebar a[data-module="${name}"]`
    );
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }

  /**
   * Get current route
   */
  getCurrentRoute() {
    return this.currentRoute;
  }
}

export default new Router();
