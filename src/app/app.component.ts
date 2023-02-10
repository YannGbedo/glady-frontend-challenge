import { Component } from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'frontend-challenge';
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    //IconRegistry declarations. In a production development scenario I would prefer these are done in a separate file altogether
    this.matIconRegistry.addSvgIcon('gladyIcon', this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/Logo_glady_main_white.svg"));
    this.matIconRegistry.addSvgIcon('plusCircle', this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/add_circle_black_24dp.svg"));
    this.matIconRegistry.addSvgIcon('minusCircle', this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/remove_circle_black_24dp.svg"));
    this.matIconRegistry.addSvgIcon('shoppingCart', this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/shopping_cart_black_24dp.svg"));
    this.matIconRegistry.addSvgIcon('cardItem', this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/card_giftcard_black_24dp.svg"));
    this.matIconRegistry.addSvgIcon('euroSymbol', this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/euro_symbol_black_24dp.svg"));
    this.matIconRegistry.addSvgIcon('chooseIcon', this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/cursor-pointer.svg"));
    this.matIconRegistry.addSvgIcon('veryHappyIcon', this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/happy_very_black_24dp.svg"));
    this.matIconRegistry.addSvgIcon('badMoodIcon', this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/mood_bad_black_24dp.svg"));

  }
}
