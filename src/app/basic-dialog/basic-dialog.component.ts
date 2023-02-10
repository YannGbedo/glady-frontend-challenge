import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-basic-dialog',
  templateUrl: './basic-dialog.component.html',
  styleUrls: ['./basic-dialog.component.sass']
})
export class BasicDialogComponent {
  constructor(public dialogRef: MatDialogRef<BasicDialogComponent>) {}
}
