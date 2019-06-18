import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private products = new Array<Product>();
  private productsSubscription: Subscription;
  private loading: any;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private productService: ProductService,
    private authService: AuthService
  ) {
    this.productsSubscription = this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  ngOnInit() {

  }
  async deleteProduct(id: string) {
    try {
      await this.productService.deleteProduct(id);
    } catch (error) {
      this.presentToast('Erro ao tentar deletar');
    }
  }
  async logout() {
    try {
      await this.authService.logout();
    } catch (err) {
      console.log(err);
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Registrando, aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

  ngOnDestroy() {
    this.productsSubscription.unsubscribe();
  }
}
