import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonCard, IonCardContent, IonSpinner } from '@ionic/angular/standalone';
import { SustainabilityService } from 'src/app/core/services/sustainability';

@Component({
  standalone: true,
  selector: 'app-sustainability-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  imports: [CommonModule, IonContent, IonCard, IonCardContent, IonSpinner],
})
export class StartPage implements OnInit {
  loading = true;
  constructor(private sus: SustainabilityService, private router: Router) {}

  async ngOnInit() {
    try {
      const me = await this.sus.getMeOrNull();
      if (me) {
        // ya tiene perfil a†’ dashboard cliente
        this.router.navigateByUrl('/dashboard/client', { replaceUrl: true });
      } else {
        // no existe a†’ cuestionario
        this.router.navigateByUrl('/sustainability/questionnaire', { replaceUrl: true });
      }
    } finally {
      this.loading = false;
    }
  }
}

