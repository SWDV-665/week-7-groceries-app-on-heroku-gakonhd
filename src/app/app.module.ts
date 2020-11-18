import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { TextMaskModule } from 'angular2-text-mask';
import { HttpClientModule} from '@angular/common/http';

import { AboutPage } from '../pages/about/about';
import { GroceryPage } from '../pages/grocery/grocery';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GroceriesProvider } from '../providers/groceries/groceries';
import { SocialSharing } from '@ionic-native/social-sharing';
 
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    GroceryPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp), 
    TextMaskModule, 
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    GroceryPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GroceriesProvider, 
    SocialSharing
    ]
})
export class AppModule {}
