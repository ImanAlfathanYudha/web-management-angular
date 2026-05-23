import { Component } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'csv-viewer-app';
  activeTab: 'transactions' | 'issues' = 'transactions';
  showNavbar = true;
  constructor(private authService: AuthorizationService, private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.showNavbar = this.router.url !== '/login';
      });
  }

  logout(): void {
    console.log('Logging out user');
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
