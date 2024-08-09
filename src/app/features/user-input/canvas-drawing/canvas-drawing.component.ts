import { Component, ElementRef,  OnInit,  ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as fabric from 'fabric';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'app-canvas-drawing',
  standalone: true,
  imports: [ButtonModule,DialogModule,InputNumberModule,TooltipModule,FormsModule],
  templateUrl: './canvas-drawing.component.html',
  styleUrl: './canvas-drawing.component.scss'
})



export class CanvasDrawingComponent implements OnInit {

  @ViewChild('canvas', { static: true }) canvasElement!: ElementRef;
  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef;

  private canvas!: fabric.Canvas;

  resizeDialogVisible:boolean = false;
  uploadFileVisible: boolean = false;

  width!:number;
  height!:number;
  constructor(
    
  ) {}

  ngOnInit() {
    this.initializeCanvas();
  }

  initializeCanvas() {
    // Initialize the Fabric.js canvas
    
    if(window.innerWidth>767) {
      this.width=800;
      this.height=600;
    }
    else {
      this.width=window.innerWidth - (window.innerWidth*0.2);
      this.height = window.innerHeight- (window.innerHeight*0.2)
    }

    this.canvas = new fabric.Canvas(this.canvasElement.nativeElement, {
      isDrawingMode: true,
      backgroundColor: '#ffffff',
      width: this.width,
      height: this.height,
    });
    if (!this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush = new fabric['PencilBrush'](this.canvas);
    }
    if (this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.color = '#000000';
      this.canvas.freeDrawingBrush.width = 5;
      this.canvas.freeDrawingBrush.shadow = null;
  
      // Optionally, set other properties on the freeDrawingBrush
      this.canvas.freeDrawingBrush.strokeLineCap = 'round';
      this.canvas.freeDrawingBrush.strokeLineJoin = 'round';
      this.canvas.freeDrawingBrush.strokeMiterLimit = 4;
      this.canvas.freeDrawingBrush.strokeDashArray = [0, 0];
    } else {
      console.error('freeDrawingBrush is undefined');
    }

    
  }


    eraser() {
      if (this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.color = '#ffffff';
      this.canvas.freeDrawingBrush.width = 20;
      }
    }
    pencil() {
      if (this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.color = '#000000';
      this.canvas.freeDrawingBrush.width = 5;
      }
    }
  resizeCanvas(width:number, height:number) {
    console.log(width,height)
    this.canvas.setDimensions({width:width, height:height})
  }

// Undo the last action
undoLastAction() {
  const lastItemIndex = (this.canvas.getObjects().length - 1);
  const item = this.canvas.item(lastItemIndex);

  
    this.canvas.remove(item);
    this.canvas.renderAll();
  
}


  clearCanvas() {
    // Clear the entire canvas
    this.canvas.clear();
    this.canvas.backgroundColor = '#ffffff';
    
  }

  saveCanvasAsImage() {
    // Export the canvas as a data URL (image) with proper options
    const dataURL = this.canvas.toDataURL({
      format: 'png',
      multiplier: 1, // No scaling
    });
    
    // Trigger download or send the data URL to the server
    this.downloadImage(dataURL);
  }
  

  private downloadImage(dataURL: string) {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'sketch.png';
    link.click();
  }

  
  // Method to get the canvas image data URL
getCanvasImageDataURL(): string {
  return this.canvas.toDataURL({
    format: 'png',
    multiplier: 1,
  });
}


// Load an image onto the canvas
loadImageToCanvas(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const fabricImage = new fabric.Image(img);
        fabricImage.set({
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5,
        });
        this.canvas.add(fabricImage);
        this.canvas.renderAll();
      };
    };
    reader.readAsDataURL(input.files[0]);
  }
}



}
