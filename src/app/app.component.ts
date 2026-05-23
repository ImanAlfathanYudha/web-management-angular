import { Component } from '@angular/core';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'csv-viewer-app';
  activeTab: 'transactions' | 'issues' = 'transactions';

  constructor(private authService: AuthorizationService, private router: Router) {}

  logout(): void {
    console.log('Logging out user');
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
