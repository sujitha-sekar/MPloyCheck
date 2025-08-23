import { Component, Inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Record, User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-records-table',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './records-table.component.html',
  styleUrl: './records-table.component.scss'
})
export class RecordsTableComponent {
constructor(
    public dialogRef: MatDialogRef<RecordsTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { action: 'View' | 'Edit'; user: User }
  ) {}

  saveChanges() {
    this.dialogRef.close(this.data.user);
  }

  cancel() {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
