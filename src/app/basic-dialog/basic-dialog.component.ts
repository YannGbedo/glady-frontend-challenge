import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-basic-dialog',
  templateUrl: './basic-dialog.component.html',
  styleUrls: ['./basic-dialog.component.sass']
})
export class BasicDialogComponent {
  constructor(public dialogRef: MatDialogRef<BasicDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public message: string) {}
}
