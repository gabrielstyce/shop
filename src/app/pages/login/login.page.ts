import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;

  public userLogin: User = {};
  public userRegister: User = {};
  private loading: any;


  constructor(
    public keyboard: Keyboard,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService
  ) { }

  ngOnInit() {

  }

  async login() {
    await this.presentLoading();
    try {
      await this.authService.login(this.userLogin);

    } catch (err) {
      console.error(err);
      err.message = 'E-mail/Senha inválido';
      this.presentToast(err.message);

    } finally {
      this.loading.dismiss();
    }
  }

  async register() {
    await this.presentLoading();

    try {
      await this.authService.register(this.userRegister);
    } catch (err) {
      console.error(err);

      switch (err.code) {
        case 'auth/email-already-in-use':
          err.message = 'Este e-mail já esta sendo usado!';
          break;
        case 'auth/invalid-email':
          err.message = 'E-mail inválido!';
          break;
      }

      this.presentToast(err.message);
    } finally {
      this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Verificando, aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

  segmentChanged(event: any) {
    event.detail.value === 'login' ? this.slides.slidePrev() : this.slides.slideNext();
  }
}
