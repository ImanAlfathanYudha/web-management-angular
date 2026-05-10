import { Component } from '@angular/core';
import { CsvUploadService } from 'src/app/services/csv-upload.service';

@Component({
  selector: 'upload-component',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  constructor(private csvService: CsvUploadService) { }
  loading = false;

  ngOnInit() {
    this.csvService.loading$.subscribe(val => {
      this.loading = val;
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      alert('⚠️ File not found');
      return;
    }

    this.csvService.uploadTransactionCSV(file).subscribe({
      next: () => {
        alert('✅ File uploaded successfully!');
      },
      error: (err) => {
        alert('❌ Upload failed. ' + err);
        console.error(err);
      }
    });
  }


}
