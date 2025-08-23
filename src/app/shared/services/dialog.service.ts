import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  /**
   * Constructor which is used to inject the required services.
   * @param dialogServices used to access the methods in dialog.
   */
  constructor(public dialogServices: MatDialog) { }
  /**
   * Method which is used to display the confirmation message.
   * @param message hold the dialog message.
   * @param className hold the dialog class name.
   * @returns dialog reference
   */
  openConfirmationDialog(message: string, className?: string) {
    const dialogRef = this.dialogServices.open(DialogComponent, {
      data: {
        header: 'Confirmation',
        content: message,
        actionType: 'Confirmation'
      },
      autoFocus: false
    });
    return dialogRef;
  };
}
