import { Component, ViewChild } from '@angular/core';
import { CanvasDrawingComponent } from "./canvas-drawing/canvas-drawing.component";
import { StabilityService } from '../../services/stability.service';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [CanvasDrawingComponent, FormsModule,DialogModule,ButtonModule,InputTextareaModule],
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.scss'
})
export class UserInputComponent {
  @ViewChild(CanvasDrawingComponent) canvasComponent!: CanvasDrawingComponent;
  resultingImageUrl: string | null = null; // URL for displaying the resulting image
  isLoading: boolean = false;
  prompt: string = "";
  isBuyModalVisible: boolean = false;
  isLoadingModalVisible: boolean = false;

  constructor(
    private stabilityService: StabilityService
  ) {}

  onGenerateButtonClick() {
    this.isBuyModalVisible=true;
  }

  onGenerate() {
    if (this.canvasComponent) {
      this.isLoading=true;
      const imageDataURL = this.canvasComponent.getCanvasImageDataURL();
      console.log('Canvas image data URL:', imageDataURL);
      this.stabilityService.sendSketchToAPI(imageDataURL,this.prompt).subscribe(
        (response: any) => {
          this.isLoading=false;
          console.log(response)
          // Assuming the API returns the image as base64 encoded JSON
          this.resultingImageUrl = `data:image/png;base64,${response.image}`;
        },
        (error) => {
          this.isLoading=false;
          console.error('API error:', error);
        }
      );
    }
  }

  onBuy() {
    console.log("clicked")
  }
}
