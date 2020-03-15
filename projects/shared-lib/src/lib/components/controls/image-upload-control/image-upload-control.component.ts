import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImageFile } from '../../../interfaces/image-file';

@Component({
  selector: 'shared-image-upload-control',
  templateUrl: './image-upload-control.component.html',
  styleUrls: ['./image-upload-control.component.scss']
})
export class ImageUploadControlComponent {
  @Input() label: string;
  @Output() fileChange = new EventEmitter();
  @Input() file: ImageFile;

  constructor() {

  }

  // Custom public methods

  onDelete() {
    this.file = null;

    this.fileChange.emit(this.file);
  }

  onFileChanged(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      this.file = {
        data: reader.result,
        name: file.name,
        type: file.type
      };
      this.fileChange.emit(this.file);
    };
  }

}
