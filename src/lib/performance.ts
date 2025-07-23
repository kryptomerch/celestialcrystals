// Performance monitoring and optimization utilities

export class PerformanceMonitor {
  private static metrics: Map<string, number> = new Map()
  private static observers: Map<string, PerformanceObserver> = new Map()

  // Initialize performance monitoring
  static init() {
    if (typeof window === 'undefined') return

    // Monitor Core Web Vitals
    this.observeWebVitals()

    // Monitor resource loading
    this.observeResourceTiming()

    // Monitor navigation timing
    this.observeNavigationTiming()

    // Monitor long tasks
    this.observeLongTasks()
  }

  // Observe Core Web Vitals (CLS, FID, LCP)
  private static observeWebVitals() {
    if (!('PerformanceObserver' in window)) return

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.metrics.set('LCP', lastEntry.startTime)
      this.reportMetric('LCP', lastEntry.startTime)
    })

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.set('LCP', lcpObserver)
    } catch (e) {
      console.warn('LCP observer not supported')
    }

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        this.metrics.set('FID', entry.processingStart - entry.startTime)
        this.reportMetric('FID', entry.processingStart - entry.startTime)
      })
    })

    try {
      fidObserver.observe({ entryTypes: ['first-input'] })
      this.observers.set('FID', fidObserver)
    } catch (e) {
      console.warn('FID observer not supported')
    }

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      this.metrics.set('CLS', clsValue)
      this.reportMetric('CLS', clsValue)
    })

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.set('CLS', clsObserver)
    } catch (e) {
      console.warn('CLS observer not supported')
    }
  }

  // Monitor resource loading performance
  private static observeResourceTiming() {
    if (!('PerformanceObserver' in window)) return

    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        // Track slow resources (> 1 second)
        if (entry.duration > 1000) {
          this.reportSlowResource(entry.name, entry.duration)
        }
      })
    })

    try {
      resourceObserver.observe({ entryTypes: ['resource'] })
      this.observers.set('resource', resourceObserver)
    } catch (e) {
      console.warn('Resource timing observer not supported')
    }
  }

  // Monitor navigation timing
  private static observeNavigationTiming() {
    if (!('PerformanceObserver' in window)) return

    const navigationObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        const metrics = {
          'DNS_Lookup': entry.domainLookupEnd - entry.domainLookupStart,
          'TCP_Connection': entry.connectEnd - entry.connectStart,
          'TLS_Negotiation': entry.secureConnectionStart > 0 ? entry.connectEnd - entry.secureConnectionStart : 0,
          'Request_Response': entry.responseEnd - entry.requestStart,
          'DOM_Processing': entry.domContentLoadedEventEnd - entry.responseEnd,
          'Resource_Loading': entry.loadEventEnd - entry.domContentLoadedEventEnd,
          'Total_Load_Time': entry.loadEventEnd - entry.navigationStart
        }

        Object.entries(metrics).forEach(([name, value]) => {
          this.metrics.set(name, value)
          this.reportMetric(name, value)
        })
      })
    })

    try {
      navigationObserver.observe({ entryTypes: ['navigation'] })
      this.observers.set('navigation', navigationObserver)
    } catch (e) {
      console.warn('Navigation timing observer not supported')
    }
  }

  // Monitor long tasks that block the main thread
  private static observeLongTasks() {
    if (!('PerformanceObserver' in window)) return

    const longTaskObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        this.reportLongTask(entry.duration, entry.startTime)
      })
    })

    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] })
      this.observers.set('longtask', longTaskObserver)
    } catch (e) {
      console.warn('Long task observer not supported')
    }
  }

  // Report metric to analytics
  private static reportMetric(name: string, value: number) {
    // Send to Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'web_vital', {
        name,
        value: Math.round(value),
        event_category: 'Performance'
      })
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric - ${name}: ${Math.round(value)}ms`)
    }

    // Send to custom analytics endpoint
    this.sendToAnalytics('performance_metric', {
      metric: name,
      value: Math.round(value),
      timestamp: Date.now(),
      url: window.location.pathname
    })
  }

  // Report slow resource loading
  private static reportSlowResource(url: string, duration: number) {
    this.sendToAnalytics('slow_resource', {
      url,
      duration: Math.round(duration),
      timestamp: Date.now(),
      page: window.location.pathname
    })
  }

  // Report long tasks
  private static reportLongTask(duration: number, startTime: number) {
    this.sendToAnalytics('long_task', {
      duration: Math.round(duration),
      startTime: Math.round(startTime),
      timestamp: Date.now(),
      page: window.location.pathname
    })
  }

  // Send data to analytics endpoint
  private static async sendToAnalytics(event: string, data: any) {
    try {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, data })
      })
    } catch (error) {
      // Silently fail - don't impact user experience
    }
  }

  // Get current metrics
  static getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics)
  }

  // Cleanup observers
  static cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
    this.metrics.clear()
  }
}

// Image optimization utilities
export class ImageOptimizer {
  // Generate responsive image srcSet
  static generateSrcSet(baseUrl: string, sizes: number[] = [320, 640, 768, 1024, 1280, 1920]): string {
    return sizes
      .map(size => `${baseUrl}?w=${size}&q=75 ${size}w`)
      .join(', ')
  }

  // Generate sizes attribute for responsive images
  static generateSizes(breakpoints: Array<{ maxWidth?: number; size: string }> = [
    { maxWidth: 640, size: '100vw' },
    { maxWidth: 1024, size: '50vw' },
    { size: '33vw' }
  ]): string {
    return breakpoints
      .map(bp => bp.maxWidth ? `(max-width: ${bp.maxWidth}px) ${bp.size}` : bp.size)
      .join(', ')
  }

  // Lazy load images with Intersection Observer
  static lazyLoadImages(selector: string = 'img[data-src]') {
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers without Intersection Observer
      document.querySelectorAll(selector).forEach((img: any) => {
        img.src = img.dataset.src
        img.classList.remove('lazy')
      })
      return
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src!
          img.classList.remove('lazy')
          img.classList.add('loaded')
          observer.unobserve(img)
        }
      })
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    })

    document.querySelectorAll(selector).forEach(img => {
      imageObserver.observe(img)
    })
  }
}

// Code splitting and dynamic imports helper
export class CodeSplitter {
  private static loadedModules: Set<string> = new Set()

  // Dynamically import component with loading state
  static async loadComponent<T>(
    importFn: () => Promise<{ default: T }>,
    moduleName: string
  ): Promise<T> {
    if (this.loadedModules.has(moduleName)) {
      return (await importFn()).default
    }

    const startTime = performance.now()

    try {
      const module = await importFn()
      const loadTime = performance.now() - startTime

      this.loadedModules.add(moduleName)

      // Report dynamic import performance
      PerformanceMonitor['sendToAnalytics']('dynamic_import', {
        module: moduleName,
        loadTime: Math.round(loadTime),
        timestamp: Date.now()
      })

      return module.default
    } catch (error) {
      console.error(`Failed to load module ${moduleName}:`, error)
      throw error
    }
  }

  // Preload critical components
  static preloadComponent(importFn: () => Promise<any>, moduleName: string) {
    if (this.loadedModules.has(moduleName)) return

    // Use requestIdleCallback if available
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.loadComponent(importFn, moduleName)
      })
    } else {
      setTimeout(() => {
        this.loadComponent(importFn, moduleName)
      }, 100)
    }
  }
}

// Bundle analyzer helper
export class BundleAnalyzer {
  // Analyze bundle size and report large chunks
  static analyzeBundles() {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return

    // Get all script tags
    const scripts = Array.from(document.querySelectorAll('script[src]'))

    scripts.forEach(async (script: any) => {
      try {
        const response = await fetch(script.src, { method: 'HEAD' })
        const size = parseInt(response.headers.get('content-length') || '0')

        if (size > 100000) { // Report bundles > 100KB
          console.warn(`Large bundle detected: ${script.src} (${Math.round(size / 1024)}KB)`)
        }
      } catch (error) {
        // Ignore errors for external scripts
      }
    })
  }
}

// Initialize performance monitoring when module loads
if (typeof window !== 'undefined') {
  // Wait for page load to initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      PerformanceMonitor.init()
      ImageOptimizer.lazyLoadImages()
    })
  } else {
    PerformanceMonitor.init()
    ImageOptimizer.lazyLoadImages()
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    PerformanceMonitor.cleanup()
  })
}
