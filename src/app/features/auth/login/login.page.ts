import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonCard, IonCardContent, IonItem, IonInput, IonIcon, IonButton, IonSpinner,
  AnimationController, ToastController, Platform, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';

import { AuthService } from 'src/app/core/services/auth';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonTitle, IonToolbar, IonHeader,
    CommonModule,
    ReactiveFormsModule,
    IonContent, IonCard, IonCardContent, IonItem, IonInput, IonIcon, IonButton, IonSpinner
  ],
})
export class LoginPage implements AfterViewInit {
  @ViewChild('brandEl', { read: ElementRef }) brandEl!: ElementRef;
  @ViewChild('cardEl', { read: ElementRef }) cardEl!: ElementRef;

  loading = false;
  showPass = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastController,
    private animCtrl: AnimationController,
    private platform: Platform
  ) {}

  async ngAfterViewInit() {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduceMotion) return;

    await this.platform.ready();

    const brand = this.animCtrl
      .create()
      .addElement(this.brandEl.nativeElement)
      .duration(450)
      .easing('cubic-bezier(0.2, 0.8, 0.2, 1)')
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(14px) scale(0.98)', 'translateY(0) scale(1)');

    const card = this.animCtrl
      .create()
      .addElement(this.cardEl.nativeElement)
      .duration(520)
      .delay(80)
      .easing('cubic-bezier(0.2, 0.8, 0.2, 1)')
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(18px)', 'translateY(0)');

    await this.animCtrl.create().addAnimation([brand, card]).play();
  }

  touched(name: 'email' | 'password') {
    const c = this.form.controls[name];
    return c.touched || c.dirty;
  }

  togglePass() {
    this.showPass = !this.showPass;
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    try {
      const { email, password } = this.form.getRawValue();
      const res = await this.auth.login(email!, password!);
      const role = this.auth.getPrimaryRole();
      console.log('Login exitoso:', res);
      console.log('Role:', role);
      if (role === 'ADMIN') this.router.navigateByUrl('/dashboard/admin', { replaceUrl: true });
      else if (role === 'EMPLOYEE') this.router.navigateByUrl('/dashboard/employee', { replaceUrl: true });
      else
      {
        //this.router.navigateByUrl('/dashboard/client', { replaceUrl: true });
        this.router.navigateByUrl('/sustainability/start', { replaceUrl: true });
      }

    } catch (e: any) {
      await this.shakeCard();
      await this.presentToast(e?.error?.message ?? 'Login falló', 'danger');
    } finally {
      this.loading = false;
    }
  }

  private async shakeCard() {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduceMotion) return;

    const a = this.animCtrl
      .create()
      .addElement(this.cardEl.nativeElement)
      .duration(360)
      .easing('ease-out')
      .keyframes([
        { offset: 0, transform: 'translateX(0)' },
        { offset: 0.2, transform: 'translateX(-8px)' },
        { offset: 0.4, transform: 'translateX(8px)' },
        { offset: 0.6, transform: 'translateX(-6px)' },
        { offset: 0.8, transform: 'translateX(6px)' },
        { offset: 1, transform: 'translateX(0)' },
      ]);

    await a.play();
  }

  private async presentToast(message: string, color: string) {
    const t = await this.toast.create({ message, duration: 1600, color });
    await t.present();
  }

  forgot(){


  }

  goRegister(){
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
