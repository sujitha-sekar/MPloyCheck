import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Record } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-records-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './records-table.component.html',
  styleUrl: './records-table.component.scss'
})
export class RecordsTableComponent {
records: Record[] = [];

  constructor(private userService: UserService) {
    // this.userService.getRecords(history.state.user?.role || 'General User').subscribe(data => this.records = data);
  }
}
