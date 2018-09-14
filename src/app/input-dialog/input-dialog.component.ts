import { Component, Input } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.css']
})
export class InputDialogComponent {

  constructor(public dialogRef: MatDialogRef<InputDialogComponent>) {}

  public confirmMessage:string;
  public tipo: string;
  public text: string;
}
