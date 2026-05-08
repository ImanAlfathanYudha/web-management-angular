import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CsvUploadService } from 'src/app/services/csv-upload.service';

@Component({
  selector: 'app-form-detail',
  templateUrl: './form-detail.component.html',
  styleUrls: ['./form-detail.component.scss'],
})
export class FormDetailComponent implements OnInit {
  transactionForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private csvService: CsvUploadService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadDetailTransaction();
  }

  initializeForm(): void {
    this.transactionForm = this.fb.group({
      timestamp: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }],
      type: [{ value: '', disabled: true }],
      amount: [{ value: '', disabled: true }],
      status: [{ value: '', disabled: true }],
      description: ['', Validators.required],
    });
  }

  loadDetailTransaction(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.csvService.getDetailTransactions(id).subscribe({
      next: (data) => {
        this.transactionForm.patchValue(data);
      },
      error: (err) => {
        alert('Failed to load transaction detail: ' + err?.error?.Message || 'Unknown error');
        console.error('Failed to load transaction detail:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    const updatedTransaction = this.transactionForm.getRawValue();

    console.log('Submitted transaction:', updatedTransaction);

    alert('Transaction updated successfully');
    this.router.navigate(['']);
  }

  onCancel(): void {
    this.router.navigate(['']);
  }
}