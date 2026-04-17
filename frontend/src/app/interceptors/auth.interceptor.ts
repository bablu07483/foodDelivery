
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core'; // Add Injector
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // Use Injector to avoid circular dependency
  constructor(private injector: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authService = this.injector.get(AuthService); // Get service here
    const token = authService.getToken();
    
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }
    
    return next.handle(req);
  }
}







