import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EditorComponent } from './shared/components/editor/editor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'tiptapEditor';
}
