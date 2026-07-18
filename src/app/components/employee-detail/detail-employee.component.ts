import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';


@Component({
  selector: 'app-detail-employee',
  standalone: false,
  templateUrl: './detail-employee.component.html',
  styleUrl: './detail-employee.component.scss'
})

export class DetailEmployeeComponent implements OnInit {
  detailEmployee$ = this.employeeService.detailEmployee$;
  loading = true;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDetailEmployee();
  }

  loadDetailEmployee() {
    const id = (this.route.snapshot.paramMap.get('id'));
    if (!id) {
      alert('Invalid employee ID');
      this.router.navigate(['/dashboard-employee']);
      return;
    }
    this.employeeService.getDetailEmployee(id).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to load employee details:', err?.error?.error || ' ');
        alert('Failed to load employee details: ' + err?.error?.error || ' ');
        this.router.navigate(['/dashboard-employee']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard-employee']);
  }
}
