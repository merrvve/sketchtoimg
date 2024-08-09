import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StabilityService {
  private apiUrl = 'https://api.stability.ai/v2beta/stable-image/control/sketch';
  private apiKey = environment.stabilityKey
  constructor(private http: HttpClient) {}

  sendSketchToAPI(imageDataURL: string, prompt: string): Observable<any> {
    let addedPrompt = "Enhance this sketch into a professional vibrant digital graphic design product.";
    if(prompt) [
      addedPrompt+= "The sketch features "+ prompt  +". The sketch only indicates the location of the pieces and they are handdrawn. Fill the indicated areas with well designed, well-shaped content."
   
    ]
    else {
      addedPrompt +=  "The sketch features the seen lines. You annotate them. The sketch only indicates the location of the pieces and they are handdrawn. Fill the indicated areas with well designed, well-shaped content." 
    }
    const formData = new FormData();
    formData.append('image', this.dataURLtoBlob(imageDataURL));
    formData.append('prompt', addedPrompt);

    // Optional parameters
     formData.append('control_strength', '0.4');
     formData.append('negative_prompt', 'No blur, no unnatural structure');
    // formData.append('seed', '12345');
     formData.append('output_format', 'png');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/json' // or 'image/*' if you want the image bytes
  
    });

    return this.http.post(this.apiUrl, formData, { headers });
  }

  // Convert base64 image data URL to Blob
  private dataURLtoBlob(dataURL: string): Blob {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([uint8Array], { type: mimeString });
  }
}
