// ============================================
// 🔔 SISTEMA DE NOTIFICACIONES GLOBAL
// ============================================

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationOptions {
  duration?: number;
  closable?: boolean;
}

class NotificationManager {
  private containerId = 'globalMessageContainer';
  
  private ensureContainer(): HTMLElement {
    let container = document.getElementById(this.containerId);
    
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      document.body.appendChild(container);
    }
    
    return container;
  }
  
  show(mensaje: string, tipo: NotificationType, options: NotificationOptions = {}): void {
    const {
      duration = 5000,
      closable = true
    } = options;
    
    const container = this.ensureContainer();
    
    const icons: Record<NotificationType, string> = {
      success: '✅',
      error: '❌',
      info: 'ℹ️',
      warning: '⚠️'
    };
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo}`;
    alertDiv.innerHTML = `
      <span style="font-size: 1.2rem;">${icons[tipo]}</span>
      <span>${mensaje}</span>
      ${closable ? `<button class="alert-close" style="
        margin-left: auto;
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0.7;
      ">×</button>` : ''}
    `;
    
    if (closable) {
      const closeBtn = alertDiv.querySelector('.alert-close');
      closeBtn?.addEventListener('click', () => this.remove(alertDiv));
    }
    
    container.appendChild(alertDiv);
    
    // Auto-remove
    if (duration > 0) {
      setTimeout(() => this.remove(alertDiv), duration);
    }
  }
  
  private remove(element: HTMLElement): void {
    if (element.parentElement) {
      element.classList.add('fade-out');
      setTimeout(() => element.remove(), 300);
    }
  }
  
  success(mensaje: string, options?: NotificationOptions): void {
    this.show(mensaje, 'success', options);
  }
  
  error(mensaje: string, options?: NotificationOptions): void {
    this.show(mensaje, 'error', options);
  }
  
  info(mensaje: string, options?: NotificationOptions): void {
    this.show(mensaje, 'info', options);
  }
  
  warning(mensaje: string, options?: NotificationOptions): void {
    this.show(mensaje, 'warning', options);
  }
}

// Exportar instancia singleton
export const notifications = new NotificationManager();

// Funciones de conveniencia
export const mostrarExito = (mensaje: string) => notifications.success(mensaje);
export const mostrarError = (mensaje: string) => notifications.error(mensaje);
export const mostrarInfo = (mensaje: string) => notifications.info(mensaje);
export const mostrarAdvertencia = (mensaje: string) => notifications.warning(mensaje);
