/**
 * BaseView - Abstract base class for all views
 * Handles common DOM manipulation and rendering logic
 */

export class BaseView {
  constructor(container) {
    this.container = container;
  }

  /**
   * Clear container
   */
  clear() {
    if (this.container) {
      this.container.innerHTML = "";
    }
  }

  /**
   * Render view to container
   */
  render(html) {
    if (this.container) {
      this.container.innerHTML = html;
    }
  }

  /**
   * Show loading spinner
   */
  showLoading() {
    this.render(`
            <div class="loading-container" style="display: flex; justify-content: center; align-items: center; min-height: 400px;">
                <div class="spinner"></div>
                <p style="margin-left: 20px; color: #6366f1;">Đang tải dữ liệu...</p>
            </div>
        `);
  }

  /**
   * Show error message
   */
  showError(message) {
    this.render(`
            <div class="error-container" style="padding: 40px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">❌</div>
                <h3 style="color: #ef4444; margin-bottom: 10px;">Lỗi</h3>
                <p style="color: #64748b;">${message}</p>
            </div>
        `);
  }

  /**
   * Show success message
   */
  showSuccess(message) {
    this.render(`
            <div class="success-container" style="padding: 40px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">✅</div>
                <h3 style="color: #10b981; margin-bottom: 10px;">Thành công</h3>
                <p style="color: #64748b;">${message}</p>
            </div>
        `);
  }

  /**
   * Show empty state
   */
  showEmpty(message = "Không có dữ liệu") {
    this.render(`
            <div class="empty-container" style="padding: 60px; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 20px;">📭</div>
                <h3 style="color: #64748b; margin-bottom: 10px;">${message}</h3>
            </div>
        `);
  }

  /**
   * Create element from HTML string
   */
  createElement(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }

  /**
   * Attach event listener
   */
  on(selector, event, handler) {
    if (this.container) {
      this.container.addEventListener(event, (e) => {
        if (e.target.matches(selector) || e.target.closest(selector)) {
          handler(e);
        }
      });
    }
  }
}
