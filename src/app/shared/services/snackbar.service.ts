import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  /**
   * Variable which hold the types of snackbar.
   */
   details = [
    { type: 'Success', icon: 'check', panelClass: 'snackbar-success' },
    { type: 'Error', icon: 'error', panelClass: 'snackbar-error' },
    { type: 'Warning', icon: 'warning', panelClass: 'snackbar-warning' },
    { type: 'Info', icon: 'priority_high', panelClass: 'snackbar-info' },
    { type: 'Default', icon: 'data_usage', panelClass: 'snackbar-default' }

  ];
  /**
   * Constructor which is used to inject the required services.
   * @param snackBar used to access the methods in snack bar.
   */
  constructor(public snackBar: MatSnackBar) { }
  /**
   * Method which is used to dispaly the snack bar messages.
   * @param message holds the message.
   * @param type holds the type of message.
   * @param duration hold the time duration to show snackbar.
   * @param panelClass hold the class name.
   */
  openSnackbar(message: string, type: string, duration?: number, panelClass?: string) {
    const property = this.details.find(x => x.type === type);
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: {
        message: message,
        icon: property?.icon,
      },
      duration: duration ? duration : 3000, 
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: panelClass ? panelClass : property?.panelClass
    })
  }
}
